/**
 * Generate course listing + detail pages for the 5 missing universities
 */
const fs = require('fs');
const path = require('path');

const UNIS = [
  {
    slug: 'delft-university-of-technology',
    name: 'Delft University of Technology',
    shortName: 'TU Delft',
    dataFile: 'delft-courses',
    varName: 'delftCourses',
    getFn: 'getDelftCourseBySlug',
    ifaceName: 'DelftCourse',
    currency: 'EUR',
    currSymbol: '€',
    currField: 'annualEUR',
    flag: '🇳🇱',
    country: 'Netherlands',
    city: 'Delft',
    ranking: '#47 QS World',
    intakes: 'September',
    workRights: 'Orientation Year 12 months',
    qs: '#47',
  },
  {
    slug: 'eindhoven-university-of-technology',
    name: 'Eindhoven University of Technology',
    shortName: 'TU/e',
    dataFile: 'eindhoven-courses',
    varName: 'eindhovenCourses',
    getFn: 'getEindhovenCourseBySlug',
    ifaceName: 'EindhovenCourse',
    currency: 'EUR',
    currSymbol: '€',
    currField: 'annualEUR',
    flag: '🇳🇱',
    country: 'Netherlands',
    city: 'Eindhoven',
    ranking: '#123 QS World',
    intakes: 'September',
    workRights: 'Orientation Year 12 months',
    qs: '#123',
  },
  {
    slug: 'university-of-auckland',
    name: 'University of Auckland',
    shortName: 'UoA',
    dataFile: 'auckland-courses',
    varName: 'aucklandCourses',
    getFn: 'getAucklandCourseBySlug',
    ifaceName: 'AucklandCourse',
    currency: 'NZD',
    currSymbol: 'NZ$',
    currField: 'annualNZD',
    flag: '🇳🇿',
    country: 'New Zealand',
    city: 'Auckland',
    ranking: '#65 QS World',
    intakes: 'February & July',
    workRights: 'Post-Study Work 3 years',
    qs: '#65',
  },
  {
    slug: 'victoria-university-of-wellington',
    name: 'Victoria University of Wellington',
    shortName: 'Victoria Wellington',
    dataFile: 'victoria-courses',
    varName: 'victoriaCourses',
    getFn: 'getVictoriaCourseBySlug',
    ifaceName: 'VictoriaCourse',
    currency: 'NZD',
    currSymbol: 'NZ$',
    currField: 'annualNZD',
    flag: '🇳🇿',
    country: 'New Zealand',
    city: 'Wellington',
    ranking: '#238 QS World',
    intakes: 'February & July',
    workRights: 'Post-Study Work 3 years',
    qs: '#238',
  },
  {
    slug: 'united-arab-emirates-university',
    name: 'United Arab Emirates University',
    shortName: 'UAEU',
    dataFile: 'uae-university-courses',
    varName: 'uaeuniversityCourses',
    getFn: 'getUaeUniversityCourseBySlug',
    ifaceName: 'UaeUniversityCourse',
    currency: 'USD',
    currSymbol: '$',
    currField: 'annualUSD',
    flag: '🇦🇪',
    country: 'UAE',
    city: 'Al Ain',
    ranking: '#300 QS World',
    intakes: 'September',
    workRights: 'UAE Work Permit',
    qs: '#300',
  },
];

