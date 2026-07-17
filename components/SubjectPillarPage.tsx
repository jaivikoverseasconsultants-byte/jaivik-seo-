import Link from 'next/link';
import { getUniversityBySlug } from '@/data/universities';
import { SUBJECT_PILLARS, type SubjectPillarConfig } from '@/data/subject-pillars';
import {
  getCoursesForPillar, getCountryBreakdown, getCheapestOverall, COUNTRY_FLAGS,
} from '@/lib/subject-pillars';
import { authorPersonSchema } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import VerifiedBy from '@/components/VerifiedBy';

const CHEAPEST_ROWS_SHOWN = 20;
const ROWS_PER_COUNTRY = 30;

export default function SubjectPillarPage({ config }: { config: SubjectPillarConfig }) {
  const courses = getCoursesForPillar(config);
  const countries = getCountryBreakdown(courses);
  const cheapest = getCheapestOverall(courses, CHEAPEST_ROWS_SHOWN);

  const ieltsValues = courses.map(c => c.ieltsMin).filter(v => v > 0);
  const ieltsMin = ieltsValues.length ? Math.min(...ieltsValues) : null;
  const ieltsMax = ieltsValues.length ? Math.max(...ieltsValues) : null;
  const cheapestOverallCountry = cheapest[0]?.country ?? null;
  const maxFeeLakhOverall = courses.length ? (Math.max(...courses.map(c => c.annualINR)) / 100000).toFixed(1) : null;

  const otherPillars = SUBJECT_PILLARS.filter(p => p.slug !== config.slug);

  const faqs = [
    {
      q: `What is the average fee for ${config.name} abroad for Indian students?`,
      a: cheapest.length
        ? `Across ${courses.length} real ${config.introLabel} courses on this site, fees range from ₹${(cheapest[0].annualINR / 100000).toFixed(1)} lakh to ₹${maxFeeLakhOverall} lakh per year, depending on country and university. The cheapest is ${cheapest[0].name} at ${getUniversityBySlug(cheapest[0].universitySlug)?.name ?? cheapest[0].universitySlug} in ${cheapest[0].country}. See the full country-by-country list below — every row links to the real course page.`
        : `See the full list below.`,
    },
    {
      q: `Which countries offer the most ${config.name} programs for Indian students?`,
      a: `Real ${config.introLabel} course data on this site spans ${countries.length} countries. ${countries.slice(0, 3).map(c => `${c.country} (${c.courses.length} courses)`).join(', ')} have the most real programmes listed — see the country sections below for the complete, real-data breakdown.`,
    },
    {
      q: `What IELTS score do I need for ${config.name} abroad?`,
      a: ieltsMin !== null
        ? `Among the ${courses.length} real ${config.introLabel} courses on this site with a published entry requirement, IELTS thresholds range from ${ieltsMin} to ${ieltsMax} overall. Check each course's own page for its exact requirement — entry IELTS varies by university and programme level, not just by country.`
        : `Check each course's own page for its exact requirement.`,
    },
    {
      q: `Which country is cheapest for ${config.name} abroad?`,
      a: cheapestOverallCountry
        ? `Based on real, crawled course data, ${cheapestOverallCountry} currently has the single cheapest ${config.introLabel} programme on this site. Fee ranges vary widely by country — see the "Cheapest ${config.name} Programs" table below for a full cross-country comparison, all sorted cheapest first.`
        : `See the full list below.`,
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
        <Link href="/courses" className="hover:text-brand-700">Courses</Link> /
        <span>{config.name} Abroad</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {config.emoji} {config.name} Abroad for Indian Students — Fees in INR, IELTS &amp; Top Universities 2026
        </h1>
        <p className="text-gray-600 max-w-3xl">
          {courses.length} real {config.introLabel} programmes across {countries.length} countries, crawled directly from
          each university&apos;s own course pages — with tuition fees converted to INR, IELTS requirements, and a direct
          link to every programme&apos;s full course page.
        </p>
      </div>

      {/* Quick country nav */}
      <div className="flex flex-wrap gap-2 mb-8">
        {countries.map(({ country, courses: c }) => (
          <a
            key={country}
            href={`#${country.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-1.5 rounded-full hover:bg-brand-100 transition-colors"
          >
            {COUNTRY_FLAGS[country] ?? ''} {country} ({c.length})
          </a>
        ))}
      </div>

      {/* Cheapest overall — cross-country comparison */}
      {cheapest.length > 0 && (
        <div className="mb-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Cheapest {config.name} Programs Abroad</h2>
          <p className="text-gray-500 text-sm mb-4">
            The {Math.min(CHEAPEST_ROWS_SHOWN, cheapest.length)} cheapest real {config.introLabel} programmes on this site, across every country, sorted cheapest first.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-3 font-semibold text-gray-700">#</th>
                  <th className="text-left py-2 px-2 font-semibold text-gray-700">Programme</th>
                  <th className="text-left py-2 px-2 font-semibold text-gray-700">University</th>
                  <th className="text-left py-2 px-2 font-semibold text-gray-700">Country</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-700">Fee/yr (INR)</th>
                  <th className="text-right py-2 pl-2 font-semibold text-gray-700">IELTS</th>
                </tr>
              </thead>
              <tbody>
                {cheapest.map((c, i) => {
                  const uni = getUniversityBySlug(c.universitySlug);
                  return (
                    <tr key={`${c.universitySlug}-${c.slug}`} className="border-b border-gray-100 hover:bg-brand-50">
                      <td className="py-2.5 pr-3 text-gray-400">{i + 1}</td>
                      <td className="py-2.5 px-2">
                        <Link href={`/universities/${c.universitySlug}/courses/${c.slug}`} className="text-brand-700 hover:underline font-medium">
                          {c.name}
                        </Link>
                      </td>
                      <td className="py-2.5 px-2 text-gray-700">{uni?.name ?? c.universitySlug}</td>
                      <td className="py-2.5 px-2 text-gray-700">{COUNTRY_FLAGS[c.country] ?? ''} {c.country}</td>
                      <td className="text-right py-2.5 px-2 font-semibold text-gray-900">₹{(c.annualINR / 100000).toFixed(1)}L</td>
                      <td className="text-right py-2.5 pl-2 text-gray-700">{c.ieltsMin > 0 ? `${c.ieltsMin}+` : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Country sections */}
      <div className="space-y-10">
        {countries.map(({ country, courses: list, minFeeLakh, maxFeeLakh, minIelts, cheapestHubSlug, pswHubSlug, budgetLink }) => {
          const shown = list.slice(0, ROWS_PER_COUNTRY);
          return (
            <div key={country} id={country.toLowerCase().replace(/\s+/g, '-')} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {COUNTRY_FLAGS[country] ?? ''} {config.name} in {country}
                </h2>
                <span className="text-xs text-gray-400">
                  {list.length} real programmes{list.length > ROWS_PER_COUNTRY ? ` — cheapest ${ROWS_PER_COUNTRY} shown` : ''}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                ₹{minFeeLakh}L–₹{maxFeeLakh}L per year{minIelts > 0 ? ` · IELTS from ${minIelts}+` : ''}
              </p>

              {(cheapestHubSlug || pswHubSlug || budgetLink) && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
                  {cheapestHubSlug && (
                    <Link href={`/cheapest-universities-${cheapestHubSlug}`} className="text-xs text-brand-700 hover:underline font-medium">
                      Cheapest Universities in {country} →
                    </Link>
                  )}
                  {budgetLink && (
                    <Link href={`/${budgetLink.slug}-under-${budgetLink.band}-lakh`} className="text-xs text-brand-700 hover:underline font-medium">
                      Study in {country} Under ₹{budgetLink.band}L →
                    </Link>
                  )}
                  {pswHubSlug && (
                    <Link href={`/courses-with-psw/${pswHubSlug}`} className="text-xs text-brand-700 hover:underline font-medium">
                      Courses in {country} with Post-Study Work Rights →
                    </Link>
                  )}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 pr-3 font-semibold text-gray-700">Programme</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-700">University</th>
                      <th className="text-right py-2 px-2 font-semibold text-gray-700">Fee/yr (INR)</th>
                      <th className="text-right py-2 pl-2 font-semibold text-gray-700">IELTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shown.map(c => {
                      const uni = getUniversityBySlug(c.universitySlug);
                      return (
                        <tr key={`${c.universitySlug}-${c.slug}`} className="border-b border-gray-100 hover:bg-brand-50">
                          <td className="py-2.5 pr-3">
                            <Link href={`/universities/${c.universitySlug}/courses/${c.slug}`} className="text-brand-700 hover:underline font-medium">
                              {c.name}
                            </Link>
                          </td>
                          <td className="py-2.5 px-2 text-gray-700">{uni?.name ?? c.universitySlug}</td>
                          <td className="text-right py-2.5 px-2 text-gray-700">₹{(c.annualINR / 100000).toFixed(1)}L</td>
                          <td className="text-right py-2.5 pl-2 text-gray-700">{c.ieltsMin > 0 ? `${c.ieltsMin}+` : '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Related subject pillars — sideways cross-links */}
      {otherPillars.length > 0 && (
        <div className="mt-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Related Subject Guides</h2>
          <div className="flex flex-wrap gap-2">
            {otherPillars.map(p => (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors"
              >
                {p.emoji} {p.name} Abroad →
              </Link>
            ))}
            <Link
              href="/ielts-6-5-universities"
              className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors"
            >
              Universities Accepting IELTS 6.5 →
            </Link>
          </div>
        </div>
      )}

      {/* FAQ */}
      <div className="mt-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{config.name} Abroad — Frequently Asked Questions</h2>
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

      <div className="mt-8 bg-brand-700 rounded-2xl p-6 text-white text-center">
        <h2 className="text-xl font-bold mb-2">Planning a {config.name} Abroad?</h2>
        <p className="text-blue-200 text-sm mb-4">
          Book a free counselling session — our advisors help Indian students shortlist real, accredited {config.introLabel} programmes that fit their budget and goals.
        </p>
        <Link href="/book-counselling" className="btn-gold inline-block">
          Get Free Guidance →
        </Link>
      </div>

      <div className="mt-6">
        <VerifiedBy />
      </div>
    </div>
  );
}
