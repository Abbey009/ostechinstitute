// app/admin/manage-lessons/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseConfig";

export default function ManageLessonsPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLessons = async () => {
    const querySnapshot = await getDocs(collection(db, "lessons"));
    const lessonList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setLessons(lessonList);
    setLoading(false);
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this lesson?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "lessons", id));
    setLessons(lessons.filter((lesson) => lesson.id !== id));
  };

  if (loading) return <p className="p-4">Loading lessons...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Lessons</h1>
      {lessons.length === 0 ? (
        <p>No lessons found.</p>
      ) : (
        <div className="grid gap-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="border rounded-md p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{lesson.title}</p>
                <p className="text-sm text-gray-500">{lesson.courseTitle || "No course"}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/edit-lesson/${lesson.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(lesson.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
