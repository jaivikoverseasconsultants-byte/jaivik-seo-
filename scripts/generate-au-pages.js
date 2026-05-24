/**
 * Universal page generator for Australian universities.
 * Usage: node scripts/generate-au-pages.js <uni-id>
 * Reads: data/scraped/australia/<uni-id>.json
 * Writes: data/<uni-id>-courses.ts
 *         app/universities/<slug>/courses/page.tsx
 *         app/universities/<slug>/courses/[slug]/page.tsx
 */

const fs = require('fs');
const path = require('path');

const CONFIGS = require('./au-universities-config');

const INR_RATE = 84;
const LIVING_AUD = 21000;
const LIVING_USD = Math.round(LIVING_AUD * 0.65);

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

function levelLabel(level) {
  if (/PhD|Doctor/.test(level)) return 'PhD';
  if (/Masters|Master/.test(level)) return 'Postgraduate';
  if (/Graduate Diploma/.test(level)) return 'Postgraduate';
  if (/Graduate Certificate/.test(level)) return 'Postgraduate';
  if (/Undergraduate/.test(level)) return 'Undergraduate';
  if (/Diploma/.test(level)) return 'Diploma';
  if (/Certificate/.test(level)) return 'Certificate';
  return 'Postgraduate';
}

function j(s) {
  return JSON.stringify(s);
}

