import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata, authorPersonSchema } from '@/lib/seo';
import { getAllRealCourses, type RealCourseEntry } from '@/data/university-course-registry';
import { getUniversityBySlug } from '@/data/universities';
import { pswDetails } from '@/lib/course-faqs';
import type { CourseForContent } from '@/lib/courseContent';
import JsonLd from '@/components/JsonLd';
import VerifiedBy from '@/components/VerifiedBy';
import WhatsAppLeadCTA from '@/components/WhatsAppLeadCTA';
import FindMyCourseCTA from '@/components/FindMyCourseCTA';
import { getPillarsWithCoverageInCountry } from '@/lib/subject-pillars';
import { courseAnnualINRLakh } from '@/lib/currency';

// Only countries lib/course-faqs.ts's pswDetails() actually computes a real
// post-study-work pathway for — never guess a country's PSW rules.
const COUNTRY_SLUGS: Record<string, string> = {
  Canada: 'canada', Australia: 'australia', UK: 'uk', Ireland: 'ireland',
  Germany: 'germany', 'New Zealand': 'new-zealand',
};
const SLUG_TO_COUNTRY = Object.fromEntries(Object.entries(COUNTRY_SLUGS).map(([c, s]) => [s, c]));

const COUNTRY_FLAGS: Record<string, string> = {
  Canada: '🇨🇦', Australia: '🇦🇺', UK: '🇬🇧', Ireland: '🇮🇪', Germany: '🇩🇪', 'New Zealand': '🇳🇿',
};

const COUNTRY_HEADLINE: Record<string, string> = {
  Canada: 'Courses in Canada with a 3-Year PGWP',
  Australia: 'Courses in Australia with the 485 Visa',
  UK: 'Courses in the UK with the Graduate Route Visa',
  Ireland: 'Courses in Ireland with the Stamp 1G Scheme',
  Germany: 'Courses in Germany with the 18-Month Job-Seeker Permit',
  'New Zealand': 'Courses in New Zealand with a Post-Study Work Visa',
};

const ROWS_SHOWN = 60;
const BUDGET_BANDS = [10, 15, 20, 25];
const BUDGET_MIN_MATCHES = 15;

interface PswRow {
  course: RealCourseEntry;
  visaName: string;
  workDuration: string;
}

function getPswCourses(countrySlug: string): { country: string; rows: PswRow[] } | null {
  const country = SLUG_TO_COUNTRY[countrySlug];
  if (!country) return null;

  const candidates = getAllRealCourses().filter(c => c.country === country && c.annualINR > 0);
  const rows: PswRow[] = [];
  for (const c of candidates) {
    const courseForContent: CourseForContent = {
      name: c.name,
      level: c.level,
      studyLevel: c.studyLevel,
      duration: c.duration,
      durationYears: c.durationYears,
      campus: '',
      intakeMonths: c.intakeMonths,
      country: c.country,
      ieltsMin: c.ieltsMin,
      toeflMin: c.toeflMin,
      pteMin: c.pteMin,
      annualINR: c.annualINR,
      annualUSD: c.annualUSD,
      // needed by the post-study-work gate in pswDetails()
      url: c.url,
      pswEligible: c.pswEligible,
    };
    const uni = getUniversityBySlug(c.universitySlug);
    const details = pswDetails(courseForContent, uni?.name ?? c.universitySlug);
    if (!details) continue;
    rows.push({ course: c, visaName: details.visaName, workDuration: details.workDuration });
  }
  rows.sort((a, b) => a.course.annualINR - b.course.annualINR);
  return { country, rows };
}

