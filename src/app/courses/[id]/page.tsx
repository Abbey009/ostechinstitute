'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';
import { useAuth } from '@/context/AuthContext';
import ClipLoader from 'react-spinners/ClipLoader';

export default function CoursePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [course, setCourse] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      const courseRef = doc(db, 'courses', id as string);
      const courseSnap = await getDoc(courseRef);
      if (courseSnap.exists()) {
        setCourse(courseSnap.data());
      }
    };

    const checkEnrollment = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        const enrolled = userSnap.data()?.enrolledCourses?.[id as string] || false;
        setIsEnrolled(enrolled);
      }
    };

    fetchCourse();
    checkEnrollment();
  }, [id, user]);

  if (!course) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color="#3b82f6" size={50} />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">{course.title}</h1>

        <section className="mt-6">
          <h2 className="text-2xl font-semibold">About the Course</h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>{course.description}</li>
            <li>100% Online</li>
            <li>Beginner Level</li>
            <li>Approx. {course.estimatedDuration || '7 weeks'} (7 hrs/week)</li>
          </ul>
        </section>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {course.skills && (
            <div>
              <h3 className="font-semibold">Skills You’ll Gain</h3>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {course.skills.map((skill: string, idx: number) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            </div>
          )}

          {course.handsOnProject && (
            <div>
              <h3 className="font-semibold">Hands-On Project</h3>
              <p className="mt-2">{course.handsOnProject}</p>
            </div>
          )}

          {course.assignment && (
            <div>
              <h3 className="font-semibold">Assignment</h3>
              <p className="mt-2">{course.assignment}</p>
            </div>
          )}

          {course.quizzes && (
            <div>
              <h3 className="font-semibold">Quizzes</h3>
              <p className="mt-2">{course.quizzes}</p>
            </div>
          )}

          {course.certificate && (
            <div>
              <h3 className="font-semibold">Certificate</h3>
              <p className="mt-2">Earn a certificate upon completion</p>
            </div>
          )}

          {course.cost && (
            <div>
              <h3 className="font-semibold">Cost</h3>
              <p className="mt-2">{course.cost}</p>
            </div>
          )}

          {course.lessons && (
            <div>
              <h3 className="font-semibold">Lessons</h3>
              <p className="mt-2">{course.lessons.length} lessons</p>
            </div>
          )}
        </div>

        {!isEnrolled && user && (
          <button
            onClick={() => router.push(course.cost === 'Free' ? `/courses/${id}/start` : `/courses/${id}/payment`)}
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg transition"
          >
            {course.cost === 'Free' ? 'Start Learning' : 'Enroll Now'}
          </button>
        )}

        {isEnrolled && (
          <p className="mt-8 text-green-600 text-lg font-semibold">
            You are already enrolled in this course.
          </p>
        )}
      </div>
    </div>
  );
}
