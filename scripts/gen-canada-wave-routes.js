// Generates app/universities/<slug>/courses/page.tsx + [slug]/page.tsx for the Canada-wave
// universities that are in the course registry but had no course route (their course URLs
// were caught by vercel.json redirects to the profile page since the 2026-07-07 prune).
//
// Based on the Dalhousie route, with three deliberate differences — every claim is gated on
// the data's own provenance fields instead of being hardcoded:
//   * Fees     — the index card and every fee surface go through lib/fee-verification, so an
//                unverified placeholder never prints (the legacy index template printed
//                annualCAD unconditionally). feeBasis is shown next to verified figures.
//   * English  — each test is shown only if the university's own English-requirements page
//                (data/wave-canada/institution-english.json) published a score for it; house
//                defaults are never presented as a requirement, and institution-wide values are
//                labelled as institution-wide.
//   * Cost     — the multi-year total is omitted when the fee is a first-year figure (Waterloo),
//                since first-year × years is not what the university published.
//   * No hardcoded QS rank, intake months, IELTS floor or PGWP badge. Colleges get the IRCC
//                field-of-study caveat on PGWP.
//
// Usage: node scripts/gen-canada-wave-routes.js
const fs = require('fs');
const path = require('path');

// englishKey names the university in data/wave-canada/institution-english.json. A test is shown
// only if that page published a score for it: englishScope is per ROW, but a row can mix a
// published IELTS with a house-default PTE (Algonquin), so the gate has to be per TEST.
const UNIS = [
  { slug: 'york-university', name: 'York University', short: 'York', city: 'Toronto', province: 'Ontario', sameAs: 'https://www.yorku.ca', varName: 'yorkuCourses', getFn: 'getYorkuCourseBySlug', dataFile: 'yorku-courses', lead: 'yorku', college: false, englishKey: 'York University' },
  { slug: 'university-of-guelph', name: 'University of Guelph', short: 'Guelph', city: 'Guelph', province: 'Ontario', sameAs: 'https://www.uoguelph.ca', varName: 'guelphCourses', getFn: 'getGuelphCourseBySlug', dataFile: 'guelph-courses', lead: 'guelph', college: false, englishKey: 'University of Guelph' },
  { slug: 'toronto-metropolitan-university', name: 'Toronto Metropolitan University', short: 'TMU', city: 'Toronto', province: 'Ontario', sameAs: 'https://www.torontomu.ca', varName: 'tmuCourses', getFn: 'getTmuCourseBySlug', dataFile: 'tmu-courses', lead: 'tmu', college: false, englishKey: 'Toronto Metropolitan' },
  { slug: 'university-of-new-brunswick', name: 'University of New Brunswick', short: 'UNB', city: 'Fredericton', province: 'New Brunswick', sameAs: 'https://www.unb.ca', varName: 'unbCourses', getFn: 'getUnbCourseBySlug', dataFile: 'unb-courses', lead: 'unb', college: false, englishKey: 'Univ of New Brunswick' },
  { slug: 'algonquin-college', name: 'Algonquin College', short: 'Algonquin', city: 'Ottawa', province: 'Ontario', sameAs: 'https://www.algonquincollege.com', varName: 'algonquinRealCourses', getFn: 'getAlgonquinRealCourseBySlug', dataFile: 'algonquin-courses', lead: 'algonquin', college: true, englishKey: 'Algonquin College' },
  { slug: 'durham-college', name: 'Durham College', short: 'Durham College', city: 'Oshawa', province: 'Ontario', sameAs: 'https://durhamcollege.ca', varName: 'durhamCourses', getFn: 'getDurhamCourseBySlug', dataFile: 'durham-courses', lead: 'durham', college: true, englishKey: 'Durham College' },
  // Waterloo already has a route (for waterloo-courses.ts, 92 graduate programmes). Only the
  // course view is generated; the existing page delegates waterlooug-* slugs to it.
  { slug: 'university-of-waterloo', name: 'University of Waterloo', short: 'Waterloo', city: 'Waterloo', province: 'Ontario', sameAs: 'https://uwaterloo.ca', varName: 'waterlooUgCourses', getFn: 'getWaterlooUgCourseBySlug', dataFile: 'waterlooug-courses', lead: 'waterloo-ug', college: false, englishKey: 'University of Waterloo', viewOnly: true, viewFile: 'ug-course-view.tsx' },
];

