/**
 * Canada university & college page generator.
 * Usage: node scripts/generate-canada-pages.js <uni-id>
 * Reads: data/scraped/canada/<uni-id>.json
 * Writes: data/<uni-id>-courses.ts
 *         app/universities/<slug>/courses/page.tsx
 *         app/universities/<slug>/courses/[slug]/page.tsx
 */

const fs = require('fs');
const path = require('path');
const CONFIGS = require('./canada-universities-config');

const CAD_TO_USD = 0.73;
const CAD_TO_INR = 61;

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

function levelLabel(level) {
  if (/PhD|Doctor/.test(level)) return 'PhD';
  if (/Masters|Master/.test(level)) return 'Postgraduate';
  if (/Graduate Certificate/.test(level)) return 'Graduate Certificate';
  if (/Graduate Diploma/.test(level)) return 'Postgraduate';
  if (/Advanced Diploma/.test(level)) return 'Advanced Diploma';
  if (/Honours Bachelor|Bachelor \(Hons/.test(level)) return 'Undergraduate';
  if (/Undergraduate/.test(level)) return 'Undergraduate';
  if (/Diploma/.test(level)) return 'Diploma';
  if (/Certificate/.test(level)) return 'Certificate';
  if (/Foundation/.test(level)) return 'Foundation';
  return 'Postgraduate';
}

function generatePages(uniId) {
  const config = CONFIGS.find(c => c.id === uniId);
  if (!config) { console.error(`Unknown institution: ${uniId}`); process.exit(1); }

  const inFile = path.join(__dirname, `../data/scraped/canada/${uniId}.json`);
  if (!fs.existsSync(inFile)) { console.error(`No data found: ${inFile}\nRun build script first.`); process.exit(1); }

  const raw = JSON.parse(fs.readFileSync(inFile, 'utf8'));
  console.log(`\nGenerating pages for ${config.name} (${raw.length} raw courses)…`);

  // Exclude basic Diplomas and Certificates — Indian students need PGWP-eligible programs
  const EXCLUDED_LEVELS = new Set(['Diploma', 'Certificate']);
  const courses = raw.filter(c => c.name && c.name.length > 3 && !EXCLUDED_LEVELS.has(c.level));
  console.log(`After filtering: ${courses.length} courses`);

  const varName = uniId.replace(/-/g, '_') + 'Courses';

  const mapped = courses.map((c, i) => {
    const annualCAD = c.annualCAD || config.fees.default;
    const annualUSD = Math.round(annualCAD * CAD_TO_USD);
    const annualINR = Math.round(annualCAD * CAD_TO_INR);
    const livingCAD = config.livingCostCAD;
    const livingUSD = Math.round(livingCAD * CAD_TO_USD);
    const livingINR = Math.round(livingCAD * CAD_TO_INR);
    const durationYears = c.durationYears || 1;
    const slug = c.slug || (`${uniId}-` + slugify(c.name));
    return {
      id: `${uniId}-${i + 1}`,
      name: c.name,
      slug,
      url: c.url || config.website,
      level: c.level || 'Postgraduate',
      studyLevel: levelLabel(c.level || ''),
      duration: c.duration || `${durationYears} year${durationYears !== 1 ? 's' : ''}`,
      durationYears,
      annualCAD,
      annualUSD,
      annualINR,
      totalCAD: c.totalCAD || Math.round(annualCAD * durationYears),
      livingCostCAD: livingCAD,
      livingCostUSD: livingUSD,
      livingCostINR: livingINR,
      ieltsMin: c.ieltsMin || config.ieltsDefault,
      toeflMin: config.toeflDefault || 79,
      pteMin: config.pteDefault || 53,
      intakeMonths: Array.isArray(c.intakeMonths) && c.intakeMonths.length ? c.intakeMonths : config.intakes,
      campus: c.campus || config.campus,
      country: 'Canada',
      province: config.province,
      city: config.city,
      countryCode: 'CA',
      pgwp: config.pgwp,
    };
  });

  // ── Write TypeScript data file ──────────────────────────────────────────────
  const tsPath = path.join(__dirname, `../data/${uniId}-courses.ts`);
  const interfaceName = uniId.replace(/-/g,'_').replace(/\b\w/g,c=>c.toUpperCase()).replace(/_/g,'') + 'Course';
  const tsContent = `// Auto-generated — do not edit manually
// Source: data/scraped/canada/${uniId}.json

export interface ${interfaceName} {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualCAD: number; annualUSD: number; annualINR: number; totalCAD: number;
  livingCostCAD: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; province: string; city: string; countryCode: string;
  pgwp: boolean;
}

export const ${varName} = ${JSON.stringify(mapped, null, 2)} as const;

export function get${varName.replace(/\b\w/g,c=>c.toUpperCase())}BySlug(slug: string) {
  return (${varName} as unknown as any[]).find((c: any) => c.slug === slug) ?? null;
}
`;
  fs.writeFileSync(tsPath, tsContent, 'utf8');
  console.log(`✅ Written: ${tsPath}`);

  // ── Write Next.js pages ─────────────────────────────────────────────────────
  const appDir = path.join(__dirname, `../app/universities/${config.slug}/courses`);
  const slugDir = path.join(appDir, '[slug]');
  fs.mkdirSync(slugDir, { recursive: true });

  const dataImport = `@/data/${uniId}-courses`;
  const getterFn = `get${varName.replace(/\b\w/g,c=>c.toUpperCase())}BySlug`;
  const intakesStr = config.intakes.join(' & ');
  const avgFee = Math.round(mapped.reduce((s, c) => s + c.annualCAD, 0) / (mapped.length || 1));
  const rankingBadge = config.qsRanking && config.qsRanking < 1400 ? ` · #${config.qsRanking} QS` : '';
  const pgwpNote = config.pgwp ? 'PGWP Eligible · ' : '';

  // courses/[slug]/page.tsx
  const slugPageContent = `import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ${varName}, ${getterFn} } from '${dataImport}';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

export async function generateStaticParams() {
  return (${varName} as unknown as any[]).map((c: any) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const course = ${getterFn}(slug);
  if (!course) return {};
  return buildMetadata({
    title: \`\${course.name} | ${config.shortName} – Fees, IELTS & Intake 2025\`,
    description: \`\${course.name} at ${config.name}. Annual fee CAD $\${course.annualCAD.toLocaleString()} (\${course.durationYears} year\${course.durationYears !== 1 ? 's' : ''}). IELTS \${course.ieltsMin}+. Intake: \${course.intakeMonths.join(' & ')}. ${config.pgwp ? 'PGWP eligible. ' : ''}Free guidance from Jaivik Overseas Consultants.\`,
    path: \`/universities/${config.slug}/courses/\${slug}\`,
    keywords: [course.name, '${config.shortName}', '${config.name}', 'study in Canada', course.level, 'PGWP'],
  });
}

export default async function CoursePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const course = ${getterFn}(slug);
  if (!course) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    provider: {
      '@type': 'CollegeOrUniversity',
      name: '${config.name}',
      sameAs: '${config.sameAs}',
    },
    courseMode: 'full-time',
    educationalLevel: course.studyLevel,
    timeRequired: \`P\${course.durationYears}Y\`,
    url: course.url,
  };

  const feeINRLakh = (course.annualINR / 100000).toFixed(1);

  return (
    <>
      <JsonLd data={schema} />

      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/country/canada" className="hover:text-white">Canada</Link> /
            <Link href="/universities/${config.slug}" className="hover:text-white">${config.shortName}</Link> /
            <Link href="/universities/${config.slug}/courses" className="hover:text-white">Courses</Link> /
            <span className="text-white">{course.name}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇨🇦 ${config.name} · ${config.city}, Canada${config.pgwp ? ' · PGWP Eligible' : ''}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.name}</h1>
              <p className="text-blue-200 text-lg mb-5">
                {course.studyLevel} · {course.duration} · {course.campus}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Annual Fee (CAD)', value: \`$\${course.annualCAD.toLocaleString()}\` },
                  { label: 'Fee in INR', value: \`₹\${feeINRLakh}L/yr\` },
                  { label: 'IELTS Minimum', value: \`\${course.ieltsMin}+\` },
                  { label: 'Duration', value: course.duration },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source={\`${uniId}-course-\${slug}\`} defaultCountry="Canada" compact />
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
                { label: 'Duration', value: course.duration + ' full-time' },
                { label: 'Campus', value: course.campus },
                { label: 'Intakes', value: course.intakeMonths.join(' & ') },
                { label: 'Annual Tuition (CAD)', value: \`$\${course.annualCAD.toLocaleString()}\` },
                { label: 'Annual Tuition (USD)', value: \`$\${course.annualUSD.toLocaleString()}\` },
                { label: 'Living Cost (CAD)', value: \`$\${course.livingCostCAD.toLocaleString()}/yr\` },
                { label: 'Total Course Fee', value: \`$\${course.totalCAD.toLocaleString()} CAD\` },
              ].map(f => (
                <div key={f.label} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">English Language Requirements</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'IELTS Academic', value: \`\${course.ieltsMin}+\`, sub: 'No band below 5.5' },
                { label: 'TOEFL iBT', value: \`\${course.toeflMin}+\`, sub: 'Writing 20+' },
                { label: 'PTE Academic', value: \`\${course.pteMin}+\`, sub: 'No band below 50' },
              ].map(e => (
                <div key={e.label} className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-xl font-bold text-brand-700">{e.value}</p>
                  <p className="text-xs font-semibold text-gray-700 mt-1">{e.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{e.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Total Cost of Study (Indian Students)</h2>
            <div className="space-y-3">
              {[
                { label: \`Tuition Fee × \${course.durationYears} year\${course.durationYears !== 1 ? 's' : ''}\`, value: \`$\${course.totalCAD.toLocaleString()} CAD\`, highlight: true },
                { label: \`Living Cost × \${course.durationYears} year\${course.durationYears !== 1 ? 's' : ''}\`, value: \`$\${(course.livingCostCAD * course.durationYears).toLocaleString()} CAD\` },
                { label: 'Total Estimated Cost', value: \`$\${(course.totalCAD + course.livingCostCAD * course.durationYears).toLocaleString()} CAD\`, highlight: true },
                { label: 'In Indian Rupees (₹)', value: \`₹\${((course.totalCAD + course.livingCostCAD * course.durationYears) * ${CAD_TO_INR} / 100000).toFixed(1)} Lakh\`, highlight: true },
              ].map(r => (
                <div key={r.label} className={\`flex justify-between items-center p-3 rounded-xl \${r.highlight ? 'bg-brand-50 font-bold' : 'bg-gray-50'}\`}>
                  <span className="text-sm text-gray-700">{r.label}</span>
                  <span className={\`text-sm \${r.highlight ? 'text-brand-700' : 'text-gray-900'}\`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Canada Study Permit & Work Rights</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Visa Type', value: 'Canada Study Permit' },
                { label: 'Work Rights (Term)', value: '24 hrs/week (on-campus unlimited)' },
                { label: 'Work Rights (Vacation)', value: 'Full-time' },
                { label: 'Post-Study Work', value: ${config.pgwp ? "'PGWP — up to 3 years'" : "'Not PGWP eligible'"} },
              ].map(f => (
                <div key={f.label} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{f.value}</p>
                </div>
              ))}
            </div>${config.pgwp ? `
            <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
              <p className="text-xs text-green-800 font-semibold">✅ PGWP Eligible Institution</p>
              <p className="text-xs text-green-700 mt-1">Graduates can apply for a Post-Graduation Work Permit valid for up to 3 years, which can lead to Canadian Permanent Residency.</p>
            </div>` : ''}
          </div>

          <div className="bg-brand-700 rounded-2xl p-6 text-white text-center">
            <h2 className="text-xl font-bold mb-2">Interested in {course.name}?</h2>
            <p className="text-blue-200 text-sm mb-4">
              Book a free counselling session. Our Canada admissions advisors help Indian students every step of the way.
            </p>
            <Link href="/book-counselling" className="btn-gold inline-block">
              Get Free Guidance →
            </Link>
          </div>
        </div>

        <div className="space-y-5">
          <div className="sticky top-20">
            <LeadForm source={\`${uniId}-course-\${slug}-sidebar\`} defaultCountry="Canada" />
            <div className="mt-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Related Links</h3>
              <div className="space-y-2">
                <a href={course.url} target="_blank" rel="noopener noreferrer"
                  className="block text-sm text-brand-700 hover:underline">
                  Official Course Page ↗
                </a>
                <Link href="/universities/${config.slug}/courses" className="block text-sm text-brand-700 hover:underline">
                  All ${config.shortName} Courses →
                </Link>
                <Link href="/universities/country/canada" className="block text-sm text-brand-700 hover:underline">
                  Study in Canada Guide →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
`;

  // courses/page.tsx (index)
  const levelOrder = ['Undergraduate', 'Honours Bachelor', 'Advanced Diploma', 'Graduate Certificate', 'Masters', 'Graduate Diploma', 'Diploma', 'Certificate', 'Foundation', 'PhD', 'Postgraduate'];

  const indexPageContent = `import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { ${varName} } from '${dataImport}';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: '${config.shortName} International Courses – All Programs, Fees & IELTS 2025',
  description: \`${config.name} — \${(${varName} as unknown as any[]).length} courses for international students. ${pgwpNote}IELTS ${config.ieltsDefault}+. ${intakesStr} intakes. Free admission guidance from Jaivik Overseas Consultants.\`,
  path: '/universities/${config.slug}/courses',
  keywords: ['${config.shortName} courses', '${config.name} international', '${config.shortName} fees', 'study in Canada', 'Canada university', 'PGWP'],
});

const levelOrder = ${JSON.stringify(levelOrder)};

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
  const courses = ${varName} as unknown as any[];
  const groups = groupByLevel(courses);
  const totalCourses = courses.length;
  const avgFee = Math.round(courses.reduce((s: number, c: any) => s + c.annualCAD, 0) / (totalCourses || 1));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: '${config.name}',
    sameAs: '${config.sameAs}',
    address: { '@type': 'PostalAddress', addressLocality: '${config.city}', addressRegion: '${config.province}', addressCountry: 'CA' },
  };

  return (
    <>
      <JsonLd data={schema} />

      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/country/canada" className="hover:text-white">Canada</Link> /
            <span className="text-white">${config.shortName}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇨🇦 ${config.city}, Canada${config.pgwp ? ' · PGWP Eligible' : ''}${rankingBadge}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                ${config.name} — International Courses
              </h1>
              <p className="text-blue-200 text-lg mb-5">
                {totalCourses} programs · Avg CAD $\${avgFee.toLocaleString()}/yr · IELTS ${config.ieltsDefault}+ · ${intakesStr} intakes
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Courses', value: totalCourses },
                  { label: 'QS Ranking', value: '${config.qsRanking && config.qsRanking < 1400 ? '#' + config.qsRanking : 'N/A'}' },
                  { label: 'Avg Annual Fee', value: \`$\${Math.round(avgFee/1000)}K CAD\` },
                  { label: 'PGWP', value: '${config.pgwp ? 'Eligible ✅' : 'N/A'}' },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source="${uniId}-courses-index" defaultCountry="Canada" compact />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-10">
          {Object.entries(groups)
            .sort(([a], [b]) => {
              const oa = levelOrder.indexOf(a) === -1 ? 99 : levelOrder.indexOf(a);
              const ob = levelOrder.indexOf(b) === -1 ? 99 : levelOrder.indexOf(b);
              return oa - ob;
            })
            .map(([level, lvCourses]) => (
            <div key={level}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                {level} Programs
                <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full font-normal">{lvCourses.length}</span>
              </h2>
              <div className="space-y-3">
                {(lvCourses as any[]).sort((a: any, b: any) => a.name.localeCompare(b.name)).map((c: any) => (
                  <Link key={c.slug} href={\`/universities/${config.slug}/courses/\${c.slug}\`}
                    className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all flex items-center justify-between group">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-brand-700 text-sm leading-snug">{c.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{c.duration} · {c.intakeMonths.join(' & ')} · {c.campus}</p>
                    </div>
                    <div className="ml-4 text-right flex-shrink-0">
                      <p className="text-sm font-bold text-brand-700">{\`$\${c.annualCAD.toLocaleString()} CAD/yr\`}</p>
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
            <LeadForm source="${uniId}-courses-sidebar" defaultCountry="Canada" />
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Facts — ${config.shortName}</h3>
              {[
                ['Established', '${config.establishedYear}'],
                ['Location', '${config.city}, ${config.province}'],
                ['Campus', '${config.campus}'],
                ['IELTS Min', '${config.ieltsDefault} overall'],
                ['Intakes', '${intakesStr}'],
                ['Work Rights', '24 hrs/week (term)'],
                ['PGWP', '${config.pgwp ? 'Eligible — up to 3 years' : 'Not eligible'}'],
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

  fs.writeFileSync(path.join(appDir, '[slug]', 'page.tsx'), slugPageContent, 'utf8');
  console.log(`✅ Written: ${path.join(appDir, '[slug]', 'page.tsx')}`);
  fs.writeFileSync(path.join(appDir, 'page.tsx'), indexPageContent, 'utf8');
  console.log(`✅ Written: ${path.join(appDir, 'page.tsx')}`);
  console.log(`\n🎉 ${config.name}: ${courses.length} course pages generated`);
}

const uniId = process.argv[2];
if (!uniId) { console.error('Usage: node generate-canada-pages.js <uni-id>'); process.exit(1); }
generatePages(uniId);
