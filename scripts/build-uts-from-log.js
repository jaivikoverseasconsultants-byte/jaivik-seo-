/**
 * Build uts-courses.json from scraper stdout log + sitemap URLs.
 * Uses UTS defaults for fee/IELTS/duration since scraper is still running.
 */
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const LOG_FILE = process.argv[2] || '';
const OUTPUT = path.join(__dirname, '../data/uts-courses.json');

function inferLevel(name) {
  const n = name.toLowerCase();
  if (/doctor of philosophy|phd/i.test(n)) return 'PhD';
  if (/juris doctor/i.test(n)) return 'Masters';
  if (/master of|masters/i.test(n)) return 'Masters';
  if (/graduate diploma/i.test(n)) return 'Graduate Diploma';
  if (/graduate certificate/i.test(n)) return 'Graduate Certificate';
  if (/honours/i.test(n) && /bachelor/i.test(n)) return 'Undergraduate (Honours)';
  if (/bachelor of|bachelor's/i.test(n)) return 'Undergraduate';
  if (/diploma/i.test(n)) return 'Diploma';
  return 'Postgraduate';
}

function inferDurationYears(name) {
  const n = name.toLowerCase();
  if (/phd|doctor of philosophy/i.test(n)) return 3;
  if (/graduate certificate/i.test(n)) return 0.5;
  if (/graduate diploma/i.test(n)) return 1;
  if (/extension/i.test(n)) return 2;
  if (/master of|masters|juris doctor/i.test(n)) return 2;
  if (/honours/i.test(n)) return 1; // honours year
  if (/bachelor of/i.test(n)) return 3;
  if (/diploma/i.test(n)) return 1;
  return 2;
}

// UTS 2025 typical fees by level (AUD per year)
function inferAnnualAUD(level, name) {
  const n = name.toLowerCase();
  if (/phd|doctor of philosophy/i.test(n)) return 28800;
  if (/graduate certificate/i.test(n)) return 18500;
  if (/graduate diploma/i.test(n)) return 22000;
  if (/master of engineering|master of professional engineering/i.test(n)) return 37220;
  if (/master of information technology/i.test(n)) return 37495;
  if (/master of business analytics/i.test(n)) return 36330;
  if (/master of data science/i.test(n)) return 37495;
  if (/master of professional accounting/i.test(n)) return 34080;
  if (/master of architecture/i.test(n)) return 35740;
  if (/juris doctor|master of laws/i.test(n)) return 36860;
  if (/mba|master of business administration/i.test(n)) return 37220;
  if (/master of/i.test(n)) return 35000;
  if (/bachelor of engineering/i.test(n)) return 40918;
  if (/bachelor of information technology|bachelor of computing/i.test(n)) return 35280;
  if (/bachelor of business|bachelor of accounting/i.test(n)) return 31680;
  if (/bachelor of science/i.test(n)) return 32400;
  if (/bachelor of nursing/i.test(n)) return 34740;
  if (/bachelor of/i.test(n)) return 31500;
  return 33000;
}

(async () => {
  // 1. Get course URLs from sitemap
  console.log('Fetching sitemap…');
  const r = await axios.get('https://www.uts.edu.au/sitemap.xml', {
    timeout: 30000,
    headers: { 'User-Agent': 'Mozilla/5.0 Chrome/124.0' }
  });
  const allUrls = [...r.data.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const courseUrls = allUrls.filter(u => {
    try {
      const parts = new URL(u).pathname.replace(/\/$/, '').split('/').filter(Boolean);
      return parts[0] === 'courses' && parts.length === 2 && parts[1] !== 'course-not-found';
    } catch { return false; }
  });
  console.log(`Sitemap course URLs: ${courseUrls.length}`);

  // 2. Parse names from log file (if provided)
  const nameByIndex = {};
  if (LOG_FILE && fs.existsSync(LOG_FILE)) {
    const lines = fs.readFileSync(LOG_FILE, 'utf8').split('\n');
    for (const line of lines) {
      const m = line.match(/^\[\s*(\d+)\/\d+\]\s+(.+)/);
      if (m) {
        const idx = parseInt(m[1], 10) - 1; // 0-based
        const name = m[2].trim();
        nameByIndex[idx] = name;
      }
    }
    console.log(`Names extracted from log: ${Object.keys(nameByIndex).length}`);
  }

  // 3. Build dataset
  const courses = courseUrls.map((url, i) => {
    const urlSlug = url.split('/').pop();
    // Derive name from URL slug if not in log
    const logName = nameByIndex[i];
    const name = logName
      ? logName.split(/(?=[A-Z][a-z]+\s+degree\s+research)/)[0].replace(/\s+$/,'').trim()
      : urlSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const level = inferLevel(name);
    const durationYears = inferDurationYears(name);
    const annualAUD = inferAnnualAUD(level, name);
    const annualUSD = Math.round(annualAUD * 0.65);
    const slug = 'uts-' + urlSlug;

    return {
      name,
      slug,
      url,
      level,
      duration: `${durationYears} year${durationYears !== 1 ? 's' : ''}`,
      durationYears,
      annualAUD,
      annualUSD,
      totalAUD: Math.round(annualAUD * durationYears),
      ieltsMin: 6.5,
      intakeMonths: ['February', 'July'],
      campus: 'City Campus',
    };
  });

  // Deduplicate by name
  const byName = new Map();
  courses.forEach(c => { if (!byName.has(c.name)) byName.set(c.name, c); });
  const final = [...byName.values()];

  fs.writeFileSync(OUTPUT, JSON.stringify(final, null, 2), 'utf8');
  console.log(`\n✅ Saved ${final.length} courses → ${OUTPUT}`);

  const byLevel = {};
  final.forEach(c => { byLevel[c.level] = (byLevel[c.level]||0)+1; });
  console.log('By level:', byLevel);
})().catch(e => { console.error(e.message); process.exit(1); });
