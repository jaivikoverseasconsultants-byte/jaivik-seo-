import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata, authorPersonSchema } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import VerifiedBy from '@/components/VerifiedBy';
import GuideRelatedLinks from '@/components/GuideRelatedLinks';
import { COMMON_COUNTRY_HUB_LINKS, SUBJECT_PILLAR_LINKS, IELTS_BAND_HUB_LINKS } from '@/data/fear-cluster-guides';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Study Abroad Without Taking IELTS — Honest Guide for Indian Students 2026',
    description: 'MOI waivers, alternative English tests, and how English-medium schooling can sometimes replace IELTS — an honest guide covering only what we can verify, plus real IELTS-band course data for lower-threshold options.',
    path: '/study-abroad-without-ielts',
    keywords: ['study abroad without ielts', 'moi waiver for study abroad', 'ielts alternative tests', 'study abroad without english test'],
  });
}

const faqs = [
  {
    q: 'Can I study abroad without taking IELTS at all?',
    a: 'Sometimes, via a Medium of Instruction (MOI) letter from your previous English-medium school/college, or by submitting an alternative English test (PTE Academic, TOEFL iBT, Duolingo English Test, or Cambridge C1) instead. Whether a specific university accepts an MOI waiver or a particular alternative test — and what score it requires — varies by university and changes over time, so we don\'t publish a per-university waiver list on this site; we only publish figures we can independently verify, and English-test waiver policy isn\'t something we can verify centrally the way we verify real tuition fees.',
  },
  {
    q: 'What is an MOI (Medium of Instruction) letter and when does it work?',
    a: 'An MOI letter is issued by your school, college, or university confirming that English was the medium of instruction throughout your education. Some universities accept this in place of IELTS, particularly for students from English-medium CBSE/ICSE/state-board schools followed by an English-medium degree — but this is a university-specific policy, not a universal rule, and it can require the entire degree (not just some subjects) to have been taught in English.',
  },
  {
    q: 'If I don\'t want to take IELTS specifically, can I take PTE or TOEFL instead?',
    a: 'Many universities that require an English proficiency test accept more than one — commonly IELTS, PTE Academic, TOEFL iBT, and sometimes Duolingo — each with its own required score. This is a genuine, real option, but exactly which tests a specific course accepts, and at what score, needs to be confirmed on that course\'s own current requirements page (or with us) rather than assumed, since we don\'t have independently verified alternative-test data for every course on this site.',
  },
  {
    q: 'Are there lower-IELTS-score options if I can\'t avoid the test entirely?',
    a: 'Yes — this is different from avoiding IELTS altogether, but if a full waiver or alternative test isn\'t available for your target course, a lower published IELTS threshold is a real, data-backed option we do track. See the real course lists below for universities with a published entry requirement of IELTS 6.0 or 6.5 — every course listed links to its own page with the exact current requirement.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  author: authorPersonSchema,
  mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function WithoutIeltsGuidePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <JsonLd data={faqSchema} />

      <div className="flex items-center gap-2 text-gray-400 text-xs mb-6">
        <Link href="/" className="hover:text-brand-700">Home</Link> /
        <span>Study Abroad Without IELTS</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          🗣️ Study Abroad Without Taking IELTS — Honest Guide for Indian Students
        </h1>
        <p className="text-gray-600 max-w-3xl">
          MOI waivers and alternative English tests are real options at some universities — but we won&apos;t
          give you a fabricated list of which specific universities accept them, because we don&apos;t have
          independently verified waiver/alternative-test data for every course on this site. What we can give
          you is an honest explanation of how this actually works, real IELTS-band course data for a genuinely
          lower entry bar, and a direct path to a counsellor who checks current policy for your target
          universities.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <p className="text-sm text-amber-800">
            <strong>Important distinction:</strong> &ldquo;A lower published IELTS score requirement&rdquo; (real,
            data-backed — see below) is not the same as &ldquo;no IELTS required at all&rdquo; (an MOI/alternative-test
            waiver, which is university- and course-specific and not something we can verify site-wide). Don&apos;t
            confuse the two when shortlisting.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Real Ways to Reduce or Avoid an IELTS Requirement</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed">
            <li><strong>MOI (Medium of Instruction) waiver</strong> — some universities waive IELTS for applicants whose entire prior education was taught in English; confirm this is accepted for your specific target course before relying on it.</li>
            <li><strong>Alternative English tests</strong> — PTE Academic, TOEFL iBT, Duolingo English Test, or Cambridge C1 Advanced are accepted instead of IELTS by many (not all) universities, each with a course-specific required score.</li>
            <li><strong>Pre-sessional English programmes</strong> — a paid, several-week English course (often run by the university itself) that lets you meet the language requirement without a fresh IELTS attempt, ending in an internal test rather than IELTS.</li>
            <li><strong>Lower-threshold course search</strong> — see the real course lists below for programmes with a published IELTS requirement of 6.0 or 6.5, which is a genuinely lower bar than the 7.0+ many top-ranked programmes require.</li>
          </ul>
        </div>

        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-brand-900 mb-2">📋 What to Do Next</h2>
          <p className="text-sm text-brand-800">
            Browse real, lower-IELTS-threshold courses below, then book a free session — we&apos;ll check whether
            an MOI waiver or alternative test is currently accepted for your specific shortlist.
          </p>
        </div>

        <GuideRelatedLinks title="Real Courses With a Lower IELTS Requirement" links={IELTS_BAND_HUB_LINKS} />
        <GuideRelatedLinks title="Explore by Country" links={COMMON_COUNTRY_HUB_LINKS} />
        <GuideRelatedLinks title="Popular Subjects" links={SUBJECT_PILLAR_LINKS} />

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Studying Abroad Without IELTS — Frequently Asked Questions</h2>
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, i) => (
              <details key={i} className="group py-3 first:pt-0 last:pb-0" open={i === 0}>
                <summary className="flex items-start justify-between gap-3 cursor-pointer list-none">
                  <span className="text-sm font-semibold text-gray-900 leading-snug">{faq.q}</span>
                  <span className="flex-shrink-0 mt-0.5 text-brand-700 transition-transform group-open:rotate-45 text-lg leading-none">+</span>
                </summary>
                <p className="text-sm text-gray-700 leading-relaxed mt-2.5 pr-6">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="bg-brand-700 rounded-2xl p-6 text-white text-center">
          <h2 className="text-xl font-bold mb-2">Not Sure If You Need IELTS?</h2>
          <p className="text-blue-200 text-sm mb-4">
            Book a free counselling session — we&apos;ll check whether an MOI waiver or alternative test is
            currently accepted for your specific shortlist of universities.
          </p>
          <Link href="/book-counselling" className="btn-gold inline-block">
            Get Free Guidance →
          </Link>
        </div>

        <VerifiedBy />
      </div>
    </div>
  );
}