export async function generateStaticParams() {
  return Object.values(COUNTRY_SLUGS).map(country => ({ country }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country: countrySlug } = await params;
  const data = getPswCourses(countrySlug);
  if (!data) return {};
  return buildMetadata({
    title: `${COUNTRY_HEADLINE[data.country]} — Full List with Fees in INR`,
    description: `${data.rows.length} real courses in ${data.country} that qualify for post-study work rights based on programme duration, with fees converted to INR and direct links to every course.`,
    path: `/courses-with-psw/${countrySlug}`,
    keywords: [`post study work visa ${data.country}`, `PGWP eligible courses`, `${data.country} PR pathway courses for Indian students`],
  });
}

export default async function PswCoursesPage({ params }: { params: Promise<{ country: string }> }) {
  const { country: countrySlug } = await params;
  const data = getPswCourses(countrySlug);
  if (!data) notFound();
  const { country, rows } = data;
  const shown = rows.slice(0, ROWS_SHOWN);
  const visaName = rows[0]?.visaName ?? '';

  // Sideways cross-links to related decision hubs for the same country —
  // all 6 PSW-eligible countries also qualify for the cheapest-in-country
  // hub, so COUNTRY_SLUGS' own values double as the cheapest-hub slug.
  const cheapestHubSlug = COUNTRY_SLUGS[country];
  const budgetBands = BUDGET_BANDS.filter(b =>
    getAllRealCourses().filter(c => c.country === country && c.annualINR > 0 && c.annualINR <= b * 100000).length >= BUDGET_MIN_MATCHES
  );
  const subjectPillars = getPillarsWithCoverageInCountry(country);

  const faqs = [
    {
      q: `Which courses in ${country} qualify for post-study work rights?`,
      a: `${rows.length} real courses in ${country} on this site qualify for a post-study work pathway based on their programme duration — see the full list below. Post-study work length is generally tied to how long your programme runs, so a longer programme (e.g. a 2-year Master's) usually earns a longer work permit than a short certificate.`,
    },
    {
      q: `What is ${visaName || 'the post-study work visa'} in ${country}?`,
      a: rows[0]
        ? `Graduates from an eligible programme in ${country} can typically apply for the ${rows[0].visaName}. The exact duration depends on your specific programme's length and level — see each course's own page for its computed duration (e.g. "${shown[0]?.course.name}" at ${getUniversityBySlug(shown[0]?.course.universitySlug ?? '')?.name} would qualify for around ${shown[0]?.workDuration}). Confirm current eligibility rules with the relevant immigration authority or your Jaivik Overseas counsellor before applying, as rules can change.`
        : `See each course's own page for details.`,
    },
    {
      q: `Does post-study work lead to permanent residency in ${country}?`,
      a: (country === 'Canada')
        ? `Post-study work experience in Canada can count toward Canadian Experience Class points under the Express Entry (CRS) system, which is one route to permanent residency — it isn't automatic, and current requirements should be confirmed with IRCC or a registered consultant.`
        : (country === 'Australia')
        ? `Work experience gained on Australia's Temporary Graduate visa (subclass 485) can support later skilled migration applications, but isn't automatic — current occupation lists and points requirements should be confirmed with a registered migration agent.`
        : `Post-study work experience can strengthen a later skilled migration or points-based application in many countries, but eligibility rules vary and change — confirm current requirements with the relevant immigration authority or your Jaivik Overseas counsellor before making decisions based on PR prospects.`,
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
        <span>{COUNTRY_HEADLINE[country]}</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {COUNTRY_FLAGS[country] ?? ''} {COUNTRY_HEADLINE[country]} — Full List with Fees in INR
        </h1>
        <p className="text-gray-600 max-w-3xl">
          {rows.length} real courses in {country} that qualify for a post-study work pathway based on programme duration — with tuition
          fees converted to INR and a direct link to every course&apos;s full page, which shows its own computed work-permit length.
          {rows.length > ROWS_SHOWN ? ` Showing the cheapest ${ROWS_SHOWN}.` : ''}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-3 font-semibold text-gray-700">Programme</th>
                <th className="text-left py-2 px-2 font-semibold text-gray-700">University</th>
                <th className="text-right py-2 px-2 font-semibold text-gray-700">Fee/yr (INR)</th>
                <th className="text-right py-2 px-2 font-semibold text-gray-700">Duration</th>
                <th className="text-right py-2 pl-2 font-semibold text-gray-700">Post-Study Work</th>
              </tr>
            </thead>
            <tbody>
              {shown.map(({ course: c, workDuration }) => {
                const uni = getUniversityBySlug(c.universitySlug);
                return (
                  <tr key={`${c.universitySlug}-${c.slug}`} className="border-b border-gray-100 hover:bg-brand-50">
                    <td className="py-2.5 pr-3">
                      <Link href={`/universities/${c.universitySlug}/courses/${c.slug}`} className="text-brand-700 hover:underline font-medium">
                        {c.name}
                      </Link>
                    </td>
                    <td className="py-2.5 px-2 text-gray-700">{uni?.name ?? c.universitySlug}</td>
                    <td className="text-right py-2.5 px-2 text-gray-700">₹{(courseAnnualINRLakh(c as any, 1) ?? '0')}L</td>
                    <td className="text-right py-2.5 px-2 text-gray-700">{c.duration}</td>
                    <td className="text-right py-2.5 pl-2 font-semibold text-green-700">{workDuration}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {(cheapestHubSlug || budgetBands.length > 0) && (
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
            {budgetBands.map(b => (
              <Link
                key={b}
                href={`/${cheapestHubSlug}-under-${b}-lakh`}
                className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors"
              >
                Study in {country} Under ₹{b}L →
              </Link>
            ))}
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Post-Study Work in {country} — Frequently Asked Questions</h2>
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
        <FindMyCourseCTA headline={`Want ${country} matches tailored to YOUR exact profile?`} />
      </div>

      <div className="mt-6">
        <WhatsAppLeadCTA
          headline={`Get ${country} Courses with Post-Study Work Rights on WhatsApp`}
          context={`${country} PSW courses`}
          source={`psw-${COUNTRY_SLUGS[country]}`}
        />
      </div>

      <div className="mt-6">
        <VerifiedBy />
      </div>
    </div>
  );
}
