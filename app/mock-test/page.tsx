import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Free IELTS Mock Test 2026 – Full Test + Reading, Listening, Writing, Speaking | Jaivik Overseas',
  description: 'Take a free IELTS mock test online. Choose Beginner, Intermediate, or Advanced level. Full test or individual sections — Reading, Listening, Writing, Speaking — with auto band scoring.',
  path: '/mock-test',
  keywords: [
    'IELTS mock test 2026 free',
    'IELTS practice test online',
    'IELTS reading test free',
    'IELTS listening practice',
    'IELTS band score calculator',
    'IELTS preparation India',
  ],
});

const testSchema = {
  '@context': 'https://schema.org',
  '@type': 'Quiz',
  name: 'Free IELTS Mock Test 2026',
  description: 'Comprehensive IELTS mock tests for Reading, Listening, Writing, and Speaking with instant band score prediction.',
  url: 'https://study.jaivikoverseasconsultants.com/mock-test',
  educationalLevel: 'University',
  about: { '@type': 'Thing', name: 'IELTS Preparation' },
  provider: { '@type': 'EducationalOrganization', name: 'Jaivik Overseas Consultants', url: 'https://study.jaivikoverseasconsultants.com' },
};

const LEVELS = [
  {
    key: 'beginner',
    label: 'Beginner',
    band: 'Band 4.0 – 5.5',
    description: 'New to IELTS or starting your preparation journey',
    icon: '🌱',
    color: 'from-green-500 to-emerald-600',
    badge: 'Best for first-timers',
  },
  {
    key: 'intermediate',
    label: 'Intermediate',
    band: 'Band 5.5 – 7.0',
    description: 'Have some IELTS experience, aiming for university admission',
    icon: '📈',
    color: 'from-blue-500 to-brand-600',
    badge: 'Most popular',
  },
  {
    key: 'advanced',
    label: 'Advanced',
    band: 'Band 7.0 – 9.0',
    description: 'Targeting top universities with high band requirements',
    icon: '🏆',
    color: 'from-purple-500 to-violet-700',
    badge: 'For top scores',
  },
];

const SECTIONS = [
  {
    key: 'full',
    label: 'Full Test',
    desc: 'All 4 sections — the complete IELTS experience',
    icon: '📋',
    time: '2h 45min',
    questions: '80+ items',
    color: 'bg-gray-900',
  },
  {
    key: 'reading',
    label: 'Reading',
    desc: '3 passages, 40 questions, MCQ + True/False + Fill',
    icon: '📖',
    time: '60 min',
    questions: '40 questions',
    color: 'bg-brand-700',
  },
  {
    key: 'listening',
    label: 'Listening',
    desc: '4 sections with transcripts, MCQ + Fill blanks',
    icon: '🎧',
    time: '30 min',
    questions: '40 questions',
    color: 'bg-teal-700',
  },
  {
    key: 'writing',
    label: 'Writing',
    desc: 'Task 1 graph + Task 2 essay with sample answers',
    icon: '✍️',
    time: '60 min',
    questions: '2 tasks',
    color: 'bg-amber-700',
  },
  {
    key: 'speaking',
    label: 'Speaking',
    desc: 'Part 1–3 with cue card, prep timer & sample answers',
    icon: '🎤',
    time: '11–14 min',
    questions: '3 parts',
    color: 'bg-purple-700',
  },
];

