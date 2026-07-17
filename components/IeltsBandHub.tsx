import Link from 'next/link';
import { getAllRealCourses, type RealCourseEntry } from '@/data/university-course-registry';
import { getUniversityBySlug } from '@/data/universities';
import JsonLd from '@/components/JsonLd';
import VerifiedBy from '@/components/VerifiedBy';
import { authorPersonSchema } from '@/lib/seo';

const COUNTRY_FLAGS: Record<string, string> = {
  UK: '🇬🇧', Australia: '🇦🇺', Canada: '🇨🇦', Ireland: '🇮🇪', 'New Zealand': '🇳🇿',
  USA: '🇺🇸', Germany: '🇩🇪', Netherlands: '🇳🇱', Denmark: '🇩🇰', Sweden: '🇸🇪',
  Finland: '🇫🇮', Singapore: '🇸🇬', 'United Arab Emirates': '🇦🇪', Italy: '🇮🇹',
};

// Sideways cross-links to the other decision hubs for the same country —
// same slug maps as app/[decisionSlug]/page.tsx and
// app/courses-with-psw/[country]/page.tsx.
const CHEAPEST_COUNTRY_SLUGS: Record<string, string> = {
  UK: 'uk', Australia: 'australia', Canada: 'canada', 'New Zealand': 'new-zealand',
  Netherlands: 'netherlands', Ireland: 'ireland', USA: 'usa', Germany: 'germany',
  Denmark: 'denmark', Sweden: 'sweden', Finland: 'finland', Singapore: 'singapore',
  'United Arab Emirates': 'united-arab-emirates',
};
const PSW_COUNTRY_SLUGS: Record<string, string> = {
  Canada: 'canada', Australia: 'australia', UK: 'uk', Ireland: 'ireland',
  Germany: 'germany', 'New Zealand': 'new-zealand',
};
const BUDGET_COUNTRY_SLUGS: Record<string, string> = {
  UK: 'uk', Australia: 'australia', Canada: 'canada', Ireland: 'ireland',
  Netherlands: 'netherlands', 'New Zealand': 'new-zealand', USA: 'usa',
  Germany: 'germany', Denmark: 'denmark', Sweden: 'sweden', Finland: 'finland',
  Singapore: 'singapore', 'United Arab Emirates': 'united-arab-emirates', Italy: 'italy',
};
const BUDGET_BANDS = [10, 15, 20, 25];
const BUDGET_MIN_MATCHES = 15;

const ROWS_PER_COUNTRY = 30;

interface Props {
  band: number; // 6, 6.5, or 7
}

export default function IeltsBandHub({ band }: Props) {
  const bandLabel = band.toFixed(1);
  const all = getAllRealCourses().filter(c => c.ieltsMin > 0 && c.ieltsMin <= band && c.annualINR > 0);

  const byCountry = new Map<string, RealCourseEntry[]>();
  for (const c of all) {
    if (!byCountry.has(c.country)) byCountry.set(c.country, []);
    byCountry.get(c.country)!.push(c);
  }
  const countries = Array.from(byCountry.entries()).sort((a, b) => b[1].length - a[1].length);

  const faqs = [
    {
      q: `Which universities accept IELTS ${bandLabel}?`,
      a: `${all.length} real courses across ${countries.length} countries on this site have a published entry requirement of IELTS ${bandLabel} or below — see the full country-by-country list below, each linking to the real course page with its exact fee and requirements. This is course-entry IELTS only; some countries and professions (e.g. nursing registration) have separate, often higher, requirements after you graduate.`,
    },
    {
      q: `Can I get into a good university with IELTS ${bandLabel}?`,
      a: `Yes — IELTS ${bandLabel} is a common entry threshold, not just for lower-ranked institutions. The list below includes real programmes at recognised universities across ${countries.map(([c]) => c).slice(0, 5).join(', ')}${countries.length > 5 ? ' and more' : ''}. If your target course requires a higher band, ask Jaivik Overseas about pre-sessional English programmes that can lead to a conditional offer.`,
    },
    {
      q: `Is IELTS ${bandLabel} enough for a student visa?`,
      a: `Course entry and visa English requirements are usually the same in practice — most study visas accept the IELTS score your offer letter is based on. However, some professional registrations (nursing, for example) require a separately higher IELTS score after graduation, regardless of your course entry requirement. Confirm your specific visa route's English requirement with your Jaivik Overseas counsellor.`,
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
        <span>Universities Accepting IELTS {bandLabel}</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Universities Accepting IELTS {bandLabel} — Fees in INR for Indian Students
        </h1>
        <p className="text-gray-600 max-w-3xl">
          {all.length} real courses with a published entry requirement of IELTS {bandLabel} or below, across {countries.length} countries —
          crawled directly from each university&apos;s own course pages, with tuition fees converted to INR and a direct link to every
          programme&apos;s full course page.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {countries.map(([country]) => (
          <a
            key={country}
            href={`#${country.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-1.5 rounded-full hover:bg-brand-100 transition-colors"
          >
            {COUNTRY_FLAGS[country] ?? ''} {country} ({byCountry.get(country)!.length})
          </a>
        ))}
      </div>

      <div className="space-y-10">
        {countries.map(([country, courses]) => {
          const sorted = courses.slice().sort((a, b) => a.annualINR - b.annualINR);
          const shown = sorted.slice(0, ROWS_PER_COUNTRY);

          const cheapestSlug = CHEAPEST_COUNTRY_SLUGS[country];
          const pswSlug = PSW_COUNTRY_SLUGS[country];
          const budgetSlug = BUDGET_COUNTRY_SLUGS[country];
          const cheapestBudgetBand = budgetSlug
            ? BUDGET_BANDS.find(b => getAllRealCourses().filter(c => c.country === country && c.annualINR > 0 && c.annualINR <= b * 100000).length >= BUDGET_MIN_MATCHES)
            : undefined;

          return (
            <div key={country} id={country.toLowerCase().replace(/\s+/g, '-')} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {COUNTRY_FLAGS[country] ?? ''} IELTS {bandLabel} Courses in {country}
                </h2>
                <span className="text-xs text-gray-400">
                  {courses.length} real matches{courses.length > ROWS_PER_COUNTRY ? ` — cheapest ${ROWS_PER_COUNTRY} shown` : ''}
                </span>
              </div>
              {(cheapestSlug || pswSlug || cheapestBudgetBand) && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
                  {cheapestSlug && (
                    <Link href={`/cheapest-universities-${cheapestSlug}`} className="text-xs text-brand-700 hover:underline font-medium">
                      Cheapest Universities in {country} →
                    </Link>
                  )}
                  {cheapestBudgetBand && (
                    <Link href={`/${budgetSlug}-under-${cheapestBudgetBand}-lakh`} className="text-xs text-brand-700 hover:underline font-medium">
                      Study in {country} Under ₹{cheapestBudgetBand}L →
                    </Link>
                  )}
                  {pswSlug && (
                    <Link href={`/courses-with-psw/${pswSlug}`} className="text-xs text-brand-700 hover:underline font-medium">
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
                          <td className="text-right py-2.5 pl-2 text-gray-700">{c.ieltsMin}+</td>
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

      <div className="mt-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">IELTS {bandLabel} — Frequently Asked Questions</h2>
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
        <h2 className="text-xl font-bold mb-2">Not Sure Your IELTS Score Is Enough?</h2>
        <p className="text-blue-200 text-sm mb-4">
          Book a free eligibility check — our counsellors will match your exact IELTS score against real course requirements.
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
