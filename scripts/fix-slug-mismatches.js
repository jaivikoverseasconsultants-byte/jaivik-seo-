/**
 * Fix slug mismatches - create course pages at the correct slugs
 */
const fs = require('fs');
const path = require('path');

// Map from data file prefix to the CORRECT slug in universities.ts
const FIXES = [
  {
    prefix: 'unsw', wrongSlug: 'university-of-new-south-wales', correctSlug: 'unsw-sydney',
    name: 'UNSW Sydney', shortName: 'UNSW', currency: 'AUD', currSymbol: 'A$',
    countryName: 'Australia', cityName: 'Sydney', url: 'https://www.unsw.edu.au',
    visa: 'Temporary Graduate Visa (500): 2-4 years post-study work'
  },
  {
    prefix: 'gatech', wrongSlug: 'georgia-institute-of-technology', correctSlug: 'georgia-tech',
    name: 'Georgia Institute of Technology', shortName: 'Georgia Tech', currency: 'USD', currSymbol: '$',
    countryName: 'USA', cityName: 'Atlanta', url: 'https://www.gatech.edu'
  },
  {
    prefix: 'humboldt', wrongSlug: 'humboldt-university-of-berlin', correctSlug: 'humboldt-university-berlin',
    name: 'Humboldt University of Berlin', shortName: 'Humboldt Berlin', currency: 'EUR', currSymbol: '€',
    countryName: 'Germany', cityName: 'Berlin', url: 'https://www.hu-berlin.de'
  },
  {
    prefix: 'fu-berlin', wrongSlug: 'free-university-of-berlin', correctSlug: 'free-university-berlin',
    name: 'Free University of Berlin', shortName: 'FU Berlin', currency: 'EUR', currSymbol: '€',
    countryName: 'Germany', cityName: 'Berlin', url: 'https://www.fu-berlin.de'
  },
];

// Also check if we need to add any new slugs that don't exist in app yet
const NEW_UNIVERSITIES = [
  // Universities with data files but no app directories yet
  {
    prefix: 'kit', correctSlug: 'karlsruhe-institute-of-technology',
    name: 'Karlsruhe Institute of Technology', shortName: 'KIT', currency: 'EUR', currSymbol: '€',
    countryName: 'Germany', cityName: 'Karlsruhe', url: 'https://www.kit.edu'
  },
  {
    prefix: 'smu', correctSlug: 'singapore-management-university',
    name: 'Singapore Management University', shortName: 'SMU Singapore', currency: 'SGD', currSymbol: 'S$',
    countryName: 'Singapore', cityName: 'Singapore', url: 'https://www.smu.edu.sg'
  },
  {
    prefix: 'ucc', correctSlug: 'university-college-cork',
    name: 'University College Cork', shortName: 'UCC', currency: 'EUR', currSymbol: '€',
    countryName: 'Ireland', cityName: 'Cork', url: 'https://www.ucc.ie'
  },
  {
    prefix: 'dcu', correctSlug: 'dublin-city-university',
    name: 'Dublin City University', shortName: 'DCU', currency: 'EUR', currSymbol: '€',
    countryName: 'Ireland', cityName: 'Dublin', url: 'https://www.dcu.ie'
  },
];

function getAnnualField(currency) {
  return currency === 'GBP' ? 'annualGBP' : currency === 'EUR' ? 'annualEUR' : currency === 'AUD' ? 'annualAUD' : currency === 'SGD' ? 'annualSGD' : currency === 'CAD' ? 'annualCAD' : 'annualUSD';
}

function getLivingField(currency) {
  return currency === 'GBP' ? 'livingCostGBP' : currency === 'EUR' ? 'livingCostEUR' : currency === 'AUD' ? 'livingCostAUD' : currency === 'SGD' ? 'livingCostSGD' : currency === 'CAD' ? 'livingCostCAD' : 'livingCostUSD';
}

function getTotalField(currency) {
  return `total${currency}`;
}

function getVarName(prefix) {
  return prefix.replace(/-/g, '') + 'Courses';
}

function getInterfaceName(prefix) {
  return prefix.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('') + 'Course';
}

function getFunctionName(prefix) {
  return 'get' + getInterfaceName(prefix) + 'BySlug';
}