const ENGLISH = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'wave-canada', 'institution-english.json'), 'utf8'));
function publishedTests(u) {
  const e = ENGLISH[u.englishKey];
  if (!e) throw new Error(`no institution-english entry for ${u.englishKey}`);
  if (e.resolved === false || e.doNotPublish) return { ielts: false, toefl: false, pte: false };
  return { ielts: e.ielts.length > 0, toefl: e.toefl.length > 0, pte: e.pte.length > 0 };
}

// Shared helpers emitted into each file. Kept inline (not a new lib module) to match how the
// existing per-university routes are self-contained.
const HELPERS = (u) => {
  // Sanity: every generated university must have a publication record, since the pages below read
  // it through lib/english-verification rather than carrying their own copy of the gate.
  publishedTests(u);
  return '';
};

function indexPage(u) {
  return `import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { ${u.varName} } from '@/data/${u.dataFile}';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';
import { feeDisplay, isFeeVerified, verifiedAvgFee } from '@/lib/fee-verification';
import { publishedEnglishTests } from '@/lib/english-verification';
import { RATE_TO_INR, courseAnnualINRLakh } from '@/lib/currency';

// Generated by scripts/gen-canada-wave-routes.js — edit the generator, not this file.
${HELPERS(u)}
const UNIVERSITY_SLUG = '${u.slug}';

export const metadata: Metadata = buildMetadata({
  title: '${u.name} Courses — Fees & Requirements 2026',
  description: \`${u.name} — \${(${u.varName} as unknown as any[]).length} programmes for international students in ${u.city}, Canada. Free admission guidance from Jaivik Overseas Consultants.\`,
  path: '/universities/${u.slug}/courses',
  keywords: ['${u.short} courses', '${u.name} international', 'study in Canada', '${u.city}'],
});

const levelOrder = ['Bachelor', 'Honours Bachelor', 'Advanced Diploma', 'Diploma', 'Certificate', 'Graduate Certificate', 'Masters', 'Master', 'Graduate Diploma', 'PhD'];

export default function CoursesPage() {
  const courses = ${u.varName} as unknown as any[];
  const groups: Record<string, any[]> = {};
  courses.forEach((c) => { (groups[c.level] = groups[c.level] || []).push(c); });
  const avgFee = verifiedAvgFee(courses, 'annualCAD');
  const verified = courses.filter((c) => isFeeVerified(c) && Number(c.annualUSD) > 0);
  const avgFeeUSD = verified.length ? Math.round(verified.reduce((s, c) => s + Number(c.annualUSD), 0) / verified.length) : 0;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How many programmes does ${u.name} offer for international students?',
        acceptedAnswer: { '@type': 'Answer', text: \`${u.name} lists \${courses.length} programmes in our course finder, each linked to its official page.\` },
      },
      ...(avgFeeUSD > 0 ? [{
        '@type': 'Question',
        name: 'What is the average international tuition at ${u.name}?',
        acceptedAnswer: { '@type': 'Answer', text: \`Across the \${verified.length} programmes where ${u.name} publishes an international fee, the average is about \${avgFeeUSD.toLocaleString()} USD (≈ ₹\${(avgFeeUSD * RATE_TO_INR.USD / 100000).toFixed(1)}L) a year.\` },
      }] : []),
      {
        '@type': 'Question',
        name: 'How can Indian students apply to ${u.name}?',
        acceptedAnswer: { '@type': 'Answer', text: 'Indian students can apply to ${u.name} through Jaivik Overseas Consultants — free application guidance, SOP writing, and visa assistance included.' },
      },
    ],
  };

  const courseListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '${u.name} — Courses for International Students',
    numberOfItems: courses.length,
    itemListElement: courses.slice(0, 5).map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Course',
        name: c.name,
        provider: { '@type': 'CollegeOrUniversity', name: '${u.name}' },
        ...(isFeeVerified(c) && Number(c.annualUSD) > 0 ? { offers: { '@type': 'Offer', price: Number(c.annualUSD), priceCurrency: 'USD' } } : {}),
        educationalLevel: c.level ?? c.studyLevel,
      },
    })),
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: '${u.name}',
    sameAs: '${u.sameAs}',
    address: { '@type': 'PostalAddress', addressLocality: '${u.city}', addressRegion: '${u.province}', addressCountry: 'CA' },
  };

  return (
    <>
      <JsonLd data={schema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={courseListSchema} />

      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/country/canada" className="hover:text-white">Canada</Link> /
            <Link href="/universities/${u.slug}" className="hover:text-white">${u.short}</Link> /
            <span className="text-white">Courses</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇨🇦 ${u.city}, ${u.province}, Canada
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">${u.name} — International Courses</h1>
              <p className="text-blue-200 text-lg mb-5">
                {courses.length} programmes{avgFee > 0 ? \` · average published fee CAD $\${avgFee.toLocaleString()}/yr\` : ''}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Programmes', value: String(courses.length) },
                  { label: 'Published intl. fees', value: \`\${verified.length} of \${courses.length}\` },
                  { label: 'Avg annual fee', value: avgFee > 0 ? \`$\${Math.round(avgFee / 1000)}K CAD\` : 'On request' },
                ].map((s) => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source="${u.lead}-courses-index" defaultCountry="Canada" compact />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-10">
          {Object.entries(groups)
            .sort(([a], [b]) => (levelOrder.indexOf(a) === -1 ? 99 : levelOrder.indexOf(a)) - (levelOrder.indexOf(b) === -1 ? 99 : levelOrder.indexOf(b)))
            .map(([level, lvCourses]) => (
            <div key={level}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                {level} Programmes
                <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full font-normal">{lvCourses.length}</span>
              </h2>
              <div className="space-y-3">
                {lvCourses.slice().sort((a, b) => a.name.localeCompare(b.name)).map((c) => (
                  <Link key={c.slug} href={\`/universities/${u.slug}/courses/\${c.slug}\`}
                    className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all flex items-center justify-between group">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-brand-700 text-sm leading-snug">{c.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{c.duration} · {c.campus}</p>
                    </div>
                    <div className="ml-4 text-right flex-shrink-0">
                      <p className="text-sm font-bold text-brand-700">{isFeeVerified(c) ? \`\${feeDisplay(c, c.annualCAD, 'CAD')}/yr\` : 'Fee on request'}</p>
                      {isFeeVerified(c) && <p className="text-xs text-gray-400">≈ ₹{courseAnnualINRLakh(c, 1) ?? '0'}L/yr</p>}
                      {publishedEnglishTests(UNIVERSITY_SLUG, c as never).some((t) => t.label === 'IELTS Academic') && <p className="text-xs text-gray-500">IELTS {c.ieltsMin}+</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="sticky top-20 space-y-5">
            <LeadForm source="${u.lead}-courses-sidebar" defaultCountry="Canada" />
          </div>
        </div>
      </div>
    </>
  );
}
`;
}

