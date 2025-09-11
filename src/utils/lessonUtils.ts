import { doc, updateDoc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';

/**
 * Marks a lesson as completed for a specific user.
 *
 * @param userId - The UID of the current user
 * @param courseId - The ID of the course
 * @param lessonId - The ID of the lesson
 */
export async function markLessonComplete(userId: string, courseId: string, lessonId: string) {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const completedLessons = userData.completedLessons || {};

      const updatedLessons = {
        ...completedLessons,
        [`${courseId}_${lessonId}`]: true,
      };

      await updateDoc(userRef, { completedLessons: updatedLessons });
    } else {
      // If the user document doesn't exist yet, create it with this completed lesson
      await setDoc(userRef, {
        completedLessons: {
          [`${courseId}_${lessonId}`]: true,
        },
      });
    }
  } catch (error) {
    console.error('Error marking lesson as complete:', error);
  }
}

/**
 * Marks a course as completed for a specific user.
 *
 * @param userId - The UID of the current user
 * @param courseId - The ID of the course
 */
export const markCourseComplete = async (userId: string, courseId: string) => {
  const userRef = doc(db, 'users', userId);
  try {
    await updateDoc(userRef, {
      completedCourses: arrayUnion(courseId),
    });
  } catch (error) {
    console.error('Error marking course complete:', error);
  }
};
