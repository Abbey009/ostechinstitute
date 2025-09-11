// components/CourseCard.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseConfig";
import { useRouter } from "next/navigation";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function CourseCard({
  id,
  title,
  description,
  imageUrl,
}: CourseCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [nextLessonId, setNextLessonId] = useState<string | null>(null);
  const [checkingProgress, setCheckingProgress] = useState(true);

  useEffect(() => {
    const checkEnrollmentAndProgress = async () => {
      if (!user) return;
      setCheckingProgress(true);

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const enrolledCourses = userDoc.exists() ? userDoc.data().enrolledCourses || {} : {};
        const completedLessons = userDoc.exists() ? userDoc.data().completedLessons || {} : {};

        if (!enrolledCourses[id]) {
          setIsEnrolled(false);
          return;
        }

        setIsEnrolled(true);

        const lessonsSnap = await getDocs(collection(db, "courses", id, "lessons"));
        const lessons = lessonsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const nextLesson = lessons.find(
          (lesson) => !completedLessons[`${id}_${lesson.id}`]
        );

        if (nextLesson) {
          setNextLessonId(nextLesson.id);
        }
      } catch (error) {
        console.error("Error checking progress:", error);
      } finally {
        setCheckingProgress(false);
      }
    };

    checkEnrollmentAndProgress();
  }, [user, id]);

  const handleContinueLearning = () => {
    if (!nextLessonId) return;
    router.push(`/courses/${id}/learn#${nextLessonId}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex gap-3">
          <Link
            href={`/courses/${id}`}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            View Course
          </Link>
          {isEnrolled && !checkingProgress && nextLessonId && (
            <button
              onClick={handleContinueLearning}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            >
              Continue Learning
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