function generatePages(uni) {
  const { prefix, correctSlug, name, shortName, currency, currSymbol, countryName, cityName, url, visa } = uni;
  const varName = getVarName(prefix);
  const iface = getInterfaceName(prefix);
  const fnName = getFunctionName(prefix);
  const dataFile = `${prefix}-courses`;
  const annualField = getAnnualField(currency);
  const livingField = getLivingField(currency);
  const totalField = getTotalField(currency);

  const rateToINR = currency === 'GBP' ? 106 : currency === 'EUR' ? 90 : currency === 'AUD' ? 54.5 : currency === 'SGD' ? 61.5 : currency === 'CAD' ? 61 : 1;

  const listingPage = `import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { ${varName} } from '@/data/${dataFile}';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: '${name} International Courses – All Programs, Fees & IELTS 2026',
  description: \`${name} – \${(${varName} as unknown as any[]).length} courses for international students. Free guidance from Jaivik Overseas Consultants.\`,
  path: '/universities/${correctSlug}/courses',
  keywords: ['${shortName} courses', '${name} international', 'study in ${countryName}'],
});

const levelOrder = ['Undergraduate', 'Foundation', 'Graduate Certificate', 'Graduate Diploma', 'Masters', 'MBA', 'PhD', 'Postgraduate'];

function groupByLevel(courses: any[]) {
  const groups: Record<string, any[]> = {};
  courses.forEach((c: any) => { const lv = c.level || 'Other'; if (!groups[lv]) groups[lv] = []; groups[lv].push(c); });
  return groups;
}

export default function CoursesPage() {
  const courses = ${varName} as unknown as any[];
  const groups = groupByLevel(courses);
  const totalCourses = courses.length;
  const pgCourses = courses.filter((c: any) => c.studyLevel !== 'Undergraduate');
  const avgFee = pgCourses.length
    ? Math.round(pgCourses.reduce((s: number, c: any) => s + (c.${annualField} || c.annualUSD || 0), 0) / pgCourses.length)
    : Math.round(courses.reduce((s: number, c: any) => s + (c.${annualField} || c.annualUSD || 0), 0) / (totalCourses || 1));
  const feeINRLakh = (avgFee * ${rateToINR} / 100000).toFixed(1);

  const schema = {
    '@context': 'https://schema.org', '@type': 'CollegeOrUniversity',
    name: '${name}', sameAs: '${url}', url: '${url}',
  };
  const orderedGroups = levelOrder.filter(l => groups[l]).map(l => [l, groups[l]]);
  const allGroups = [...orderedGroups, ...Object.keys(groups).filter(l => !levelOrder.includes(l)).map(l => [l, groups[l]])] as [string, any[]][];

  return (
    <>
      <JsonLd data={schema} />
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/${correctSlug}" className="hover:text-white">${shortName}</Link> /
            <span>Courses</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">${name}</h1>
          <p className="text-blue-100 text-lg mb-6">{totalCourses} Programs · ${cityName}, ${countryName} · IELTS 6.0–7.0+</p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/10 rounded-xl px-5 py-3 text-center"><div className="text-2xl font-bold">{totalCourses}</div><div className="text-blue-200 text-xs">Courses</div></div>
            <div className="bg-white/10 rounded-xl px-5 py-3 text-center"><div className="text-2xl font-bold">${currSymbol}{avgFee.toLocaleString()}</div><div className="text-blue-200 text-xs">Avg PG Fee/year</div></div>
            <div className="bg-white/10 rounded-xl px-5 py-3 text-center"><div className="text-2xl font-bold">₹{feeINRLakh}L</div><div className="text-blue-200 text-xs">Avg Fee (INR)</div></div>
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
              {levelCourses.map((course: any) => {
                const fee = course.${annualField} || course.annualUSD || 0;
                return (
                  <Link key={course.id} href={\`/universities/${correctSlug}/courses/\${course.slug}\`}
                    className="block bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-brand-200 transition-all group">
                    <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors mb-2 text-sm leading-snug">{course.name}</h3>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{course.level}</span>
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full">${currSymbol}{fee.toLocaleString()}/yr</span>
                      <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">IELTS {course.ieltsMin}+</span>
                      <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">{course.duration}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>
      <section className="bg-brand-50 py-12 px-4"><div className="max-w-2xl mx-auto"><h2 className="text-2xl font-bold text-center text-brand-900 mb-2">Apply to ${shortName}</h2><p className="text-center text-gray-600 mb-6">Get free expert guidance from Jaivik Overseas Consultants</p><LeadForm /></div></section>
    </>
  );
}
`;

  const detailPage = `import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ${varName}, ${fnName} } from '@/data/${dataFile}';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

export async function generateStaticParams() {
  return (${varName} as unknown as any[]).map((c: any) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = ${fnName}(slug);
  if (!course) return {};
  const fee = (course as any).${annualField} || (course as any).annualUSD || 0;
  return buildMetadata({
    title: \`\${course.name} | ${shortName} – Fees, IELTS & Intake 2026\`,
    description: \`\${course.name} at ${name}. Annual fee ${currSymbol}\${fee.toLocaleString()}. IELTS \${course.ieltsMin}+. Intake: \${course.intakeMonths.join(' & ')}. Free guidance from Jaivik Overseas Consultants.\`,
    path: \`/universities/${correctSlug}/courses/\${slug}\`,
    keywords: [course.name, '${shortName}', '${name}', 'study in ${countryName}', course.level],
  });
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = ${fnName}(slug);
  if (!course) notFound();

  const fee = (course as any).${annualField} || (course as any).annualUSD || 0;
  const feeINRLakh = (course.annualINR / 100000).toFixed(1);
  const totalFee = (course as any).${totalField} || fee * course.durationYears;

  const schema = { '@context': 'https://schema.org', '@type': 'Course', name: course.name, provider: { '@type': 'CollegeOrUniversity', name: '${name}', sameAs: '${url}' }, courseMode: 'full-time', educationalLevel: course.studyLevel };

  const fieldKey = course.name.toLowerCase();
  const careerMap: Record<string, { roles: string[], avgUSD: number }> = {
    default: { roles: ['Industry Professional', 'Research Associate', 'Consultant', 'Manager'], avgUSD: 85000 },
    'computer science': { roles: ['Software Engineer', 'Data Scientist', 'ML Engineer', 'Technical Lead'], avgUSD: 120000 },
    'data science': { roles: ['Data Scientist', 'ML Engineer', 'Data Analyst', 'AI Researcher'], avgUSD: 115000 },
    'artificial intelligence': { roles: ['AI Engineer', 'ML Researcher', 'Data Scientist', 'AI Product Manager'], avgUSD: 125000 },
    'business': { roles: ['Business Analyst', 'Management Consultant', 'Strategy Manager', 'Operations Director'], avgUSD: 95000 },
    'finance': { roles: ['Financial Analyst', 'Investment Banker', 'Portfolio Manager', 'CFO'], avgUSD: 110000 },
    'engineering': { roles: ['Design Engineer', 'Project Engineer', 'Engineering Manager', 'Technical Director'], avgUSD: 100000 },
    'mba': { roles: ['Product Manager', 'Strategy Consultant', 'Business Development Manager', 'CEO'], avgUSD: 130000 },
  };
  let career = careerMap.default;
  for (const [key, val] of Object.entries(careerMap)) { if (fieldKey.includes(key)) { career = val; break; } }
  const avgINRLakh = (career.avgUSD * 83.5 / 100000).toFixed(1);

  return (
    <>
      <JsonLd data={schema} />
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4 flex-wrap">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/${correctSlug}" className="hover:text-white">${shortName}</Link> /
            <Link href="/universities/${correctSlug}/courses" className="hover:text-white">Courses</Link> /
            <span>{course.name}</span>
          </div>
          <div className="inline-block bg-white/10 text-blue-100 text-xs px-3 py-1 rounded-full mb-3">{course.level} · {course.studyLevel}</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.name}</h1>
          <p className="text-blue-100 text-lg">${name} · ${cityName}, ${countryName} · {course.duration}</p>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Program Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Annual Fee', value: \`${currSymbol}\${fee.toLocaleString()}\`, sub: \`₹\${feeINRLakh}L/year\` },
                  { label: 'Total Fees', value: \`${currSymbol}\${totalFee.toLocaleString()}\`, sub: \`\${course.durationYears} year(s)\` },
                  { label: 'IELTS', value: \`\${course.ieltsMin}+\`, sub: \`TOEFL \${course.toeflMin}+\` },
                  { label: 'Duration', value: course.duration, sub: course.studyLevel },
                  { label: 'Intake', value: (course.intakeMonths || []).join(' & '), sub: 'Annual' },
                  { label: 'Campus', value: '${cityName}', sub: '${countryName}' },
                ].map(({ label, value, sub }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">{label}</div>
                    <div className="font-bold text-gray-900">{value}</div>
                    {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Career Outcomes</h2>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-white rounded-xl p-4 text-center"><div className="text-2xl font-bold text-green-700">\${career.avgUSD.toLocaleString()}</div><div className="text-xs text-gray-500">Avg Salary (USD)</div></div>
                <div className="bg-white rounded-xl p-4 text-center"><div className="text-2xl font-bold text-green-700">₹{avgINRLakh}L</div><div className="text-xs text-gray-500">Avg Salary (INR)</div></div>
              </div>
              <div className="flex flex-wrap gap-2">
                {career.roles.map((role: string) => (<span key={role} className="bg-white text-green-800 text-xs px-3 py-1 rounded-full border border-green-200">{role}</span>))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-brand-700 text-white rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-2">Apply to {course.name}</h3>
              <p className="text-blue-100 text-sm mb-4">Get free expert guidance</p>
              <Link href="/thank-you" className="block w-full bg-white text-brand-700 text-center font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors">Apply Now – Free Guidance</Link>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-3">Eligibility</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">IELTS</span><span className="font-medium">{course.ieltsMin}+</span></div>
                <div className="flex justify-between"><span className="text-gray-500">TOEFL</span><span className="font-medium">{course.toeflMin}+</span></div>
                <div className="flex justify-between"><span className="text-gray-500">PTE</span><span className="font-medium">{course.pteMin}+</span></div>
              </div>
            </div>
            <Link href="/universities/${correctSlug}/courses" className="flex items-center gap-2 text-brand-700 hover:text-brand-900 font-medium text-sm">← All ${shortName} Courses</Link>
          </div>
        </div>
      </section>
      <section className="bg-brand-50 py-12 px-4 mt-4"><div className="max-w-2xl mx-auto"><h2 className="text-2xl font-bold text-center text-brand-900 mb-2">Ready to Apply?</h2><p className="text-center text-gray-600 mb-6">Get personalised guidance from our expert counsellors</p><LeadForm /></div></section>
    </>
  );
}
`;

  return { listingPage, detailPage };
}

