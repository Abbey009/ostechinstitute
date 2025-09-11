// app/admin/courses/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const snapshot = await getDocs(collection(db, "courses"));
      const courseList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(courseList);
    };
    fetchCourses();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <ul className="space-y-4">
        {courses.map((course) => (
          <li key={course.id} className="border p-4 rounded shadow-sm">
            <h2 className="text-lg font-semibold">{course.title}</h2>
            <Link
              href={`/admin/courses/${course.id}/lessons`}
              className="text-blue-600 underline"
            >
              Manage Lessons
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
