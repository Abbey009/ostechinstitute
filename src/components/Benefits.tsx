'use client';

import { CheckCircle } from 'lucide-react';

const benefits = [
  'Real Projects for Practical Learning',
  'Track Your Progress',
  'Free Access to All Courses',
  'Interactive Quizzes and Certificates',
  'Built for Beginners and Career Changers',
  'No Credit Card Required',
];

const Benefits = () => {
  return (
    <section className="bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Why Choose TechStack Academy?</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-6">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="text-green-500 mt-1" size={20} />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Benefits;
