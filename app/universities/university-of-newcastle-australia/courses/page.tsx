import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { newcastleCoursesReal } from '@/data/newcastle-courses-real';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

// Facts come ONLY from a partner-platform list — see data/newcastle-courses-real.ts's header comment.
// No official University of Newcastle source is reachable (Cloudflare-protected degree pages,
// Googlebot-only handbook robots.txt, and this project's own network policy refuses newcastle.edu.au).
// Every figure on this page and the course pages below — fee, duration, intake — is an unverified
// estimate, and no CRICOS code or post-study-work claim is shown anywhere, unlike every other
// Australia Bucket-A university.
const courses = newcastleCoursesReal;

export const metadata: Metadata = buildMetadata({
  title: 'University of Newcastle Courses — Fee & Intake Estimates',
  description: `University of Newcastle — ${courses.length} courses with partner-platform fee, duration and intake estimates (not independently verified). Free admission guidance from Jaivik Overseas Consultants.`,
  path: '/universities/university-of-newcastle-australia/courses',
  keywords: ['University of Newcastle courses', 'UON Australia', 'study in Australia'],
});

const levelOrder = ['Bachelor', 'Associate Degree', 'Diploma', 'Master', 'Graduate Diploma', 'Graduate Certificate', 'Doctorate'];

export default function CoursesPage() {
  const groups: Record<string, typeof courses> = {};
  for (const c of courses) (groups[c.level] ??= []).push(c);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How many courses does the University of Newcastle offer for international students?',
        acceptedAnswer: { '@type': 'Answer', text: `This page lists ${courses.length} University of Newcastle programmes. Fee, duration and intake are shown as partner-network estimates; our counsellors confirm the exact figures and CRICOS eligibility with the university directly as part of a free consultation before you apply.` },
      },
      {
        '@type': 'Question',
        name: 'Are the fees on this page confirmed by the University of Newcastle?',
        acceptedAnswer: { '@type': 'Answer', text: `Not yet on this page — they're partner-network estimates. Jaivik Overseas Consultants verifies the current fee, intake and CRICOS status with the University of Newcastle directly for every student we work with, at no charge.` },
      },
    ],
  };

  return (
    <>
      <JsonLd data={faqSchema} />

      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/university-of-newcastle-australia" className="hover:text-white">University of Newcastle</Link> /
            <span className="text-white">Courses</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇦🇺 Newcastle &amp; Sydney, New South Wales
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">University of Newcastle — Courses</h1>
              <p className="text-blue-200 text-lg mb-5">{courses.length} courses · fee &amp; intake estimates, confirmed free when you talk to us</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Courses', value: courses.length },
                  { label: 'Fees', value: 'Estimates shown' },
                  { label: 'CRICOS check', value: 'Free with us' },
                ].map((s) => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source="university-of-newcastle-australia-courses-index" defaultCountry="Australia" compact />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-10">
          <div className="rounded-2xl p-4 border border-amber-200 bg-amber-50 text-sm text-amber-900 flex flex-wrap items-center justify-between gap-3">
            <span>
              Fee, duration and intake below are partner-network estimates — the University of Newcastle&apos;s own pages aren&apos;t
              publicly readable right now. Book a free session and we&apos;ll confirm the exact numbers, and CRICOS eligibility, with
              the university before you apply.
            </span>
            <Link href="/book-counselling" className="btn-gold whitespace-nowrap text-sm px-4 py-2">Get it confirmed →</Link>
          </div>
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
                    <Link key={c.slug} href={`/universities/university-of-newcastle-australia/courses/${c.slug}`}
                      className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all flex items-center justify-between group">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 group-hover:text-brand-700 text-sm leading-snug">{c.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{c.duration} · {c.intakeMonths.join(', ') || 'Rolling intake'}</p>
                      </div>
                      <div className="ml-4 text-right flex-shrink-0">
                        <p className="text-sm font-bold text-brand-700">
                          ~A${c.kcEstimate.tuitionMinAUD.toLocaleString('en-US')}{c.kcEstimate.tuitionMaxAUD !== c.kcEstimate.tuitionMinAUD ? `–${c.kcEstimate.tuitionMaxAUD.toLocaleString('en-US')}` : ''}/yr
                        </p>
                        <p className="text-xs text-gray-400">estimate only</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          <p className="text-xs text-gray-500">
            Fee, duration and intake are partner-network estimates — book a free session and we confirm them with the university for you.
          </p>
        </div>

        <div>
          <div className="sticky top-20">
            <LeadForm source="university-of-newcastle-australia-courses-sidebar" defaultCountry="Australia" />
          </div>
        </div>
      </div>
    </>
  );
}
