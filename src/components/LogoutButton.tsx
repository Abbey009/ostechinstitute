'use client';
import './globals.css';
import { useEffect, useState } from 'react';import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebaseConfig';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {      setUser(currentUser);    });    return () => unsubscribe();  }, []);
  const handleLogout = async () => {    await signOut(auth);  };
  return (    <html lang="en">      <body>        <nav className="bg-gray-800 text-white p-4 flex flex-col sm:flex-row justify-between items-center">          <div className="text-xl font-bold mb-2 sm:mb-0">            <Link href="/">TechStack Academy</Link>          </div>          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-sm">            <Link href="/courses" className="hover:underline">Courses</Link>            <Link href="/about" className="hover:underline">About</Link>            {!user ? (              <Link href="/auth" className="hover:underline">Login</Link>            ) : (              <>                <span className="text-gray-300">Welcome, {user.email}</span>                <button                  onClick={handleLogout}                  className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"                >                  Logout                </button>              </>            )}          </div>        </nav>        <main className="p-4">{children}</main>      </body>    </html>  );}
