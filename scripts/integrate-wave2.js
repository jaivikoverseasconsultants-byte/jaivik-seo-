// Wave 2 integration — builds cleaned per-university course data files from
// data/wave2-crawl/*.ts and patches data/university-course-registry.ts.
// Real-data-only: no fee/duration/IELTS value is invented. Missing fields stay 0/null.
const fs = require('fs');
const path = require('path');

function loadWave2(file) {
  const src = fs.readFileSync(path.join('data/wave2-crawl', file), 'utf8');
  const m = src.match(/=\s*(\[[\s\S]*\]);\s*$/m);
  if (!m) throw new Error('Could not locate array in ' + file);
  return JSON.parse(m[1]);
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/​/g, '')
    .trim();
}

function slugify(s) {
  return s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').substring(0, 90);
}

function classify(name) {
  const n = name.toLowerCase();
  if (/\bmba\b/.test(n)) return { level: 'MBA', studyLevel: 'Postgraduate' };
  if (/^(phd|doctorate|dphil)/.test(n)) return { level: 'PhD', studyLevel: 'Postgraduate' };
  if (/^(ba |bsc|beng|llb|bmus|bachelor|b\.sc|b\.eng)/.test(n) || /bachelor/.test(n)) return { level: 'Bachelor', studyLevel: 'Undergraduate' };
  if (/^(msc|ma\/|ma |llm|march|meng|pgdip|pgcert|master)/.test(n) || /master|pgdip|pgcert/.test(n)) return { level: 'Master', studyLevel: 'Postgraduate' };
  return { level: 'Postgraduate', studyLevel: 'Postgraduate' };
}

const RATES = {
  '£': { code: 'GBP', usd: 1.27, inr: 107 },
  '€': { code: 'EUR', usd: 1.08, inr: 90 },
  '$': { code: 'AUD', usd: 0.66, inr: 55 }, // only used for confirmed AU-domain crawls in this batch
};

function money(feeAmount, feeCurrency) {
  if (!feeAmount || !feeCurrency || !RATES[feeCurrency]) {
    return { code: null, native: 0, usd: 0, inr: 0 };
  }
  const r = RATES[feeCurrency];
  return { code: r.code, native: feeAmount, usd: Math.round(feeAmount * r.usd), inr: Math.round(feeAmount * r.inr) };
}

// ─────────────────────────────────────────────────────────────────────────
// Per-university spec: id prefix, module var name, interface name, output
// file, display metadata, and a transform(rawCourses) -> cleaned course list.
// Each transform encodes the specific manual-review findings for that file.
// ─────────────────────────────────────────────────────────────────────────

