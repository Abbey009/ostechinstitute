// src/app/admin/dashboard/page.tsx

'use client';
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firebaseConfig'; // Update path if different
import { collection, getDocs } from 'firebase/firestore';

export default function DashboardPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    lessons: 0,
    certificates: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const usersSnap = await getDocs(collection(db, 'users'));
      const coursesSnap = await getDocs(collection(db, 'courses'));
      const certsSnap = await getDocs(collection(db, 'certificates'));

      let lessonCount = 0;
      coursesSnap.forEach((doc) => {
        const data = doc.data();
        if (data.lessons && Array.isArray(data.lessons)) {
          lessonCount += data.lessons.length;
        }
      });

      setStats({
        users: usersSnap.size,
        courses: coursesSnap.size,
        lessons: lessonCount,
        certificates: certsSnap.size,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Navbar */}
      <header className="flex md:hidden justify-between items-center bg-gray-900 text-white px-4 py-3">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="focus:outline-none"
        >
          {isSidebarOpen ? 'Close' : 'Menu'}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white w-64 p-6 space-y-4 md:block ${
          isSidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-3">
          <a href="/admin/dashboard" className="block hover:text-yellow-400">Dashboard</a>
          <a href="/admin/users" className="block hover:text-yellow-400">Manage Users</a>
          <a href="/admin/courses" className="block hover:text-yellow-400">Manage Courses</a>
          <a href="/admin/certificates" className="block hover:text-yellow-400">Certificates</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <span className="text-sm text-gray-600 hidden md:block">Admin Logged In</span>
        </div>

        <p className="mb-6 text-gray-700">
          Welcome to the admin dashboard! Use the panel to manage users, courses, and certificates.
        </p>

        {/* Analytics Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Users" value={stats.users} />
          <StatsCard title="Courses" value={stats.courses} />
          <StatsCard title="Lessons" value={stats.lessons} />
          <StatsCard title="Certificates" value={stats.certificates} />
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <a
            href="/admin/users"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">Users</h2>
            <p className="text-gray-600">View and manage registered users.</p>
          </a>

          <a
            href="/admin/courses"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">Courses</h2>
            <p className="text-gray-600">Create, update, or delete courses.</p>
          </a>

          <a
            href="/admin/certificates"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">Certificates</h2>
            <p className="text-gray-600">Generate and manage course certificates.</p>
          </a>
        </div>
      </main>
    </div>
  );
}

function StatsCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 text-center">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
