import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { getAllNursingCourses, classifyLevel, type NursingCourseEntry } from '@/data/university-course-registry';
import { getUniversityBySlug } from '@/data/universities';
import JsonLd from '@/components/JsonLd';

// Real, sourced facts used in the FAQ below — not per-university estimates:
// - NMC (UK) registration: IELTS Academic 7.0 in Listening/Reading/Speaking,
//   6.5 in Writing, or OET grade B (350/300); results valid 2 years.
// - AHPRA/NMBA (Australia) registration: IELTS Academic overall 7.0, with no
//   individual band below 7.0 (updated 23 April 2026); OET/PTE/TOEFL/Cambridge
//   also accepted.
// - Canada: Registered Nurse is NOC 31301, included in the Healthcare and
//   Social Services Express Entry category — eligible for category-based
//   draws (lower CRS cutoffs than general Express Entry).
// These are regulator-set requirements, separate from each course's own
// (lower) admission IELTS threshold shown in the tables below.

const COUNTRY_DISPLAY: Record<string, string> = {
  UK: 'United Kingdom',
  'United Kingdom': 'United Kingdom',
  Australia: 'Australia',
  Canada: 'Canada',
  Ireland: 'Ireland',
  'New Zealand': 'New Zealand',
  USA: 'USA',
};

const COUNTRY_FLAGS: Record<string, string> = {
  'United Kingdom': '🇬🇧',
  Australia: '🇦🇺',
  Canada: '🇨🇦',
  Ireland: '🇮🇪',
  'New Zealand': '🇳🇿',
  USA: '🇺🇸',
};

const REGISTRATION_BODY: Record<string, string> = {
  'United Kingdom': 'Nursing and Midwifery Council (NMC)',
  Australia: 'Nursing and Midwifery Board of Australia (NMBA), via AHPRA',
  Canada: 'Provincial nursing regulator (e.g. College of Nurses of Ontario, BCCNM)',
  Ireland: 'Nursing and Midwifery Board of Ireland (NMBI)',
  'New Zealand': 'Nursing Council of New Zealand',
  USA: 'State Board of Nursing (via NCLEX-RN)',
};

function levelBadge(c: NursingCourseEntry): string {
  return classifyLevel(c.name, '', c.level);
}

export async function generateMetadata(): Promise<Metadata> {
  const all = getAllNursingCourses();
  return buildMetadata({
    title: 'BSc Nursing Abroad — Fees in INR for Indian Students',
    description: `${all.length} real BSc & MSc Nursing programmes abroad for Indian students, with fees converted to INR, IELTS requirements, and direct links — across Australia, UK, Ireland, Canada, New Zealand & USA.`,
    path: '/nursing-abroad',
    keywords: ['BSc nursing fees for Indian students', 'nursing in Australia cost in INR', 'nursing abroad for Indian students', 'MSc nursing abroad', 'IELTS for nursing registration'],
  });
}