const UNIS = [
  {
    slug: 'imperial-college-london', abbr: 'imperial', varName: 'imperialCourses', ifaceName: 'ImperialCourse',
    displayName: 'Imperial College London', country: 'UK', city: 'London', state: 'England', countryCode: 'GB',
    sameAs: 'https://www.imperial.ac.uk',
    transform: raw => raw,
  },
  {
    slug: 'unsw-sydney', abbr: 'unsw-w2', varName: 'unswW2Courses', ifaceName: 'UnswW2Course',
    displayName: 'UNSW Sydney', country: 'Australia', city: 'Sydney', state: 'New South Wales', countryCode: 'AU',
    sameAs: 'https://www.unsw.edu.au',
    transform: raw => raw.filter(c => !['unsw-sydney-handbook', 'unsw-sydney-changes-to-our-master-of-commerce-programs-from-2023'].includes(c.slug)),
  },
  {
    slug: 'goldsmiths-university-london', abbr: 'goldsmiths', varName: 'goldsmithsCourses', ifaceName: 'GoldsmithsCourse',
    displayName: 'Goldsmiths, University of London', country: 'UK', city: 'London', state: 'England', countryCode: 'GB',
    sameAs: 'https://www.gold.ac.uk',
    transform: raw => raw.map(c => {
      if (c.durationRaw === '2 months') return { ...c, durationRaw: null, durationYears: null }; // MA/MFA Scriptwriting — implausible for a Master's
      return c;
    }),
  },
  {
    slug: 'university-of-greenwich', abbr: 'greenwich', varName: 'greenwichCourses', ifaceName: 'GreenwichCourse',
    displayName: 'University of Greenwich', country: 'UK', city: 'London', state: 'England', countryCode: 'GB',
    sameAs: 'https://www.gre.ac.uk',
    transform: raw => raw.filter(c => !/degree apprenticeship/i.test(c.name)), // not open to international students
  },
  {
    slug: 'university-of-central-lancashire', abbr: 'uclan', varName: 'uclanCourses', ifaceName: 'UclanCourse',
    displayName: 'University of Central Lancashire', country: 'UK', city: 'Preston', state: 'England', countryCode: 'GB',
    sameAs: 'https://www.uclan.ac.uk',
    transform: raw => raw
      .filter(c => !/bed-manufacturer-partnership/i.test(c.url)) // research-news article, not a course
      .map(c => {
        if (c.durationRaw === '2 months' || c.durationRaw === '5 months') return { ...c, durationRaw: null, durationYears: null }; // implausible for a Master's
        if (c.slug.includes('aerospace-engineering') && c.feeAmount === 2625) return { ...c, feeAmount: null, feeCurrency: null }; // far below peer MSc fees at same university — likely deposit/per-module figure, not annual
        return c;
      }),
  },
  {
    slug: 'university-of-salford', abbr: 'salford-w2', varName: 'salfordW2Courses', ifaceName: 'SalfordW2Course',
    displayName: 'University of Salford', country: 'UK', city: 'Salford', state: 'England', countryCode: 'GB',
    sameAs: 'https://www.salford.ac.uk',
    transform: raw => raw.map(c => c.durationYears === 0 ? { ...c, durationRaw: null, durationYears: null } : c), // crawler's own convention: null on low confidence, not 0
  },
  {
    slug: 'brunel-university-london', abbr: 'brunel-w2', varName: 'brunelW2Courses', ifaceName: 'BrunelW2Course',
    displayName: 'Brunel University London', country: 'UK', city: 'Uxbridge', state: 'England', countryCode: 'GB',
    sameAs: 'https://www.brunel.ac.uk',
    transform: raw => raw.map(c => c.durationRaw === '2 months' ? { ...c, durationRaw: null, durationYears: null } : c), // MSc by Research implausible at 2 months
  },
  {
    slug: 'university-of-plymouth', abbr: 'plymouth-w2', varName: 'plymouthW2Courses', ifaceName: 'PlymouthW2Course',
    displayName: 'University of Plymouth', country: 'UK', city: 'Plymouth', state: 'England', countryCode: 'GB',
    sameAs: 'https://www.plymouth.ac.uk',
    transform: raw => raw.map(c => c.durationRaw === '5 months' ? { ...c, durationRaw: null, durationYears: null } : c), // BSc implausible at 5 months
  },
  {
    slug: 'university-of-sussex', abbr: 'sussex-w2', varName: 'sussexW2Courses', ifaceName: 'SussexW2Course',
    displayName: 'University of Sussex', country: 'UK', city: 'Falmer, Brighton', state: 'England', countryCode: 'GB',
    sameAs: 'https://www.sussex.ac.uk',
    transform: raw => raw.map(c => (c.feeAmount === 5760) ? { ...c, feeAmount: null, feeCurrency: null } : c), // foundation-year outlier, far below every other Sussex fee in this file — not comparable to the standard/STEM bands
  },
  {
    slug: 'university-of-sunshine-coast', abbr: 'unisc', varName: 'uniscCourses', ifaceName: 'UniscCourse',
    displayName: 'University of the Sunshine Coast', country: 'Australia', city: 'Sippy Downs', state: 'Queensland', countryCode: 'AU',
    sameAs: 'https://www.unisc.edu.au',
    transform: raw => raw.map(c => ({ ...c, name: c.name.replace(/\s*\|\s*UniSC\s*\|\s*University of the Sunshine Coast, Queensland, Australia\s*$/i, '') })),
  },
  {
    slug: 'dublin-business-school', abbr: 'dbs', varName: 'dbsCourses', ifaceName: 'DbsCourse',
    displayName: 'Dublin Business School', country: 'Ireland', city: 'Dublin', state: '', countryCode: 'IE',
    sameAs: 'https://www.dbs.ie',
    transform: raw => {
      let out = raw.filter(c => !/news-and-events/i.test(c.url)); // MBA Student Interview, MBA Society competition — news, not courses
      out = out.map(c => {
        if (c.slug === 'dublin-business-school-courses-in-dublin') return { ...c, name: 'Master of Science (MSc) in Health Psychology', slug: 'dublin-business-school-master-of-science-msc-in-health-psychology' };
        if (c.url.includes(' full-time-undergraduate-ba-(hons)-business-management-(marketing)')) return { ...c, name: 'BA (Hons) Business Management (Marketing)', slug: 'dublin-business-school-ba-hons-business-management-marketing', url: c.url.replace('/ full-time-undergraduate-ba', '/full-time-undergraduate-ba') };
        if (c.url.includes('business-in-information-systems')) return { ...c, name: 'BA (Hons) in Business (Information Systems)', slug: 'dublin-business-school-ba-hons-in-business-information-systems' };
        if (c.url.includes('mba-project-management-full-time')) return { ...c, name: 'MBA - Project Management', slug: 'dublin-business-school-mba-project-management' };
        if (c.durationYears === 0) return { ...c, durationRaw: null, durationYears: null };
        return c;
      });
      // true duplicate: "BA (Hons) Business" evening-degree reachable via two URL aliases
      const seen = new Set();
      out = out.filter(c => {
        if (c.slug === 'dublin-business-school-ba-hons-business') {
          if (seen.has(c.slug)) return false;
          seen.add(c.slug);
        }
        return true;
      });
      return out;
    },
  },
  {
    slug: 'birmingham-city-university', abbr: 'bcu-w2', varName: 'bcuW2Courses', ifaceName: 'BcuW2Course',
    displayName: 'Birmingham City University', country: 'UK', city: 'Birmingham', state: 'England', countryCode: 'GB',
    sameAs: 'https://www.bcu.ac.uk',
    transform: raw => {
      let out = raw.filter(c => !/news-events/i.test(c.url)); // 3 student/showcase news articles
      // Jazz BMus duplicated 4x across year/domain variants — keep one canonical URL
      const seenJazz = new Set();
      out = out.filter(c => {
        if (c.slug === 'birmingham-city-university-jazz-bmus') {
          if (seenJazz.has('x')) return false;
          seenJazz.add('x');
        }
        return true;
      });
      out = out.map(c => c.slug === 'birmingham-city-university-courses'
        ? { ...c, name: 'MBA Degrees (International)', slug: 'birmingham-city-university-mba-degrees-international' }
        : c);
      return out;
    },
  },
  {
    slug: 'national-college-of-ireland', abbr: 'nci', varName: 'nciCourses', ifaceName: 'NciCourse',
    displayName: 'National College of Ireland', country: 'Ireland', city: 'Dublin', state: '', countryCode: 'IE',
    sameAs: 'https://www.ncirl.ie',
    // All 7 rows are sub-pages of the same MBA programme; the "5 years" duration is
    // identical across all 7 despite very different page types — not a real, confident figure.
    // Collapse to one real course entry with duration left unconfirmed.
    transform: raw => [{ ...raw[0], durationRaw: null, durationYears: null }],
  },
];

