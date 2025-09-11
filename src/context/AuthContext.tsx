'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

interface ExtendedUser extends User {
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  state?: string;
  country?: string;
  role?: string;
}

const AuthContext = createContext<{
  user: ExtendedUser | null;
  firstName: string;
  loading: boolean;
}>({
  user: null,
  firstName: '',
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          const docRef = doc(db, 'users', authUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            const mergedUser = { ...authUser, ...userData } as ExtendedUser;
            setUser(mergedUser);
            setFirstName(userData.firstName || authUser.displayName?.split(' ')[0] || '');
          } else {
            setUser(authUser);
            setFirstName(authUser.displayName?.split(' ')[0] || '');
          }
        } catch (err) {
          console.error('Error fetching user info:', err);
          setUser(authUser);
          setFirstName(authUser.displayName?.split(' ')[0] || '');
        }
      } else {
        setUser(null);
        setFirstName('');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, firstName, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
