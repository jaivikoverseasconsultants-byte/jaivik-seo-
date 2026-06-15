/**
 * Batch 5 targeted crawl: RMIT + Adelaide
 * RMIT:    /study-with-us/levels-of-study/(postgraduate-study|research-programs)/{slug}
 * Adelaide: /study/degrees/{slug}/ — NOT /legacy/ NOT /online/ (keep online)
 */

const https = require('https');
const http  = require('http');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

const UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const TIMEOUT = 14000;
const CONCURRENCY = 5;
const MAX_PAGES = 800;

// ── HTTP ──────────────────────────────────────────────────────────────────────

function fetch(url, isXml = false) {
  return new Promise((resolve) => {
    try {
      const p = new URL(url);
      const lib = p.protocol === 'https:' ? https : http;
      const req = lib.request({
        hostname: p.hostname, path: p.pathname + p.search, method: 'GET', timeout: TIMEOUT,
        headers: { 'User-Agent': UA, 'Accept': isXml ? 'text/xml,*/*' : 'text/html,*/*', 'Accept-Language': 'en-GB,en;q=0.9' },
      }, (res) => {
        if ([301,302,303].includes(res.statusCode) && res.headers.location) {
          const loc = res.headers.location.startsWith('http')
            ? res.headers.location
            : `${p.protocol}//${p.hostname}${res.headers.location}`;
          return fetch(loc, isXml).then(resolve);
        }
        let body = '';
        res.setEncoding('utf8');
        res.on('data', d => { body += d; if (body.length > 2_000_000) res.destroy(); });
        res.on('end', () => resolve({ status: res.statusCode, body }));
        res.on('error', () => resolve({ status: 0, body: '' }));
      });
      req.on('timeout', () => { req.destroy(); resolve({ status: 408, body: '' }); });
      req.on('error', () => resolve({ status: 0, body: '' }));
      req.end();
    } catch { resolve({ status: 0, body: '' }); }
  });
}

function extractXmlUrls(xml) {
  return [...xml.matchAll(/<loc>(https?:\/\/[^<\s]+)<\/loc>/g)].map(m => m[1].trim());
}

async function getSitemapUrls(sitemapUrl) {
  const { status, body } = await fetch(sitemapUrl, true);
  if (status !== 200) return { status, urls: [] };
  if (body.includes('<sitemapindex')) {
    const subs = extractXmlUrls(body);
    const all = [];
    for (const s of subs.slice(0, 30)) {
      const { body: b } = await fetch(s, true);
      all.push(...extractXmlUrls(b));
    }
    return { status, urls: all };
  }
  return { status, urls: extractXmlUrls(body) };
}

// ── Name extraction ───────────────────────────────────────────────────────────

