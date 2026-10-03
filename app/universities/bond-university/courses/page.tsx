import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { bondUniversityCourses, type BondUniversityCourse } from '@/data/bond-university-courses';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

import { isFeeVerified } from '@/lib/fee-verification';

// Every figure on this page comes from data/bond-university-courses.ts, which takes them from each
// programme's own Bond page — nothing here is a house constant. Bond publishes semester fees and
// programme totals, not annual fees, so this page quotes those and never an "average per year".
const courses = bondUniversityCourses;
const intakeMonths = ['January', 'May', 'September'].filter((m) => courses.some((c) => c.intakeMonths.includes(m)));
const bachelorSemester = Array.from(new Set(
  courses.filter((c) => c.level === 'Bachelor' && isFeeVerified(c) && c.semesterAUD && c.feeYear === 2026).map((c) => c.semesterAUD as number),
));

export const metadata: Metadata = buildMetadata({
  title: 'Bond University Courses — Fees & Intakes',
  description: `Bond University, Gold Coast — ${courses.length} programmes for international students, each priced from its own Bond programme page. ${intakeMonths.join(', ')} intakes. Free admission guidance from Jaivik Overseas Consultants.`,
  path: '/universities/bond-university/courses',
  keywords: ['Bond University courses', 'Bond University fees', 'Bond University Gold Coast', 'study in Australia'],
});

const levelOrder = ['Bachelor', 'Master', 'Doctorate', 'Diploma'];
const levelHeading: Record<string, string> = {
  Bachelor: "Bachelor's Degrees", Master: "Master's Degrees", Doctorate: 'Doctorates', Diploma: 'Pathway Diplomas',
};

function listFee(c: BondUniversityCourse): string {
  if (!isFeeVerified(c) || !c.totalAUD) return 'Fee on request';
  if (c.semesterAUD) return `A$${c.semesterAUD.toLocaleString('en-US')}/semester`;
  if (c.annualAUD > 0) return `A$${c.annualAUD.toLocaleString('en-US')}/yr`;
  return `A$${c.totalAUD.toLocaleString('en-US')} total`;
}

export default function CoursesPage() {
  const groups: Record<string, BondUniversityCourse[]> = {};
  for (const c of courses) (groups[c.level] ??= []).push(c);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How many programmes does Bond University offer for international students?',
        acceptedAnswer: { '@type': 'Answer', text: `This page lists ${courses.length} Bond University programmes with an upcoming Gold Coast intake, each with its fee from its own Bond programme page.` },
      },
      ...(bachelorSemester.length === 1 ? [{
        '@type': 'Question',
        name: 'What is the tuition fee at Bond University?',
        acceptedAnswer: { '@type': 'Answer', text: `For students starting in 2026, Bond lists its bachelor's degrees at A$${bachelorSemester[0].toLocaleString('en-US')} per semester for international students. Bond teaches three semesters a year, so a two-year bachelor's is six semesters; each programme page gives Bond's own total. Master's fees vary by programme.` },
      }] : []),
      {
        '@type': 'Question',
        name: 'When can I start at Bond University?',
        acceptedAnswer: { '@type': 'Answer', text: `Bond runs three semesters a year, starting in ${intakeMonths.join(', ')}. Not every programme starts in every semester; each programme page lists its own intakes.` },
      },
    ],
  };

  const courseListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Bond University — Programmes for International Students',
    numberOfItems: courses.length,
    itemListElement: courses.slice(0, 5).map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Course',
        name: c.name,
        provider: { '@type': 'CollegeOrUniversity', name: 'Bond University' },
        educationalLevel: c.studyLevel,
      },
    })),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={courseListSchema} />

      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/bond-university" className="hover:text-white">Bond University</Link> /
            <span className="text-white">Courses</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇦🇺 Gold Coast, Queensland, Australia
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Bond University — International Programmes</h1>
              <p className="text-blue-200 text-lg mb-5">
                {courses.length} programmes · {intakeMonths.join(', ')} intakes · three semesters a year
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Programmes', value: courses.length },
                  { label: "Bachelor's per Semester (2026)", value: bachelorSemester.length === 1 ? `A$${Math.round(bachelorSemester[0] / 100) / 10}K` : 'Varies' },
                  { label: 'Intakes', value: intakeMonths.map((m) => m.slice(0, 3)).join(' / ') },
                ].map((s) => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source="bond-university-courses-index" defaultCountry="Australia" compact />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-10">
          {Object.entries(groups)
            .sort(([a], [b]) => levelOrder.indexOf(a) - levelOrder.indexOf(b))
            .map(([level, lvCourses]) => (
              <div key={level}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  {levelHeading[level] ?? level}
                  <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full font-normal">{lvCourses.length}</span>
                </h2>
                <div className="space-y-3">
                  {[...lvCourses].sort((a, b) => a.name.localeCompare(b.name)).map((c) => (
                    <Link key={c.slug} href={`/universities/bond-university/courses/${c.slug}`}
                      className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all flex items-center justify-between group">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 group-hover:text-brand-700 text-sm leading-snug">{c.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{c.duration} · {c.intakeMonths.join(', ')} · {c.campus}</p>
                      </div>
                      <div className="ml-4 text-right flex-shrink-0">
                        <p className="text-sm font-bold text-brand-700">{listFee(c)}</p>
                        {isFeeVerified(c) && c.totalAUD > 0 && (c.semesterAUD || c.annualAUD > 0) && (
                          <p className="text-xs text-gray-400">A${c.totalAUD.toLocaleString('en-US')} total</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          <p className="text-xs text-gray-500">
            Fees: Bond University&apos;s indicative international tuition from each programme&apos;s own fee page — per semester
            and for the whole programme, for students commencing in 2026 (2027 for programmes whose first intake is 2027).
            Bond teaches three semesters a year, and charges at the rate for the year of enrolment.
          </p>
        </div>

        <div>
          <div className="sticky top-20">
            <LeadForm source="bond-university-courses-sidebar" defaultCountry="Australia" />
          </div>
        </div>
      </div>
    </>
  );
}
