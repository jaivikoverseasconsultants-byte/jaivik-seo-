// Generates app/universities/<slug>/courses/page.tsx + [slug]/page.tsx for each
// Wave 2-integrated university, following the established per-university-folder
// pattern (see app/universities/dublin-city-university/courses/ for the template
// this is based on).
const fs = require('fs');
const path = require('path');

const UNIS = [
  { slug: 'imperial-college-london', displayName: 'Imperial College London', short: 'Imperial', varName: 'imperialCourses', getFn: 'getImperialCourseBySlug', dataFile: 'imperial-courses', sameAs: 'https://www.imperial.ac.uk', currencySymbol: '£', currencyField: null, city: 'London', country: 'UK' },
  { slug: 'unsw-sydney', displayName: 'UNSW Sydney', short: 'UNSW', varName: 'unswW2Courses', getFn: 'getUnswW2CourseBySlug', dataFile: 'unsw-w2-courses', sameAs: 'https://www.unsw.edu.au', currencySymbol: 'A$', currencyField: 'annualAUD', city: 'Sydney', country: 'Australia' },
  { slug: 'goldsmiths-university-london', displayName: 'Goldsmiths, University of London', short: 'Goldsmiths', varName: 'goldsmithsCourses', getFn: 'getGoldsmithsCourseBySlug', dataFile: 'goldsmiths-courses', sameAs: 'https://www.gold.ac.uk', currencySymbol: '£', currencyField: null, city: 'London', country: 'UK' },
  { slug: 'university-of-greenwich', displayName: 'University of Greenwich', short: 'Greenwich', varName: 'greenwichCourses', getFn: 'getGreenwichCourseBySlug', dataFile: 'greenwich-courses', sameAs: 'https://www.gre.ac.uk', currencySymbol: '£', currencyField: 'annualGBP', city: 'London', country: 'UK' },
  { slug: 'university-of-central-lancashire', displayName: 'University of Central Lancashire', short: 'UCLan', varName: 'uclanCourses', getFn: 'getUclanCourseBySlug', dataFile: 'uclan-courses', sameAs: 'https://www.uclan.ac.uk', currencySymbol: '£', currencyField: 'annualGBP', city: 'Preston', country: 'UK' },
  { slug: 'university-of-salford', displayName: 'University of Salford', short: 'Salford', varName: 'salfordW2Courses', getFn: 'getSalfordW2CourseBySlug', dataFile: 'salford-w2-courses', sameAs: 'https://www.salford.ac.uk', currencySymbol: '£', currencyField: null, city: 'Salford', country: 'UK' },
  { slug: 'brunel-university-london', displayName: 'Brunel University London', short: 'Brunel', varName: 'brunelW2Courses', getFn: 'getBrunelW2CourseBySlug', dataFile: 'brunel-w2-courses', sameAs: 'https://www.brunel.ac.uk', currencySymbol: '£', currencyField: 'annualGBP', city: 'Uxbridge', country: 'UK' },
  { slug: 'university-of-plymouth', displayName: 'University of Plymouth', short: 'Plymouth', varName: 'plymouthW2Courses', getFn: 'getPlymouthW2CourseBySlug', dataFile: 'plymouth-w2-courses', sameAs: 'https://www.plymouth.ac.uk', currencySymbol: '£', currencyField: 'annualGBP', city: 'Plymouth', country: 'UK' },
  { slug: 'university-of-sussex', displayName: 'University of Sussex', short: 'Sussex', varName: 'sussexW2Courses', getFn: 'getSussexW2CourseBySlug', dataFile: 'sussex-w2-courses', sameAs: 'https://www.sussex.ac.uk', currencySymbol: '£', currencyField: 'annualGBP', city: 'Falmer, Brighton', country: 'UK' },
  { slug: 'university-of-sunshine-coast', displayName: 'University of the Sunshine Coast', short: 'UniSC', varName: 'uniscCourses', getFn: 'getUniscCourseBySlug', dataFile: 'unisc-courses', sameAs: 'https://www.unisc.edu.au', currencySymbol: 'A$', currencyField: 'annualAUD', city: 'Sippy Downs', country: 'Australia' },
  { slug: 'dublin-business-school', displayName: 'Dublin Business School', short: 'DBS', varName: 'dbsCourses', getFn: 'getDbsCourseBySlug', dataFile: 'dbs-courses', sameAs: 'https://www.dbs.ie', currencySymbol: '€', currencyField: null, city: 'Dublin', country: 'Ireland' },
  { slug: 'birmingham-city-university', displayName: 'Birmingham City University', short: 'BCU', varName: 'bcuW2Courses', getFn: 'getBcuW2CourseBySlug', dataFile: 'bcu-w2-courses', sameAs: 'https://www.bcu.ac.uk', currencySymbol: '£', currencyField: null, city: 'Birmingham', country: 'UK' },
  { slug: 'national-college-of-ireland', displayName: 'National College of Ireland', short: 'NCI', varName: 'nciCourses', getFn: 'getNciCourseBySlug', dataFile: 'nci-courses', sameAs: 'https://www.ncirl.ie', currencySymbol: '€', currencyField: null, city: 'Dublin', country: 'Ireland' },
];

