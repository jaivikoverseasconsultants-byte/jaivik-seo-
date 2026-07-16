import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { getAllRealCourses, type RealCourseEntry } from '@/data/university-course-registry';
import { getUniversityBySlug } from '@/data/universities';
import JsonLd from '@/components/JsonLd';

// Root-level dynamic segment handling TWO distinct decision-hub URL shapes,
// merged into a single route. Next.js App Router's static export does not
// correctly enumerate composite dynamic segments (a folder literally named
// "cheapest-universities-[country]") — generateStaticParams for that shape
// silently produced only one literal "cheapest-universities-[country].html"
// file instead of one per country. A folder named exactly "[decisionSlug]"
// (a full, non-composite dynamic segment) does not have this problem, so
// both "/cheapest-universities-uk" and "/uk-under-20-lakh" are parsed here
// from one generic slug param instead.

const CHEAPEST_COUNTRY_SLUGS: Record<string, string> = {
  UK: 'uk', Australia: 'australia', Canada: 'canada', 'New Zealand': 'new-zealand',
  Netherlands: 'netherlands', Ireland: 'ireland', USA: 'usa', Germany: 'germany',
  Denmark: 'denmark', Sweden: 'sweden', Finland: 'finland', Singapore: 'singapore',
  'United Arab Emirates': 'united-arab-emirates',
};
const CHEAPEST_SLUG_TO_COUNTRY = Object.fromEntries(Object.entries(CHEAPEST_COUNTRY_SLUGS).map(([c, s]) => [`cheapest-universities-${s}`, c]));

const BUDGET_COUNTRY_SLUGS: Record<string, string> = {
  UK: 'uk', Australia: 'australia', Canada: 'canada', Ireland: 'ireland',
  Netherlands: 'netherlands', 'New Zealand': 'new-zealand', USA: 'usa',
  Germany: 'germany', Denmark: 'denmark', Sweden: 'sweden', Finland: 'finland',
  Singapore: 'singapore', 'United Arab Emirates': 'united-arab-emirates', Italy: 'italy',
};
const BUDGET_SLUG_TO_COUNTRY = Object.fromEntries(Object.entries(BUDGET_COUNTRY_SLUGS).map(([c, s]) => [s, c]));

const PSW_COUNTRY_SLUGS: Record<string, string> = {
  Canada: 'canada', Australia: 'australia', UK: 'uk', Ireland: 'ireland',
  Germany: 'germany', 'New Zealand': 'new-zealand',
};

const COUNTRY_FLAGS: Record<string, string> = {
  UK: '🇬🇧', Australia: '🇦🇺', Canada: '🇨🇦', Ireland: '🇮🇪', Netherlands: '🇳🇱',
  'New Zealand': '🇳🇿', USA: '🇺🇸', Germany: '🇩🇪', Denmark: '🇩🇰', Sweden: '🇸🇪',
  Finland: '🇫🇮', Singapore: '🇸🇬', 'United Arab Emirates': '🇦🇪', Italy: '🇮🇹',
};

const BANDS = [10, 15, 20, 25];
const MIN_MATCHES = 15;
const CHEAPEST_ROWS_SHOWN = 50;
const BUDGET_ROWS_SHOWN = 60;

type Parsed =
  | { kind: 'cheapest'; country: string }
  | { kind: 'budget'; country: string; band: number };

function parseSlug(slug: string): Parsed | null {
  if (CHEAPEST_SLUG_TO_COUNTRY[slug]) {
    return { kind: 'cheapest', country: CHEAPEST_SLUG_TO_COUNTRY[slug] };
  }
  const m = slug.match(/^(.+)-under-(\d+)-lakh$/);
  if (m) {
    const country = BUDGET_SLUG_TO_COUNTRY[m[1]];
    const band = parseInt(m[2], 10);
    if (country && BANDS.includes(band)) return { kind: 'budget', country, band };
  }
  return null;
}

function getCheapestCourses(country: string): RealCourseEntry[] {
  return getAllRealCourses().filter(c => c.country === country && c.annualINR > 0).sort((a, b) => a.annualINR - b.annualINR);
}
function getBudgetCourses(country: string, band: number): RealCourseEntry[] {
  return getAllRealCourses()
    .filter(c => c.country === country && c.annualINR > 0 && c.annualINR <= band * 100000)
    .sort((a, b) => a.annualINR - b.annualINR);
}

