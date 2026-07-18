import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata, authorPersonSchema } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import VerifiedBy from '@/components/VerifiedBy';
import GuideRelatedLinks from '@/components/GuideRelatedLinks';
import { COMMON_COUNTRY_HUB_LINKS, SUBJECT_PILLAR_LINKS, CHEAPEST_HUB_LINKS, COST_PILLAR_LINKS } from '@/data/fear-cluster-guides';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Low CGPA? Universities Abroad You Can Still Apply To — Honest Guide 2026',
    description: 'How a low CGPA or percentage is generally viewed by admissions teams abroad, what pathway/foundation programmes actually are, and how to find real courses to apply to — an honest guide, no invented per-university cutoffs.',
    path: '/low-cgpa-universities-abroad',
    keywords: ['low cgpa universities abroad', 'study abroad with low percentage', 'low gpa masters abroad', 'pathway program low cgpa'],
  });
}

const faqs = [
  {
    q: 'What CGPA or percentage do I need to study abroad?',
    a: 'This varies significantly by university, course, and level (bachelor\'s vs. master\'s) — there is no single number. We do not publish a specific per-university CGPA cutoff on this site, because minimum-GPA policy isn\'t something we can verify centrally the way we verify real tuition fees; it also changes by intake and is often applied flexibly alongside your overall profile (work experience, SOP, references, entrance test scores).',
  },
  {
    q: 'Can I get into a master\'s programme abroad with a low CGPA?',
    a: 'Often, yes — for master\'s admissions, your 12th-grade marks rarely matter, and even a modest bachelor\'s percentage can be offset by strong work experience, a compelling SOP, good references, or a solid GRE/GMAT score where the course requires one. Some universities also weight your final two years of a 4-year bachelor\'s more heavily than the first two. Confirm current minimums for your specific target courses with a counsellor rather than assuming from a generic number.',
  },
  {
    q: 'What is a pathway or foundation programme, and does it help with a low CGPA?',
    a: 'A pathway/foundation programme is a preparatory course (commonly 1 year) run by or affiliated with a university, designed for applicants who don\'t yet meet the direct-entry academic bar. Completing it at a required standard typically guarantees progression into the main degree. It is a genuine, real option used by many Indian students, but availability, cost, and exact entry criteria are course- and university-specific — confirm current details before committing.',
  },
  {
    q: 'Does a low CGPA affect financial aid or scholarship eligibility?',
    a: 'Merit-based scholarships generally do require a stronger academic record, so a low CGPA can reduce your merit-scholarship options specifically — but it does not automatically disqualify you from studying abroad altogether, or from other funding routes like education loans. Confirm current scholarship eligibility criteria for your shortlisted universities directly, since these change by intake.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  author: authorPersonSchema,
  mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function LowCgpaGuidePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <JsonLd data={faqSchema} />

      <div className="flex items-center gap-2 text-gray-400 text-xs mb-6">
        <Link href="/" className="hover:text-brand-700">Home</Link> /
        <span>Low CGPA Universities Abroad</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          📉 Low CGPA? Universities Abroad You Can Still Apply To — Honest Guide
        </h1>
        <p className="text-gray-600 max-w-3xl">
          A low CGPA or percentage doesn&apos;t automatically close the door on studying abroad. We won&apos;t
          give you a fabricated list of &ldquo;University X accepts CGPA Y&rdquo; — that number isn&apos;t
          something we can verify centrally, and university admissions criteria change by intake. What follows
          is an honest explanation of how this is actually assessed, real course and country data to help you
          shortlist, and a direct path to a counsellor who checks current requirements for your specific
          profile.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Why We Don&apos;t List Per-University CGPA Cutoffs</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Every fee, IELTS requirement, and course fact on this site is crawled directly from a real, current
            university source. Minimum-CGPA/percentage policy is usually applied flexibly and holistically, not
            published as one fixed number, and it changes by intake and department. We won&apos;t invent a
            number here; instead, we explain the real factors admissions teams weigh and connect you to a
            counsellor who checks current requirements for your specific target universities.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-3">What Can Offset a Low CGPA</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed">
            <li><strong>Relevant work experience</strong> — particularly for master&apos;s programmes, a few years of relevant professional experience can matter as much as your transcript.</li>
            <li><strong>A strong SOP and references</strong> — a well-written statement of purpose that explains your trajectory and goals, backed by solid references, genuinely influences admissions decisions.</li>
            <li><strong>Entrance test scores</strong> — a strong GRE/GMAT score, where the course requires or accepts one, can help balance a weaker academic transcript.</li>
            <li><strong>Pathway/foundation programmes</strong> — a preparatory year that leads into the main degree once completed at the required standard, a common and legitimate route for borderline academic profiles.</li>
            <li><strong>Course and university choice</strong> — less oversubscribed courses, and universities with a broader intake profile, are generally more likely to assess your application holistically rather than screening on CGPA alone.</li>
          </ul>
        </div>

        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-brand-900 mb-2">📋 What to Do Next</h2>
          <p className="text-sm text-brand-800">
            Browse real courses and compare costs below, then book a free session — we&apos;ll review your
            transcript honestly and check current entry requirements for your specific shortlist.
          </p>
        </div>

        <GuideRelatedLinks title="Explore Real Course & Fee Data" links={[...COMMON_COUNTRY_HUB_LINKS, ...CHEAPEST_HUB_LINKS]} />
        <GuideRelatedLinks title="Plan Your Budget" links={COST_PILLAR_LINKS} />
        <GuideRelatedLinks title="Popular Subjects" links={SUBJECT_PILLAR_LINKS} />

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Low CGPA &amp; Studying Abroad — Frequently Asked Questions</h2>
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
          <h2 className="text-xl font-bold mb-2">Worried Your CGPA Isn&apos;t High Enough?</h2>
          <p className="text-blue-200 text-sm mb-4">
            Book a free counselling session — we&apos;ll review your transcript honestly and check current entry
            requirements with real universities before you apply anywhere.
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