function listingPage(u) {
  const feeExpr = u.currencyField ? `course.${u.currencyField} || course.annualUSD` : 'course.annualUSD';
  return `import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { ${u.varName} } from '@/data/${u.dataFile}';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: '${u.displayName} International Courses – All Programs, Fees & IELTS 2026',
  description: \`${u.displayName} – \${${u.varName}.length} courses for international students. Free guidance from Jaivik Overseas Consultants.\`,
  path: '/universities/${u.slug}/courses',
  keywords: ['${u.short} courses', '${u.displayName}', 'study in ${u.country}'],
});

function groupByLevel(courses: typeof ${u.varName}) {
  const groups: Record<string, typeof ${u.varName}> = {};
  courses.forEach((c) => { const lv = c.studyLevel || 'Other'; if (!groups[lv]) groups[lv] = []; groups[lv].push(c); });
  return groups;
}

export default function CoursesPage() {
  const courses = ${u.varName};
  const groups = groupByLevel(courses);
  const withFee = courses.filter(c => c.annualUSD > 0);
  const avgFeeUSD = withFee.length ? Math.round(withFee.reduce((s, c) => s + c.annualUSD, 0) / withFee.length) : 0;
  const feeINRLakh = withFee.length ? (withFee.reduce((s, c) => s + c.annualINR, 0) / withFee.length / 100000).toFixed(1) : '0';
  const levelOrder = ['Undergraduate', 'Postgraduate', 'MBA'];
  const orderedGroups = levelOrder.filter(l => groups[l]).map(l => [l, groups[l]] as [string, typeof ${u.varName}]);
  const allGroups = [...orderedGroups, ...Object.keys(groups).filter(l => !levelOrder.includes(l)).map(l => [l, groups[l]] as [string, typeof ${u.varName}])];

  const schema = { '@context': 'https://schema.org', '@type': 'CollegeOrUniversity', name: '${u.displayName}', sameAs: '${u.sameAs}', url: '${u.sameAs}' };
  const courseListSchema = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: '${u.displayName} — Courses for International Students',
    numberOfItems: courses.length,
    itemListElement: courses.slice(0, 5).map((c, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: { '@type': 'Course', name: c.name, provider: { '@type': 'CollegeOrUniversity', name: '${u.displayName}' }, educationalLevel: c.studyLevel },
    })),
  };

  return (
    <>
      <JsonLd data={schema} />
      <JsonLd data={courseListSchema} />
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/${u.slug}" className="hover:text-white">${u.short}</Link> /
            <span>Courses</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">${u.displayName}</h1>
          <p className="text-blue-100 text-lg mb-6">{courses.length} Programs · ${u.city}, ${u.country}</p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/10 rounded-xl px-5 py-3 text-center"><div className="text-2xl font-bold">{courses.length}</div><div className="text-blue-200 text-xs">Courses</div></div>
            {avgFeeUSD > 0 && <div className="bg-white/10 rounded-xl px-5 py-3 text-center"><div className="text-2xl font-bold">\${avgFeeUSD.toLocaleString()}</div><div className="text-blue-200 text-xs">Avg Fee/year (USD)</div></div>}
            {avgFeeUSD > 0 && <div className="bg-white/10 rounded-xl px-5 py-3 text-center"><div className="text-2xl font-bold">₹{feeINRLakh}L</div><div className="text-blue-200 text-xs">Avg Fee (INR)</div></div>}
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-10">
        {allGroups.map(([level, levelCourses]) => (
          <div key={level} className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-sm">{level}</span>
              <span className="text-gray-500 text-sm font-normal">{levelCourses.length} programs</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {levelCourses.map((course) => {
                const fee = ${feeExpr};
                return (
                  <Link key={course.id} href={\`/universities/${u.slug}/courses/\${course.slug}\`}
                    className="block bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-brand-200 transition-all group">
                    <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors mb-2 text-sm leading-snug">{course.name}</h3>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{course.level}</span>
                      {fee > 0 && <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full">${u.currencySymbol}{fee.toLocaleString()}/yr</span>}
                      {course.ieltsMin > 0 && <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">IELTS {course.ieltsMin}+</span>}
                      <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">{course.duration}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>
      <section className="bg-brand-50 py-12 px-4"><div className="max-w-2xl mx-auto"><h2 className="text-2xl font-bold text-center text-brand-900 mb-2">Apply to ${u.short}</h2><p className="text-center text-gray-600 mb-6">Get free expert guidance from Jaivik Overseas Consultants</p><LeadForm /></div></section>
    </>
  );
}
`;
}

