"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface TopBarProps {
  courseId: string;
  certificateAvailable: boolean;
  completedCount: number;
  totalLessons: number;
}

const TopBar: React.FC<TopBarProps> = ({
  courseId,
  certificateAvailable,
  completedCount,
  totalLessons,
}) => {
  const router = useRouter();

  const progressPercent = totalLessons
    ? Math.round((completedCount / totalLessons) * 100)
    : 0;

  return (
    <div className="mb-6">
      <Link href="/dashboard" className="mb-4 inline-block text-blue-600 hover:underline">
        ← Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold mb-4">Start Learning</h1>

      {certificateAvailable && (
        <button
          onClick={() => router.push(`/certificate/${courseId}`)}
          className="mb-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          View Certificate
        </button>
      )}

      <p className="mb-2">
        Progress: {completedCount} / {totalLessons} lessons completed ({progressPercent}%)
      </p>

      <div className="w-full bg-gray-300 rounded h-4">
        <div
          className="h-full bg-green-500 rounded transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

export default TopBar;