export default async function MockTestPage({
  searchParams,
}: {
  searchParams: Promise<{ recommend?: string }>;
}) {
  const { recommend } = await searchParams;

  return (
    <>
      <JsonLd data={testSchema} />
      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0a1628] via-[#0d1b2e] to-[#1a2e4a] text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/40 text-brand-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              🆓 100% Free · No Registration Required
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              IELTS Mock Test <span className="text-brand-400">2026</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Realistic IELTS practice tests for all four sections — Reading, Listening, Writing, and Speaking.
              Choose your level and get instant band score predictions.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300">
              {['40-question Reading tests', '40-question Listening tests', 'Task 1 + Task 2 Writing', 'Part 1–3 Speaking with cue cards'].map(f => (
                <span key={f} className="flex items-center gap-1.5"><span className="text-green-400">✓</span>{f}</span>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">
          {/* Recommended */}
          {recommend && (
            <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6">
              <p className="text-brand-700 font-bold text-lg mb-1">🎯 Recommended for you</p>
              <p className="text-brand-600 text-sm mb-4">Based on your profile, we recommend starting here:</p>
              <Link
                href={`/mock-test/${recommend}/full`}
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-bold transition-colors"
              >
                Take {recommend.charAt(0).toUpperCase() + recommend.slice(1)} Full Test →
              </Link>
            </div>
          )}

          {/* Step 1: Choose Level */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-9 h-9 rounded-full bg-[#0a1628] text-white flex items-center justify-center font-black text-lg">1</span>
              <h2 className="text-2xl font-black text-gray-900">Choose Your Level</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {LEVELS.map(lvl => (
                <div key={lvl.key} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className={`bg-gradient-to-br ${lvl.color} p-6 text-white`}>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-4xl">{lvl.icon}</span>
                      <span className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full">{lvl.badge}</span>
                    </div>
                    <h3 className="text-2xl font-black">{lvl.label}</h3>
                    <p className="text-white/80 text-sm font-semibold mt-0.5">{lvl.band}</p>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-600 text-sm mb-4">{lvl.description}</p>
                    <div className="space-y-2">
                      <Link href={`/mock-test/${lvl.key}/full`}
                        className="block w-full text-center bg-[#0a1628] hover:bg-[#0d1b2e] text-white py-2.5 rounded-xl text-sm font-bold transition-colors">
                        Full Test →
                      </Link>
                      <div className="grid grid-cols-2 gap-2">
                        {['reading', 'listening'].map(s => (
                          <Link key={s} href={`/mock-test/${lvl.key}/${s}`}
                            className="text-center border border-gray-200 hover:border-brand-400 text-gray-700 hover:text-brand-700 py-2 rounded-lg text-xs font-semibold capitalize transition-colors">
                            {s}
                          </Link>
                        ))}
                        {['writing', 'speaking'].map(s => (
                          <Link key={s} href={`/mock-test/${lvl.key}/${s}`}
                            className="text-center border border-gray-200 hover:border-brand-400 text-gray-700 hover:text-brand-700 py-2 rounded-lg text-xs font-semibold capitalize transition-colors">
                            {s}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Step 2: Or choose section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-9 h-9 rounded-full bg-[#0a1628] text-white flex items-center justify-center font-black text-lg">2</span>
              <h2 className="text-2xl font-black text-gray-900">Or Practice a Single Section</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SECTIONS.map(sec => (
                <div key={sec.key} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${sec.color} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                      {sec.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900">{sec.label}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{sec.time} · {sec.questions}</p>
                      <p className="text-xs text-gray-600 mt-1">{sec.desc}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {LEVELS.map(lvl => (
                      <Link key={lvl.key} href={`/mock-test/${lvl.key}/${sec.key}`}
                        className="flex-1 text-center border border-gray-200 hover:border-brand-400 hover:bg-brand-50 text-gray-600 hover:text-brand-700 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors">
                        {lvl.label.slice(0, 3)}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* What you get */}
          <section className="bg-[#0a1628] rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-black mb-6 text-center">What You Get in Each Test</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: '⏱', title: 'Timed Tests', desc: 'Authentic IELTS timing with countdown timer and auto-submit' },
                { icon: '🎯', title: 'Instant Scoring', desc: 'Auto-marked Reading & Listening with accurate band prediction' },
                { icon: '📄', title: 'Sample Answers', desc: 'Band 7+ sample answers for Writing and Speaking sections' },
                { icon: '💡', title: 'Expert Tips', desc: 'Section-specific band tips and key vocabulary guidance' },
              ].map(f => (
                <div key={f.title} className="text-center">
                  <div className="text-4xl mb-3">{f.icon}</div>
                  <h3 className="font-bold text-brand-300 mb-1">{f.title}</h3>
                  <p className="text-gray-400 text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-brand-500 to-brand-700 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-black mb-2">Want a Personalised IELTS Study Plan?</h2>
            <p className="text-brand-200 mb-5">Our experts analyse your mock test results and create a targeted preparation strategy.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="https://wa.me/919510603038?text=Hi!%20I'd%20like%20help%20with%20IELTS%20preparation"
                target="_blank" rel="noopener noreferrer"
                className="bg-white text-brand-700 font-bold px-6 py-3 rounded-xl hover:bg-brand-50 transition-colors">
                📞 Book Free Counselling
              </a>
              <Link href="/mock-test/intermediate/full"
                className="bg-brand-800 border border-brand-400 text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-900 transition-colors">
                Start Intermediate Test →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