function detailPage(u) {
  const feeExpr = u.currencyField ? `(course.${u.currencyField} || course.annualUSD)` : 'course.annualUSD';
  return `import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ${u.varName}, ${u.getFn} } from '@/data/${u.dataFile}';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';
import CourseRichContent from '@/components/CourseRichContent';
import CourseKeyFacts from '@/components/CourseKeyFacts';

export async function generateStaticParams() {
  return ${u.varName}.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = ${u.getFn}(slug);
  if (!course) return {};
  return buildMetadata({
    title: \`\${course.name} at ${u.displayName} — Fees in INR, IELTS & Requirements for Indian Students\`,
    description: \`\${course.name} at ${u.displayName}, ${u.city}\${course.annualINR > 0 ? \` costs ₹\${(course.annualINR / 100000).toFixed(1)}L/year for Indian students.\` : '.'}\${course.ieltsMin > 0 ? \` IELTS \${course.ieltsMin}+,\` : ''} Apply with Jaivik Overseas — 13 years expertise, 99% visa success.\`,
    path: \`/universities/${u.slug}/courses/\${slug}\`,
    keywords: [course.name, '${u.short}', '${u.displayName}', 'study in ${u.country}', course.level],
  });
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = ${u.getFn}(slug);
  if (!course) notFound();

  const fee = ${feeExpr};
  const feeINRLakh = (course.annualINR / 100000).toFixed(1);
  const schema = { '@context': 'https://schema.org', '@type': 'Course', name: course.name, provider: { '@type': 'CollegeOrUniversity', name: '${u.displayName}', sameAs: '${u.sameAs}' }, courseMode: 'full-time', educationalLevel: course.studyLevel };

  return (
    <>
      <JsonLd data={schema} />
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4 flex-wrap">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/${u.slug}" className="hover:text-white">${u.short}</Link> /
            <Link href="/universities/${u.slug}/courses" className="hover:text-white">Courses</Link> /
            <span>{course.name}</span>
          </div>
          <div className="inline-block bg-white/10 text-blue-100 text-xs px-3 py-1 rounded-full mb-3">{course.level} · {course.studyLevel}</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.name} at ${u.displayName} — Fees in INR, IELTS &amp; Requirements for Indian Students</h1>
          <p className="text-blue-100 text-lg">${u.displayName} · ${u.city}, ${u.country} · {course.duration}</p>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Program Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  fee > 0 ? { label: 'Annual Fee', value: \`${u.currencySymbol}\${fee.toLocaleString()}\`, sub: \`₹\${feeINRLakh}L/year\` } : null,
                  course.ieltsMin > 0 ? { label: 'IELTS', value: \`\${course.ieltsMin}+\`, sub: undefined } : null,
                  { label: 'Duration', value: course.duration, sub: course.studyLevel },
                  { label: 'Campus', value: '${u.city}', sub: '${u.country}' },
                ].filter((x): x is { label: string; value: string; sub: string | undefined } => x !== null).map(({ label, value, sub }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">{label}</div>
                    <div className="font-bold text-gray-900">{value}</div>
                    {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
                  </div>
                ))}
              </div>
            </div>
            <CourseKeyFacts course={course as any} universityName="${u.displayName}" universitySlug="${u.slug}" />
          </div>
          <div className="space-y-6">
            <CourseRichContent course={course as any} universityName="${u.displayName}" universitySlug="${u.slug}" />
            <div className="bg-brand-700 text-white rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-2">Apply to {course.name}</h3>
              <p className="text-blue-100 text-sm mb-4">Get free expert guidance</p>
              <Link href="/thank-you" className="block w-full bg-white text-brand-700 text-center font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors">Apply Now – Free Guidance</Link>
            </div>
            <Link href="/universities/${u.slug}/courses" className="flex items-center gap-2 text-brand-700 hover:text-brand-900 font-medium text-sm">← All ${u.short} Courses</Link>
          </div>
        </div>
      </section>
      <section className="bg-brand-50 py-12 px-4 mt-4"><div className="max-w-2xl mx-auto"><h2 className="text-2xl font-bold text-center text-brand-900 mb-2">Ready to Apply?</h2><p className="text-center text-gray-600 mb-6">Get personalised guidance from our expert counsellors</p><LeadForm /></div></section>
    </>
  );
}
`;
}

for (const u of UNIS) {
  const dir = path.join('app/universities', u.slug, 'courses');
  const detailDir = path.join(dir, '[slug]');
  fs.mkdirSync(detailDir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'page.tsx'), listingPage(u));
  fs.writeFileSync(path.join(detailDir, 'page.tsx'), detailPage(u));
  console.log(`Generated routes for ${u.slug}`);
}
