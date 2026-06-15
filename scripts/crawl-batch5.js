/**
 * Batch 5 sitemap crawl: Durham, Leeds, Sheffield, Bristol (UK)
 *                        Queens, Dalhousie (Canada)
 *                        RMIT, Adelaide (Australia)
 *                        UCD, Trinity Dublin (Ireland)
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

// ── Config ───────────────────────────────────────────────────────────────────

const UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const FETCH_TIMEOUT = 12000;
const CRAWL_CONCURRENCY = 4;
const MAX_PAGES_PER_UNI = 600;

// ── University definitions ────────────────────────────────────────────────────

const UNIVERSITIES = [
  {
    id: 'durham',
    name: 'Durham University',
    siteUrl: 'https://www.durham.ac.uk',
    sitemapUrl: 'https://www.durham.ac.uk/sitemap.xml',
    urlFilter: (u) => {
      const p = new URL(u).pathname;
      return (
        (p.includes('/postgraduate/courses/') || p.includes('/study/postgraduate/courses/')) &&
        !p.endsWith('/courses/') &&
        p.split('/').filter(Boolean).length >= 4
      );
    },
    slugPrefix: 'durham',
    country: 'UK',
    currency: 'GBP',
    annualGBP: 25000,
    ieltsMin: 6.5,
    intakeMonths: ['September'],
    campus: 'Durham',
    livingCostGBP: 12000,
  },
  {
    id: 'leeds',
    name: 'University of Leeds',
    siteUrl: 'https://www.leeds.ac.uk',
    sitemapUrl: 'https://www.leeds.ac.uk/sitemap.xml',
    urlFilter: (u) => {
      const p = new URL(u).pathname;
      return (
        /\/course\/(postgraduate|undergraduate)\//.test(p) &&
        p.split('/').filter(Boolean).length >= 4
      );
    },
    slugPrefix: 'leeds',
    country: 'UK',
    currency: 'GBP',
    annualGBP: 23000,
    ieltsMin: 6.5,
    intakeMonths: ['September'],
    campus: 'Leeds',
    livingCostGBP: 11000,
  },
  {
    id: 'sheffield',
    name: 'University of Sheffield',
    siteUrl: 'https://www.sheffield.ac.uk',
    sitemapUrl: 'https://www.sheffield.ac.uk/sitemap.xml',
    urlFilter: (u) => {
      const p = new URL(u).pathname;
      return (
        p.includes('/postgraduate/courses/') &&
        !p.endsWith('/courses/') &&
        p.split('/').filter(Boolean).length >= 4
      );
    },
    slugPrefix: 'sheffield',
    country: 'UK',
    currency: 'GBP',
    annualGBP: 22000,
    ieltsMin: 6.5,
    intakeMonths: ['September'],
    campus: 'Sheffield',
    livingCostGBP: 11000,
  },
  {
    id: 'bristol',
    name: 'University of Bristol',
    siteUrl: 'https://www.bristol.ac.uk',
    sitemapUrl: 'https://www.bristol.ac.uk/sitemap.xml',
    urlFilter: (u) => {
      const p = new URL(u).pathname;
      return (
        p.includes('/study/postgraduate/') &&
        !p.endsWith('/postgraduate/') &&
        p.split('/').filter(Boolean).length >= 4
      );
    },
    slugPrefix: 'bristol',
    country: 'UK',
    currency: 'GBP',
    annualGBP: 24000,
    ieltsMin: 6.5,
    intakeMonths: ['September'],
    campus: 'Bristol',
    livingCostGBP: 12000,
  },
  {
    id: 'queens',
    name: "Queen's University",
    siteUrl: 'https://www.queensu.ca',
    sitemapUrl: 'https://www.queensu.ca/sitemap.xml',
    urlFilter: (u) => {
      const p = new URL(u).pathname;
      return (
        (p.includes('/academic/graduate/') || p.includes('/graduate-studies/')) &&
        p.split('/').filter(Boolean).length >= 3
      );
    },
    slugPrefix: 'queens',
    country: 'Canada',
    currency: 'CAD',
    annualCAD: 22000,
    ieltsMin: 6.5,
    intakeMonths: ['September', 'January'],
    campus: 'Kingston, Ontario',
    livingCostCAD: 14000,
  },
  {
    id: 'dalhousie',
    name: 'Dalhousie University',
    siteUrl: 'https://www.dal.ca',
    sitemapUrl: 'https://www.dal.ca/sitemap.xml',
    urlFilter: (u) => {
      const p = new URL(u).pathname;
      return (
        (p.includes('/academics/programs/') || p.includes('/faculty/')) &&
        /\/(graduate|masters|phd|msc|meng|mba)/.test(p) &&
        p.split('/').filter(Boolean).length >= 4
      );
    },
    slugPrefix: 'dal',
    country: 'Canada',
    currency: 'CAD',
    annualCAD: 18000,
    ieltsMin: 6.5,
    intakeMonths: ['September', 'January'],
    campus: 'Halifax, Nova Scotia',
    livingCostCAD: 13000,
  },
  {
    id: 'rmit',
    name: 'RMIT University',
    siteUrl: 'https://www.rmit.edu.au',
    sitemapUrl: 'https://www.rmit.edu.au/sitemap.xml',
    urlFilter: (u) => {
      const p = new URL(u).pathname;
      return (
        p.includes('/study-with-us/') &&
        !p.endsWith('/study-with-us/') &&
        p.split('/').filter(Boolean).length >= 3 &&
        !p.includes('/short-courses/') &&
        !p.includes('/tafe/')
      );
    },
    slugPrefix: 'rmit',
    country: 'Australia',
    currency: 'AUD',
    annualAUD: 38000,
    ieltsMin: 6.5,
    intakeMonths: ['February', 'July'],
    campus: 'Melbourne',
    livingCostAUD: 21000,
  },
  {
    id: 'adelaide',
    name: 'University of Adelaide',
    siteUrl: 'https://www.adelaide.edu.au',
    sitemapUrl: 'https://www.adelaide.edu.au/sitemap.xml',
    urlFilter: (u) => {
      const p = new URL(u).pathname;
      return (
        (p.includes('/degree-finder/') || p.includes('/programs/')) &&
        p.split('/').filter(Boolean).length >= 3 &&
        !p.includes('/short-courses/')
      );
    },
    slugPrefix: 'adelaide',
    country: 'Australia',
    currency: 'AUD',
    annualAUD: 36000,
    ieltsMin: 6.5,
    intakeMonths: ['February', 'July'],
    campus: 'Adelaide',
    livingCostAUD: 19000,
  },
  {
    id: 'ucd',
    name: 'University College Dublin',
    siteUrl: 'https://www.ucd.ie',
    sitemapUrl: 'https://www.ucd.ie/sitemap.xml',
    urlFilter: (u) => {
      const p = new URL(u).pathname;
      return (
        (p.includes('/courses/') || p.includes('/programmes/') || p.includes('/graduate/')) &&
        !p.endsWith('/courses/') &&
        p.split('/').filter(Boolean).length >= 3
      );
    },
    slugPrefix: 'ucd',
    country: 'Ireland',
    currency: 'EUR',
    annualEUR: 18000,
    ieltsMin: 6.5,
    intakeMonths: ['September'],
    campus: 'Dublin',
    livingCostEUR: 13000,
  },
  {
    id: 'tcd',
    name: 'Trinity College Dublin',
    siteUrl: 'https://www.tcd.ie',
    sitemapUrl: 'https://www.tcd.ie/sitemap.xml',
    urlFilter: (u) => {
      const p = new URL(u).pathname;
      return (
        (p.includes('/courses/') || p.includes('/postgraduate/') || p.includes('/graduate/')) &&
        !p.endsWith('/postgraduate/') &&
        p.split('/').filter(Boolean).length >= 3
      );
    },
    slugPrefix: 'tcd',
    country: 'Ireland',
    currency: 'EUR',
    annualEUR: 19000,
    ieltsMin: 6.5,
    intakeMonths: ['September'],
    campus: 'Dublin',
    livingCostEUR: 13000,
  },
];

// ── HTTP helpers ──────────────────────────────────────────────────────────────

function fetchUrl(url, isXml = false) {
  return new Promise((resolve) => {
    const parsed = new URL(url);
    const lib = parsed.protocol === 'https:' ? https : http;
    const opts = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'GET',
      timeout: FETCH_TIMEOUT,
      headers: {
        'User-Agent': UA,
        'Accept': isXml ? 'text/xml,application/xml,*/*' : 'text/html,*/*',
        'Accept-Language': 'en-GB,en;q=0.9',
      },
    };
    const req = lib.request(opts, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location;
        if (loc) return fetchUrl(loc.startsWith('http') ? loc : `${parsed.protocol}//${parsed.hostname}${loc}`, isXml).then(resolve);
      }
      let body = '';
      res.setEncoding('utf8');
      res.on('data', d => { body += d; if (body.length > 3_000_000) res.destroy(); });
      res.on('end', () => resolve({ status: res.statusCode, body }));
      res.on('error', () => resolve({ status: 0, body: '' }));
    });
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: '' }); });
    req.on('error', () => resolve({ status: 0, body: '' }));
    req.end();
  });
}

function extractUrls(xml) {
  return [...xml.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)].map(m => m[1].trim());
}

async function fetchSitemapUrls(sitemapUrl) {
  const { status, body } = await fetchUrl(sitemapUrl, true);
  if (status !== 200) return { urls: [], status };

  // Check if sitemap index
  if (body.includes('<sitemapindex')) {
    const subSitemaps = extractUrls(body);
    const allUrls = [];
    for (const sub of subSitemaps.slice(0, 20)) {
      const { body: subBody } = await fetchUrl(sub, true);
      allUrls.push(...extractUrls(subBody));
    }
    return { urls: allUrls, status };
  }

  return { urls: extractUrls(body), status };
}

// ── Name extraction ───────────────────────────────────────────────────────────

function extractName(html, url) {
  // Try H1
  const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1) {
    const n = h1[1].trim().replace(/\s+/g, ' ');
    if (n.length > 5 && n.length < 120 && !/cookie|404|error|nav/i.test(n)) return n;
  }
  // Try og:title
  const og = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i)
    || html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:title"/i);
  if (og) {
    const n = og[1].split('|')[0].split(' - ')[0].trim();
    if (n.length > 5 && n.length < 120) return n;
  }
  // Try <title>
  const title = html.match(/<title>([^<]+)<\/title>/i);
  if (title) {
    const n = title[1].split('|')[0].split(' - ')[0].split(' — ')[0].trim();
    if (n.length > 5 && n.length < 120) return n;
  }
  // Fallback: URL slug
  const segs = new URL(url).pathname.split('/').filter(Boolean);
  const slug = segs[segs.length - 1];
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function inferLevel(name) {
  const n = name.toLowerCase();
  if (/\bphd\b|doctor/.test(n)) return 'PhD';
  if (/\bmba\b/.test(n)) return 'MBA';
  if (/\bllm\b/.test(n)) return 'LLM';
  if (/\bmres\b/.test(n)) return 'MRes';
  if (/\bpgcert\b|pg cert/.test(n)) return 'PGCert';
  if (/\bpgdip\b|pg dip/.test(n)) return 'PGDip';
  if (/\bmsc\b/.test(n)) return 'MSc';
  if (/\bma\b/.test(n)) return 'MA';
  if (/\bmeng\b/.test(n)) return 'MEng';
  if (/\bmarch\b/.test(n)) return 'MArch';
  if (/\bmaster/.test(n)) return 'MSc';
  if (/\bbsc\b/.test(n)) return 'BSc';
  if (/\bba\b/.test(n)) return 'BA';
  if (/\bbeng\b/.test(n)) return 'BEng';
  if (/\bllb\b/.test(n)) return 'LLB';
  return 'MSc';
}

function inferStudyLevel(level) {
  const ug = ['BSc', 'BA', 'BEng', 'BArch', 'LLB'];
  return ug.includes(level) ? 'Undergraduate' : 'Postgraduate';
}

function inferDuration(level) {
  if (['PhD'].includes(level)) return { dur: '3 years', yrs: 3 };
  if (['MBA', 'MSc', 'MA', 'LLM', 'MRes', 'MEng', 'MArch'].includes(level)) return { dur: '1 year', yrs: 1 };
  if (['PGCert'].includes(level)) return { dur: '1 year', yrs: 1 };
  if (['PGDip'].includes(level)) return { dur: '1 year', yrs: 1 };
  if (['BSc', 'BA', 'BEng', 'LLB'].includes(level)) return { dur: '3 years', yrs: 3 };
  return { dur: '1 year', yrs: 1 };
}

// ── Data quality filter ───────────────────────────────────────────────────────

function isGoodName(name) {
  if (!name || name.length < 5 || name.length > 120) return false;
  if (/404|error|cookie|login|home page|sitemap/i.test(name)) return false;
  if (/^\d+$/.test(name)) return false;
  return true;
}

// ── Concurrency helper ────────────────────────────────────────────────────────

async function pLimit(items, limit, fn) {
  const results = [];
  let idx = 0;
  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

// ── Course builder ────────────────────────────────────────────────────────────

function buildCourse(uni, name, url) {
  const level = inferLevel(name);
  const { dur, yrs } = inferDuration(level);
  const studyLevel = inferStudyLevel(level);

  const base = {
    name,
    slug: `${uni.slugPrefix}-${slugify(name)}`,
    url,
    level,
    studyLevel,
    duration: dur,
    durationYears: yrs,
    ieltsMin: uni.ieltsMin,
    toeflMin: 90,
    pteMin: 62,
    intakeMonths: uni.intakeMonths,
    campus: uni.campus,
    country: uni.country,
  };

  if (uni.currency === 'GBP') {
    return {
      ...base,
      annualGBP: uni.annualGBP,
      annualINR: Math.round(uni.annualGBP * 107),
      annualUSD: Math.round(uni.annualGBP * 1.27),
      totalGBP: uni.annualGBP * yrs,
      livingCostGBP: uni.livingCostGBP,
    };
  }
  if (uni.currency === 'CAD') {
    return {
      ...base,
      annualCAD: uni.annualCAD,
      annualINR: Math.round(uni.annualCAD * 62),
      annualUSD: Math.round(uni.annualCAD * 0.74),
      totalCAD: uni.annualCAD * yrs,
      livingCostCAD: uni.livingCostCAD,
    };
  }
  if (uni.currency === 'AUD') {
    return {
      ...base,
      annualAUD: uni.annualAUD,
      annualINR: Math.round(uni.annualAUD * 55),
      annualUSD: Math.round(uni.annualAUD * 0.65),
      totalAUD: uni.annualAUD * yrs,
      livingCostAUD: uni.livingCostAUD,
    };
  }
  if (uni.currency === 'EUR') {
    return {
      ...base,
      annualEUR: uni.annualEUR,
      annualINR: Math.round(uni.annualEUR * 90),
      annualUSD: Math.round(uni.annualEUR * 1.09),
      totalEUR: uni.annualEUR * yrs,
      livingCostEUR: uni.livingCostEUR,
    };
  }
  return base;
}

// ── TypeScript file writer ────────────────────────────────────────────────────

function writeTS(uni, courses) {
  const iface = uni.id.charAt(0).toUpperCase() + uni.id.slice(1) + 'Course';
  const exportName = uni.id + 'Courses';
  const getterName = `get${iface}BySlug`;

  const feeFields = uni.currency === 'GBP'
    ? `  annualGBP: number;\n  annualINR: number;\n  annualUSD: number;\n  totalGBP: number;\n  livingCostGBP: number;`
    : uni.currency === 'CAD'
    ? `  annualCAD: number;\n  annualINR: number;\n  annualUSD: number;\n  totalCAD: number;\n  livingCostCAD: number;`
    : uni.currency === 'AUD'
    ? `  annualAUD: number;\n  annualINR: number;\n  annualUSD: number;\n  totalAUD: number;\n  livingCostAUD: number;`
    : `  annualEUR: number;\n  annualINR: number;\n  annualUSD: number;\n  totalEUR: number;\n  livingCostEUR: number;`;

  const entries = courses.map(c => {
    const feeStr = uni.currency === 'GBP'
      ? `annualGBP: ${c.annualGBP}, annualINR: ${c.annualINR}, annualUSD: ${c.annualUSD}, totalGBP: ${c.totalGBP}, livingCostGBP: ${c.livingCostGBP}`
      : uni.currency === 'CAD'
      ? `annualCAD: ${c.annualCAD}, annualINR: ${c.annualINR}, annualUSD: ${c.annualUSD}, totalCAD: ${c.totalCAD}, livingCostCAD: ${c.livingCostCAD}`
      : uni.currency === 'AUD'
      ? `annualAUD: ${c.annualAUD}, annualINR: ${c.annualINR}, annualUSD: ${c.annualUSD}, totalAUD: ${c.totalAUD}, livingCostAUD: ${c.livingCostAUD}`
      : `annualEUR: ${c.annualEUR}, annualINR: ${c.annualINR}, annualUSD: ${c.annualUSD}, totalEUR: ${c.totalEUR}, livingCostEUR: ${c.livingCostEUR}`;
    return `  { name: ${JSON.stringify(c.name)}, slug: ${JSON.stringify(c.slug)}, url: ${JSON.stringify(c.url)}, level: ${JSON.stringify(c.level)}, studyLevel: ${JSON.stringify(c.studyLevel)}, duration: ${JSON.stringify(c.duration)}, durationYears: ${c.durationYears}, ieltsMin: ${c.ieltsMin}, toeflMin: ${c.toeflMin}, pteMin: ${c.pteMin}, intakeMonths: ${JSON.stringify(c.intakeMonths)}, campus: ${JSON.stringify(c.campus)}, country: ${JSON.stringify(c.country)}, ${feeStr} }`;
  }).join(',\n');

  return `export interface ${iface} {
  name: string;
  slug: string;
  url: string;
  level: string;
  studyLevel: string;
  duration: string;
  durationYears: number;
  ieltsMin: number;
  toeflMin: number;
  pteMin: number;
  intakeMonths: string[];
  campus: string;
  country: string;
${feeFields}
}

export const ${exportName}: ${iface}[] = [
${entries}
];

export function ${getterName}(slug: string): ${iface} | undefined {
  return ${exportName}.find(c => c.slug === slug);
}
`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function processUniversity(uni) {
  process.stdout.write(`\n[${uni.id.toUpperCase()}] Fetching sitemap... `);

  const { urls, status } = await fetchSitemapUrls(uni.sitemapUrl);
  if (status !== 200) {
    console.log(`BLOCKED (HTTP ${status})`);
    return { uni, count: 0, status: 'blocked' };
  }

  const courseUrls = urls.filter(u => {
    try { return uni.urlFilter(u); } catch { return false; }
  });

  console.log(`${urls.length} sitemap URLs → ${courseUrls.length} course URLs`);

  if (courseUrls.length === 0) {
    console.log(`  ⚠ No URLs matched filter — sample URLs:`);
    urls.slice(0, 5).forEach(u => console.log(`    ${u}`));
    return { uni, count: 0, status: 'no_match' };
  }

  const toCrawl = courseUrls.slice(0, MAX_PAGES_PER_UNI);
  process.stdout.write(`  Crawling ${toCrawl.length} pages... `);

  let done = 0;
  let ok = 0;
  const courses = [];
  const seenNames = new Set();

  await pLimit(toCrawl, CRAWL_CONCURRENCY, async (url) => {
    const { status: s, body } = await fetchUrl(url);
    done++;
    if (done % 50 === 0) process.stdout.write(`${done}/${toCrawl.length} `);

    if (s !== 200) return;
    ok++;

    const name = extractName(body, url);
    if (!isGoodName(name) || seenNames.has(name.toLowerCase())) return;
    seenNames.add(name.toLowerCase());
    courses.push(buildCourse(uni, name, url));
  });

  console.log(`\n  ✓ ${ok}/${toCrawl.length} pages OK → ${courses.length} unique courses`);

  if (courses.length < 10) {
    console.log(`  ⚠ Too few courses (${courses.length}) — skipping write`);
    console.log(`  Sample URLs that returned 200:`);
    return { uni, count: courses.length, status: 'too_few' };
  }

  // Data quality check
  const avgNameLen = courses.reduce((s, c) => s + c.name.length, 0) / courses.length;
  console.log(`  Quality: avg name length ${avgNameLen.toFixed(0)} chars, sample: ${courses.slice(0, 3).map(c => c.name).join(' | ')}`);

  // Write file
  const outPath = path.join(__dirname, `../data/${uni.id}-courses.ts`);
  fs.writeFileSync(outPath, writeTS(uni, courses), 'utf8');
  console.log(`  → Written to data/${uni.id}-courses.ts`);

  return { uni, count: courses.length, status: 'ok' };
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║  BATCH 5 SITEMAP CRAWL                                       ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');

  const results = [];
  for (const uni of UNIVERSITIES) {
    const r = await processUniversity(uni);
    results.push(r);
  }

  console.log('\n\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║  SUMMARY                                                      ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log(`${'University'.padEnd(25)} | ${'Courses'.padEnd(8)} | Status`);
  console.log('─'.repeat(55));
  for (const r of results) {
    const icon = r.status === 'ok' ? '✅' : r.status === 'blocked' ? '🚫' : '⚠️ ';
    console.log(`${icon} ${r.uni.name.padEnd(23)} | ${String(r.count).padEnd(8)} | ${r.status}`);
  }

  const successful = results.filter(r => r.status === 'ok');
  console.log(`\nSuccessful: ${successful.length}/${results.length}`);
  console.log('Files written: ' + successful.map(r => `data/${r.uni.id}-courses.ts`).join(', '));
}

main().catch(console.error);
