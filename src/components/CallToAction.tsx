'use client';

import Link from 'next/link';

const CallToAction = () => {
  return (
    <section className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white py-12 text-center px-4">
      <h2 className="text-3xl font-bold mb-4">Ready to Level Up Your Tech Skills?</h2>
      <p className="text-lg mb-6">Join thousands of learners transforming their careers with TechStack Academy.</p>
      <Link
        href="/auth/signup"
        className="inline-block bg-white text-blue-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-200 shadow-md transition"
      >
        Get Started for Free
      </Link>
    </section>
  );
};

export default CallToAction;