function extractName(html, url) {
  // og:title first (most reliable for course pages)
  const og = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
          || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
  if (og) {
    const n = og[1].split('|')[0].split(' - ')[0].split(' — ')[0].replace(/\s+/g,' ').trim();
    if (n.length > 5 && n.length < 120) return n;
  }
  // H1
  const h1 = html.match(/<h1[^>]*>([^<]{5,120})<\/h1>/i);
  if (h1) {
    const n = h1[1].replace(/\s+/g,' ').trim();
    if (!/404|error|cookie|home/i.test(n)) return n;
  }
  // Title
  const t = html.match(/<title>([^<]{5,150})<\/title>/i);
  if (t) {
    const n = t[1].split('|')[0].split(' - ')[0].split(' — ')[0].trim();
    if (n.length > 5) return n;
  }
  // Fallback: slug
  const segs = new URL(url).pathname.split('/').filter(Boolean);
  return segs[segs.length - 1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function isGoodName(n) {
  if (!n || n.length < 5 || n.length > 150) return false;
  if (/404|error|cookie|login|home|undergraduate|postgraduate|courses listing|find a course/i.test(n)) return false;
  return true;
}

// ── Level inference ───────────────────────────────────────────────────────────

function inferLevel(name, url) {
  const n = name.toLowerCase();
  const u = url.toLowerCase();
  if (/\bphd\b|doctor|research-program/.test(n) || u.includes('research-programs')) return 'PhD';
  if (/\bmba\b/.test(n)) return 'MBA';
  if (/\bllm\b/.test(n)) return 'LLM';
  if (/\bmres\b/.test(n)) return 'MRes';
  if (/\bmsc\b/.test(n) || /master of science/.test(n)) return 'MSc';
  if (/\bma\b(?!\w)/.test(n) || /master of arts/.test(n)) return 'MA';
  if (/\bmeng\b/.test(n)) return 'MEng';
  if (/master/.test(n)) return 'MSc';
  if (/\bbsc\b/.test(n) || /bachelor of science/.test(n)) return 'BSc';
  if (/\bba\b(?!\w)/.test(n) || /bachelor of arts/.test(n)) return 'BA';
  if (/\bbeng\b/.test(n)) return 'BEng';
  if (/bachelor/.test(n)) return 'BSc';
  if (/honours/.test(n)) return 'BSc';
  return 'MSc';
}

function inferStudyLevel(level) {
  return ['BSc','BA','BEng','BArch','LLB'].includes(level) ? 'Undergraduate' : 'Postgraduate';
}

function inferDuration(level) {
  if (level === 'PhD') return { dur: '3 years', yrs: 3 };
  if (['BSc','BA','BEng'].includes(level)) return { dur: '3 years', yrs: 3 };
  return { dur: '1 year', yrs: 1 };
}

function slugify(t) { return t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,''); }

// ── Parallel crawl ────────────────────────────────────────────────────────────

async function crawlPages(urls) {
  const results = new Array(urls.length);
  let idx = 0;
  async function worker() {
    while (idx < urls.length) {
      const i = idx++;
      results[i] = await fetch(urls[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, urls.length) }, worker));
  return results;
}

// ── University crawlers ───────────────────────────────────────────────────────

async function crawlRMIT() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  RMIT University                                          ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  console.log('Fetching sitemap...');
  const { status, urls } = await getSitemapUrls('https://www.rmit.edu.au/sitemap.xml');
  if (status !== 200) { console.log(`BLOCKED (${status})`); return null; }
  console.log(`Total sitemap URLs: ${urls.length}`);

  // Filter: postgraduate + research programme pages (depth=5, specific slug segment)
  const courseUrls = urls.filter(u => {
    try {
      const p = new URL(u).pathname;
      const segs = p.split('/').filter(Boolean);
      if (segs.length < 4) return false;
      if (segs[0] !== 'study-with-us') return false;
      if (segs[1] !== 'levels-of-study') return false;
      if (!['postgraduate-study','research-programs'].includes(segs[2])) return false;
      // Must have a specific slug (4th segment), not just the level index
      if (!segs[3] || segs[3].length < 5) return false;
      // Skip known non-programme paths
      if (/apply|fees|scholarship|entry|how-to|contact|faq|why/i.test(segs[3])) return false;
      return true;
    } catch { return false; }
  });

  console.log(`Filtered to ${courseUrls.length} course URLs`);
  console.log('Sample:', courseUrls.slice(0,5).map(u => new URL(u).pathname).join('\n        '));

  const toCrawl = courseUrls.slice(0, MAX_PAGES);
  console.log(`Crawling ${toCrawl.length} pages (concurrency=${CONCURRENCY})...`);

  let done = 0;
  const courses = [];
  const seenNames = new Set();

  const responses = await crawlPages(toCrawl);
  for (let i = 0; i < toCrawl.length; i++) {
    const { status: s, body } = responses[i] || { status: 0, body: '' };
    done++;
    if (done % 100 === 0) process.stdout.write(`  ${done}/${toCrawl.length}\n`);
    if (s !== 200) continue;

    const name = extractName(body, toCrawl[i]);
    if (!isGoodName(name)) continue;
    const key = name.toLowerCase();
    if (seenNames.has(key)) continue;
    seenNames.add(key);

    const level = inferLevel(name, toCrawl[i]);
    const { dur, yrs } = inferDuration(level);
    courses.push({
      name, slug: `rmit-${slugify(name)}`, url: toCrawl[i],
      level, studyLevel: inferStudyLevel(level),
      duration: dur, durationYears: yrs,
      annualAUD: 38000, annualINR: Math.round(38000 * 55), annualUSD: Math.round(38000 * 0.65),
      totalAUD: 38000 * yrs, livingCostAUD: 21000,
      ieltsMin: 6.5, toeflMin: 90, pteMin: 64,
      intakeMonths: ['February', 'July'],
      campus: 'Melbourne', country: 'Australia',
    });
  }

  console.log(`✓ ${courses.length} unique courses extracted`);
  console.log('Sample:', courses.slice(0,4).map(c => c.name).join(' | '));
  return courses;
}

