"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditLessonPage() {
  const { courseId, lessonId } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [resources, setResources] = useState("");

  useEffect(() => {
    const fetchLesson = async () => {
      const docRef = doc(db, "lessons", lessonId as string);
      const lessonSnap = await getDoc(docRef);
      if (lessonSnap.exists()) {
        const data = lessonSnap.data();
        setTitle(data.title || "");
        setVideoUrl(data.videoUrl || "");
        setDuration(data.duration || "");
        setResources(data.resources || "");
      }
    };

    fetchLesson();
  }, [lessonId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const lessonRef = doc(db, "lessons", lessonId as string);
      await updateDoc(lessonRef, {
        title,
        videoUrl,
        duration,
        resources,
        updatedAt: new Date(),
      });
      router.push(`/admin/courses/${courseId}/lessons`);
    } catch (error) {
      console.error("Error updating lesson:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Lesson</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          placeholder="Lesson Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Resources"
          value={resources}
          onChange={(e) => setResources(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Update Lesson
        </button>
      </form>
    </div>
  );
}
