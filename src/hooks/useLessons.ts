import { useState, useEffect } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseConfig";

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

export function useLessons(user: any, courseId: string) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [certificateAvailable, setCertificateAvailable] = useState(false);

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
  }, [user, courseId]);

  return {
    lessons,
    setLessons,
    completedCount,
    setCompletedCount,
    isEnrolled,
    loading,
    certificateAvailable,
    setCertificateAvailable,
  };
}
