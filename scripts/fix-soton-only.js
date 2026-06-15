// Southampton fix — use Filter 1: /courses/{slug} degree programme pages
// Run: node scripts/fix-soton-only.js

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const DELAY_MS = 350;
const PAGE_TIMEOUT = 12000;
const SITEMAP_TIMEOUT = 20000;
const DATA_DIR = path.join(__dirname, '..', 'data');
const GBP_USD = 1.27;
const GBP_INR = 107;

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-GB,en;q=0.9',
};

async function get(url, timeout = PAGE_TIMEOUT) {
  try {
    const r = await axios.get(url, { headers: HEADERS, timeout, maxRedirects: 4 });
    return { ok: true, status: r.status, data: r.data };
  } catch (e) {
    return { ok: false, status: e.response?.status ?? 0, data: '' };
  }
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Sitemap ───────────────────────────────────────────────────────────────────
async function getSitemapUrls() {
  console.log('Fetching Southampton sitemap...');
  const res = await get('https://www.southampton.ac.uk/sitemap.xml', SITEMAP_TIMEOUT);
  if (!res.ok) { console.log(`HTTP ${res.status}`); return []; }
  const $ = cheerio.load(res.data, { xmlMode: true });
  const urls = [];
  $('url loc, sitemap loc').each((_, el) => urls.push($(el).text().trim()));
  console.log(`✓ ${urls.length} sitemap URLs`);
  return [...new Set(urls)];
}

// ── Filter 1: /courses/{slug} — actual degree programme pages ─────────────────
// Pattern: southampton.ac.uk/courses/{subject}-{degree-qualifier}
// e.g. /courses/accounting-finance-masters-msc
//      /courses/data-science-msc
//      /courses/computer-science-bsc
function isDegreeProgrammeUrl(url) {
  try {
    const p = new URL(url).pathname;
    const segs = p.split('/').filter(Boolean);
    if (segs.length !== 2 || segs[0] !== 'courses') return false;
    const slug = segs[1];
    if (slug.length < 5 || slug.includes('.')) return false;
    if (/^\d{4}-\d{2}$/.test(slug)) return false; // year segments
    // Must look like a programme (contain a degree keyword OR be reasonably long)
    return /\b(msc|bsc|ba|beng|meng|mba|llm|ma|phd|mres|pgcert|pgdip|degree|masters|undergraduate)\b/i.test(slug)
      || slug.length >= 15; // long slugs are almost always programmes
  } catch { return false; }
}

// ── Slug → name fallback (used if crawl gets bad H1) ─────────────────────────
const DEGREE_SUFFIXES = ['masters-msc', 'degree-msc', 'msc', 'masters-ma', 'degree-ma', 'ma',
  'degree-bsc', 'bsc', 'degree-beng', 'beng', 'degree-ba', 'ba', 'mba', 'llm', 'meng',
  'mres', 'pgcert', 'pgdip', 'phd', 'degree', 'masters'];
const DEGREE_LABELS = {
  msc: 'MSc', ma: 'MA', bsc: 'BSc', beng: 'BEng', ba: 'BA', mba: 'MBA',
  llm: 'LLM', meng: 'MEng', mres: 'MRes', pgcert: 'PGCert', pgdip: 'PGDip', phd: 'PhD',
};

function slugToName(slug) {
  let degreeLabel = null;
  let subjectSlug = slug;
  for (const suffix of DEGREE_SUFFIXES) {
    if (slug.endsWith('-' + suffix)) {
      subjectSlug = slug.slice(0, slug.length - suffix.length - 1);
      const code = suffix.replace(/^(masters|degree)-/, '');
      degreeLabel = DEGREE_LABELS[code] ?? suffix.toUpperCase();
      break;
    }
    if (slug === suffix) {
      degreeLabel = DEGREE_LABELS[suffix] ?? suffix.toUpperCase();
      subjectSlug = '';
      break;
    }
  }
  const LOWER = new Set(['of', 'and', 'in', 'for', 'the', 'with', 'by', 'at']);
  const subject = subjectSlug.split('-').map((w, i) =>
    i === 0 || !LOWER.has(w) ? w.charAt(0).toUpperCase() + w.slice(1) : w
  ).join(' ').trim();

  return degreeLabel
    ? subject ? `${degreeLabel} ${subject}` : degreeLabel
    : subject || slug;
}

function isUGDegree(slug, name) {
  return /\b(bsc|beng|ba|barch|degree)\b/i.test(slug)
    && !/\b(msc|mba|meng|llm|mres|masters)\b/i.test(slug);
}

// ── Extract from crawled page ─────────────────────────────────────────────────
function extractFromPage($, url, slug) {
  const title = $('title').text().trim();
  const og = $('meta[property="og:title"]').attr('content') ?? '';
  const h1 = $('h1').first().text().replace(/\s+/g, ' ').trim();
  const body = $('body').text().replace(/\s+/g, ' ');

  // Best name: prefer H1 if it looks like a real programme title
  let name = '';
  for (const candidate of [h1, og.split('|')[0].trim(), title.split('|')[0].trim()]) {
    if (candidate.length >= 6 && candidate.length <= 120
      && !/^(home|error|404|page not found|sorry)/i.test(candidate)
      && !/^(study at southampton|university of southampton)/i.test(candidate)) {
      name = candidate;
      break;
    }
  }
  if (!name) name = slugToName(slug);

  const isUG = isUGDegree(slug, name);
  const studyLevel = isUG ? 'Undergraduate' : 'Postgraduate';
  const dl = name.match(/^(MSc|MA|MBA|MEng|MRes|LLM|BSc|BEng|BA|PGCert|PGDip|PhD)\b/)?.[1] ?? '';
  const level = dl || (isUG ? 'Undergraduate' : 'Masters');

  // Duration
  const durM = body.match(/(?:duration|course length)[:\s]+(\d+(?:\.\d+)?)\s*(year|month)/i)
    || body.match(/\b(\d)\s*year[s]?\s*full[- ]time/i);
  let durationYears = isUG ? 3 : 1;
  if (durM) {
    const val = parseFloat(durM[1]);
    if (/year/i.test(durM[2] ?? 'year') && val >= 1 && val <= 5) durationYears = val;
  }
  if (/placement|sandwich|with year in industry/i.test(name)) durationYears = isUG ? 4 : 2;
  if (/integrated|meng/i.test(name)) durationYears = 4;
  const duration = durationYears === 1 ? '1 year' : `${durationYears} years`;

  // Fee
  const feeM = body.match(/£\s*([\d,]+)\s*(?:per\s*year|per\s*annum|p\.a\.)/i);
  const feeVal = feeM ? parseInt(feeM[1].replace(/,/g, '')) : 0;
  const FEES = {
    MSc: 27000, MA: 20000, MBA: 32000, MEng: 26500, MRes: 22000, LLM: 22000,
    BSc: 23000, BEng: 23000, BA: 21000, PhD: 21000, PGCert: 16000, PGDip: 18000,
  };
  const annualGBP = (feeVal >= 10000 && feeVal <= 60000) ? feeVal : (FEES[dl] ?? (isUG ? 22000 : 24000));

  // IELTS
  const ieltsM = body.match(/IELTS[^0-9]{0,40}(\d\.\d)/i);
  const ieltsMin = ieltsM ? parseFloat(ieltsM[1]) : 6.5;

  // Intakes
  const intakeMonths = [];
  for (const m of ['January', 'February', 'September', 'October']) {
    if (body.includes(m) && !intakeMonths.includes(m)) intakeMonths.push(m);
  }

  return { name, level, studyLevel, duration, durationYears, annualGBP, ieltsMin,
    intakeMonths: intakeMonths.length ? intakeMonths : ['September'] };
}

function makeSlug(name) {
  return ('soton-' + name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  ).slice(0, 80);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const t0 = Date.now();
  console.log('Southampton Fix — Filter 1: /courses/{programme-slug}');
  console.log(`Started: ${new Date().toISOString()}\n`);

  const allUrls = await getSitemapUrls();
  const courseUrls = allUrls.filter(isDegreeProgrammeUrl);
  console.log(`\n✓ Filter 1 (degree programmes): ${courseUrls.length} URLs`);
  console.log('Sample:');
  courseUrls.slice(0, 10).forEach(u => console.log(`  ${u}`));

  // Crawl all (500 × 0.35s ≈ 3 min)
  console.log(`\nCrawling ${courseUrls.length} pages...`);
  const raw = [];
  let ok = 0, fail = 0;
  for (let i = 0; i < courseUrls.length; i++) {
    if (i > 0) await sleep(DELAY_MS);
    const url = courseUrls[i];
    const slug = new URL(url).pathname.split('/').filter(Boolean)[1];
    const res = await get(url);
    if (!res.ok) { fail++; continue; }
    ok++;
    const $ = cheerio.load(res.data);
    const entry = extractFromPage($, url, slug);
    if (entry.name.length >= 5) {
      const lcGBP = 13500;
      raw.push({
        id: `soton-${i+1}`,
        name: entry.name,
        slug: makeSlug(entry.name),
        url,
        level: entry.level,
        studyLevel: entry.studyLevel,
        duration: entry.duration,
        durationYears: entry.durationYears,
        annualGBP: entry.annualGBP,
        annualUSD: Math.round(entry.annualGBP * GBP_USD),
        annualINR: Math.round(entry.annualGBP * GBP_INR),
        totalGBP: Math.round(entry.annualGBP * entry.durationYears),
        livingCostGBP: lcGBP,
        livingCostUSD: Math.round(lcGBP * GBP_USD),
        livingCostINR: Math.round(lcGBP * GBP_INR),
        ieltsMin: entry.ieltsMin,
        toeflMin: 91,
        pteMin: 66,
        intakeMonths: entry.intakeMonths,
        campus: 'Highfield Campus, Southampton',
        country: 'United Kingdom',
        state: 'England',
        city: 'Southampton',
        countryCode: 'GB',
      });
    }
    if ((i + 1) % 25 === 0)
      process.stdout.write(`\r  ${i+1}/${courseUrls.length} (${ok} ok, ${fail} fail)...`);
  }
  process.stdout.write(`\r  ${courseUrls.length}/${courseUrls.length} (${ok} ok, ${fail} fail)\n`);

  // De-dupe by name
  const seen = new Set();
  const slugSeen = new Set();
  const courses = [];
  for (const c of raw) {
    const key = c.name.toLowerCase().replace(/\s+/g, '');
    if (seen.has(key)) continue;
    seen.add(key);
    let slug = c.slug;
    let n = 2;
    while (slugSeen.has(slug)) slug = `${c.slug}-${n++}`;
    slugSeen.add(slug);
    courses.push({ ...c, slug });
  }

  console.log(`\n✓ Extracted: ${raw.length} → ${courses.length} unique courses`);
  console.log('\nSample (first 5):');
  courses.slice(0, 5).forEach((c, i) =>
    console.log(`  [${i+1}] ${c.name} | ${c.studyLevel} | £${c.annualGBP.toLocaleString()} | IELTS ${c.ieltsMin}`));

  // Write TypeScript
  const lines = [
    `// Auto-generated — do not edit manually`,
    `// Source: Sitemap crawl of https://www.southampton.ac.uk/sitemap.xml`,
    `// Generated: ${new Date().toISOString()}`,
    `// ${courses.length} courses`,
    ``,
    `export interface SotonCourse {`,
    `  id: string; name: string; slug: string; url: string;`,
    `  level: string; studyLevel: string; duration: string; durationYears: number;`,
    `  annualGBP: number; annualUSD: number; annualINR: number; totalGBP: number;`,
    `  livingCostGBP: number; livingCostUSD: number; livingCostINR: number;`,
    `  ieltsMin: number; toeflMin: number; pteMin: number;`,
    `  intakeMonths: string[]; campus: string;`,
    `  country: string; state: string; city: string; countryCode: string;`,
    `}`,
    ``,
    `export const sotonCourses: SotonCourse[] = [`,
    ...courses.map(c => `  ${JSON.stringify(c)},`),
    `];`,
    ``,
    `export function getSotonCourseBySlug(slug: string): SotonCourse | undefined {`,
    `  return sotonCourses.find(c => c.slug === slug);`,
    `}`,
  ];
  const ts = lines.join('\n');
  fs.writeFileSync(path.join(DATA_DIR, 'soton-courses.ts'), ts, 'utf8');

  const elapsed = Math.round((Date.now() - t0) / 1000);
  console.log(`\n✓ Written: data/soton-courses.ts (${courses.length} courses, ${Buffer.byteLength(ts).toLocaleString()} bytes)`);
  console.log(`Elapsed: ${elapsed}s`);
  console.log('\n→ Next: npx tsc --noEmit && npm run build');
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