function courseView(u) {
  const pgwpNote = u.college
    ? "College programmes qualify for a PGWP only if the programme is in an eligible field of study (IRCC rule since November 2024). We confirm eligibility for this specific programme during counselling."
    : "Graduates of eligible programmes at designated learning institutions can apply for a Post-Graduation Work Permit. Its length depends on the length of the programme.";
  return `import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ${u.varName}, ${u.getFn} } from '@/data/${u.dataFile}';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';
import CourseRichContent from '@/components/CourseRichContent';
import { showOnCoursePage } from '@/lib/course-field-variance';
import { publishedEnglishTests, englishOnRequestNote, englishScopeNote } from '@/lib/english-verification';
import { feeDisplay, feeDisplayINRLakh, isFeeVerified, feeSentenceINR, titleFeeFragment } from '@/lib/fee-verification';
import { RATE_TO_INR, courseAnnualINRLakh } from '@/lib/currency';

// Generated by scripts/gen-canada-wave-routes.js — edit the generator, not this file.
${HELPERS(u)}
const UNIVERSITY_SLUG = '${u.slug}';

export function courseParams() {
  return (${u.varName} as unknown as any[]).map((c) => ({ slug: c.slug }));
}

export async function courseMetadata(slug: string): Promise<Metadata> {
  const course = ${u.getFn}(slug) as any;
  if (!course) return {};
  const english = publishedEnglishTests(UNIVERSITY_SLUG, course as never).some((t) => t.label === 'IELTS Academic') ? \` IELTS \${course.ieltsMin}+.\` : '';
  return buildMetadata({
    title: \`\${course.name} at ${u.name}\`,
    description: \`\${course.name} at ${u.name}, ${u.city}\${feeSentenceINR(course, course.annualINR)}\${english} Apply with Jaivik Overseas — 13 years expertise, 99% visa success.\`,
    path: \`/universities/${u.slug}/courses/\${slug}\`,
    keywords: [course.name, '${u.short}', '${u.name}', 'study in Canada', course.level],
  });
}

export default async function CourseView({ slug }: { slug: string }) {
  const course = ${u.getFn}(slug) as any;
  if (!course) notFound();

  const verified = isFeeVerified(course);
  const feeINRLakh = courseAnnualINRLakh(course, 1) ?? '0';
  const years = course.durationYears || 0;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    provider: { '@type': 'CollegeOrUniversity', name: '${u.name}', sameAs: '${u.sameAs}' },
    courseMode: 'full-time',
    educationalLevel: course.studyLevel,
    ...(years > 0 ? { timeRequired: \`P\${years}Y\` } : {}),
    url: course.url,
  };

  return (
    <>
      <JsonLd data={schema} />

      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4 flex-wrap">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/country/canada" className="hover:text-white">Canada</Link> /
            <Link href="/universities/${u.slug}" className="hover:text-white">${u.short}</Link> /
            <Link href="/universities/${u.slug}/courses" className="hover:text-white">Courses</Link> /
            <span className="text-white">{course.name}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇨🇦 ${u.name} · ${u.city}, Canada
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.name} at ${u.name} — {titleFeeFragment(course, course.annualINR)}Requirements for Indian Students</h1>
              <p className="text-blue-200 text-lg mb-5">{course.level} · {course.duration} · {course.campus}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Annual Fee (CAD)', value: feeDisplay(course, course.annualCAD, 'CAD') },
                  { label: 'Fee in INR', value: feeDisplayINRLakh(course, feeINRLakh, '/yr') },
                  ...(publishedEnglishTests(UNIVERSITY_SLUG, course as never).some((t) => t.label === 'IELTS Academic') && showOnCoursePage(UNIVERSITY_SLUG, 'ieltsMin') ? [{ label: 'IELTS Minimum', value: \`\${course.ieltsMin}+\` }] : []),
                  { label: 'Duration', value: course.duration },
                ].map((s) => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source={\`${u.lead}-course-\${slug}\`} defaultCountry="Canada" compact />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Course Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Qualification', value: course.level },
                { label: 'Duration', value: course.duration },
                ...(showOnCoursePage(UNIVERSITY_SLUG, 'campus') ? [{ label: 'Campus', value: course.campus }] : []),
                ...(showOnCoursePage(UNIVERSITY_SLUG, 'intakeMonths') && course.intakeMonths?.length ? [{ label: 'Intakes', value: course.intakeMonths.join(' & ') }] : []),
                { label: 'Annual Tuition (CAD)', value: feeDisplay(course, course.annualCAD, 'CAD') },
                { label: 'Annual Tuition (USD)', value: feeDisplay(course, course.annualUSD, 'USD') },
              ].map((f) => (
                <div key={f.label} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{f.value}</p>
                </div>
              ))}
            </div>
            {verified && course.feeBasis && (
              <p className="text-xs text-gray-500 mt-4">
                Fee basis: {course.feeBasis}.{' '}
                {course.feeSourceUrl && <a href={course.feeSourceUrl} target="_blank" rel="noopener noreferrer" className="text-brand-700 hover:underline">Source ↗</a>}
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">English Language Requirements</h2>
            {publishedEnglishTests(UNIVERSITY_SLUG, course as never).length > 0 ? (
              <>
                <div className="grid grid-cols-3 gap-4">
                  {publishedEnglishTests(UNIVERSITY_SLUG, course as never).map((e) => (
                    <div key={e.label} className="bg-blue-50 rounded-xl p-4 text-center">
                      <p className="text-xl font-bold text-brand-700">{e.value}+</p>
                      <p className="text-xs font-semibold text-gray-700 mt-1">{e.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">{englishScopeNote(UNIVERSITY_SLUG, course as never)}</p>
              </>
            ) : (
              <p className="text-sm text-gray-600">
                ${u.name} doesn’t publish a single English score that applies to this programme.
                Ask us and we’ll confirm the IELTS, TOEFL or PTE score you need before you apply.
              </p>
            )}
          </div>

          {verified && years > 0 && !/first year/i.test(course.feeBasis || '') && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Estimated Cost of Study (Indian Students)</h2>
              <div className="space-y-3">
                {[
                  { label: \`Tuition × \${years} year\${years !== 1 ? 's' : ''}\`, value: \`$\${course.totalCAD.toLocaleString()} CAD\`, highlight: true },
                  { label: \`Living cost estimate × \${years} year\${years !== 1 ? 's' : ''}\`, value: \`$\${(course.livingCostCAD * years).toLocaleString()} CAD\` },
                  { label: 'Total estimate', value: \`$\${(course.totalCAD + course.livingCostCAD * years).toLocaleString()} CAD\`, highlight: true },
                  { label: 'In Indian Rupees (₹)', value: \`₹\${((course.totalCAD + course.livingCostCAD * years) * RATE_TO_INR.CAD / 100000).toFixed(1)} Lakh\`, highlight: true },
                ].map((r) => (
                  <div key={r.label} className={\`flex justify-between items-center p-3 rounded-xl \${r.highlight ? 'bg-brand-50 font-bold' : 'bg-gray-50'}\`}>
                    <span className="text-sm text-gray-700">{r.label}</span>
                    <span className={\`text-sm \${r.highlight ? 'text-brand-700' : 'text-gray-900'}\`}>{r.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">Tuition can rise in later years. Living cost is our estimate, not a university figure.</p>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Study Permit &amp; Post-Graduation Work</h2>
            <p className="text-sm text-gray-700">${pgwpNote}</p>
          </div>

          <CourseRichContent course={course} universityName="${u.name}" universitySlug="${u.slug}" />

          <div className="bg-brand-700 rounded-2xl p-6 text-white text-center">
            <h2 className="text-xl font-bold mb-2">Interested in {course.name}?</h2>
            <p className="text-blue-200 text-sm mb-4">Book a free counselling session. Our Canada admissions advisors help Indian students every step of the way.</p>
            <Link href="/book-counselling" className="btn-gold inline-block">Get Free Guidance →</Link>
          </div>
        </div>

        <div className="space-y-5">
          <div className="sticky top-20">
            <LeadForm source={\`${u.lead}-course-\${slug}-sidebar\`} defaultCountry="Canada" />
            <div className="mt-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Related Links</h3>
              <div className="space-y-2">
                <a href={course.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-brand-700 hover:underline">Official Course Page ↗</a>
                <Link href="/universities/${u.slug}/courses" className="block text-sm text-brand-700 hover:underline">All ${u.short} Courses →</Link>
                <Link href="/universities/country/canada" className="block text-sm text-brand-700 hover:underline">Study in Canada Guide →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
`;
}