function makeListingPage(u) {
  const feeLabel = u.currency === 'EUR' ? 'EUR' : u.currency === 'NZD' ? 'NZD' : 'USD';
  const avgFeeExpr = `Math.round(courses.reduce((s: number, c: any) => s + c.${u.currField}, 0) / totalCourses)`;

  return `import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { ${u.varName} } from '@/data/${u.dataFile}';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: '${u.name} Courses 2026 – Programs, Fees & IELTS for Indian Students',
  description: 'Explore all programs at ${u.name} for international students. ${u.currSymbol} fees, IELTS requirements, and intake dates. Free admission guidance from Jaivik Overseas.',
  path: '/universities/${u.slug}/courses',
  keywords: ['${u.shortName} courses', '${u.name} international', 'study in ${u.country}', '${u.country} university'],
});

const levelOrder = ['Bachelor','Master','PhD','Executive','Postgraduate'];

function groupByLevel(courses: any[]) {
  const groups: Record<string, any[]> = {};
  courses.forEach((c: any) => {
    const lv = c.level;
    if (!groups[lv]) groups[lv] = [];
    groups[lv].push(c);
  });
  return groups;
}

export default function CoursesPage() {
  const courses = ${u.varName} as any[];
  const groups = groupByLevel(courses);
  const totalCourses = courses.length;
  const avgFee = ${avgFeeExpr};

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: '${u.name}',
    address: { '@type': 'PostalAddress', addressLocality: '${u.city}', addressCountry: '${u.currency === 'EUR' ? 'NL' : u.currency === 'NZD' ? 'NZ' : 'AE'}' },
  };

  return (
    <>
      <JsonLd data={schema} />
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <span className="text-white">${u.shortName}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                ${u.flag} ${u.city}, ${u.country} · ${u.ranking}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">${u.name} — International Courses</h1>
              <p className="text-blue-200 text-lg mb-5">
                {totalCourses} programs · Avg {u.currSymbol}{'{'}Math.round(avgFee / 1000){'}'}K ${feeLabel}/yr · IELTS 6.5+ · ${u.intakes} intakes
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Courses', value: totalCourses },
                  { label: 'QS Ranking', value: '${u.ranking}' },
                  { label: 'Avg Fee', value: \`${u.currSymbol}\${Math.round(avgFee / 1000)}K\` },
                  { label: 'Campus', value: '${u.city}' },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source="${u.slug}-courses" defaultCountry="${u.country}" compact />
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
                {level} Programs
                <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full font-normal">{(lvCourses as any[]).length}</span>
              </h2>
              <div className="space-y-3">
                {(lvCourses as any[]).sort((a: any, b: any) => a.name.localeCompare(b.name)).map((c: any) => (
                  <Link key={c.slug} href={\`/universities/${u.slug}/courses/\${c.slug}\`}
                    className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all flex items-center justify-between group">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-brand-700 text-sm leading-snug">{c.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{c.duration} · {c.intakeMonths.join(' & ')} · {c.campus}</p>
                    </div>
                    <div className="ml-4 text-right flex-shrink-0">
                      <p className="text-sm font-bold text-brand-700">${u.currSymbol}{'{'}c.${u.currField}.toLocaleString(){'}'}/yr</p>
                      <p className="text-xs text-gray-500">IELTS {c.ieltsMin}+</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="sticky top-20 space-y-5">
            <LeadForm source="${u.slug}-sidebar" defaultCountry="${u.country}" />
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Facts — ${u.shortName}</h3>
              {[
                ['Location', '${u.city}, ${u.country}'],
                ['IELTS Min', '6.5 overall'],
                ['Intakes', '${u.intakes}'],
                ['Work Rights', '${u.workRights}'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-xs">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-semibold text-gray-900">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
`;
}

