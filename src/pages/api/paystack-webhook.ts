// src/pages/api/paystack-webhook.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import * as admin from 'firebase-admin';
import crypto from 'crypto';
import axios from 'axios';

// ✅ Validate critical env vars up front
if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is missing');
}
if (!process.env.PAYSTACK_SECRET_KEY) {
  throw new Error('PAYSTACK_SECRET_KEY is missing');
}

// ✅ Initialize Firebase Admin SDK once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    ),
  });
}
const db = admin.firestore();

export const config = {
  api: {
    bodyParser: false, // Needed for raw body
  },
};

// ✅ Helper: Get raw body buffer
const buffer = async (req: NextApiRequest): Promise<Buffer> => {
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawBody = await buffer(req);
    const signature = req.headers['x-paystack-signature'] as string;

    const secret = process.env.PAYSTACK_SECRET_KEY!;
    const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');

    if (hash !== signature) {
      return res.status(401).json({ error: 'Invalid Paystack signature' });
    }

    const event = JSON.parse(rawBody.toString());

    if (event.event !== 'charge.success') {
      console.log(`Unhandled event type: ${event.event}`);
      return res.status(200).json({ message: 'Event ignored' });
    }

    const paymentData = event.data;
    const reference = paymentData.reference;
    const amountPaid = paymentData.amount / 100;

    // ✅ Get payment doc by reference
    const paymentRef = db.collection('payments').doc(reference);
    const paymentSnap = await paymentRef.get();

    if (!paymentSnap.exists) {
      console.warn(`Payment reference ${reference} not found in Firestore`);
      return res.status(404).json({ error: 'Payment not found' });
    }

    const payment = paymentSnap.data();

    // ✅ Guard: Ensure required fields exist
    const userId = payment?.userId;
    const courseId = payment?.courseId;

    if (!userId || !courseId) {
      console.error(`Missing userId or courseId in payment:`, payment);
      return res.status(400).json({ error: 'Invalid payment data' });
    }

    // ✅ Prevent duplicate confirmation
    if (payment.status === 'confirmed') {
      return res.status(200).json({ message: 'Already confirmed' });
    }

    // ✅ Re-verify with Paystack (optional but recommended)
    const verifyRes = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${secret}`,
      },
    });

    if (verifyRes.data.data.status !== 'success') {
      console.error(`Verification failed for ${reference}`);
      return res.status(400).json({ error: 'Transaction not verified' });
    }

    // ✅ Confirm payment in Firestore
    await paymentRef.set(
      {
        ...payment,
        status: 'confirmed',
        confirmedAt: admin.firestore.FieldValue.serverTimestamp(),
        amountPaid,
      },
      { merge: true }
    );

    // ✅ Enroll user in course
    const enrollmentRef = db.collection('enrollments').doc(`${userId}_${courseId}`);
    await enrollmentRef.set(
      {
        userId,
        courseId,
        enrolledAt: admin.firestore.FieldValue.serverTimestamp(),
        method: 'paystack',
      },
      { merge: true }
    );

    console.log(`✅ User ${userId} enrolled in course ${courseId}`);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('🔥 Webhook handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
