// hooks/useActivity.ts
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const useActivity = (courseId: string) => {
  const { user } = useAuth();

  const updateCourseActivity = async () => {
    if (!user) return;
    const activityRef = doc(db, "users", user.uid, "activity", courseId);
    await setDoc(activityRef, {
      lastCourseActivity: serverTimestamp(),
    }, { merge: true });
  };

  const updateLessonActivity = async (lessonId: string) => {
    if (!user) return;
    const activityRef = doc(db, "users", user.uid, "activity", courseId);
    await setDoc(activityRef, {
      lessons: {
        [lessonId]: serverTimestamp(),
      },
    }, { merge: true });
  };

  return { updateCourseActivity, updateLessonActivity };
};
