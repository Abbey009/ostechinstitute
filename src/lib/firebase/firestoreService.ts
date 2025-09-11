import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const markLessonComplete = async (userId: string, courseId: string, lessonId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(
      userRef,
      {
        completedLessons: {
          [`${courseId}_${lessonId}`]: true,
        },
      },
      { merge: true }
    );
    console.log('Lesson marked as complete');
  } catch (error) {
    console.error('Error marking lesson as completed:', error);
  }
};
