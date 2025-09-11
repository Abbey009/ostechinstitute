// app/admin/manage-courses/page.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  description: string;
}

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const snapshot = await getDocs(collection(db, "courses"));
      const courseList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Course[];
      setCourses(courseList);
    };

    fetchCourses();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (confirmDelete) {
      await deleteDoc(doc(db, "courses", id));
      setCourses((prev) => prev.filter((course) => course.id !== id));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Courses</h1>
      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <ul className="space-y-4">
          {courses.map((course) => (
            <li key={course.id} className="border p-4 rounded-md shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{course.title}</h2>
                  <p className="text-sm text-gray-600">{course.description}</p>
                </div>
                <div className="space-x-2">
                  <Link href={`/admin/edit-course/${course.id}`}>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded-md">Edit</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