let totalCourses = 0;
const registryImports = [];
const registryEntries = [];

for (const uni of UNIS) {
  const rawFile = uni.slug + '-courses.ts';
  const raw = loadWave2(rawFile);
  const cleaned = uni.transform(raw);

  const seenSlugs = new Set();
  const courses = cleaned.map((c, idx) => {
    const name = decodeEntities(c.name);
    let slug = c.slug || (uni.slug + '-' + slugify(name));
    if (seenSlugs.has(slug)) slug = slug + '-' + (idx + 1);
    seenSlugs.add(slug);
    const { level, studyLevel } = classify(name);
    const fee = money(c.feeAmount, c.feeCurrency);
    // A generic regex duration-extractor sometimes grabs an unrelated short window (a
    // payment deadline, a placement period) rather than the real programme length.
    // Any Bachelor's/Master's under 6 months is implausible on its face — null it rather
    // than display a misleading duration (real-data-only: skip on low confidence).
    let durationYears = c.durationYears ?? 0;
    let durationRaw = c.durationRaw;
    if (studyLevel !== 'Foundation' && durationYears > 0 && durationYears < 0.5) {
      durationYears = 0;
      durationRaw = null;
    }
    const duration = durationRaw || (durationYears > 0 ? `${durationYears} year(s)` : 'Not specified');
    return {
      id: `${uni.abbr}-${idx + 1}`,
      name,
      slug,
      url: c.url,
      level,
      studyLevel,
      duration,
      durationYears,
      feeCurrencyCode: fee.code,
      annualNative: fee.native,
      annualUSD: fee.usd,
      annualINR: fee.inr,
      ieltsMin: c.ieltsMin ?? 0,
      toeflMin: 0,
      campus: `${uni.city} Campus`,
      intakeMonths: ['September'],
      country: uni.country,
      state: uni.state,
      city: uni.city,
      countryCode: uni.countryCode,
    };
  });

  totalCourses += courses.length;

  const nativeCurrencyField = courses[0]?.feeCurrencyCode ? `annual${courses[0].feeCurrencyCode}` : 'annualNative';
  // Determine the currency field name actually used across the file (first non-null wins; falls back to a generic name)
  const curCode = courses.find(c => c.feeCurrencyCode)?.feeCurrencyCode || null;
  const curField = curCode ? `annual${curCode}` : null;

  const content = `// Wave 2 integration — ${uni.displayName} (${courses.length} courses)
// Source: data/wave2-crawl/${rawFile}, manually reviewed and cleaned 2026-07-29 before
// integration (junk/duplicate/news-page rows dropped, implausible fee/duration values
// nulled — see DATA-AUDIT.md "Wave 2" section for the specific per-file findings).
// Fees/IELTS are 0 where not confidently extracted — do not treat 0 as a real value.

export interface ${uni.ifaceName} {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  ${curField ? `${curField}: number; ` : ''}annualUSD: number; annualINR: number;
  ieltsMin: number; toeflMin: number; campus: string; intakeMonths: string[];
  country: string; state: string; city: string; countryCode: string;
}

export const ${uni.varName}: ${uni.ifaceName}[] = ${JSON.stringify(courses.map(c => {
    const o = {
      id: c.id, name: c.name, slug: c.slug, url: c.url,
      level: c.level, studyLevel: c.studyLevel, duration: c.duration, durationYears: c.durationYears,
    };
    if (curField) o[curField] = c.annualNative;
    o.annualUSD = c.annualUSD; o.annualINR = c.annualINR;
    o.ieltsMin = c.ieltsMin; o.toeflMin = c.toeflMin; o.campus = c.campus; o.intakeMonths = c.intakeMonths;
    o.country = c.country; o.state = c.state; o.city = c.city; o.countryCode = c.countryCode;
    return o;
  }), null, 2)};

export function get${uni.ifaceName}BySlug(slug: string) {
  return ${uni.varName}.find(c => c.slug === slug) ?? null;
}
`;

  fs.writeFileSync(path.join('data', `${uni.abbr}-courses.ts`), content);
  console.log(`Wrote ${courses.length} courses -> data/${uni.abbr}-courses.ts`);

  const moduleVar = 'm_' + uni.slug.replace(/-/g, '_');
  registryImports.push(`import { ${uni.varName} as ${moduleVar} } from './${uni.abbr}-courses';`);
  registryEntries.push(`  '${uni.slug}': ${moduleVar},`);
}

// ── Patch the registry ──────────────────────────────────────────────────
const regPath = 'data/university-course-registry.ts';
let reg = fs.readFileSync(regPath, 'utf8');

if (reg.includes('m_imperial_college_london')) {
  console.log('\nRegistry already patched — skipping (re-run after `git checkout -- ' + regPath + '` if you need to regenerate).');
  process.exit(0);
}

const lastImportMatch = [...reg.matchAll(/^import .+;$/gm)].pop();
const insertAfterImports = lastImportMatch.index + lastImportMatch[0].length;
reg = reg.slice(0, insertAfterImports) + '\n' + registryImports.join('\n') + reg.slice(insertAfterImports);

const closeBraceIdx = reg.indexOf('\n};', reg.indexOf('REGISTRY'));
reg = reg.slice(0, closeBraceIdx) + '\n' + registryEntries.join('\n') + reg.slice(closeBraceIdx);

fs.writeFileSync(regPath, reg);
console.log(`\nPatched ${regPath}: +${registryImports.length} imports, +${registryEntries.length} registry entries`);
console.log(`Total new courses integrated: ${totalCourses}`);
