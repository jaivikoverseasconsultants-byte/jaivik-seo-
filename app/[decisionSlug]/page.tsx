import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import type { RealCourseEntry } from '@/data/university-course-registry';
import { getUniversityBySlug } from '@/data/universities';
import JsonLd from '@/components/JsonLd';
import VerifiedBy from '@/components/VerifiedBy';
import WhatsAppLeadCTA from '@/components/WhatsAppLeadCTA';
import FindMyCourseCTA from '@/components/FindMyCourseCTA';
import { authorPersonSchema } from '@/lib/seo';
import { getPillarsWithCoverageInCountry } from '@/lib/subject-pillars';
import {
  getAllCountrySubjectComparisons, parseCountrySubjectSlug, getCountrySubjectComparisonData,
} from '@/lib/country-subject-comparisons';
import CountrySubjectComparisonPage from '@/components/CountrySubjectComparisonPage';
import { courseAnnualINRLakh } from '@/lib/currency';
import { hasPublishedIelts } from '@/lib/english-verification';
import {
  COUNTRY_FLAGS, CHEAPEST_COUNTRY_SLUGS, PSW_COUNTRY_SLUGS,
  getCheapestCourses, getBudgetHub, getBudgetHubs, getBudgetHubsForCountry, type BudgetHub,
} from '@/lib/site-hubs';

// Root-level dynamic segment handling TWO distinct decision-hub URL shapes,
// merged into a single route. Next.js App Router's static export does not
// correctly enumerate composite dynamic segments (a folder literally named
// "cheapest-universities-[country]") — generateStaticParams for that shape
// silently produced only one literal "cheapest-universities-[country].html"
// file instead of one per country. A folder named exactly "[decisionSlug]"
// (a full, non-composite dynamic segment) does not have this problem, so
// both "/cheapest-universities-uk" and "/uk-under-20-lakh" are parsed here
// from one generic slug param instead.

const CHEAPEST_SLUG_TO_COUNTRY = Object.fromEntries(Object.entries(CHEAPEST_COUNTRY_SLUGS).map(([c, s]) => [`cheapest-universities-${s}`, c]));

const CHEAPEST_ROWS_SHOWN = 50;
const BUDGET_ROWS_SHOWN = 60;

type Parsed =
  | { kind: 'cheapest'; country: string }
  | { kind: 'budget'; hub: BudgetHub }
  | { kind: 'country-subject-compare'; slug: string };

function parseSlug(slug: string): Parsed | null {
  if (CHEAPEST_SLUG_TO_COUNTRY[slug]) {
    return { kind: 'cheapest', country: CHEAPEST_SLUG_TO_COUNTRY[slug] };
  }
  // Only budget hubs that get a page (lib/site-hubs.ts): a band that adds too few courses over the
  // band below is not built, and its old URL 301s to that lower band in vercel.json.
  const hub = getBudgetHub(slug);
  if (hub) return { kind: 'budget', hub };
  if (parseCountrySubjectSlug(slug)) {
    return { kind: 'country-subject-compare', slug };
  }
  return null;
}

