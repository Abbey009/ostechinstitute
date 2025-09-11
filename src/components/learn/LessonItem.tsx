// components/learn/LessonItem.tsx
import React, { useState } from "react";

interface Quiz {
  question: string;
  options: string[];
  answer: string;
}

interface Lesson {
  id: string;
  title: string;
  videoUrl?: string;
  content?: string;
  duration?: string;
  completed?: boolean;
  resources?: string[];
  quiz?: Quiz;
  assignment?: string;
}

interface LessonItemProps {
  lesson: Lesson;
  onMarkComplete: (lessonId: string) => void;
  quizMessage?: string;
  onQuizSubmit: (lessonId: string, selected: string, correct: string) => void;
  lessonRef?: React.RefObject<HTMLDivElement> | ((instance: HTMLDivElement | null) => void);
}

function convertToEmbedUrl(url: string): string {
  try {
    if (url.includes("youtu.be")) {
      const id = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("youtube.com")) {
      const urlObj = new URL(url);
      const id = urlObj.searchParams.get("v");
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  } catch {
    return url;
  }
}

const LessonItem: React.FC<LessonItemProps> = ({
  lesson,
  onMarkComplete,
  quizMessage,
  onQuizSubmit,
  lessonRef,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div
      ref={lessonRef}
      className="p-4 bg-white rounded-lg shadow border mb-8"
      aria-labelledby={`lesson-title-${lesson.id}`}
      tabIndex={-1}
    >
      <h3 id={`lesson-title-${lesson.id}`} className="text-xl font-semibold mb-2">
        {lesson.title}
      </h3>

      {lesson.duration && (
        <p className="mb-2 text-sm text-gray-600">
          Duration: {lesson.duration}
        </p>
      )}

      {lesson.videoUrl && (
        <iframe
          title={`Video for ${lesson.title}`}
          className="w-full aspect-video mb-4 rounded"
          src={convertToEmbedUrl(lesson.videoUrl)}
          allowFullScreen
        />
      )}

      {lesson.content && (
        <div
          className="mb-4 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
      )}

      {lesson.resources && lesson.resources.length > 0 && (
        <section className="mb-4">
          <h4 className="font-semibold mb-1">Resources:</h4>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            {lesson.resources.map((resource, i) => (
              <li key={i}>
                <a
                  href={resource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-900"
                >
                  Resource {i + 1}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {lesson.quiz && (
        <section className="mb-4">
          <h4 className="font-semibold mb-2">Quiz: {lesson.quiz.question}</h4>
          <div role="radiogroup" aria-labelledby={`quiz-${lesson.id}`}>
            {lesson.quiz.options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setSelectedOption(option);
                  onQuizSubmit(lesson.id, option, lesson.quiz!.answer);
                }}
                className={`block w-full text-left px-4 py-2 mb-2 border rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  selectedOption === option ? "bg-blue-100" : ""
                }`}
                aria-pressed={selectedOption === option}
              >
                {option}
              </button>
            ))}
          </div>
          {quizMessage && (
            <p
              role="alert"
              className={`mt-2 font-semibold ${
                quizMessage === "Correct Answer!" ? "text-green-600" : "text-red-600"
              }`}
            >
              {quizMessage}
            </p>
          )}
        </section>
      )}

      {lesson.assignment && (
        <section className="mb-4">
          <h4 className="font-semibold mb-1">Assignment</h4>
          <p>{lesson.assignment}</p>
        </section>
      )}

      {!lesson.completed ? (
        <button
          onClick={() => onMarkComplete(lesson.id)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Mark lesson ${lesson.title} as completed`}
        >
          Mark as Completed
        </button>
      ) : (
        <p className="mt-4 font-semibold text-green-700">Lesson Completed ✅</p>
      )}
    </div>
  );
};

export default LessonItem;