export async function generateStaticParams() {
  const params: { decisionSlug: string }[] = [];
  for (const slug of Object.keys(CHEAPEST_SLUG_TO_COUNTRY)) {
    params.push({ decisionSlug: slug });
  }
  for (const [country, countrySlug] of Object.entries(BUDGET_COUNTRY_SLUGS)) {
    for (const band of BANDS) {
      if (getBudgetCourses(country, band).length >= MIN_MATCHES) {
        params.push({ decisionSlug: `${countrySlug}-under-${band}-lakh` });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ decisionSlug: string }> }): Promise<Metadata> {
  const { decisionSlug } = await params;
  const parsed = parseSlug(decisionSlug);
  if (!parsed) return {};

  if (parsed.kind === 'cheapest') {
    const courses = getCheapestCourses(parsed.country);
    return buildMetadata({
      title: `Cheapest Universities in ${parsed.country} for Indian Students — Fees in INR`,
      description: `${courses.length} real courses in ${parsed.country}, sorted cheapest first, with tuition fees converted to INR and direct links to every course. Real data, crawled from each university's own course pages.`,
      path: `/${decisionSlug}`,
      keywords: [`cheapest universities in ${parsed.country}`, `low fee universities in ${parsed.country} for Indian students`, `${parsed.country} tuition fees in INR`],
    });
  }

  const matches = getBudgetCourses(parsed.country, parsed.band);
  return buildMetadata({
    title: `Study in ${parsed.country} Under ₹${parsed.band} Lakh — Real Course List`,
    description: `${matches.length} real courses in ${parsed.country} costing ₹${parsed.band} lakh per year or less, sorted cheapest first, with direct links to every course. Real data, crawled from each university's own course pages.`,
    path: `/${decisionSlug}`,
    keywords: [`study in ${parsed.country} under ${parsed.band} lakh`, `${parsed.country} courses under budget for Indian students`, `cheap courses in ${parsed.country} for Indian students`],
  });
}

export default async function DecisionSlugPage({ params }: { params: Promise<{ decisionSlug: string }> }) {
  const { decisionSlug } = await params;
  const parsed = parseSlug(decisionSlug);
  if (!parsed) notFound();

  if (parsed.kind === 'cheapest') {
    return <CheapestView country={parsed.country} />;
  }

  const matches = getBudgetCourses(parsed.country, parsed.band);
  if (matches.length < MIN_MATCHES) notFound();
  return <BudgetView country={parsed.country} band={parsed.band} matches={matches} />;
}

function CheapestView({ country }: { country: string }) {
  const courses = getCheapestCourses(country);
  const countrySlug = CHEAPEST_COUNTRY_SLUGS[country];
  const shown = courses.slice(0, CHEAPEST_ROWS_SHOWN);
  const cheapestLakh = courses.length ? (courses[0].annualINR / 100000).toFixed(1) : null;
  const medianLakh = courses.length ? (courses[Math.floor(courses.length / 2)].annualINR / 100000).toFixed(1) : null;

  // Sideways cross-links to related decision hubs for the same country
  const budgetCountrySlug = BUDGET_COUNTRY_SLUGS[country];
  const budgetBands = budgetCountrySlug
    ? BANDS.filter(b => getBudgetCourses(country, b).length >= MIN_MATCHES)
    : [];
  const pswHubSlug = PSW_COUNTRY_SLUGS[country];

  const faqs = [
    {
      q: `What is the cheapest university in ${country} for Indian students?`,
      a: cheapestLakh
        ? `Among ${courses.length} real courses in ${country} on this site, the cheapest is ${shown[0].name} at ${getUniversityBySlug(shown[0].universitySlug)?.name ?? shown[0].universitySlug}, at approximately ₹${cheapestLakh} lakh per year. The median annual fee across all ${courses.length} real courses is approximately ₹${medianLakh} lakh. See the full sorted list below — every row links to the real course page.`
        : `See the full sorted list below.`,
    },
    {
      q: `Are cheaper universities in ${country} lower quality?`,
      a: `Not necessarily — tuition fees vary by programme level, specialisation, and university funding model (public vs private), not just ranking. A lower fee often reflects a public university's subsidised tuition structure or a shorter/more focused programme, not lower teaching quality. Always check the specific programme's accreditation and your own career goals, not fee alone.`,
    },
    {
      q: `Does a lower tuition fee mean lower total cost of studying in ${country}?`,
      a: `Tuition is usually the largest cost, but not the only one — living costs, health insurance, and visa fees are additional and vary by city more than by university. Use this site's cost of living guides alongside this fee list to estimate your total budget.`,
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <JsonLd data={faqSchema} />

      <div className="flex items-center gap-2 text-gray-400 text-xs mb-6">
        <Link href="/" className="hover:text-brand-700">Home</Link> /
        <span>Cheapest Universities in {country}</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {COUNTRY_FLAGS[country] ?? ''} Cheapest Universities in {country} for Indian Students — Fees in INR
        </h1>
        <p className="text-gray-600 max-w-3xl">
          {courses.length} real courses in {country}, sorted cheapest first — crawled directly from each university&apos;s own course
          pages, with tuition fees converted to INR and a direct link to every programme&apos;s full course page.
          {courses.length > CHEAPEST_ROWS_SHOWN ? ` Showing the cheapest ${CHEAPEST_ROWS_SHOWN}.` : ''}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-3 font-semibold text-gray-700">#</th>
                <th className="text-left py-2 px-2 font-semibold text-gray-700">Programme</th>
                <th className="text-left py-2 px-2 font-semibold text-gray-700">University</th>
                <th className="text-right py-2 px-2 font-semibold text-gray-700">Fee/yr (INR)</th>
                <th className="text-right py-2 pl-2 font-semibold text-gray-700">IELTS</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((c, i) => {
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
                    <td className="text-right py-2.5 px-2 font-semibold text-gray-900">₹{(c.annualINR / 100000).toFixed(1)}L</td>
                    <td className="text-right py-2.5 pl-2 text-gray-700">{c.ieltsMin > 0 ? `${c.ieltsMin}+` : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {(budgetBands.length > 0 || pswHubSlug) && (
        <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Related Real Course Lists for {country}</h2>
          <div className="flex flex-wrap gap-2">
            {budgetBands.map(b => (
              <Link
                key={b}
                href={`/${budgetCountrySlug}-under-${b}-lakh`}
                className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors"
              >
                Study in {country} Under ₹{b}L →
              </Link>
            ))}
            {pswHubSlug && (
              <Link
                href={`/courses-with-psw/${pswHubSlug}`}
                className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors"
              >
                Courses in {country} with Post-Study Work Rights →
              </Link>
            )}
            <Link
              href="/ielts-6-5-universities"
              className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors"
            >
              Universities Accepting IELTS 6.5 →
            </Link>
          </div>
        </div>
      )}

      <div className="mt-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Cheapest in {country} — Frequently Asked Questions</h2>
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
        <h2 className="text-xl font-bold mb-2">Planning Your Budget for {country}?</h2>
        <p className="text-blue-200 text-sm mb-4">
          Book a free counselling session — our advisors help Indian students find affordable, real, accredited programmes that fit their budget.
        </p>
        <Link href="/book-counselling" className="btn-gold inline-block">
          Get Free Guidance →
        </Link>
      </div>
    </div>
  );
}

function BudgetView({ country, band, matches }: { country: string; band: number; matches: RealCourseEntry[] }) {
  const countrySlug = BUDGET_COUNTRY_SLUGS[country];
  const shown = matches.slice(0, BUDGET_ROWS_SHOWN);
  const otherBands = BANDS.filter(b => b !== band && getBudgetCourses(country, b).length >= MIN_MATCHES);

  // Sideways cross-links to related decision hubs for the same country
  const cheapestHubSlug = CHEAPEST_COUNTRY_SLUGS[country];
  const pswHubSlug = PSW_COUNTRY_SLUGS[country];

  const faqs = [
    {
      q: `Can I study in ${country} under ₹${band} lakh per year?`,
      a: `Yes — ${matches.length} real courses in ${country} on this site have an annual tuition fee of ₹${band} lakh or less. The cheapest is ${shown[0].name} at ${getUniversityBySlug(shown[0].universitySlug)?.name ?? shown[0].universitySlug}, at approximately ₹${(shown[0].annualINR / 100000).toFixed(1)} lakh per year. See the full list below — every row links to the real course page for exact, current fees.`,
    },
    {
      q: `Does ₹${band} lakh include living costs in ${country}?`,
      a: `No — the fees shown are tuition only, as published by each university. Living costs (accommodation, food, transport), visa fees, and health insurance are additional and vary by city. Check this site's cost of living guides for a city-by-city breakdown before finalising your budget.`,
    },
    {
      q: `What kind of courses in ${country} cost under ₹${band} lakh?`,
      a: `The list below is real, unfiltered course data — it spans different levels (bachelor's, master's, diploma) and specialisations, not a curated "budget" category. Lower fees are often found at public universities or in shorter/more focused programmes. Check each course's own page for its level and duration before shortlisting.`,
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <JsonLd data={faqSchema} />

      <div className="flex items-center gap-2 text-gray-400 text-xs mb-6">
        <Link href="/" className="hover:text-brand-700">Home</Link> /
        <span>{country} Under ₹{band} Lakh</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {COUNTRY_FLAGS[country] ?? ''} Study in {country} Under ₹{band} Lakh — Real Course List
        </h1>
        <p className="text-gray-600 max-w-3xl">
          {matches.length} real courses in {country} costing ₹{band} lakh per year or less, sorted cheapest first — crawled directly
          from each university&apos;s own course pages, with a direct link to every course&apos;s full page.
          {matches.length > BUDGET_ROWS_SHOWN ? ` Showing the cheapest ${BUDGET_ROWS_SHOWN}.` : ''}
        </p>
        {otherBands.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs text-gray-500 mt-1.5">Other budgets:</span>
            {otherBands.map(b => (
              <Link
                key={b}
                href={`/${countrySlug}-under-${b}-lakh`}
                className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-1.5 rounded-full hover:bg-brand-100 transition-colors"
              >
                Under ₹{b}L
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-3 font-semibold text-gray-700">#</th>
                <th className="text-left py-2 px-2 font-semibold text-gray-700">Programme</th>
                <th className="text-left py-2 px-2 font-semibold text-gray-700">University</th>
                <th className="text-right py-2 px-2 font-semibold text-gray-700">Fee/yr (INR)</th>
                <th className="text-right py-2 pl-2 font-semibold text-gray-700">IELTS</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((c, i) => {
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
                    <td className="text-right py-2.5 px-2 font-semibold text-gray-900">₹{(c.annualINR / 100000).toFixed(1)}L</td>
                    <td className="text-right py-2.5 pl-2 text-gray-700">{c.ieltsMin > 0 ? `${c.ieltsMin}+` : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {(cheapestHubSlug || pswHubSlug) && (
        <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Related Real Course Lists for {country}</h2>
          <div className="flex flex-wrap gap-2">
            {cheapestHubSlug && (
              <Link
                href={`/cheapest-universities-${cheapestHubSlug}`}
                className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors"
              >
                Cheapest Universities in {country} →
              </Link>
            )}
            {pswHubSlug && (
              <Link
                href={`/courses-with-psw/${pswHubSlug}`}
                className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors"
              >
                Courses in {country} with Post-Study Work Rights →
              </Link>
            )}
            <Link
              href="/ielts-6-5-universities"
              className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors"
            >
              Universities Accepting IELTS 6.5 →
            </Link>
          </div>
        </div>
      )}

      <div className="mt-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Studying in {country} Under ₹{band} Lakh — Frequently Asked Questions</h2>
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
        <h2 className="text-xl font-bold mb-2">Need Help Picking Within Your Budget?</h2>
        <p className="text-blue-200 text-sm mb-4">
          Book a free counselling session — our advisors help Indian students shortlist real, affordable programmes that fit their exact budget.
        </p>
        <Link href="/book-counselling" className="btn-gold inline-block">
          Get Free Guidance →
        </Link>
      </div>
    </div>
  );
}
