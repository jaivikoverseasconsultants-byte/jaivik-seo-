import Link from 'next/link';
import type { UniversityComparisonData } from '@/lib/university-comparisons';
import { PSW_ONE_LINER } from '@/lib/university-comparisons';
import { getCostPillarForCountry } from '@/data/cost-pillars';
import { CHEAPEST_COUNTRY_SLUGS, PSW_COUNTRY_SLUGS } from '@/lib/subject-pillars';
import { authorPersonSchema } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import VerifiedBy from '@/components/VerifiedBy';
import WhatsAppLeadCTA from '@/components/WhatsAppLeadCTA';
import FindMyCourseCTA from '@/components/FindMyCourseCTA';
import { feeDisplayINRLakh } from '@/lib/fee-verification';
import { courseAnnualINRLakh } from '@/lib/currency';

export default function UniversityComparisonPage({ data }: { data: UniversityComparisonData }) {
  const { pair, sideA, sideB, sameCity, cityCostOfLiving } = data;
  const nameA = sideA.university.name;
  const nameB = sideB.university.name;
  const pswLine = PSW_ONE_LINER[pair.country];
  const costPillar = getCostPillarForCountry(pair.country);
  const cheapestHubSlug = CHEAPEST_COUNTRY_SLUGS[pair.country];
  const pswHubSlug = PSW_COUNTRY_SLUGS[pair.country];

  // cheapness claims must rest on verified fees only
  const feeA = sideA.minFeeLakh ? parseFloat(sideA.minFeeLakh) : null;
  const feeB = sideB.minFeeLakh ? parseFloat(sideB.minFeeLakh) : null;
  const comparable = feeA !== null && feeB !== null;
  const cheaperSide = comparable ? (feeA! < feeB! ? sideA : feeB! < feeA! ? sideB : null) : null;
  const moreCoursesSide = sideA.count > sideB.count ? sideA : sideB.count > sideA.count ? sideB : null;

  const faqs = [
    {
      q: `Which is cheaper, ${nameA} or ${nameB}?`,
      a: cheaperSide
        ? `${cheaperSide.university.name}'s cheapest verified course starts at ₹${cheaperSide.minFeeLakh} lakh/year, versus ₹${(cheaperSide === sideA ? sideB : sideA).minFeeLakh} lakh/year at the other university (${cheaperSide.basisNote}). Fee ranges vary a lot by course and level at both — see the cheapest courses listed below for each.`
        : comparable
          ? `Both universities' cheapest verified courses start at approximately the same fee, around ₹${sideA.minFeeLakh} lakh/year — see the full course lists below for each.`
          : `We cannot compare fees for these two universities yet: the courses listed are real, but their tuition has not yet been checked against the universities' own pages, so it shows as "On request". See the course lists below and ask us for current fees in writing.`,
    },
    {
      q: `How many real courses does ${nameA} offer compared to ${nameB}?`,
      a: `This site has ${sideA.count} real, crawled courses for ${nameA} (${sideA.bachelorCount} Bachelor's, ${sideA.masterCount} Master's) and ${sideB.count} for ${nameB} (${sideB.bachelorCount} Bachelor's, ${sideB.masterCount} Master's). ${moreCoursesSide ? `${moreCoursesSide.university.name} has more real courses listed on this site.` : 'Both have a similar number of real courses listed on this site.'} This reflects what we've crawled directly from each university's own course pages, not total programs offered.`,
    },
    {
      q: `Do ${nameA} and ${nameB} have the same post-study work rights?`,
      a: pswLine ?? `Both are in ${pair.country}, so graduates follow the same national post-study work visa route — check our ${pair.country} post-study work guide for details.`,
    },
  ];

  if (sameCity && cityCostOfLiving) {
    faqs.push({
      q: `Is the cost of living different between ${nameA} and ${nameB}?`,
      a: `No — both universities are in ${cityCostOfLiving.city}, so student living costs are the same: approximately ₹${cityCostOfLiving.totalMonthlyINR.min.toLocaleString()}–₹${cityCostOfLiving.totalMonthlyINR.max.toLocaleString()} per month for rent, groceries, transport, and utilities combined, per our ${pair.country} cost of living guide.`,
    });
  }

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
        <Link href="/compare" className="hover:text-brand-700">Compare</Link> /
        <span>{nameA} vs {nameB}</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {nameA} vs {nameB} — Real Fees, Courses &amp; PSW for Indian Students
        </h1>
        <p className="text-gray-600 max-w-3xl">
          A side-by-side comparison of {sideA.count + sideB.count} real, crawled courses across both universities in {pair.country}
          {sameCity ? ` (both in ${sideA.university.city})` : ''} — tuition fees in INR, course counts by level, and post-study work rights.
        </p>
      </div>

      {/* Side-by-side stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {[sideA, sideB].map(side => (
          <div key={side.university.slug} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">
                <Link href={`/universities/${side.university.slug}`} className="hover:text-brand-700 hover:underline">
                  {side.university.name}
                </Link>
              </h2>
              {side.university.qsRanking ? (
                <span className="text-xs font-semibold bg-brand-50 text-brand-700 px-2 py-1 rounded-full">QS #{side.university.qsRanking}</span>
              ) : null}
            </div>
            <p className="text-xs text-gray-500 mb-4">{side.university.city}, {pair.country}</p>
            <dl className="grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-gray-500">Real courses</dt>
              <dd className="text-right font-semibold text-gray-900">{side.count}</dd>
              <dt className="text-gray-500">Bachelor&apos;s</dt>
              <dd className="text-right font-semibold text-gray-900">{side.bachelorCount}</dd>
              <dt className="text-gray-500">Master&apos;s</dt>
              <dd className="text-right font-semibold text-gray-900">{side.masterCount}</dd>
              <dt className="text-gray-500">Fee range/yr</dt>
              <dd className="text-right font-semibold text-gray-900">{side.minFeeLakh && side.maxFeeLakh ? <>₹{side.minFeeLakh}L–₹{side.maxFeeLakh}L</> : <span className="text-gray-400 font-normal">On request</span>}</dd>
            </dl>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-700 mb-2">Cheapest real courses</p>
              <ul className="space-y-1.5">
                {side.cheapest.map(c => (
                  <li key={c.slug} className="text-xs">
                    <Link href={`/universities/${side.university.slug}/courses/${c.slug}`} className="text-brand-700 hover:underline">
                      {c.name}
                    </Link>
                    <span className="text-gray-500"> — {feeDisplayINRLakh(c as any, (courseAnnualINRLakh(c as any, 1) ?? '0'), '/yr')}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Cost of living — only if both are in the same city with real data */}
      {sameCity && cityCostOfLiving && (
        <div className="mb-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Cost of Living — Same for Both</h2>
          <p className="text-sm text-gray-700">
            Both universities are in <strong>{cityCostOfLiving.city}</strong>, so student living costs are identical:
            approximately ₹{cityCostOfLiving.totalMonthlyINR.min.toLocaleString()}–₹{cityCostOfLiving.totalMonthlyINR.max.toLocaleString()} per month
            for rent, groceries, transport, and utilities combined.
          </p>
          {costPillar && (
            <Link href={`/${costPillar.slug}`} className="text-xs text-brand-700 hover:underline font-medium mt-2 inline-block">
              Full {pair.country} Cost of Studying Guide →
            </Link>
          )}
        </div>
      )}

      {/* PSW */}
      {pswLine && (
        <div className="mb-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Post-Study Work Rights</h2>
          <p className="text-sm text-gray-700">{pswLine}</p>
        </div>
      )}

      {/* Verdict — honest, no fake winner */}
      <div className="mb-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-2">So Which Should You Choose?</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          There is no single &quot;better&quot; choice — it depends on your priority.{' '}
          {cheaperSide && (
            <>If <strong>budget</strong> matters most, {cheaperSide.university.name}&apos;s cheapest real course (₹{cheaperSide.minFeeLakh}L/year) is lower than the other university&apos;s. </>
          )}
          {moreCoursesSide && (
            <>If you want more <strong>course choice</strong>, {moreCoursesSide.university.name} has more real programmes listed on this site ({moreCoursesSide.count} vs {(moreCoursesSide === sideA ? sideB : sideA).count}). </>
          )}
          {sameCity ? 'Since both are in the same city, living costs and post-study work rights are identical — the decision comes down to the specific course, its fee, and entry requirements. ' : 'Post-study work rights are identical since both are in the same country. '}
          Talk to a counsellor about your specific course shortlist, budget, and profile before deciding.
        </p>
      </div>

      {/* Related links */}
      <div className="mb-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Related Guides</h2>
        <div className="flex flex-wrap gap-2">
          <Link href={`/universities/country/${pair.countrySlug}`} className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors">
            Study in {pair.country} →
          </Link>
          {costPillar && (
            <Link href={`/${costPillar.slug}`} className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors">
              Cost of Studying in {pair.country} →
            </Link>
          )}
          {cheapestHubSlug && (
            <Link href={`/cheapest-universities-${cheapestHubSlug}`} className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors">
              Cheapest Universities in {pair.country} →
            </Link>
          )}
          {pswHubSlug && (
            <Link href={`/courses-with-psw/${pswHubSlug}`} className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors">
              Courses in {pair.country} with Post-Study Work Rights →
            </Link>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{nameA} vs {nameB} — Frequently Asked Questions</h2>
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

      <div className="mb-6">
        <FindMyCourseCTA headline={`Not sure which fits YOUR profile — ${nameA} or ${nameB}?`} />
      </div>

      <WhatsAppLeadCTA
        headline={`Get a Personalised ${nameA} vs ${nameB} Comparison on WhatsApp`}
        context={`${nameA} vs ${nameB}`}
        source={`compare-university-${pair.slug}`}
      />

      <div className="mt-6">
        <VerifiedBy />
      </div>
    </div>
  );
}
