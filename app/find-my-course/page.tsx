import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const CourseMatcherClient = dynamic(() => import('@/components/CourseMatcherClient'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center py-24 text-gray-500">
      <div className="w-10 h-10 border-4 border-brand-700 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm">Loading course finder…</p>
    </div>
  ),
});

export const metadata: Metadata = {
  title: 'Find My Course | 5-Step University Matcher for Indian Students',
  description: 'Not sure which course or university is right for you? Use our free 5-step course matching wizard to find universities that match your study level, subject, country, budget and IELTS score.',
  keywords: ['find my course abroad', 'university matcher', 'course finder India', 'study abroad quiz', 'which university should I apply'],
};

export default function FindMyCoursePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4 justify-center">
            <a href="/" className="hover:text-white">Home</a>
            <span>/</span>
            <span className="text-white">Find My Course</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            🎯 Free 5-Step Course Matching Tool
          </div>
          <h1 className="text-4xl font-bold mb-3">Find Your Perfect Course Abroad</h1>
          <p className="text-blue-200 text-lg mb-4">
            Answer 5 quick questions and we&apos;ll match you with universities that fit your study level, subject, country, budget, and IELTS score.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {['⏱️ 2 minutes', '🎓 500+ universities analysed', '🆓 100% free'].map(tag => (
              <span key={tag} className="bg-white/10 text-white px-3 py-1.5 rounded-full text-xs">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Wizard */}
      <section className="bg-gray-50 min-h-screen">
        <CourseMatcherClient />
      </section>
    </>
  );
}
