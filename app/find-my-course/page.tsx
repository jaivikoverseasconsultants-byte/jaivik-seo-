import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const FindMyCourseMatcher = dynamic(() => import('@/components/FindMyCourseMatcher'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center py-24 text-gray-500">
      <div className="w-10 h-10 border-4 border-brand-700 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm">Loading matcher…</p>
    </div>
  ),
});

export const metadata: Metadata = {
  title: 'Find My Course | Real University Course Matcher for Indian Students',
  description: 'Tell us your country, degree level, subject, and budget — get matched against our real, crawled course database across 103 universities, with a free downloadable shortlist.',
  keywords: ['find my course abroad', 'university matcher', 'course finder India', 'study abroad quiz', 'which university should I apply'],
  alternates: { canonical: 'https://study.jaivikoverseasconsultants.com/find-my-course' },
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
            🎯 Real Course Matching — Not Estimates
          </div>
          <h1 className="text-4xl font-bold mb-3">Find Your Perfect Course Abroad</h1>
          <p className="text-blue-200 text-lg mb-4">
            Tell us your country, degree level, subject, and budget — get matched against our real, crawled course
            database and a free downloadable shortlist.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {['📊 Real course data', '🎓 103 real universities', '🆓 100% free'].map(tag => (
              <span key={tag} className="bg-white/10 text-white px-3 py-1.5 rounded-full text-xs">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Matcher */}
      <section className="bg-gray-50 min-h-screen">
        <FindMyCourseMatcher />
      </section>
    </>
  );
}
