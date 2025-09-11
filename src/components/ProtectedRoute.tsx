'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebaseConfig';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/auth'); // redirect to login if not logged in
      }
        setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return <>{children}</>;
}
