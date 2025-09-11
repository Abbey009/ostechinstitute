"use client";

import Link from "next/link";

const EmptyState = () => {
  return (
    <div className="text-center mt-10">
      <p className="text-gray-500 mb-4">You haven’t enrolled in any course yet.</p>
      <Link
        href="/courses"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded-xl text-sm font-medium transition"
      >
        Browse Courses
      </Link>
    </div>
  );
};

export default EmptyState;