// The standalone route is the course view in the same file (lib/fee-verification is imported
// where the fees are printed, which is what `npm run audit:fees` checks), with the view's helper
// exports made module-private — Next.js rejects unknown named exports from a page file.
function detailPage(u) {
  return courseView(u)
    .replace('export function courseParams()', 'function courseParams()')
    .replace('export async function courseMetadata(', 'async function courseMetadata(')
    .replace('export default async function CourseView(', 'async function CourseView(') + `
export async function generateStaticParams() {
  return courseParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return courseMetadata(slug);
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CourseView slug={slug} />;
}
`;
}

for (const u of UNIS) {
  const dir = path.join(__dirname, '..', 'app', 'universities', u.slug, 'courses');
  fs.mkdirSync(path.join(dir, '[slug]'), { recursive: true });
  if (u.viewOnly) {
    fs.writeFileSync(path.join(dir, '[slug]', u.viewFile), courseView(u));
  } else {
    fs.writeFileSync(path.join(dir, 'page.tsx'), indexPage(u));
    fs.writeFileSync(path.join(dir, '[slug]', 'page.tsx'), detailPage(u));
    const stale = path.join(dir, '[slug]', 'course-view.tsx');
    if (fs.existsSync(stale)) fs.unlinkSync(stale);
  }
  console.log(`generated ${u.slug}${u.viewOnly ? ' (course view only)' : ''}`);
}
