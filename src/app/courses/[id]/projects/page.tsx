'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firebaseConfig';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext'; // adjust path to your AuthContext
import { ClipLoader } from 'react-spinners';

interface LessonProject {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  resources: string[];
  submissionLink?: string;
}

export default function ProjectsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;
  const { currentUser } = useAuth();

  const [projects, setProjects] = useState<LessonProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!courseId) return;

      const lessonsRef = collection(db, `courses/${courseId}/lessons`);
      const snapshot = await getDocs(lessonsRef);

      const projectLessons: LessonProject[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        if (data.handsOnProject) {
          let submissionLink = '';

          if (currentUser) {
            const submissionRef = doc(db, `users/${currentUser.uid}/projects/${docSnap.id}`);
            const submissionSnap = await getDoc(submissionRef);
            if (submissionSnap.exists()) {
              submissionLink = submissionSnap.data()?.submissionLink || '';
            }
          }

          projectLessons.push({
            id: docSnap.id,
            lessonId: docSnap.id,
            title: data.handsOnProject || 'Untitled Project',
            description: data.projectDescription || '',
            resources: data.projectResources || [],
            submissionLink,
          });
        }
      }

      setProjects(projectLessons);
      setLoading(false);
    };

    fetchProjects();
  }, [courseId, currentUser]);

  const handleSubmit = async (projectId: string, url: string) => {
    if (!currentUser || !url) return;
    setSubmitting(projectId);

    const submissionRef = doc(db, `users/${currentUser.uid}/projects/${projectId}`);
    await setDoc(submissionRef, {
      submissionLink: url,
      submittedAt: new Date().toISOString(),
      courseId,
    });

    setProjects(prev =>
      prev.map(p =>
        p.id === projectId ? { ...p, submissionLink: url } : p
      )
    );

    setSubmitting(null);
  };

  return (
    <div className="p-4 min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Course Projects</h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <ClipLoader size={40} color="#3b82f6" />
        </div>
      ) : projects.length === 0 ? (
        <p className="text-center text-gray-600">No projects available.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map(project => (
            <div key={project.id} className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
              <h2 className="text-xl font-semibold text-blue-700">{project.title}</h2>
              <p className="text-gray-600 my-2">{project.description}</p>

              {project.resources.length > 0 && (
                <ul className="list-disc pl-6 mb-4 text-sm text-blue-500">
                  {project.resources.map((res, idx) => (
                    <li key={idx}>
                      <a href={res} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {res}
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Submit your project URL:</label>
                <input
                  type="url"
                  defaultValue={project.submissionLink}
                  onBlur={(e) => handleSubmit(project.id, e.target.value)}
                  placeholder="https://github.com/your-repo or hosted site"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 text-sm"
                />
              </div>

              {submitting === project.id && (
                <p className="text-sm text-blue-600">Submitting...</p>
              )}

              {project.submissionLink && (
                <p className="text-green-600 text-sm mt-2">
                  Submitted: <a href={project.submissionLink} className="underline" target="_blank">{project.submissionLink}</a>
                </p>
              )}

              <button
                onClick={() =>
                  router.push(`/courses/${courseId}/lessons/${project.lessonId}`)
                }
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition text-sm"
              >
                Go to Lesson
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