function generatePages(uniId) {
  const config = CONFIGS.find(c => c.id === uniId);
  if (!config) {
    console.error(`Unknown university: ${uniId}`);
    process.exit(1);
  }

  const inFile = path.join(__dirname, `../data/scraped/australia/${uniId}.json`);
  if (!fs.existsSync(inFile)) {
    console.error(`No data found: ${inFile}`);
    console.error('Run scraper first.');
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(inFile, 'utf8'));
  console.log(`\nGenerating pages for ${config.name} (${raw.length} raw courses)…`);

  // Filter out pure research/PhD if desired — keep all for SEO coverage
  const courses = raw.filter(c => c.name && c.name.length > 3);
  console.log(`After filtering: ${courses.length} courses`);

  // Map to structured objects
  const varName = uniId.replace(/-/g, '_') + 'Courses';
  const mapped = courses.map((c, i) => {
    const annualAUD = c.annualAUD || config.fees.default;
    const annualUSD = c.annualUSD || Math.round(annualAUD * 0.65);
    const annualINR = Math.round(annualUSD * INR_RATE);
    const livingINR = Math.round(LIVING_USD * INR_RATE);
    const durationYears = c.durationYears || 2;
    const slug = c.slug || (`${uniId}-` + slugify(c.name));
    return {
      id: `${uniId}-${i + 1}`,
      name: c.name,
      slug,
      url: c.url,
      level: c.level || 'Postgraduate',
      studyLevel: levelLabel(c.level || ''),
      duration: c.duration || `${durationYears} years`,
      durationYears,
      annualAUD,
      annualUSD,
      annualINR,
      totalAUD: c.totalAUD || Math.round(annualAUD * durationYears),
      livingCostAUD: LIVING_AUD,
      livingCostUSD: LIVING_USD,
      livingCostINR: livingINR,
      ieltsMin: c.ieltsMin || config.ieltsDefault,
      toeflMin: config.toeflDefault || 79,
      pteMin: config.pteDefault || 58,
      intakeMonths: Array.isArray(c.intakeMonths) && c.intakeMonths.length ? c.intakeMonths : config.intakes,
      campus: c.campus || config.campus,
      country: 'Australia',
      state: config.state,
      city: config.city,
      countryCode: 'AU',
    };
  });

  // ── Write TypeScript data file ─────────────────────────────────────────────
  const tsPath = path.join(__dirname, `../data/${uniId}-courses.ts`);
  const tsContent = `// Auto-generated — do not edit manually
// Source: data/scraped/australia/${uniId}.json

export interface ${uniId.replace(/-/g,'_').replace(/\b\w/g,c=>c.toUpperCase()).replace(/_/g,'')}Course {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualAUD: number; annualUSD: number; annualINR: number; totalAUD: number;
  livingCostAUD: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
}

export const ${varName} = ${JSON.stringify(mapped, null, 2)} as const;

export function get${varName.replace(/\b\w/g,c=>c.toUpperCase())}BySlug(slug: string) {
  return (${varName} as unknown as any[]).find((c: any) => c.slug === slug) ?? null;
}
`;
  fs.writeFileSync(tsPath, tsContent, 'utf8');
  console.log(`✅ Written: ${tsPath}`);

  // ── Write Next.js pages ────────────────────────────────────────────────────
  const appDir = path.join(__dirname, `../app/universities/${config.slug}/courses`);
  const slugDir = path.join(appDir, '[slug]');
  fs.mkdirSync(slugDir, { recursive: true });

  const dataImport = `@/data/${uniId}-courses`;
  const getterFn = `get${varName.replace(/\b\w/g,c=>c.toUpperCase())}BySlug`;
  const intakesStr = config.intakes.join(' & ');
  const avgFee = Math.round(mapped.reduce((s, c) => s + c.annualAUD, 0) / (mapped.length || 1));
  const qsText = config.qsRanking ? `#${config.qsRanking} QS World Ranking` : 'Australian University';

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
    description: \`\${course.name} at ${config.name}. Annual fee A$\${course.annualAUD.toLocaleString()} (\${course.durationYears} year\${course.durationYears !== 1 ? 's' : ''}). IELTS \${course.ieltsMin}+. Intake: \${course.intakeMonths.join(' & ')}. Free guidance from Jaivik Overseas Consultants.\`,
    path: \`/universities/${config.slug}/courses/\${slug}\`,
    keywords: [course.name, '${config.shortName}', '${config.name}', 'study in Australia', course.level],
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
            <Link href="/universities/${config.slug}" className="hover:text-white">${config.shortName}</Link> /
            <span className="text-white">{course.name}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇦🇺 ${config.name} · {course.campus}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.name}</h1>
              <p className="text-blue-200 text-lg mb-5">
                {course.studyLevel} · {course.duration} · {course.campus}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Annual Fee (AUD)', value: \`A$\${course.annualAUD.toLocaleString()}\` },
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
              <LeadForm source={\`${uniId}-course-\${slug}\`} defaultCountry="Australia" compact />
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
                { label: 'Annual Tuition (AUD)', value: \`A$\${course.annualAUD.toLocaleString()}\` },
                { label: 'Annual Tuition (USD)', value: \`$\${course.annualUSD.toLocaleString()}\` },
                { label: 'Living Cost (AUD)', value: \`A$\${course.livingCostAUD.toLocaleString()}/yr\` },
                { label: 'Total Course Fee', value: \`A$\${course.totalAUD.toLocaleString()}\` },
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
                { label: 'IELTS Academic', value: \`\${course.ieltsMin}+\`, sub: 'Writing 6.0+' },
                { label: 'TOEFL iBT', value: \`\${course.toeflMin}+\`, sub: 'Writing 24+' },
                { label: 'PTE Academic', value: \`\${course.pteMin}+\`, sub: 'Writing 50+' },
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
                { label: \`Tuition Fee × \${course.durationYears} year\${course.durationYears !== 1 ? 's' : ''}\`, value: \`A$\${course.totalAUD.toLocaleString()}\`, highlight: true },
                { label: \`Living Cost × \${course.durationYears} year\${course.durationYears !== 1 ? 's' : ''}\`, value: \`A$\${(course.livingCostAUD * course.durationYears).toLocaleString()}\` },
                { label: 'Total Estimated Cost', value: \`A$\${(course.totalAUD + course.livingCostAUD * course.durationYears).toLocaleString()}\`, highlight: true },
                { label: 'In Indian Rupees (₹)', value: \`₹\${((course.totalAUD + course.livingCostAUD * course.durationYears) * 0.65 * 84 / 100000).toFixed(1)} Lakh\`, highlight: true },
              ].map(r => (
                <div key={r.label} className={\`flex justify-between items-center p-3 rounded-xl \${r.highlight ? 'bg-brand-50 font-bold' : 'bg-gray-50'}\`}>
                  <span className="text-sm text-gray-700">{r.label}</span>
                  <span className={\`text-sm \${r.highlight ? 'text-brand-700' : 'text-gray-900'}\`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-brand-700 rounded-2xl p-6 text-white text-center">
            <h2 className="text-xl font-bold mb-2">Interested in {course.name}?</h2>
            <p className="text-blue-200 text-sm mb-4">
              Book a free counselling session. Our advisors specialise in ${config.shortName} admissions for Indian students.
            </p>
            <Link href="/book-counselling" className="btn-gold inline-block">
              Get Free Guidance →
            </Link>
          </div>
        </div>

        <div className="space-y-5">
          <div className="sticky top-20">
            <LeadForm source={\`${uniId}-course-\${slug}-sidebar\`} defaultCountry="Australia" />
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
                <Link href="/universities/country/australia" className="block text-sm text-brand-700 hover:underline">
                  Study in Australia Guide →
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
  const levelOrder = ['Undergraduate', 'Undergraduate (Honours)', 'Masters', 'Graduate Diploma', 'Graduate Certificate', 'Diploma', 'Certificate', 'PhD', 'Postgraduate'];

  const indexPageContent = `import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { ${varName} } from '${dataImport}';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: '${config.shortName} International Courses – All Programs, Fees & IELTS 2025',
  description: \`${config.name} — \${(${varName} as unknown as any[]).length} courses for international students. IELTS ${config.ieltsDefault}+. ${intakesStr} intakes. Free admission guidance from Jaivik Overseas Consultants.\`,
  path: '/universities/${config.slug}/courses',
  keywords: ['${config.shortName} courses', '${config.name} international', '${config.shortName} fees', 'study in Australia'],
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
  const avgFee = Math.round(courses.reduce((s: number, c: any) => s + c.annualAUD, 0) / (totalCourses || 1));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: '${config.name}',
    sameAs: '${config.sameAs}',
    address: { '@type': 'PostalAddress', addressLocality: '${config.city}', addressRegion: '${config.state}', addressCountry: 'AU' },
  };

  return (
    <>
      <JsonLd data={schema} />

      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <span className="text-white">${config.shortName}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇦🇺 ${config.city}, Australia${config.qsRanking ? ` · #${config.qsRanking} QS World Ranking` : ''}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                ${config.name} — International Courses
              </h1>
              <p className="text-blue-200 text-lg mb-5">
                {totalCourses} programs · Avg A\${avgFee.toLocaleString()}/yr · IELTS ${config.ieltsDefault}+ · ${intakesStr} intakes
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Courses', value: totalCourses },
                  { label: 'QS Ranking', value: '${config.qsRanking ? '#' + config.qsRanking : 'N/A'}' },
                  { label: 'Avg Annual Fee', value: \`A$\${Math.round(avgFee/1000)}K\` },
                  { label: 'Campus', value: '${config.campus}' },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source="${uniId}-courses-index" defaultCountry="Australia" compact />
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
                      <p className="text-sm font-bold text-brand-700">{\`A$\${c.annualAUD.toLocaleString()}/yr\`}</p>
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
            <LeadForm source="${uniId}-courses-sidebar" defaultCountry="Australia" />
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Facts — ${config.shortName}</h3>
              {[
                ['Established', '${config.establishedYear}'],
                ['Location', '${config.city}, ${config.state}'],
                ['Campus', '${config.campus}'],
                ['IELTS Min', '${config.ieltsDefault} overall'],
                ['Intakes', '${intakesStr}'],
                ['Work Rights', '48 hrs/fortnight'],
                ['Post-Study', 'Grad Visa 2–4 years'],
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

  fs.writeFileSync(path.join(slugDir, 'page.tsx'), slugPageContent, 'utf8');
  console.log(`✅ Written: ${slugDir}/page.tsx`);

  fs.writeFileSync(path.join(appDir, 'page.tsx'), indexPageContent, 'utf8');
  console.log(`✅ Written: ${appDir}/page.tsx`);

  console.log(`\n🎉 ${config.name}: ${mapped.length} course pages generated`);
  return mapped.length;
}

const uniId = process.argv[2];
if (!uniId) {
  console.error('Usage: node scripts/generate-au-pages.js <uni-id>');
  process.exit(1);
}
generatePages(uniId);
