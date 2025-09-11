// components/Metrics.tsx
'use client';

export default function Metrics() {
  return (
    <section className="bg-gray-100 py-10 text-center">
      <h2 className="text-2xl font-bold mb-6">Our Impact</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xl font-semibold">
        <p>2,000+ Learners</p>
        <p>1,000+ Courses Completed</p>
        <p>90% Student Satisfaction</p>
      </div>
    </section>
  );
}
