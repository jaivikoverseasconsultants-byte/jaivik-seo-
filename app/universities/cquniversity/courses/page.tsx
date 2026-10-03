import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { cquCoursesReal } from '@/data/cqu-courses-real';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

import { isFeeVerified, verifiedAvgFee } from '@/lib/fee-verification';
import { RATE_TO_INR, courseAnnualINRLakh } from '@/lib/currency';

// Facts come from data/cqu-courses-real.ts (CQUniversity's own handbook). Tuition is a partner-platform
// estimate only, labelled as such — CQU's own current fees could not be read.
const courses = cquCoursesReal;
const MONTH_ORDER = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const intakeMonths = MONTH_ORDER.filter((m) => courses.some((c) => c.intakeMonths.includes(m)));
const mainIntakes = ['March', 'July', 'November'].filter((m) => intakeMonths.includes(m));

export const metadata: Metadata = buildMetadata({
  title: 'CQUniversity Courses — International Intakes',
  description: `CQUniversity — ${courses.length} courses for international students across Queensland, Sydney and Melbourne, with CRICOS codes and intakes from CQU's own handbook. Free admission guidance from Jaivik Overseas Consultants.`,
  path: '/universities/cquniversity/courses',
  keywords: ['CQUniversity courses', 'CQU international', 'Central Queensland University', 'study in Australia'],
});

const levelOrder = ['Bachelor', 'Associate Degree', 'Diploma', 'Master', 'Graduate Diploma', 'Graduate Certificate', 'Doctorate'];
// CQU fees here are estimates only, never averaged into a headline figure.

export default function CoursesPage() {
  const avgFee = verifiedAvgFee(courses as any[], 'annualAUD');
  const groups: Record<string, typeof courses> = {};
  for (const c of courses) (groups[c.level] ??= []).push(c);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How many courses does CQUniversity offer for international students?',
        acceptedAnswer: { '@type': 'Answer', text: `This page lists ${courses.length} CQUniversity courses that international students can start on campus, each with its CRICOS code and intakes from CQU's own handbook.` },
      },
      ...(avgFee > 0 ? [{
        '@type': 'Question',
        name: 'What is the tuition fee at CQUniversity?',
        acceptedAnswer: { '@type': 'Answer', text: `Verified CQUniversity fees average about A$${Math.round(avgFee).toLocaleString('en-US')} a year (≈ ₹${(avgFee * RATE_TO_INR.AUD / 100000).toFixed(1)}L).` },
      }] : []),
      {
        '@type': 'Question',
        name: 'When can I start at CQUniversity?',
        acceptedAnswer: { '@type': 'Answer', text: `CQUniversity runs three terms: Term 1 starts in March, Term 2 in July and Term 3 in November. Not every course takes all three; each course page lists its intakes by campus.` },
      },
    ],
  };

  const courseListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'CQUniversity — Courses for International Students',
    numberOfItems: courses.length,
    itemListElement: courses.slice(0, 5).map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Course',
        name: c.name,
        provider: { '@type': 'CollegeOrUniversity', name: 'CQUniversity' },
        ...(isFeeVerified(c as any) && c.annualAUD > 0 ? { offers: { '@type': 'Offer', price: c.annualAUD, priceCurrency: 'AUD' } } : {}),
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
            <Link href="/universities/cquniversity" className="hover:text-white">CQUniversity</Link> /
            <span className="text-white">Courses</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇦🇺 Queensland, Sydney &amp; Melbourne
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">CQUniversity — International Courses</h1>
              <p className="text-blue-200 text-lg mb-5">
                {courses.length} courses{avgFee > 0 ? ` · Avg A$${Math.round(avgFee / 1000)}K/yr` : ''} · {mainIntakes.join(' & ')} intakes
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Courses', value: courses.length },
                  { label: 'Avg Annual Fee (2027)', value: avgFee > 0 ? `A$${Math.round(avgFee / 1000)}K` : 'On request' },
                  { label: 'Main Intakes', value: mainIntakes.map((m) => m.slice(0, 3)).join(' / ') },
                ].map((s) => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source="cquniversity-courses-index" defaultCountry="Australia" compact />
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
                  {level === 'Bachelor' || level === 'Master' ? `${level}'s Courses` : `${level}s`}
                  <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full font-normal">{lvCourses.length}</span>
                </h2>
                <div className="space-y-3">
                  {[...lvCourses].sort((a, b) => a.name.localeCompare(b.name)).map((c) => (
                    <Link key={c.slug} href={`/universities/cquniversity/courses/${c.slug}`}
                      className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all flex items-center justify-between group">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 group-hover:text-brand-700 text-sm leading-snug">{c.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{c.duration} · {c.intakeMonths.join(', ')} · {c.campus}</p>
                      </div>
                      <div className="ml-4 text-right flex-shrink-0">
                        <p className="text-sm font-bold text-brand-700">{isFeeVerified(c as any) && c.annualAUD > 0 ? `A$${c.annualAUD.toLocaleString('en-US')}/yr` : isFeeVerified(c as any) && c.totalAUD > 0 ? `A$${c.totalAUD.toLocaleString('en-US')} total` : 'Fee on request'}</p>
                        {isFeeVerified(c as any) && c.annualAUD > 0 && <p className="text-xs text-gray-400">≈ ₹{courseAnnualINRLakh(c as any, 1) ?? '0'}L/yr</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          <p className="text-xs text-gray-500">
            CRICOS codes, durations and intakes are from CQUniversity&apos;s own handbook. Tuition is shown on each course page only as a
            partner-platform estimate (not published by the university); confirm the fee with CQUniversity or with us.
          </p>
        </div>

        <div>
          <div className="sticky top-20">
            <LeadForm source="cquniversity-courses-sidebar" defaultCountry="Australia" />
          </div>
        </div>
      </div>
    </>
  );
}
