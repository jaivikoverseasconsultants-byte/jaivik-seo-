import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata, authorPersonSchema } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import VerifiedBy from '@/components/VerifiedBy';
import GuideRelatedLinks from '@/components/GuideRelatedLinks';
import { COMMON_COUNTRY_HUB_LINKS, SUBJECT_PILLAR_LINKS, CHEAPEST_HUB_LINKS } from '@/data/fear-cluster-guides';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Universities Abroad That Accept Backlogs — Honest Guide for Indian Students 2026',
    description: 'What counts as a backlog, how admissions teams generally view them, and how to find out which specific universities will accept yours — a real, no-fabrication guide, not a list of invented per-university numbers.',
    path: '/universities-accepting-backlogs',
    keywords: ['universities accepting backlogs abroad', 'study abroad with backlogs india', 'how many backlogs allowed abroad', 'backlog friendly universities'],
  });
}

const faqs = [
  {
    q: 'What counts as a "backlog" for university admissions abroad?',
    a: 'A backlog usually means a subject you failed and had to re-sit (a "reappear"/"ATKT" in Indian university terminology), reflected on your transcript alongside the eventual pass. Admissions teams abroad generally look at your overall completed degree and final transcript rather than penalising every individual backlog — but exactly how many are tolerated, and whether they must all be cleared before you apply, varies by university and even by department within the same university.',
  },
  {
    q: 'How many backlogs are too many to study abroad?',
    a: 'There is no single universal number — it depends on the university, the course, and how the backlogs are explained in your application. We do not publish a specific per-university backlog limit on this site, because admissions policy on this changes by intake and we only publish figures we can independently verify from real, current university sources. A counsellor can check current policy for your specific target universities and shortlist accordingly.',
  },
  {
    q: 'Are some countries or types of universities generally more flexible about backlogs?',
    a: 'As a general pattern in the industry (not a claim about any specific institution on this site), public universities and a broader range of intake-focused institutions tend to evaluate applications more holistically than a small number of highly selective, high-demand programmes — but this varies significantly by course and by intake, and it is not a reliable predictor for any one university. Use the real course data below to compare fees, IELTS requirements, and countries, then confirm current backlog policy directly with your shortlisted universities or with us.',
  },
  {
    q: 'Will my backlogs be visible to the university I apply to?',
    a: 'Yes — your official transcript from your Indian university will typically show subjects that required a re-sit, even after you\'ve passed them. Trying to hide this is not advisable; most universities abroad are used to seeing Indian transcripts with cleared backlogs and evaluate the final result, not just the history.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  author: authorPersonSchema,
  mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function BacklogsGuidePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <JsonLd data={faqSchema} />

      <div className="flex items-center gap-2 text-gray-400 text-xs mb-6">
        <Link href="/" className="hover:text-brand-700">Home</Link> /
        <span>Universities Accepting Backlogs</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          🎓 Universities Abroad That Accept Backlogs — Honest Guide for Indian Students
        </h1>
        <p className="text-gray-600 max-w-3xl">
          If you have one or more backlogs and are worried they&apos;ll rule out studying abroad, start here.
          We do not publish a list of &ldquo;University X accepts 5 backlogs&rdquo; on this site — exact backlog
          policy varies by course and intake, and isn&apos;t something we can verify centrally the way we verify
          real tuition fees and course data. What we can give you is an honest explanation of how this actually
          works, plus real course/fee/country data to help you shortlist, and a direct path to a counsellor who
          can check current policy for your specific target universities.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Why We Don&apos;t List Per-University Backlog Numbers</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Every fee, IELTS requirement, and course fact on this site is crawled directly from a real, current
            university source — that&apos;s the whole point of this portal. Backlog tolerance isn&apos;t published
            as a fixed number by most universities; it&apos;s assessed case-by-case by admissions officers, and it
            changes by department and intake. Publishing an invented number here (even a plausible-sounding one)
            could lead you to apply — or not apply — based on something we made up. Instead, we&apos;ll explain how
            it actually works and point you to a counsellor who checks current, real policy before you commit to
            an application.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-3">How Admissions Teams Generally Look at Backlogs</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>Most universities evaluate your <strong>final, completed transcript</strong> — a cleared backlog (subject passed on re-sit) is treated very differently from an outstanding/unresolved one.</li>
            <li>A small number of backlogs, especially in a single semester, is usually less of a concern than a pattern across multiple years.</li>
            <li>Course-specific requirements matter more than a blanket university rule — a highly competitive, oversubscribed programme is naturally more selective than a less competitive one at the very same university.</li>
            <li>A strong SOP explaining the circumstances (illness, personal hardship, work commitments) can matter alongside the transcript itself.</li>
            <li>All outstanding backlogs should generally be cleared before your visa application, even if the university admitted you conditionally — visa officers separately assess your academic record.</li>
          </ul>
        </div>

        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-brand-900 mb-2">📋 What to Do Next</h2>
          <p className="text-sm text-brand-800">
            Shortlist real courses and universities using the data below, then book a free session — we&apos;ll
            check current backlog policy for your specific shortlist directly with each university&apos;s
            admissions team before you spend money on an application.
          </p>
        </div>

        <GuideRelatedLinks title="Explore Real Course & Fee Data" links={[...COMMON_COUNTRY_HUB_LINKS, ...CHEAPEST_HUB_LINKS]} />
        <GuideRelatedLinks title="Popular Subjects" links={SUBJECT_PILLAR_LINKS} />

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Backlogs &amp; Studying Abroad — Frequently Asked Questions</h2>
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
          <h2 className="text-xl font-bold mb-2">Worried Your Backlogs Will Hold You Back?</h2>
          <p className="text-blue-200 text-sm mb-4">
            Book a free counselling session — we&apos;ll review your transcript honestly and check current
            admissions policy with real universities before you apply anywhere.
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
