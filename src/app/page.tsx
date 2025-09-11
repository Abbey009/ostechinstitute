'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Metrics from '@/components/Metrics';
import ValuePropositions from '@/components/ValuePropositions';
import FAQ from '@/components/FAQ';
import Hero from '@/components/Hero';
import Testimonials from '@/components/Testimonials';
import FeaturedCourses from '@/components/FeaturedCourses';
import CourseGrid from '@/components/CourseGrid';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/dashboard'); // Change this to your actual dashboard route
    }
  }, [user, router]);

  const handleCourseClick = (path: string) => {
    if (user) {
      router.push(path);
    } else {
      router.push('/auth/signup');
    }
  };

  return (
    <main className="text-gray-800">
      <Hero />
      <ValuePropositions />
      <Metrics />
      <FeaturedCourses />
      <CourseGrid />
      <Testimonials />
      <FAQ />
      <CallToAction />
      <Footer />
    </main>
  );
}