function makeDetailPage(u) {
  const feeLabel = u.currency;
  const feeDesc = u.currency === 'EUR'
    ? `€\${course.annualEUR.toLocaleString()}/EUR/yr`
    : u.currency === 'NZD'
    ? `NZ$\${course.annualNZD.toLocaleString()}/NZD/yr`
    : `$\${course.annualUSD.toLocaleString()}/USD/yr`;

  const feeOverviewRow = u.currency === 'EUR'
    ? `['Annual Fee (EUR)', \`€\${course.annualEUR.toLocaleString()}\`],`
    : u.currency === 'NZD'
    ? `['Annual Fee (NZD)', \`NZ$\${course.annualNZD.toLocaleString()}\`],`
    : `['Annual Fee (USD)', \`$\${course.annualUSD.toLocaleString()}\`],`;

  const feeStatCard = u.currency === 'EUR'
    ? `{ label: 'Annual Fee', value: \`€\${course.annualEUR.toLocaleString()}\` },`
    : u.currency === 'NZD'
    ? `{ label: 'Annual Fee', value: \`NZ$\${course.annualNZD.toLocaleString()}\` },`
    : `{ label: 'Annual Fee', value: \`$\${course.annualUSD.toLocaleString()}\` },`;

  const descFee = u.currency === 'EUR'
    ? 'course.annualEUR.toLocaleString()'
    : u.currency === 'NZD'
    ? 'course.annualNZD.toLocaleString()'
    : 'course.annualUSD.toLocaleString()';

  const descCurr = u.currency === 'EUR' ? '€' : u.currency === 'NZD' ? 'NZ$' : '$';

  return `import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ${u.varName}, ${u.getFn} } from '@/data/${u.dataFile}';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

export function generateStaticParams() {
  return ${u.varName}.map(c => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const course = ${u.getFn}(slug);
  if (!course) return {};
  return buildMetadata({
    title: \`\${course.name} at ${u.name} 2026 – Fees, IELTS & Requirements\`,
    description: \`\${course.name} at ${u.name}: \${course.duration}, ${descCurr}\$\{${descFee}\}/${feeLabel}/yr. IELTS \${course.ieltsMin}+. Intake: \${course.intakeMonths.join(' & ')}. Free guidance from Jaivik Overseas.\`,
    path: \`/universities/${u.slug}/courses/\${slug}\`,
    keywords: [course.name, '${u.name}', 'study in ${u.country}', course.level],
  });
}

export default async function CourseDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const course = ${u.getFn}(slug);
  if (!course) notFound();

  const feeINRLakh = (course.annualINR / 100000).toFixed(1);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    provider: { '@type': 'CollegeOrUniversity', name: '${u.name}' },
    courseMode: 'full-time',
    educationalLevel: course.studyLevel,
    timeRequired: \`P\${course.durationYears}Y\`,
  };

  return (
    <>
      <JsonLd data={schema} />
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4 flex-wrap">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities/${u.slug}/courses" className="hover:text-white">${u.shortName}</Link> /
            <span className="text-white">{course.name}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                ${u.flag} ${u.name} · ${u.city}, ${u.country}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.name}</h1>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                {[
                  ${feeStatCard}
                  { label: 'Fee (INR)', value: \`₹\${feeINRLakh}L/yr\` },
                  { label: 'Duration', value: course.duration },
                  { label: 'IELTS Min', value: \`\${course.ieltsMin}+\` },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source="${u.slug}-\${slug}" defaultCountry="${u.country}" compact />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Course Overview</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['University', '${u.name}'],
                ['Level', course.level],
                ['Duration', course.duration],
                ['Campus', course.campus],
                ['Country', '${u.country}'],
                ['Intake', course.intakeMonths.join(' & ')],
                ['IELTS Minimum', \`\${course.ieltsMin} overall\`],
                ['TOEFL Minimum', \`\${course.toeflMin}+\`],
                ${feeOverviewRow}
                ['Annual Fee (USD)', \`$\${course.annualUSD.toLocaleString()}\`],
                ['Annual Fee (INR)', \`₹\${(course.annualINR/100000).toFixed(1)}L\`],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col">
                  <span className="text-xs text-gray-500">{k}</span>
                  <span className="font-semibold text-gray-900 mt-0.5">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-brand-50 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 mb-3">Need Help Applying?</h2>
            <p className="text-sm text-gray-600 mb-4">Our counsellors have guided 500+ Indian students to {course.level} programs in ${u.country}. Free 30-min session.</p>
            <Link href="/book-counselling" className="btn-gold inline-block">Book Free Counselling →</Link>
          </div>
        </div>

        <div>
          <div className="sticky top-20">
            <LeadForm source="${u.slug}-detail-sidebar" defaultCountry="${u.country}" />
          </div>
        </div>
      </div>
    </>
  );
}
`;
}

let created = 0;

for (const u of UNIS) {
  const baseDir = `app/universities/${u.slug}/courses`;
  const slugDir = `${baseDir}/[slug]`;

  fs.mkdirSync(baseDir, { recursive: true });
  fs.mkdirSync(slugDir, { recursive: true });

  fs.writeFileSync(`${baseDir}/page.tsx`, makeListingPage(u));
  fs.writeFileSync(`${slugDir}/page.tsx`, makeDetailPage(u));
  console.log(`✅ Created pages for ${u.name} (${u.slug})`);
  created += 2;
}

console.log(`\n✅ Created ${created} page files for ${UNIS.length} universities`);
