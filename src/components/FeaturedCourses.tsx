'use client';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const courses = [
  {
    title: 'DevOps Mastery',
    description: 'Start from Linux basics to CI/CD, Docker & Kubernetes.',
    price: 'N29,000',
    image: '/images/devops.jpg',
    id: 'devops',
  },
  {
    title: 'Full-Stack Web Development',
    description: 'HTML, CSS, JavaScript, React, Node.js & more.',
    price: 'N20,000',
    image: '/images/webdev.jpg',
    id: 'webdev',
  },
  {
    title: 'Python Programming',
    description: 'Beginner to advanced Python with real-world projects.',
    price: 'N10,000',
    image: '/images/python.jpg',
    id: 'python',
  },
];

export default function FeaturedCourses() {
  const router = useRouter();
  const { user } = useAuth();

  const handleCourseClick = (path: string) => {
    if (user) router.push(path);
    else router.push('/auth/signup');
  };

  return (
    <section className="p-6 bg-white">
      <h2 className="text-2xl font-bold text-center mb-4">Explore Featured Courses</h2>
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
      >
        {courses.map((course, index) => (
          <SwiperSlide key={index}>
            <div
              className="cursor-pointer flex flex-col items-center bg-gray-100 rounded-lg p-4 mx-6 md:mx-24"
              onClick={() => handleCourseClick(`/courses/${course.id}`)}
            >
              <Image src={course.image} alt={course.title} width={600} height={300} className="rounded-md object-cover" />
              <h3 className="text-xl font-semibold mt-3">{course.title}</h3>
              <p className="text-gray-600">{course.description}</p>
              <p className="mt-2 font-bold text-green-600">{course.price}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
