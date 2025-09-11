'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebaseConfig';
import { useAuth } from '@/context/AuthContext';
import { Menu, X } from 'lucide-react';
import { ClipLoader } from 'react-spinners';

export default function Navbar() {
  const { user, firstName, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const getAvatarColor = (name: string) => {
    // Simple hash function for consistent color generation
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 60%)`;
    return color;
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between relative">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 text-xl font-bold">
        <Image
          src="/logo.png"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-full bg-white"
        />
        <span>OsTech Institute</span>
      </Link>

      {/* Mobile Menu Button */}
      <div className="sm:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Nav Links */}
      <div
        className={`${
          menuOpen ? 'block' : 'hidden'
        } sm:flex items-center space-y-4 sm:space-y-0 sm:space-x-6 mt-4 sm:mt-0`}
      >
        <Link href="/courses" className="hover:text-blue-300 block sm:inline">
          Courses
        </Link>
        <Link href="/about" className="hover:text-blue-300 block sm:inline">
          About
        </Link>

        {loading ? (
          <ClipLoader size={25} color="#38bdf8" />
        ) : !user ? (
          <Link
            href="/auth"
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Login
          </Link>
        ) : (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full focus:outline-none"
            >
              <div
                className="w-8 h-8 flex items-center justify-center rounded-full text-white font-semibold text-sm"
                style={{
                  backgroundColor: getAvatarColor(firstName || 'U'),
                }}
              >
                {(firstName || 'U')[0].toUpperCase()}
              </div>
              <span className="hidden sm:inline text-sm font-medium">
                {firstName}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-lg z-50">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
