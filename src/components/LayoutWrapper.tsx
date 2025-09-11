'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNavbar = pathname !== '/'; // Hide Navbar on landing page

  return (
    <>
      {showNavbar && <Navbar />}
      <main className="min-h-screen bg-gray-50 p-4">{children}</main>
    </>
  );
}
