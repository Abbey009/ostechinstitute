"use client";
import TopBar from "@/components/learn/TopBar";
import LessonItem from "@/components/learn/LessonItem";
import SidebarLessonList from "@/components/learn/SidebarLessonList";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { ClipLoader } from "react-spinners";
import { markLessonComplete, markCourseComplete } from "@/utils/lessonUtils";
import { useActivity } from "@/hooks/useActivity";
import { Button } from "@/components/ui/button";

interface Lesson {
  id: string;
  title: string;
  videoUrl?: string;
  content?: string;
  duration?: string;
  completed?: boolean;
  resources?: string[];
  quiz?: {
    question: string;
    options: string[];
    answer: string;
  };
  assignment?: string;
}

function convertToEmbedUrl(url: string): string {
  try {
    if (url.includes("youtu.be")) {
      const id = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("youtube.com")) {
      const urlObj = new URL(url);
      const id = urlObj.searchParams.get("v");
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  } catch {
    return url;
  }
}

export default function LearnPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizMessage, setQuizMessage] = useState<{ [key: string]: string }>({});
  const [certificateAvailable, setCertificateAvailable] = useState(false);

  const lessonRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const { updateCourseActivity, updateLessonActivity } = useActivity(courseId);

  const firstIncompleteLessonId = lessons.find((l) => !l.completed)?.id;

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      try {
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : null;

        if (!userData?.enrolledCourses?.[courseId]) {
          setIsEnrolled(false);
          return;
        }

        setIsEnrolled(true);
        await updateCourseActivity();

        const lessonsRef = collection(db, "courses", courseId, "lessons");
        const snapshot = await getDocs(lessonsRef);
        const lessonsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Lesson[];

        const completedLessons = userData.completedLessons || {};
        const updatedLessons = lessonsList.map(lesson => ({
          ...lesson,
          completed: completedLessons[`${courseId}_${lesson.id}`] || false,
        }));

        setLessons(updatedLessons);
        setCompletedCount(updatedLessons.filter(l => l.completed).length);

        const certRef = doc(db, "certificates", `${user.uid}_${courseId}`);
        const certSnap = await getDoc(certRef);
        if (certSnap.exists()) setCertificateAvailable(true);
      } catch (error) {
        console.error("Error loading lessons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [params.id, user]);

  const handleMarkComplete = useCallback(
    async (lessonId: string) => {
      if (!user) return;
      await markLessonComplete(user.uid, courseId, lessonId);
      await updateLessonActivity(lessonId);

      setLessons(prev =>
        prev.map(lesson =>
          lesson.id === lessonId ? { ...lesson, completed: true } : lesson
        )
      );

      setCompletedCount(prev => {
        const newCount = prev + 1;
        if (newCount === lessons.length) {
          markCourseComplete(user.uid, courseId);
          const certRef = doc(db, "certificates", `${user.uid}_${courseId}`);
          setDoc(certRef, {
            userId: user.uid,
            courseId,
            completedAt: serverTimestamp(),
          });
          alert("Course completed! Your certificate is now available.");
          setCertificateAvailable(true);
        }
        return newCount;
      });
    },
    [user, courseId, lessons.length, updateLessonActivity]
  );

  const handleQuizSubmit = (lessonId: string, selected: string, correct: string) => {
    const message = selected === correct ? "Correct Answer!" : "Wrong Answer. Try Again!";
    setQuizMessage(prev => ({ ...prev, [lessonId]: message }));
  };

  const scrollToLesson = (id: string) => {
    const el = lessonRefs.current[id];
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader size={40} color="#3B82F6" />
      </div>
    );
  }

  if (isEnrolled === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="mb-4">You are not enrolled in this course.</p>
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <SidebarLessonList lessons={lessons} scrollToLesson={scrollToLesson} />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 sm:p-6 space-y-10">
        <TopBar
          courseId={courseId}
          certificateAvailable={certificateAvailable}
          completedCount={completedCount}
          totalLessons={lessons.length}
        />

        {firstIncompleteLessonId && (
          <div className="mb-6">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
              onClick={() => scrollToLesson(firstIncompleteLessonId)}
            >
              Continue Learning
            </Button>
          </div>
        )}

        {lessons.map((lesson) => (
          <LessonItem
            key={lesson.id}
            lesson={lesson}
            lessonRef={(el) => (lessonRefs.current[lesson.id] = el)}
            onMarkComplete={handleMarkComplete}
            quizMessage={quizMessage[lesson.id]}
            onQuizSubmit={handleQuizSubmit}
          />
        ))}
      </main>
    </div>
  );
}