export async function generateStaticParams() {
  const params: { decisionSlug: string }[] = [];
  for (const slug of Object.keys(CHEAPEST_SLUG_TO_COUNTRY)) {
    params.push({ decisionSlug: slug });
  }
  for (const hub of getBudgetHubs()) {
    params.push({ decisionSlug: hub.slug });
  }
  for (const c of getAllCountrySubjectComparisons()) {
    params.push({ decisionSlug: c.slug });
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

  if (parsed.kind === 'budget') {
    const { hub } = parsed;
    const range = hub.lowerBand ? `₹${hub.lowerBand}–${hub.band} lakh` : `up to ₹${hub.band} lakh`;
    const unis = new Set(hub.inBand.map(c => c.universitySlug)).size;
    return buildMetadata({
      title: `Study in ${hub.country} Under ₹${hub.band} Lakh — Real Course List`,
      description: `${hub.inBand.length} courses in ${hub.country} at ${unis} universit${unis === 1 ? 'y' : 'ies'} with annual tuition ${range}${hub.lowerBand ? ` — the options that open up above ₹${hub.lowerBand} lakh` : ''}, of ${hub.total.length} under ₹${hub.band} lakh in all. Fees in INR, from each university's own course pages.`,
      path: `/${decisionSlug}`,
      keywords: [`study in ${hub.country} under ${hub.band} lakh`, `${hub.country} courses under budget for Indian students`, `cheap courses in ${hub.country} for Indian students`],
    });
  }

  const compareParsed = parseCountrySubjectSlug(parsed.slug);
  const compareData = compareParsed ? getCountrySubjectComparisonData(compareParsed) : null;
  if (!compareData) return {};
  const { sideA, sideB } = compareData;
  return buildMetadata({
    title: `${sideA.countryName} vs ${sideB.countryName} for ${compareParsed!.pillar.name} — Fees, Courses & PSW Compared`,
    description: `Real course data comparison: ${compareParsed!.pillar.name} in ${sideA.countryName} (${sideA.count} real courses) vs ${sideB.countryName} (${sideB.count} real courses) — tuition fees in INR, cost of living, and post-study work rights for Indian students.`,
    path: `/${decisionSlug}`,
    keywords: [`${sideA.countryName} vs ${sideB.countryName} for ${compareParsed!.pillar.name}`, `${compareParsed!.pillar.name} ${sideA.countryName} or ${sideB.countryName}`],
  });
}

export default async function DecisionSlugPage({ params }: { params: Promise<{ decisionSlug: string }> }) {
  const { decisionSlug } = await params;
  const parsed = parseSlug(decisionSlug);
  if (!parsed) notFound();

  if (parsed.kind === 'cheapest') {
    return <CheapestView country={parsed.country} />;
  }

  if (parsed.kind === 'country-subject-compare') {
    const compareParsed = parseCountrySubjectSlug(parsed.slug);
    const compareData = compareParsed ? getCountrySubjectComparisonData(compareParsed) : null;
    if (!compareData) notFound();
    return <CountrySubjectComparisonPage data={compareData} />;
  }

  return <BudgetView hub={parsed.hub} />;
}

function CheapestView({ country }: { country: string }) {
  const courses = getCheapestCourses(country);
  const countrySlug = CHEAPEST_COUNTRY_SLUGS[country];
  const shown = courses.slice(0, CHEAPEST_ROWS_SHOWN);
  const cheapestLakh = courses.length ? (courseAnnualINRLakh(courses[0] as any, 1) ?? '0') : null;
  const medianLakh = courses.length ? (courseAnnualINRLakh(courses[Math.floor(courses.length / 2)] as any, 1) ?? '0') : null;

  // Sideways cross-links to related decision hubs for the same country
  const budgetHubs = getBudgetHubsForCountry(country);
  const pswHubSlug = PSW_COUNTRY_SLUGS[country];
  const subjectPillars = getPillarsWithCoverageInCountry(country);

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
    author: authorPersonSchema,
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
                    <td className="text-right py-2.5 px-2 font-semibold text-gray-900">₹{(courseAnnualINRLakh(c as any, 1) ?? '0')}L</td>
                    <td className="text-right py-2.5 pl-2 text-gray-700">{hasPublishedIelts(c.universitySlug, c as never) && c.ieltsMin > 0 ? `${c.ieltsMin}+` : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {(budgetHubs.length > 0 || pswHubSlug) && (
        <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Related Real Course Lists for {country}</h2>
          <div className="flex flex-wrap gap-2">
            {budgetHubs.map(h => (
              <Link
                key={h.slug}
                href={`/${h.slug}`}
                className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors"
              >
                Study in {country} Under ₹{h.band}L →
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
            {subjectPillars.map(p => (
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

      <div className="mt-8">
        <FindMyCourseCTA headline={`Not sure which ${country} university fits YOUR exact profile?`} />
      </div>

      <div className="mt-6">
        <WhatsAppLeadCTA
          headline={`Get the Cheapest ${country} Universities List on WhatsApp`}
          context={`Cheapest universities in ${country}`}
          source={`cheapest-${countrySlug}`}
        />
      </div>

      <div className="mt-6">
        <VerifiedBy />
      </div>
    </div>
  );
}

// Each budget page leads with what its band ADDS — courses priced above the next lower band that has
// a page — so the 10/15/20/25 lakh pages for one country are no longer nested copies of one table.
// Every figure in the copy below is computed from that slice of real course data.
function BudgetView({ hub }: { hub: BudgetHub }) {
  const { country, band, lowerBand, total, inBand } = hub;
  const shown = inBand.slice(0, BUDGET_ROWS_SHOWN);
  const otherHubs = getBudgetHubsForCountry(country).filter(h => h.slug !== hub.slug);
  const lowerHub = otherHubs.find(h => h.band === lowerBand);
  const cheapestHubSlug = CHEAPEST_COUNTRY_SLUGS[country];
  const pswHubSlug = PSW_COUNTRY_SLUGS[country];
  const subjectPillars = getPillarsWithCoverageInCountry(country);

  const uniName = (slug: string) => getUniversityBySlug(slug)?.name ?? slug;
  const lakh = (c: RealCourseEntry) => courseAnnualINRLakh(c as any, 1) ?? '0';
  const range = lowerBand ? `₹${lowerBand}–${band} lakh` : `up to ₹${band} lakh`;

  // Universities in this band, most courses first, and those with nothing cheaper on this site.
  const byUni = new Map<string, number>();
  for (const c of inBand) byUni.set(c.universitySlug, (byUni.get(c.universitySlug) ?? 0) + 1);
  const unis = Array.from(byUni.entries()).sort((a, b) => b[1] - a[1]);
  const cheaperUnis = new Set(total.filter(c => c.annualINR <= lowerBand * 100000).map(c => c.universitySlug));
  const firstAppear = unis.filter(([u]) => !cheaperUnis.has(u)).map(([u]) => uniName(u));
  const ug = inBand.filter(c => /under|bachelor/i.test(`${c.studyLevel} ${c.level}`)).length;
  const pg = inBand.filter(c => /post|master|mba|phd|doctor/i.test(`${c.studyLevel} ${c.level}`)).length;
  const other = inBand.length - ug - pg;
  const median = inBand[Math.floor(inBand.length / 2)];
  const top = unis.slice(0, 5).map(([u, n]) => `${uniName(u)} (${n})`).join(', ');
  const levelLine = ug || pg
    ? `${ug} undergraduate and ${pg} postgraduate${other > 0 ? `, plus ${other} other (diplomas, pathways, certificates)` : ''}`
    : null;
  const moreUnis = firstAppear.length - 4;

  const faqs = [
    lowerBand
      ? {
          q: `What does a ₹${band} lakh budget get you in ${country} that ₹${lowerBand} lakh does not?`,
          a: `${inBand.length} more courses, priced between ₹${lowerBand} and ₹${band} lakh a year${firstAppear.length ? `, including the first options on this site at ${firstAppear.slice(0, 4).join(', ')}${moreUnis > 0 ? ` and ${moreUnis} other universit${moreUnis === 1 ? 'y' : 'ies'}` : ''}` : ''}. That takes the total under ₹${band} lakh to ${total.length} courses.`,
        }
      : {
          q: `What is the cheapest way to study in ${country}?`,
          a: `The cheapest course on this site is ${shown[0].name} at ${uniName(shown[0].universitySlug)}, at about ₹${lakh(shown[0])} lakh a year in tuition. ${inBand.length} courses in ${country} cost ₹${band} lakh a year or less.`,
        },
    {
      q: `Which universities in ${country} have courses ${lowerBand ? `between ₹${lowerBand} and ₹${band} lakh` : `under ₹${band} lakh`}?`,
      a: `${unis.length} universit${unis.length === 1 ? 'y has' : 'ies have'} courses in this range on this site. Most courses: ${top}.`,
    },
    ...(levelLine ? [{
      q: `Are the ${range} courses in ${country} mostly bachelor's or master's?`,
      a: `Of the ${inBand.length}, ${levelLine}. The median annual fee in this range is about ₹${lakh(median)} lakh.`,
    }] : []),
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

      <div className="flex items-center gap-2 text-gray-400 text-xs mb-6 flex-wrap">
        <Link href="/" className="hover:text-brand-700">Home</Link> /
        <Link href={`/universities/country/${hub.countryHubSlug}`} className="hover:text-brand-700">Study in {country}</Link> /
        <span>Under ₹{band} Lakh</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {COUNTRY_FLAGS[country] ?? ''} Study in {country} Under ₹{band} Lakh — Real Course List
        </h1>
        <p className="text-gray-600 max-w-3xl">
          {lowerBand ? (
            <>
              {total.length} courses in {country} cost ₹{band} lakh a year or less. This page lists the {inBand.length} priced
              between ₹{lowerBand} and ₹{band} lakh, which are the options a ₹{band} lakh budget adds.{' '}
              {lowerHub && <>The {total.length - inBand.length} cheaper ones are on the <Link href={`/${lowerHub.slug}`} className="text-brand-700 underline">under ₹{lowerBand} lakh</Link> page.</>}
            </>
          ) : (
            <>{inBand.length} courses in {country} cost ₹{band} lakh a year or less, the lowest tuition on this site for {country}, sorted cheapest first.</>
          )}
          {inBand.length > BUDGET_ROWS_SHOWN ? ` Showing the cheapest ${BUDGET_ROWS_SHOWN}.` : ''} Fees are tuition only, converted to INR from each university&apos;s own course page.
        </p>
        {otherHubs.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs text-gray-500 mt-1.5">Other budgets:</span>
            {otherHubs.map(h => (
              <Link
                key={h.slug}
                href={`/${h.slug}`}
                className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-1.5 rounded-full hover:bg-brand-100 transition-colors"
              >
                Under ₹{h.band}L
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6 bg-brand-50 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">What the {range} band looks like in {country}</h2>
        <ul className="text-sm text-gray-700 space-y-1.5 list-disc pl-5">
          <li>{inBand.length} courses at {unis.length} universit{unis.length === 1 ? 'y' : 'ies'}, from ₹{lakh(inBand[0])} to ₹{lakh(inBand[inBand.length - 1])} lakh a year (median ₹{lakh(median)} lakh).</li>
          {levelLine && <li>{levelLine[0].toUpperCase() + levelLine.slice(1)}.</li>}
          {lowerBand > 0 && (firstAppear.length
            ? <li>First options on this site at {firstAppear.slice(0, 6).join(', ')}{firstAppear.length > 6 ? ` and ${firstAppear.length - 6} more` : ''}: none of their courses here cost ₹{lowerBand} lakh or less.</li>
            : <li>Every university here also has cheaper courses under ₹{lowerBand} lakh, so this band adds more courses at the same universities rather than new universities.</li>)}
          <li>That is {Math.round((inBand.length / total.length) * 100)}% of the {total.length} courses under ₹{band} lakh{lowerBand ? `; the other ${total.length - inBand.length} cost ₹${lowerBand} lakh or less` : ''}.</li>
        </ul>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-3">{lowerBand ? `Courses from ₹${lowerBand} to ₹${band} lakh a year` : `Courses up to ₹${band} lakh a year`}</h2>
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
              {shown.map((c, i) => (
                <tr key={`${c.universitySlug}-${c.slug}`} className="border-b border-gray-100 hover:bg-brand-50">
                  <td className="py-2.5 pr-3 text-gray-400">{i + 1}</td>
                  <td className="py-2.5 px-2">
                    <Link href={`/universities/${c.universitySlug}/courses/${c.slug}`} className="text-brand-700 hover:underline font-medium">
                      {c.name}
                    </Link>
                  </td>
                  <td className="py-2.5 px-2 text-gray-700">{uniName(c.universitySlug)}</td>
                  <td className="text-right py-2.5 px-2 font-semibold text-gray-900">₹{lakh(c)}L</td>
                  <td className="text-right py-2.5 pl-2 text-gray-700">{hasPublishedIelts(c.universitySlug, c as never) && c.ieltsMin > 0 ? `${c.ieltsMin}+` : '—'}</td>
                </tr>
              ))}
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
            {subjectPillars.map(p => (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors"
              >
                {p.emoji} {p.name} Abroad →
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Studying in {country} on a {range} Budget — Frequently Asked Questions</h2>
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

      <div className="mt-8">
        <FindMyCourseCTA headline={`Want matches tailored to YOUR exact profile, not just budget?`} />
      </div>

      <div className="mt-6">
        <WhatsAppLeadCTA
          headline={`Get ${country} Universities Under ₹${band}L on WhatsApp`}
          context={`${country} under ₹${band}L`}
          source={`budget-${hub.countrySlug}-${band}l`}
        />
      </div>

      <div className="mt-6">
        <VerifiedBy />
      </div>
    </div>
  );
}