// Process fixes (wrong slugs)
for (const uni of FIXES) {
  const correctDir = `app/universities/${uni.correctSlug}/courses`;
  const correctDetailDir = `${correctDir}/[slug]`;

  fs.mkdirSync(correctDir, { recursive: true });
  fs.mkdirSync(correctDetailDir, { recursive: true });

  const { listingPage, detailPage } = generatePages(uni);
  fs.writeFileSync(`${correctDir}/page.tsx`, listingPage);
  fs.writeFileSync(`${correctDetailDir}/page.tsx`, detailPage);

  console.log(`✅ Fixed: ${uni.wrongSlug} → ${uni.correctSlug}/courses/`);
}

// Process new universities (no app dir yet)
for (const uni of NEW_UNIVERSITIES) {
  const dir = `app/universities/${uni.correctSlug}/courses`;
  const detailDir = `${dir}/[slug]`;

  if (!fs.existsSync(`data/${uni.prefix}-courses.ts`)) {
    console.log(`⚠️  Data file not found: ${uni.prefix}-courses.ts`);
    continue;
  }

  // Check if universities.ts has this slug
  const unisContent = fs.readFileSync('data/universities.ts', 'utf8');
  if (!unisContent.includes(`'${uni.correctSlug}'`)) {
    console.log(`⚠️  Slug not in universities.ts: ${uni.correctSlug}`);
    // Still create the pages, may need to add to universities.ts later
  }

  fs.mkdirSync(dir, { recursive: true });
  fs.mkdirSync(detailDir, { recursive: true });

  const { listingPage, detailPage } = generatePages(uni);
  fs.writeFileSync(`${dir}/page.tsx`, listingPage);
  fs.writeFileSync(`${detailDir}/page.tsx`, detailPage);

  console.log(`✅ Created: ${uni.correctSlug}/courses/`);
}

console.log('\n✅ Done!');
