import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import VerifiedBy from '@/components/VerifiedBy';
import WhatsAppLeadCTA from '@/components/WhatsAppLeadCTA';
import GuideRelatedLinks from '@/components/GuideRelatedLinks';
import VerifiedEnglishRequirements from '@/components/VerifiedEnglishRequirements';
import { authorPersonSchema } from '@/lib/seo';
import type { IeltsBandGuide } from '@/data/ielts-band-guides';
import { IELTS_BAND_GUIDES } from '@/data/ielts-band-guides';
import { englishReqsVerified } from '@/data/english-requirements-verified';
import {
  COMMON_COUNTRY_HUB_LINKS, SUBJECT_PILLAR_LINKS, COST_PILLAR_LINKS, CHEAPEST_HUB_LINKS,
} from '@/data/fear-cluster-guides';

export default function IeltsBandHub({ guide }: { guide: IeltsBandGuide }) {
  const otherBands = IELTS_BAND_GUIDES.filter(g => g.slug !== guide.slug);
  const verifiedForBand = englishReqsVerified.filter(r => r.ieltsOverall === guide.band);

  const faqs = [
    {
      q: `What does IELTS ${guide.bandLabel} overall actually mean?`,
      a: guide.levelDescription,
    },
    {
      q: `What can I realistically get into with IELTS ${guide.bandLabel}?`,
      a: guide.accessibility,
    },
    {
      q: 'Is the overall band score the same as every section score?',
      a: 'No — IELTS gives you four section scores (Listening, Reading, Writing, Speaking) plus an Overall Band Score, which is the average of the four, rounded. Many universities specify both an overall minimum AND a "no band below X" rule for individual sections — so a 6.5 overall with a 5.5 in Writing might not meet a requirement that also demands 6.0 in every section. Always check both numbers on your target course\'s requirements, not just the headline overall score.',
    },
    {
      q: `Which specific universities accept IELTS ${guide.bandLabel}?`,
      a: verifiedForBand.length > 0
        ? `We've manually verified ${verifiedForBand.length} universit${verifiedForBand.length === 1 ? 'y' : 'ies'} whose IELTS ${guide.bandLabel} requirement we checked directly against their own official page — see the "Verified English Requirements" section below for the full list with sources. Beyond that small verified set, exact requirements vary by university and course and change by intake, so we don't publish a broader centrally-verified list — check your specific shortlisted course's own page, or ask a counsellor.`
        : 'We don\'t publish a per-university list here — exact IELTS requirements vary by university and by course, and change by intake, which makes a centrally-verified list impractical to maintain honestly. The real way to find out is to check the requirements page of your specific shortlisted course, or ask a counsellor who can check current requirements for you.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    author: authorPersonSchema,
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <JsonLd data={faqSchema} />

      <div className="flex items-center gap-2 text-gray-400 text-xs mb-6">
        <Link href="/" className="hover:text-brand-700">Home</Link> /
        <span>IELTS {guide.bandLabel}</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          🗣️ {guide.title}
        </h1>
        <p className="text-gray-600 max-w-3xl">
          A general guide to what an IELTS {guide.bandLabel} overall score realistically opens up — not a list of
          specific universities, because exact requirements vary by course and change by intake in ways we can&apos;t
          verify centrally the way we verify real tuition fees on this site.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h2 className="text-base font-bold text-amber-900 mb-2">Why There&apos;s No University List Here</h2>
          <p className="text-sm text-amber-800 leading-relaxed">
            This page used to list specific real courses by their published IELTS requirement. On review, the
            underlying IELTS-requirement data for most courses on this site turned out to come from a generic
            estimate applied during data collection, not an independently verified per-course crawl — so we&apos;ve
            removed that list rather than keep presenting it as verified fact. Exact IELTS requirements vary by
            university and course — verify on the university&apos;s own course page, or ask our counsellors, before
            relying on any specific number. Below, we&apos;re rebuilding a small list the honest way — one university
            at a time, each one checked by hand against its own official page.
          </p>
        </div>

        {verifiedForBand.length > 0 ? (
          <VerifiedEnglishRequirements rows={verifiedForBand} />
        ) : (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">✓ Verified English Requirements</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              We haven&apos;t manually verified any university&apos;s IELTS {guide.bandLabel} requirement yet — this
              list is growing as we check more universities directly against their official pages, one at a time.
              Check back, or ask a counsellor for a current, exact requirement in the meantime.
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-3">What Does IELTS {guide.bandLabel} Overall Mean?</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{guide.levelDescription}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-3">What&apos;s Realistically Accessible at This Band?</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">{guide.accessibility}</p>
          <p className="text-sm text-gray-700 leading-relaxed">{guide.countryNotes}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Overall Band vs. Section Scores</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            IELTS reports four section scores — Listening, Reading, Writing, Speaking — and an Overall Band Score
            (their average, rounded to the nearest 0.5). Many universities set two separate conditions: a minimum
            overall score, <em>and</em> a minimum for every individual section (often phrased as &ldquo;no band below
            X&rdquo;). Writing is the section Indian test-takers most commonly score lowest on. Meeting the overall
            average isn&apos;t enough if a section-specific minimum isn&apos;t met — always check both numbers on your
            target course&apos;s actual requirements page.
          </p>
        </div>

        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-brand-900 mb-2">📋 What to Do Next</h2>
          <p className="text-sm text-brand-800">
            Explore real universities and real fee data by country and budget below, then book a free session —
            we&apos;ll check the current, exact IELTS requirement for your specific shortlist before you apply
            anywhere.
          </p>
        </div>

        <GuideRelatedLinks title="Explore Real Universities by Country" links={COMMON_COUNTRY_HUB_LINKS} />
        <GuideRelatedLinks title="Real Fee Data — Cheapest Options" links={CHEAPEST_HUB_LINKS} />
        <GuideRelatedLinks title="Plan Your Budget" links={COST_PILLAR_LINKS} />
        <GuideRelatedLinks title="Popular Subjects" links={SUBJECT_PILLAR_LINKS} />
        <GuideRelatedLinks
          title="Other IELTS Bands"
          links={otherBands.map(g => ({ href: `/${g.slug}`, label: `IELTS ${g.bandLabel} Guide` }))}
        />

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">IELTS {guide.bandLabel} — Frequently Asked Questions</h2>
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

        <WhatsAppLeadCTA
          headline={`Get Your IELTS ${guide.bandLabel} University List on WhatsApp`}
          context={`IELTS ${guide.bandLabel}`}
          source={`ielts-band-${guide.slug}`}
        />

        <VerifiedBy />
      </div>
    </div>
  );
}
