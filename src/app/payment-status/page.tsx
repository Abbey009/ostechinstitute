'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<'checking' | 'success' | 'failed'>('checking');
  const [message, setMessage] = useState('Checking payment status...');
  const [courseId, setCourseId] = useState('');

  useEffect(() => {
    const reference = searchParams.get('reference');
    if (!reference) {
      setStatus('failed');
      setMessage('No payment reference provided.');
      return;
    }

    const checkPayment = async () => {
      try {
        const res = await fetch(`/api/check-payment?reference=${reference}`);
        const data = await res.json();

        if (!res.ok || !data) {
          setStatus('failed');
          setMessage(data?.error || 'Failed to verify payment.');
          return;
        }

        if (data.status === 'confirmed') {
          setStatus('success');
          setMessage('Payment successful! Redirecting...');
          setCourseId(data.courseId);

          setTimeout(() => {
            router.push(`/courses/${data.courseId}/learn`);
          }, 3000); // Delay to show success message
        } else {
          setStatus('failed');
          setMessage('Payment not successful. Please try again.');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        setMessage('Something went wrong. Please try again.');
      }
    };

    checkPayment();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      {status === 'checking' && (
        <>
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
          <h2 className="text-lg font-semibold text-blue-700">{message}</h2>
        </>
      )}

      {status === 'success' && (
        <>
          <CheckCircle2 className="h-12 w-12 text-green-600 mb-4" />
          <h2 className="text-lg font-semibold text-green-700">{message}</h2>
          <p className="text-sm text-gray-600 mt-2">Redirecting to course...</p>
        </>
      )}

      {status === 'failed' && (
        <>
          <XCircle className="h-12 w-12 text-red-600 mb-4" />
          <h2 className="text-lg font-semibold text-red-700">{message}</h2>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Return to Home
          </button>
        </>
      )}
    </div>
  );
}
