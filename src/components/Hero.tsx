'use client';
import Link from 'next/link';

export default function Hero() {
  return (
    <section
      className="relative bg-cover bg-center min-h-[500px] text-white"
      style={{
        backgroundImage: 'url(/images/hero-bg.jpg)',
        backgroundColor: '#2b5c7d', // Fallback color for unsupported image
      }}
    >
      <div className="absolute inset-0 bg-[#2b5c7d]/80"></div> {/* Better layering */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center px-4 py-10 sm:px-6 sm:py-12 h-full w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Welcome to OsTech Institute
        </h1>
        <p className="text-base sm:text-lg md:text-xl max-w-2xl">
          Master DevOps, Web Development, Python & more – all in one place.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none sm:justify-center">
          <Link
            href="/auth/signup"
            className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg font-semibold text-white text-center transition duration-200 ease-in-out"
          >
            Create Account
          </Link>
          <Link
            href="/auth/login"
            className="border border-white hover:bg-white hover:text-[#2b5c7d] px-6 py-2 rounded-lg font-semibold text-white text-center transition duration-200 ease-in-out"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}
