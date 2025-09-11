// components/learn/SidebarLessonList.tsx
import React from "react";

interface Lesson {
  id: string;
  title: string;
}

interface SidebarLessonListProps {
  lessons: Lesson[];
  scrollToLesson: (lessonId: string) => void;
}

const SidebarLessonList: React.FC<SidebarLessonListProps> = ({
  lessons,
  scrollToLesson,
}) => {
  return (
    <aside className="w-64 bg-blue-900 text-white p-4 hidden md:block h-screen sticky top-0 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Lessons</h2>
      {lessons.map((lesson) => (
        <button
          key={lesson.id}
          onClick={() => scrollToLesson(lesson.id)}
          className="block w-full text-left px-3 py-2 rounded hover:bg-blue-700"
        >
          {lesson.title}
        </button>
      ))}
    </aside>
  );
};

export default SidebarLessonList;
