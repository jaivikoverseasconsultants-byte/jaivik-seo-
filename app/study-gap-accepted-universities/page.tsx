import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata, authorPersonSchema } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import VerifiedBy from '@/components/VerifiedBy';
import GuideRelatedLinks from '@/components/GuideRelatedLinks';
import { COMMON_COUNTRY_HUB_LINKS, SUBJECT_PILLAR_LINKS, COST_PILLAR_LINKS } from '@/data/fear-cluster-guides';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Study Abroad With a Study Gap — Honest Guide for Indian Students 2026',
    description: 'How admissions teams generally view a study gap or career break, how to explain it in your application, and how to find out which specific universities will accept yours — an honest guide, no invented per-university claims.',
    path: '/study-gap-accepted-universities',
    keywords: ['study gap accepted universities abroad', 'study abroad after gap year india', 'career break study abroad', 'study gap explanation letter'],
  });
}

const faqs = [
  {
    q: 'How many years of study gap is acceptable for studying abroad?',
    a: 'There is no universal cutoff — a well-explained 1–3 year gap (work experience, family responsibility, health, exam preparation) is routinely accepted by many universities, especially for master\'s programmes where relevant work experience can actually strengthen your application. We do not publish a specific "University X accepts a Y-year gap" figure on this site, because this is assessed case-by-case and isn\'t something we can verify centrally the way we verify real tuition and course data.',
  },
  {
    q: 'Do I need a gap certificate or explanation letter?',
    a: 'Most universities and visa authorities expect a brief written explanation (sometimes called a "gap certificate" or covered within your SOP) describing what you did during the gap — work, further study, family circumstances, or exam preparation. Supporting documents (offer letters, pay slips, certificates) that back up the explanation are generally more persuasive than the explanation alone.',
  },
  {
    q: 'Does a study gap hurt my student visa application?',
    a: 'Visa officers generally care more about whether your gap is clearly explained and documented than about the gap\'s existence itself. An unexplained, undocumented gap is more likely to raise questions than a gap you can account for with evidence. Genuine work experience during the gap, particularly if related to your intended course, can actually support your visa case by strengthening your overall profile and post-study intent.',
  },
  {
    q: 'Is a work-experience gap viewed differently from an unexplained gap?',
    a: 'Generally yes, in the sense that documented work experience gives you something concrete to show — pay slips, an experience letter, a LinkedIn profile matching the dates — whereas an unexplained gap relies entirely on your written explanation. Neither is disqualifying on its own; documentation simply makes your case stronger. Confirm current requirements for your specific target universities with a counsellor before applying.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  author: authorPersonSchema,
  mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function StudyGapGuidePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <JsonLd data={faqSchema} />

      <div className="flex items-center gap-2 text-gray-400 text-xs mb-6">
        <Link href="/" className="hover:text-brand-700">Home</Link> /
        <span>Study Gap &amp; Studying Abroad</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          📅 Study Abroad With a Study Gap — Honest Guide for Indian Students
        </h1>
        <p className="text-gray-600 max-w-3xl">
          A study gap after 12th, after your bachelor&apos;s, or a career break doesn&apos;t automatically rule
          out studying abroad. We won&apos;t give you a fabricated list of &ldquo;universities that accept a
          3-year gap&rdquo; — no data source verifies that centrally, and we only publish what we can actually
          check. What follows is an honest explanation of how a gap is generally viewed, plus real course and
          country data to help you shortlist, and a direct path to a counsellor who reviews your specific
          situation.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Why We Don&apos;t List Per-University Gap Limits</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Every fee, IELTS requirement, and course fact on this site is crawled directly from a real, current
            university source. Study-gap tolerance is not published as a fixed number by universities — it is
            assessed case-by-case, alongside your SOP, references, and any supporting documents. We don&apos;t
            invent a number here; instead, we explain the real factors that matter and connect you to a
            counsellor who can check current admissions practice for your specific target universities.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-3">What Actually Helps Your Application</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>A clear, honest written explanation of the gap — as part of your SOP or a separate gap letter.</li>
            <li>Documentary evidence: offer/experience letters, pay slips, certificates for courses completed, or medical documentation where relevant.</li>
            <li>For master&apos;s applicants, relevant work experience during the gap can actively strengthen your profile rather than weaken it.</li>
            <li>Consistency between your explanation, your documents, and your visa interview answers matters more than the length of the gap itself.</li>
            <li>Applying with a strong, current academic/professional trajectory (rather than a long period of no activity at all) is generally viewed more favourably.</li>
          </ul>
        </div>

        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-brand-900 mb-2">📋 What to Do Next</h2>
          <p className="text-sm text-brand-800">
            Shortlist real courses and countries using the data below, then book a free session — we&apos;ll help
            you structure a strong gap explanation and check current admissions practice for your specific
            shortlist before you apply.
          </p>
        </div>

        <GuideRelatedLinks title="Explore Real Course & Country Data" links={COMMON_COUNTRY_HUB_LINKS} />
        <GuideRelatedLinks title="Plan Your Budget" links={COST_PILLAR_LINKS} />
        <GuideRelatedLinks title="Popular Subjects" links={SUBJECT_PILLAR_LINKS} />

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Study Gap &amp; Studying Abroad — Frequently Asked Questions</h2>
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
          <h2 className="text-xl font-bold mb-2">Worried Your Study Gap Will Hold You Back?</h2>
          <p className="text-blue-200 text-sm mb-4">
            Book a free counselling session — we&apos;ll help you build a strong, honest gap explanation and check
            current admissions practice with real universities.
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
