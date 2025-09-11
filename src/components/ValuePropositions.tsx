// components/ValuePropositions.tsx
'use client';

export default function ValuePropositions() {
  return (
    <section className="bg-white py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center px-6">
        <div>
          <h3 className="text-xl font-bold mb-2">Self-Paced & Beginner Friendly</h3>
          <p>Learn anytime, anywhere at your own pace.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Real Projects, Real Skills</h3>
          <p>Build portfolio-ready projects while learning.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Join 2,000+ Learners</h3>
          <p>Be part of a growing global tech community.</p>
        </div>
      </div>
    </section>
  );
}
