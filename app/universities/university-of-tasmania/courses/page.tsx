import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { utasCoursesReal } from '@/data/utas-courses-real';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

import { isFeeVerified, verifiedAvgFee } from '@/lib/fee-verification';
import { RATE_TO_INR, courseAnnualINRLakh } from '@/lib/currency';

// Every figure on this page comes from data/utas-courses-real.ts, which takes them from each course's
// own UTAS page — nothing here is a house constant.
const courses = utasCoursesReal;
const MONTH_ORDER = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const intakeMonths = MONTH_ORDER.filter((m) => courses.some((c) => c.intakeMonths.includes(m)));
const mainIntakes = ['February', 'July'].filter((m) => intakeMonths.includes(m));

export const metadata: Metadata = buildMetadata({
  title: 'University of Tasmania Courses — 2027 International Fees',
  description: `University of Tasmania — ${courses.length} courses for international students in Hobart, Launceston and beyond, each priced from UTAS's own 2027 international fees. Free admission guidance from Jaivik Overseas Consultants.`,
  path: '/universities/university-of-tasmania/courses',
  keywords: ['University of Tasmania courses', 'UTAS fees', 'UTAS international', 'study in Tasmania'],
});

const levelOrder = ['Bachelor', 'Associate Degree', 'Diploma', 'Master', 'Graduate Diploma', 'Graduate Certificate', 'Doctorate'];

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
        name: 'How many courses does the University of Tasmania offer for international students?',
        acceptedAnswer: { '@type': 'Answer', text: `This page lists ${courses.length} UTAS courses that international students can take on campus, each with its 2027 international fee and CRICOS code from UTAS's own course page. Courses UTAS offers internationally only online are not listed.` },
      },
      ...(avgFee > 0 ? [{
        '@type': 'Question',
        name: 'What is the tuition fee at the University of Tasmania?',
        acceptedAnswer: { '@type': 'Answer', text: `UTAS's 2027 international fees for these courses average about A$${Math.round(avgFee).toLocaleString('en-US')} a year (≈ ₹${(avgFee * RATE_TO_INR.AUD / 100000).toFixed(1)}L) for a standard full-time year, including the Student Services and Amenities Fee.` },
      }] : []),
      {
        '@type': 'Question',
        name: 'When can I start at the University of Tasmania?',
        acceptedAnswer: { '@type': 'Answer', text: `UTAS courses start in ${mainIntakes.join(' or ')} (Semester 1 begins 22 February 2027, Semester 2 on 5 July 2027); not every course takes both. Each course page lists its intakes by campus.` },
      },
    ],
  };

  const courseListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'University of Tasmania — Courses for International Students',
    numberOfItems: courses.length,
    itemListElement: courses.slice(0, 5).map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Course',
        name: c.name,
        provider: { '@type': 'CollegeOrUniversity', name: 'University of Tasmania' },
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
            <Link href="/universities/university-of-tasmania" className="hover:text-white">University of Tasmania</Link> /
            <span className="text-white">Courses</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇦🇺 Hobart, Launceston &amp; Cradle Coast, Tasmania
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">University of Tasmania — International Courses</h1>
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
              <LeadForm source="utas-courses-index" defaultCountry="Australia" compact />
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
                    <Link key={c.slug} href={`/universities/university-of-tasmania/courses/${c.slug}`}
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
            Fees: UTAS&apos;s 2027 annual international student tuition fees, from each course&apos;s own page, including the Student
            Services and Amenities Fee. Only courses with an on-campus offering and a CRICOS code are listed.
          </p>
        </div>

        <div>
          <div className="sticky top-20">
            <LeadForm source="utas-courses-sidebar" defaultCountry="Australia" />
          </div>
        </div>
      </div>
    </>
  );
}
