import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

type Course = {
  id: string;
  title: string;
  description?: string;
  image?: string;
};

type LessonStats = {
  total: number;
  completed: number;
};

export function useDashboardData() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [lessonStats, setLessonStats] = useState<Record<string, LessonStats>>({});
  const [lastActivityMap, setLastActivityMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : null;
        const enrolledCourses = userData?.enrolledCourses ? Object.keys(userData.enrolledCourses) : [];
        const completedLessons = userData?.completedLessons || {};
        const lastActivity = userData?.lastActivity || {};

        const progress: Record<string, number> = {};
        const lessonData: Record<string, LessonStats> = {};
        const activityMap: Record<string, string> = {};

        const coursePromises = enrolledCourses.map(async (courseId) => {
          try {
            const courseRef = doc(db, 'courses', courseId);
            const courseSnap = await getDoc(courseRef);
            if (!courseSnap.exists()) return null;

            const courseData = courseSnap.data() as Course;
            const lessonsRef = collection(db, 'courses', courseId, 'lessons');
            const lessonSnap = await getDocs(lessonsRef);
            const lessonIds = lessonSnap.docs.map((doc) => doc.id);
            const totalLessons = lessonIds.length;
            const completedCount = lessonIds.filter(
              (lessonId) => completedLessons[`${courseId}_${lessonId}`]
            ).length;

            progress[courseId] = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;
            lessonData[courseId] = { total: totalLessons, completed: completedCount };

            if (lastActivity[courseId]) {
              const lastSeenDate = new Date(lastActivity[courseId]);
              activityMap[courseId] = lastSeenDate.toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              });
            }

            return { id: courseId, ...courseData };
          } catch {
            return null;
          }
        });

        const resolvedCourses = (await Promise.all(coursePromises)).filter(Boolean) as Course[];
        setCourses(resolvedCourses);
        setProgressMap(progress);
        setLessonStats(lessonData);
        setLastActivityMap(activityMap);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return {
    courses,
    progressMap,
    lessonStats,
    lastActivityMap,
    loading,
    error,
  };
}
