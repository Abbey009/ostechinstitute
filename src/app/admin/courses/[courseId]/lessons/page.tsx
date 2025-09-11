// app/admin/courses/[courseId]/lessons/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase/firebaseConfig";
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";

interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  duration: string;
}

export default function LessonsListPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const fetchLessons = async () => {
      const q = query(collection(db, "lessons"), where("courseId", "==", courseId));
      const querySnapshot = await getDocs(q);
      const lessonList: Lesson[] = [];
      querySnapshot.forEach((docSnap) => {
        lessonList.push({ id: docSnap.id, ...docSnap.data() } as Lesson);
      });
      setLessons(lessonList);
    };

    fetchLessons();
  }, [courseId]);

  const handleDelete = async (lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    await deleteDoc(doc(db, "lessons", lessonId));
    setLessons(lessons.filter((lesson) => lesson.id !== lessonId));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lessons</h1>
      <button
        onClick={() => router.push(`/admin/courses/${courseId}/lessons/new`)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add New Lesson
      </button>

      <ul className="space-y-4">
        {lessons.map((lesson) => (
          <li
            key={lesson.id}
            className="p-4 border rounded flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{lesson.title}</h2>
              <p className="text-sm text-gray-600">Duration: {lesson.duration}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() =>
                  router.push(`/admin/courses/${courseId}/lessons/${lesson.id}/edit`)
                }
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(lesson.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