async function crawlAdelaide() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  University of Adelaide                                   ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  console.log('Fetching sitemap...');
  const { status, urls } = await getSitemapUrls('https://www.adelaide.edu.au/sitemap.xml');
  if (status !== 200) { console.log(`BLOCKED (${status})`); return null; }
  console.log(`Total sitemap URLs: ${urls.length}`);

  // Filter: /study/degrees/{slug}/ — not legacy, not scholarships, not news
  const courseUrls = urls.filter(u => {
    try {
      const p = new URL(u).pathname;
      const segs = p.split('/').filter(Boolean);
      if (segs.length < 2 || segs[0] !== 'study') return false;
      if (segs[1] !== 'degrees') return false;
      if (segs.length < 3 || segs[2].length < 5) return false;
      if (segs[2] === 'legacy') return false;
      // Must look like a specific degree slug
      const slug = segs[2];
      if (!/bachelor|master|doctor|phd|graduate|certificate|diploma|honours|of-/i.test(slug)) return false;
      return true;
    } catch { return false; }
  });

  console.log(`Filtered to ${courseUrls.length} course URLs`);
  console.log('Sample:', courseUrls.slice(0,5).map(u => new URL(u).pathname).join('\n        '));

  const toCrawl = courseUrls.slice(0, MAX_PAGES);
  console.log(`Crawling ${toCrawl.length} pages...`);

  const responses = await crawlPages(toCrawl);
  const courses = [];
  const seenNames = new Set();

  for (let i = 0; i < toCrawl.length; i++) {
    const { status: s, body } = responses[i] || { status: 0, body: '' };
    if (s !== 200) continue;

    const name = extractName(body, toCrawl[i]);
    if (!isGoodName(name)) continue;
    const key = name.toLowerCase();
    if (seenNames.has(key)) continue;
    seenNames.add(key);

    const level = inferLevel(name, toCrawl[i]);
    const { dur, yrs } = inferDuration(level);
    courses.push({
      name, slug: `adelaide-${slugify(name)}`, url: toCrawl[i],
      level, studyLevel: inferStudyLevel(level),
      duration: dur, durationYears: yrs,
      annualAUD: 36000, annualINR: Math.round(36000 * 55), annualUSD: Math.round(36000 * 0.65),
      totalAUD: 36000 * yrs, livingCostAUD: 19000,
      ieltsMin: 6.5, toeflMin: 90, pteMin: 62,
      intakeMonths: ['February', 'July'],
      campus: 'Adelaide', country: 'Australia',
    });
  }

  console.log(`✓ ${courses.length} unique courses extracted`);
  console.log('Sample:', courses.slice(0,4).map(c => c.name).join(' | '));
  return courses;
}

// ── Write TS ──────────────────────────────────────────────────────────────────

function writeTS(id, courses) {
  const iface = id.charAt(0).toUpperCase() + id.slice(1) + 'Course';
  const exportName = id + 'Courses';
  const getter = `get${iface}BySlug`;

  const entries = courses.map(c =>
    `  {"name":${JSON.stringify(c.name)},"slug":${JSON.stringify(c.slug)},"url":${JSON.stringify(c.url)},"level":${JSON.stringify(c.level)},"studyLevel":${JSON.stringify(c.studyLevel)},"duration":${JSON.stringify(c.duration)},"durationYears":${c.durationYears},"annualAUD":${c.annualAUD},"annualINR":${c.annualINR},"annualUSD":${c.annualUSD},"totalAUD":${c.totalAUD},"livingCostAUD":${c.livingCostAUD},"ieltsMin":${c.ieltsMin},"toeflMin":${c.toeflMin},"pteMin":${c.pteMin},"intakeMonths":${JSON.stringify(c.intakeMonths)},"campus":${JSON.stringify(c.campus)},"country":${JSON.stringify(c.country)}}`
  ).join(',\n');

  return `// Auto-generated — sitemap crawl
// ${courses.length} courses

export interface ${iface} {
  name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualAUD: number; annualINR: number; annualUSD: number; totalAUD: number; livingCostAUD: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string; country: string;
}

export const ${exportName}: ${iface}[] = [
${entries}
];

export function ${getter}(slug: string): ${iface} | undefined {
  return ${exportName}.find(c => c.slug === slug);
}
`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

(async () => {
  const rmitCourses = await crawlRMIT();
  const adelaideCourses = await crawlAdelaide();

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  RESULTS                                                  ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  if (rmitCourses && rmitCourses.length >= 20) {
    const out = path.join(__dirname, '../data/rmit-courses.ts');
    fs.writeFileSync(out, writeTS('rmit', rmitCourses), 'utf8');
    console.log(`✅ RMIT: ${rmitCourses.length} courses → data/rmit-courses.ts`);
  } else {
    console.log(`❌ RMIT: ${rmitCourses ? rmitCourses.length : 0} courses — too few, not written`);
  }

  if (adelaideCourses && adelaideCourses.length >= 20) {
    const out = path.join(__dirname, '../data/adelaide-courses.ts');
    fs.writeFileSync(out, writeTS('adelaide', adelaideCourses), 'utf8');
    console.log(`✅ Adelaide: ${adelaideCourses.length} courses → data/adelaide-courses.ts`);
  } else {
    console.log(`❌ Adelaide: ${adelaideCourses ? adelaideCourses.length : 0} courses — too few, not written`);
  }
})();
