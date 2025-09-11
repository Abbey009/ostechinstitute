import { db } from '@/lib/firebase/firebaseConfig';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

export const enrollInCourse = async (userId: string, courseId: string) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      enrolledCourses: {
        [courseId]: true,
      },
    });
  } else {
    await updateDoc(userRef, {
      [`enrolledCourses.${courseId}`]: true,
    });
  }
};
