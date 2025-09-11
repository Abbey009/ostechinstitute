// components/Testimonials.tsx
'use client';

import Image from 'next/image';

interface Testimonial {
  name: string;
  message: string;
  image: string;
  title: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Amina Yusuf',
    message: 'OsTech Institute helped me transition into a DevOps role in just 3 months!',
    image: '/images/amina.jpg',
    title: 'Cloud Engineer, Nigeria',
  },
  {
    name: 'Kwame Mensah',
    message: 'As a beginner, the platform guided me step by step to become a full-stack developer.',
    image: '/images/kwame.jpg',
    title: 'Software Developer, Ghana',
  },
  {
    name: 'Zanele Dlamini',
    message: 'Practical lessons and real projects made the difference. I landed a freelance job easily!',
    image: '/images/zanele.jpg',
    title: 'Freelancer, South Africa',
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gray-100 p-8">
      <h2 className="text-2xl font-bold text-center mb-6">What Our Students Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-md text-center">
            <Image src={t.image} alt={t.name} width={100} height={100} className="rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-semibold">{t.name}</h3>
            <p className="text-sm italic text-gray-600 mb-2">{t.title}</p>
            <p className="text-gray-700">“{t.message}”</p>
          </div>
        ))}
      </div>
    </section>
  );
}
