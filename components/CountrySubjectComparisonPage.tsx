import Link from 'next/link';
import type { CountrySubjectComparisonData } from '@/lib/country-subject-comparisons';
import { getCostPillarForCountry } from '@/data/cost-pillars';
import { CHEAPEST_COUNTRY_SLUGS, PSW_COUNTRY_SLUGS, COUNTRY_FLAGS } from '@/lib/subject-pillars';
import { authorPersonSchema } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import VerifiedBy from '@/components/VerifiedBy';
import WhatsAppLeadCTA from '@/components/WhatsAppLeadCTA';

export default function CountrySubjectComparisonPage({ data }: { data: CountrySubjectComparisonData }) {
  const { parsed, sideA, sideB, costA, costB, pswA, pswB } = data;
  const { pillar } = parsed;
  const nameA = sideA.countryName;
  const nameB = sideB.countryName;

  const feeA = parseFloat(sideA.minFeeLakh);
  const feeB = parseFloat(sideB.minFeeLakh);
  const cheaperSide = feeA < feeB ? sideA : feeB < feeA ? sideB : null;
  const moreCoursesSide = sideA.count > sideB.count ? sideA : sideB.count > sideA.count ? sideB : null;

  const faqs = [
    {
      q: `Which is cheaper for ${pillar.name}, ${nameA} or ${nameB}?`,
      a: cheaperSide
        ? `Based on ${sideA.count + sideB.count} real ${pillar.introLabel} courses on this site, ${cheaperSide.countryName}'s cheapest real course starts at ₹${cheaperSide.minFeeLakh} lakh/year, lower than the other country's cheapest option. Fee ranges vary a lot by university and course level in both — see the cheapest real courses listed below for each.`
        : `Both countries' cheapest real ${pillar.introLabel} courses start at a similar fee, around ₹${sideA.minFeeLakh} lakh/year — see the full course lists below.`,
    },
    {
      q: `How many real ${pillar.name} courses does ${nameA} offer compared to ${nameB}?`,
      a: `This site has ${sideA.count} real, crawled ${pillar.introLabel} courses in ${nameA} and ${sideB.count} in ${nameB}. ${moreCoursesSide ? `${moreCoursesSide.countryName} has more real ${pillar.name} programmes listed on this site.` : 'Both have a similar number of real courses listed.'} This reflects what we've crawled directly from university course pages, not every program that exists.`,
    },
    {
      q: `What are the post-study work rights in ${nameA} vs ${nameB} after a ${pillar.name} degree?`,
      a: `${pswA ? `${nameA}: ${pswA}` : `${nameA}'s post-study work rules aren't covered in our verified PSW data.`} ${pswB ? `${nameB}: ${pswB}` : `${nameB}'s post-study work rules aren't covered in our verified PSW data.`}`,
    },
  ];

  if (costA && costB) {
    faqs.push({
      q: `Is the cost of living higher in ${nameA} or ${nameB}?`,
      a: `Per our cost of living guides, student living costs range from ₹${costA.min.toLocaleString()}–₹${costA.max.toLocaleString()}/month in ${nameA} (across ${costA.cityCount} cities) and ₹${costB.min.toLocaleString()}–₹${costB.max.toLocaleString()}/month in ${nameB} (across ${costB.cityCount} cities). These are city-by-city ranges, not single national averages — see each country's full cost of living guide for the breakdown.`,
    });
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    author: authorPersonSchema,
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  const sides = [
    { side: sideA, cost: costA, psw: pswA, cheapestHubSlug: CHEAPEST_COUNTRY_SLUGS[nameA], pswHubSlug: PSW_COUNTRY_SLUGS[nameA], costPillar: getCostPillarForCountry(nameA) },
    { side: sideB, cost: costB, psw: pswB, cheapestHubSlug: CHEAPEST_COUNTRY_SLUGS[nameB], pswHubSlug: PSW_COUNTRY_SLUGS[nameB], costPillar: getCostPillarForCountry(nameB) },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <JsonLd data={faqSchema} />

      <div className="flex items-center gap-2 text-gray-400 text-xs mb-6">
        <Link href="/" className="hover:text-brand-700">Home</Link> /
        <Link href={`/${pillar.slug}`} className="hover:text-brand-700">{pillar.name} Abroad</Link> /
        <span>{nameA} vs {nameB}</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {pillar.emoji} {nameA} vs {nameB} for {pillar.name} — Real Fees, Courses &amp; PSW for Indian Students
        </h1>
        <p className="text-gray-600 max-w-3xl">
          A side-by-side comparison of {sideA.count + sideB.count} real, crawled {pillar.introLabel} courses across {nameA} and {nameB} —
          tuition fees in INR, course counts, cost of living, and post-study work rights.
        </p>
      </div>

      {/* Side-by-side stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {sides.map(({ side, cost, psw, cheapestHubSlug, pswHubSlug, costPillar }) => (
          <div key={side.countrySlug} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              {COUNTRY_FLAGS[side.countryName] ?? ''} {side.countryName}
            </h2>
            <p className="text-xs text-gray-500 mb-4">{pillar.name} — {side.count} real courses</p>
            <dl className="grid grid-cols-2 gap-y-2 text-sm mb-4">
              <dt className="text-gray-500">Fee range/yr</dt>
              <dd className="text-right font-semibold text-gray-900">₹{side.minFeeLakh}L–₹{side.maxFeeLakh}L</dd>
              {cost && (
                <>
                  <dt className="text-gray-500">Living cost/mo</dt>
                  <dd className="text-right font-semibold text-gray-900">₹{cost.min.toLocaleString()}–₹{cost.max.toLocaleString()}</dd>
                </>
              )}
            </dl>
            {psw && <p className="text-xs text-gray-600 mb-4"><strong>PSW:</strong> {psw}</p>}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-700 mb-2">Cheapest real {pillar.name} courses</p>
              <ul className="space-y-1.5 mb-3">
                {side.cheapest.map(c => (
                  <li key={`${c.universitySlug}-${c.slug}`} className="text-xs">
                    <Link href={`/universities/${c.universitySlug}/courses/${c.slug}`} className="text-brand-700 hover:underline">
                      {c.name}
                    </Link>
                    <span className="text-gray-500"> — ₹{(c.annualINR / 100000).toFixed(1)}L/yr</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <Link href={`/universities/country/${side.countrySlug}`} className="text-xs text-brand-700 hover:underline font-medium">
                  Study in {side.countryName} →
                </Link>
                {costPillar && (
                  <Link href={`/${costPillar.slug}`} className="text-xs text-brand-700 hover:underline font-medium">
                    Cost of Studying →
                  </Link>
                )}
                {cheapestHubSlug && (
                  <Link href={`/cheapest-universities-${cheapestHubSlug}`} className="text-xs text-brand-700 hover:underline font-medium">
                    Cheapest Universities →
                  </Link>
                )}
                {pswHubSlug && (
                  <Link href={`/courses-with-psw/${pswHubSlug}`} className="text-xs text-brand-700 hover:underline font-medium">
                    PSW Courses →
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Verdict — honest, no fake winner */}
      <div className="mb-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-2">So Which Should You Choose?</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          There is no single &quot;better&quot; country — it depends on your priority.{' '}
          {cheaperSide && (
            <>If <strong>budget</strong> matters most, {cheaperSide.countryName}&apos;s cheapest real {pillar.name} course (₹{cheaperSide.minFeeLakh}L/year) is lower than the other country&apos;s. </>
          )}
          {moreCoursesSide && (
            <>If you want more <strong>course choice</strong>, {moreCoursesSide.countryName} has more real {pillar.name} programmes listed on this site. </>
          )}
          {pswA && pswB && <>If <strong>post-study work rights</strong> matter most, compare the PSW routes above — they differ in duration and eligibility rules between {nameA} and {nameB}. </>}
          Talk to a counsellor about your specific course shortlist, budget, and career goals before deciding.
        </p>
      </div>

      {/* Related subject pillar link */}
      <div className="mb-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Related Guide</h2>
        <Link
          href={`/${pillar.slug}`}
          className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors inline-block"
        >
          {pillar.emoji} Full {pillar.name} Abroad Guide (All Countries) →
        </Link>
      </div>

      {/* FAQ */}
      <div className="mb-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{nameA} vs {nameB} for {pillar.name} — Frequently Asked Questions</h2>
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
        headline={`Get ${pillar.name}: ${nameA} vs ${nameB} Shortlist on WhatsApp`}
        context={`${pillar.name} — ${nameA} vs ${nameB}`}
        source={`compare-country-subject-${parsed.slug}`}
      />

      <div className="mt-6">
        <VerifiedBy />
      </div>
    </div>
  );
}