export default function NursingAbroadPage() {
  const all = getAllNursingCourses();

  const byCountry = new Map<string, NursingCourseEntry[]>();
  for (const c of all) {
    const display = COUNTRY_DISPLAY[c.country] || c.country;
    if (!byCountry.has(display)) byCountry.set(display, []);
    byCountry.get(display)!.push(c);
  }
  // Sort countries by number of real programmes, descending.
  const countries = Array.from(byCountry.entries()).sort((a, b) => b[1].length - a[1].length);

  const ieltsValues = all.map((c: NursingCourseEntry) => c.ieltsMin).filter((v: number) => v > 0);
  const ieltsMin = Math.min(...ieltsValues);
  const ieltsMax = Math.max(...ieltsValues);

  const feeStatsByCountry = countries.map(([country, courses]) => {
    const fees = courses.map(c => c.annualINR).filter(v => v > 0);
    const lakh = (v: number) => (v / 100000).toFixed(1);
    return {
      country,
      count: courses.length,
      minFeeLakh: fees.length ? lakh(Math.min(...fees)) : null,
      maxFeeLakh: fees.length ? lakh(Math.max(...fees)) : null,
    };
  });

  const faqs = [
    {
      q: 'What IELTS score do I need to study BSc Nursing abroad?',
      a: `Across the ${all.length} real nursing programmes on this page, course entry IELTS requirements range from ${ieltsMin} to ${ieltsMax} overall (check each university's exact requirement in the tables below). This is separate from professional registration after you graduate: the UK's Nursing and Midwifery Council (NMC) requires IELTS Academic 7.0 in Listening, Reading and Speaking with 6.5 in Writing (or OET grade B), and Australia's AHPRA/Nursing and Midwifery Board (NMBA) requires an overall IELTS Academic band of 7.0 with no individual band below 7.0. Course entry and professional registration are two different thresholds — confirm both with the university and the relevant regulator before applying.`,
    },
    {
      q: 'Can I get PR in Australia or Canada after studying nursing?',
      a: `Registered Nurse is classified under NOC 31301 in Canada and is included in the Healthcare and Social Services Express Entry category, which runs category-based draws with lower CRS score cutoffs than general Express Entry rounds. In Australia, nursing occupations have long been included on the skilled occupation lists that support skilled migration visas, in addition to the standard Temporary Graduate (subclass 485) post-study work visa available to eligible graduates. Occupation lists and draw criteria change — confirm current eligibility with a registered migration agent or your Jaivik Overseas counsellor before making study-destination decisions based on PR prospects.`,
    },
    {
      q: 'Which registration body do I need to register with after graduating as a nurse?',
      a: `Registration is handled by a different regulator in each country: the Nursing and Midwifery Council (NMC) in the UK, the Nursing and Midwifery Board of Australia (NMBA) via AHPRA, the Nursing and Midwifery Board of Ireland (NMBI), the Nursing Council of New Zealand, a provincial regulator in Canada (e.g. the College of Nurses of Ontario or BCCNM in British Columbia), and a State Board of Nursing via the NCLEX-RN exam in the USA. Registration requirements (English test scores, competency exams, supervised practice) are separate from — and typically stricter than — a university's course entry requirements.`,
    },
    {
      q: 'How much does BSc Nursing abroad cost in INR for Indian students?',
      a: feeStatsByCountry.filter(s => s.minFeeLakh).map(s =>
        `${s.country}: ₹${s.minFeeLakh}L–₹${s.maxFeeLakh}L per year across ${s.count} real programmes`
      ).join('; ') + '. Costs vary by university and programme level (Bachelor\'s, Master\'s, or postgraduate certificate/diploma) — see the exact fee for each programme in the tables below. These are tuition fees only; living costs, visa fees, and health insurance are additional.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <JsonLd data={faqSchema} />

      <div className="flex items-center gap-2 text-gray-400 text-xs mb-6">
        <Link href="/" className="hover:text-brand-700">Home</Link> /
        <Link href="/courses" className="hover:text-brand-700">Courses</Link> /
        <span>Nursing Abroad</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          BSc Nursing Abroad — Fees in INR for Indian Students
        </h1>
        <p className="text-gray-600 max-w-3xl">
          {all.length} real Bachelor&apos;s and Master&apos;s nursing programmes across {countries.length} countries, crawled directly from
          each university&apos;s own course pages — with tuition fees converted to INR, IELTS requirements, and a direct link to every
          programme&apos;s full course page.
        </p>
      </div>

      {/* Quick country nav */}
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

      {/* Country sections */}
      <div className="space-y-10">
        {countries.map(([country, courses]) => (
          <div key={country} id={country.toLowerCase().replace(/\s+/g, '-')} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold text-gray-900">
                {COUNTRY_FLAGS[country] ?? ''} Nursing Programs in {country}
              </h2>
              <span className="text-xs text-gray-400">{courses.length} real programmes</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Register to practice with: {REGISTRATION_BODY[country] ?? 'the relevant national nursing regulator'}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 pr-3 font-semibold text-gray-700">Programme</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">University</th>
                    <th className="text-right py-2 px-2 font-semibold text-gray-700">Level</th>
                    <th className="text-right py-2 px-2 font-semibold text-gray-700">Fee/yr (INR)</th>
                    <th className="text-right py-2 pl-2 font-semibold text-gray-700">IELTS</th>
                  </tr>
                </thead>
                <tbody>
                  {courses
                    .slice()
                    .sort((a: NursingCourseEntry, b: NursingCourseEntry) => a.annualINR - b.annualINR)
                    .map((c: NursingCourseEntry) => {
                      const uni = getUniversityBySlug(c.universitySlug);
                      return (
                        <tr key={`${c.universitySlug}-${c.slug}`} className="border-b border-gray-100 hover:bg-brand-50">
                          <td className="py-2.5 pr-3">
                            <Link
                              href={`/universities/${c.universitySlug}/courses/${c.slug}`}
                              className="text-brand-700 hover:underline font-medium"
                            >
                              {c.name}
                            </Link>
                          </td>
                          <td className="py-2.5 px-2 text-gray-700">{uni?.name ?? c.universitySlug}</td>
                          <td className="text-right py-2.5 px-2">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-100 text-brand-700">{levelBadge(c)}</span>
                          </td>
                          <td className="text-right py-2.5 px-2 text-gray-700">
                            {c.annualINR > 0 ? `₹${(c.annualINR / 100000).toFixed(1)}L` : '—'}
                          </td>
                          <td className="text-right py-2.5 pl-2 text-gray-700">{c.ieltsMin > 0 ? `${c.ieltsMin}+` : '—'}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="mt-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Nursing Abroad — Frequently Asked Questions</h2>
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
        <h2 className="text-xl font-bold mb-2">Planning to Study Nursing Abroad?</h2>
        <p className="text-blue-200 text-sm mb-4">
          Book a free counselling session — our advisors help Indian nursing students with university shortlisting, IELTS/OET
          preparation, and visa guidance.
        </p>
        <Link href="/book-counselling" className="btn-gold inline-block">
          Get Free Guidance →
        </Link>
      </div>
    </div>
  );
}
