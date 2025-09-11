// components/FAQ.tsx
'use client';

export default function FAQ() {
  return (
    <section className="bg-gray-50 py-10 px-4">
      <h2 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
      <div className="max-w-3xl mx-auto space-y-4">
        <div>
          <h3 className="font-semibold text-lg">Who can enroll in OsTech courses?</h3>
          <p>Anyone with a desire to learn — from complete beginners to tech professionals.</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg">Are the courses free?</h3>
          <p>Some courses are free while others are premium, starting at affordable prices.</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg">Do I get a certificate?</h3>
          <p>Yes, you receive a certificate upon completing any course with assessments.</p>
        </div>
      </div>
    </section>
  );
}
