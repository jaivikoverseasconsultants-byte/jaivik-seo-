/**
 * UTS International Courses Scraper
 * Sources course URLs from UTS sitemap, scrapes each course page.
 * Usage: node scripts/scrape-uts.js
 * Output: data/uts-courses.json
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const SITEMAP = 'https://www.uts.edu.au/sitemap.xml';
const OUTPUT  = path.join(__dirname, '../data/uts-courses.json');
const DELAY   = 900; // ms between requests

const sleep = ms => new Promise(r => setTimeout(r, ms));

const ax = axios.create({
  timeout: 20000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
    'Accept-Language': 'en-AU,en;q=0.9',
  },
});

// ── Step 1: Get all course URLs from sitemap ──────────────────────────────────

async function getCourseUrls() {
  console.log('Fetching UTS sitemap…');
  const r = await ax.get(SITEMAP);
  const allUrls = [...r.data.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  console.log(`Sitemap: ${allUrls.length} total URLs`);

  // Course pages: /courses/[slug] (not /courses/majors/[slug] or /courses/course-not-found)
  const courseUrls = allUrls.filter(u => {
    try {
      const parts = new URL(u).pathname.replace(/\/$/, '').split('/').filter(Boolean);
      if (parts[0] !== 'courses') return false;
      if (parts.length !== 2) return false; // only direct /courses/[slug]
      if (parts[1] === 'course-not-found') return false;
      return true;
    } catch { return false; }
  });

  console.log(`Found ${courseUrls.length} course pages\n`);
  return courseUrls;
}

// ── Parsers ───────────────────────────────────────────────────────────────────

function inferLevel(name) {
  const n = name.toLowerCase();
  if (/doctor of philosophy|phd/i.test(n)) return 'PhD';
  if (/master of|masters/i.test(n)) return 'Masters';
  if (/graduate diploma/i.test(n)) return 'Graduate Diploma';
  if (/graduate certificate/i.test(n)) return 'Graduate Certificate';
  if (/honours/i.test(n)) return 'Undergraduate (Honours)';
  if (/bachelor of|bachelor's/i.test(n)) return 'Undergraduate';
  if (/diploma/i.test(n)) return 'Diploma';
  return 'Postgraduate';
}

function parseDurationYears(text) {
  // "1.5 years full time" → 1.5
  const m = text.match(/([\d.]+)\s*years?\s*full[\s-]*time/i);
  return m ? parseFloat(m[1]) : null;
}

function parseIelts(text) {
  const m = text.match(/IELTS[^:]*:\s*overall\s*([\d.]+)/i)
          || text.match(/IELTS[^0-9]*([\d.]+)/i);
  return m ? parseFloat(m[1]) : 6.5; // default for UTS
}

function parseIntakes(text) {
  // UTS standard: February (Autumn) and July (Spring)
  // Some courses may only be February
  const months = [];
  if (/february|autumn|semester\s*1|session\s*1/i.test(text)) months.push('February');
  if (/july|spring|semester\s*2|session\s*2/i.test(text)) months.push('July');
  if (/january/i.test(text)) months.push('January');
  return months.length ? months : ['February', 'July'];
}

function parseFees(text) {
  // Find all dollar amounts with comma formatting
  const amounts = [...text.matchAll(/\$\s*([\d,]+)/g)]
    .map(m => parseInt(m[1].replace(/,/g, ''), 10))
    .filter(n => n > 5000 && n < 500000); // plausible fee range

  if (!amounts.length) return { totalAUD: null, annualAUD: null };

  // UTS shows: international fee first, then domestic, then HELP limit
  // For international: typically 15000-50000 per year range
  // Total course fee is typically 30000-200000
  // We want the international annual fee

  // Look for the indicative total tuition fee context
  const totalMatch = text.match(/indicative total tuition fee[^$]*?\$([\d,]+)/i);
  const totalAUD = totalMatch ? parseInt(totalMatch[1].replace(/,/g,''), 10) : amounts[0];

  return { totalAUD, annualAUD: null, amounts };
}

// ── Scrape one course page ────────────────────────────────────────────────────

async function scrapeCourse(url, index, total) {
  process.stdout.write(`[${String(index).padStart(3)}/${total}] `);
  try {
    const r = await ax.get(url, { timeout: 15000 });
    const $ = cheerio.load(r.data);
    const text = r.data;

    // Name: get only direct text of h1 (not nested elements)
    const h1 = $('h1').first();
    const nameRaw = h1.clone().children().remove().end().text().replace(/\s+/g, ' ').trim()
      || h1.text().replace(/\s+/g, ' ').trim();
    // Truncate at common separators that indicate non-name content
    const name = nameRaw.split(/(?=[A-Z][a-z]+\s+degree\s+research)/)[0]
      .replace(/\s+$/,'').trim();
    if (!name || name.toLowerCase().includes('not found')) {
      process.stdout.write(`SKIP (no name)\n`);
      return null;
    }

    // Level
    const level = inferLevel(name);

    // Duration
    const durationText = text.match(/([\d.]+)\s*years?\s*full[\s-]*time[^"]{0,40}/i)?.[0] || '';
    const durationYears = parseDurationYears(durationText);
    const duration = durationYears
      ? `${durationYears} year${durationYears !== 1 ? 's' : ''}`
      : '';

    // Fees - UTS pages have total course fee
    const { totalAUD, amounts } = parseFees(text);
    // Compute annual from total / years; if bachelor/honours assume per-year
    let annualAUD = null;
    if (totalAUD && durationYears) {
      annualAUD = Math.round(totalAUD / durationYears);
    } else if (totalAUD && level === 'Undergraduate') {
      // Bachelor pages sometimes show annual fee directly (first amount < 60000)
      const firstSmall = (amounts || []).find(n => n < 60000);
      annualAUD = firstSmall || totalAUD;
    } else if (totalAUD) {
      annualAUD = totalAUD; // single figure — treat as total, convert below
    }

    // Keep annual in a sensible range
    if (annualAUD && annualAUD > 80000) {
      // Probably total, not annual — try dividing by likely duration
      const guessYears = /phd|doctoral/i.test(name) ? 3 : /master|graduate/i.test(name) ? 2 : 4;
      annualAUD = Math.round(annualAUD / guessYears);
    }
    const annualUSD = annualAUD ? Math.round(annualAUD * 0.65) : null;

    // IELTS
    const ieltsMin = parseIelts(text);

    // Intakes
    const intakeRaw = text.match(/(intake|semester|session|february|july)[^<\n]{0,200}/i)?.[0] || '';
    const intakeMonths = parseIntakes(intakeRaw + ' ' + text.slice(0, 5000));

    // Campus
    let campus = 'City Campus';
    const campusText = text.match(/campus[^<\n]{0,100}/i)?.[0] || '';
    if (/haymarket/i.test(campusText)) campus = 'Haymarket';
    else if (/online/i.test(campusText)) campus = 'Online';

    // Slug from URL
    const slug = 'uts-' + url.split('/').pop().replace(/\/$/, '');

    process.stdout.write(`${name.slice(0, 50)}\n`);
    return {
      name,
      slug,
      url,
      level,
      duration,
      durationYears,
      annualAUD,
      annualUSD,
      totalAUD,
      ieltsMin,
      intakeMonths,
      campus,
    };
  } catch (err) {
    process.stdout.write(`ERROR: ${err.response?.status || err.message.slice(0, 40)}\n`);
    return null;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🦘 UTS International Courses Scraper\n');

  const urls = await getCourseUrls();
  const results = [];

  for (let i = 0; i < urls.length; i++) {
    const course = await scrapeCourse(urls[i], i + 1, urls.length);
    if (course) results.push(course);
    if (i < urls.length - 1) await sleep(DELAY);
  }

  // Deduplicate by name
  const byName = new Map();
  results.forEach(c => { if (!byName.has(c.name)) byName.set(c.name, c); });
  const final = [...byName.values()];

  fs.writeFileSync(OUTPUT, JSON.stringify(final, null, 2), 'utf8');

  console.log(`\n✅ Saved ${final.length} courses → ${OUTPUT}`);
  const byLevel = {};
  final.forEach(c => { byLevel[c.level] = (byLevel[c.level]||0)+1; });
  console.log('By level:', byLevel);
  const withFee = final.filter(c=>c.annualAUD).length;
  console.log(`With fees: ${withFee}/${final.length}`);
  console.log('\nSample entries:');
  final.slice(0,5).forEach(c =>
    console.log(`  ${c.name} | ${c.level} | ${c.duration} | AUD $${(c.annualAUD||0).toLocaleString()}/yr | IELTS ${c.ieltsMin}`)
  );
}

main().catch(err => { console.error('\n❌', err.message); process.exit(1); });
