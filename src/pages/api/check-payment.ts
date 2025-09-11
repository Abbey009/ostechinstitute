import type { NextApiRequest, NextApiResponse } from 'next';
import * as admin from 'firebase-admin';

// ✅ Initialize Firebase Admin SDK once
if (!admin.apps.length) {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is missing');
  }
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    ),
  });
}

const db = admin.firestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const reference = req.query.reference as string;

  if (!reference) {
    return res.status(400).json({ error: 'Missing payment reference' });
  }

  try {
    const paymentDoc = await db.collection('payments').doc(reference).get();

    if (!paymentDoc.exists) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const payment = paymentDoc.data();

    return res.status(200).json({
      status: payment?.status || 'pending',
      courseId: payment?.courseId || null,
      userId: payment?.userId || null,
    });
  } catch (error) {
    console.error('❌ Error checking payment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
