'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import ClipLoader from 'react-spinners/ClipLoader';

const mockCourses = [
  {
    id: 'zzkEIVUUnx7vA2Db5AvG',
    title: 'DevOps Mastery',
    description: 'A comprehensive beginner-to-advanced DevOps course designed to build expertise in modern development and operations practices',
    image: '/images/devops.jpg',
  },
  {
    id: 'BlTr7kUnLxWibRzXKq6V',
    title: 'Full-Stack Web Development',
    description: 'A complete course designed to teach front-end and back-end web development. Students will learn to build responsive websites and dynamic applications using modern technologies such as HTML, CSS, JavaScript, Frameworks, databases, and deployment tools.',
    image: '/images/webdev.jpg',
  },
  {
    id: 'J245t5CQvdWEq4MAtslr',
    title: 'Cybersecurity Fundamentals & Advanced Practices',
    description: 'A comprehensive course covering the principle, tools, and techniques of cybersecurity. Learners will gain hands-on skills in network security, ethical hacking, risk management, and cyber defense strategies to protect digital systems against modern threat.',
    image: 'images/python.jpg',
  },
];

export default function CoursesPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ProtectedRoute>
      <div className="px-4 sm:px-6 lg:px-12 py-10 min-h-screen bg-gray-50">
        <h1 className="text-3xl font-bold mb-10 text-center text-gray-800">Available Courses</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader size={50} color="#3B82F6" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-200 flex flex-col h-[420px]"
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-32 object-cover rounded-t-2xl"
                />
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold text-gray-800">{course.title}</h2>
                    <p className="text-gray-600 mt-2 text-sm">{course.description}</p>
                  </div>
                  <div className="mt-6 flex flex-col gap-2">
                    <Link href={`/courses/${course.id}`}>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition w-full text-sm">
                        View Course
                      </button>
                    </Link>
                    <Link href={`/courses/${course.id}/learn`}>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition w-full text-sm">
                        Start Learning
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
