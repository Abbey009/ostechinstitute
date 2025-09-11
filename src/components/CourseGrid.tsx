'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2 } from 'lucide-react';

const courses = [
  {
    title: 'DevOps Mastery',
    description:
      'Master DevOps from scratch. Learn Linux, CI/CD pipelines, Docker, and Kubernetes through practical, real-world projects. Beginner-friendly with quizzes and certification.',
    price: '$49',
    image: '/images/devops.jpg',
    id: 'devops',
    features: ['Beginner-Friendly', 'Hands-On Projects', 'Certificate', 'Quizzes'],
  },
  {
    title: 'Full-Stack Web Development',
    description:
      'Become a full-stack web developer by learning HTML, CSS, JavaScript, React, Node.js, and more. Includes real-world projects and step-by-step guidance.',
    price: '$39',
    image: '/images/webdev.jpg',
    id: 'webdev',
    features: ['Project-Based', 'Frontend & Backend', 'Beginner-Friendly', 'Certificate'],
  },
  {
    title: 'Python Programming',
    description:
      'Learn Python from basics to advanced topics. Build automation scripts, data tools, and complete real-world projects. Perfect for beginners.',
    price: '$29',
    image: '/images/python.jpg',
    id: 'python',
    features: ['Beginner to Advanced', 'Real-World Projects', 'Certificate', 'Quizzes'],
  },
];

export default function CourseGrid() {
  const router = useRouter();
  const { user } = useAuth();

  const handleCourseClick = (path: string) => {
    if (user) router.push(path);
    else router.push('/auth/signup');
  };

  return (
    <section className="bg-gray-50 px-4 py-12">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-gray-800">
        Our Courses
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {courses.map((course) => (
          <div
            key={course.id}
            onClick={() => handleCourseClick(`/courses/${course.id}`)}
            className="bg-white rounded-2xl shadow-md transition duration-300 transform hover:scale-[1.02] hover:shadow-lg cursor-pointer overflow-hidden flex flex-col"
          >
            <div className="relative h-48 w-full">
              <Image
                src={course.image}
                alt={`Course preview for ${course.title}`}
                layout="fill"
                objectFit="cover"
                className="w-full h-full"
                priority
              />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {course.title}
              </h3>
              <p className="text-gray-700 text-sm mb-4 flex-1">{course.description}</p>
              <ul className="text-sm text-gray-700 mb-4 space-y-1">
                {course.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <p className="text-green-600 font-bold text-lg mt-auto">{course.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
