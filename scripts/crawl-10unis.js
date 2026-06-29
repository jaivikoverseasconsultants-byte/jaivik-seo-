/**
 * Production sitemap crawl: 10 target universities
 * Birmingham, Leeds, Sheffield, Nottingham, Glasgow (UK)
 * Monash, RMIT, UQ (Australia)
 * Western, Calgary (Canada)
 *
 * Run: node scripts/crawl-10unis.js [uni_id]
 *   or: node scripts/crawl-10unis.js  (crawls all 10)
 */

const https = require('https');
const http  = require('http');
const { URL } = require('url');
const fs    = require('fs');
const path  = require('path');

const UA            = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const FETCH_TIMEOUT = 14000;
const CONCURRENCY   = 5;
const MAX_PAGES     = 500;

// ── University definitions ────────────────────────────────────────────────────
const UNIVERSITIES = [
  {
    id: 'birmingham',
    name: 'University of Birmingham',
    // Sitemap has 8.6k URLs but individual course pages aren't in it.
    // Fallback: PG listing page + scrape links from course tiles
    sitemapUrl: 'https://www.birmingham.ac.uk/sitemap.xml',
    listingUrls: [
      'https://www.birmingham.ac.uk/postgraduate/courses/taught/index.aspx',
      'https://www.birmingham.ac.uk/postgraduate/courses/taught/',
    ],
    urlFilter: function(u) {
      var p = new URL(u).pathname;
      return (
        (p.includes('/postgraduate/courses/taught/') || p.includes('/postgraduate/courses/research/')) &&
        p.split('/').filter(Boolean).length >= 5 &&
        !p.endsWith('/taught/') && !p.endsWith('/research/') &&
        !p.includes('/mdslisting') && !p.includes('/requirements')
      );
    },
    slugPrefix: 'birmingham',
    country: 'United Kingdom',
    currency: 'GBP', annualGBP: 29700, livingCostGBP: 11400,
    ieltsMin: 6.5, intakeMonths: ['September'], campus: 'Edgbaston',
    city: 'Birmingham', state: 'England', countryCode: 'GB',
  },
  {
    id: 'leeds',
    name: 'University of Leeds',
    sitemapUrl: 'https://www.leeds.ac.uk/sitemap.xml',
    urlFilter: function(u) {
      var p = new URL(u).pathname;
      return (
        (/\/courses?\/(postgraduate|taught|research|undergraduate)/.test(p) || /\/postgraduate\//.test(p)) &&
        p.split('/').filter(Boolean).length >= 4 &&
        !p.includes('/news') && !p.includes('/events') && !p.includes('/staff')
      );
    },
    slugPrefix: 'leeds',
    country: 'United Kingdom',
    currency: 'GBP', annualGBP: 23000, livingCostGBP: 11000,
    ieltsMin: 6.5, intakeMonths: ['September'], campus: 'Leeds',
    city: 'Leeds', state: 'England', countryCode: 'GB',
  },
  {
    id: 'sheffield',
    name: 'University of Sheffield',
    // Sheffield sitemap is paginated at sheffield.ac.uk (no www)
    sitemapUrls: [
      'https://sheffield.ac.uk/sitemap.xml?page=1',
      'https://sheffield.ac.uk/sitemap.xml?page=2',
    ],
    urlFilter: function(u) {
      var p;
      try { p = new URL(u).pathname; } catch { return false; }
      return (
        (p.includes('/postgraduate/courses/') || p.includes('/undergraduate/courses/')) &&
        p.split('/').filter(Boolean).length >= 5 &&
        !p.endsWith('/courses/') && !p.includes('/profiles') && !p.includes('/careers')
      );
    },
    slugPrefix: 'sheffield',
    country: 'United Kingdom',
    currency: 'GBP', annualGBP: 22000, livingCostGBP: 11000,
    ieltsMin: 6.5, intakeMonths: ['September'], campus: 'Sheffield',
    city: 'Sheffield', state: 'England', countryCode: 'GB',
  },
  {
    id: 'nottingham',
    name: 'University of Nottingham',
    sitemapUrl: 'https://www.nottingham.ac.uk/sitemap.xml',
    urlFilter: function(u) {
      var p = new URL(u).pathname;
      return (
        p.includes('/pgstudy/') &&
        (p.endsWith('.aspx') || p.includes('/courses/')) &&
        p.split('/').filter(Boolean).length >= 4 &&
        !p.includes('/doctoral-training-programmes') &&
        !p.includes('/faqs') && !p.includes('/contact') && !p.includes('/fees')
      );
    },
    slugPrefix: 'nottingham',
    country: 'United Kingdom',
    currency: 'GBP', annualGBP: 25000, livingCostGBP: 11000,
    ieltsMin: 6.5, intakeMonths: ['September'], campus: 'University Park',
    city: 'Nottingham', state: 'England', countryCode: 'GB',
  },
  {
    id: 'glasgow',
    name: 'University of Glasgow',
    // Glasgow sitemap redirects are broken; it already has 282 real courses from Puppeteer crawl
    sitemapUrl: 'https://www.gla.ac.uk/sitemap.xml',
    urlFilter: function(u) {
      var p = new URL(u).pathname;
      return (
        (p.includes('/postgraduate/') || p.includes('/undergraduate/')) &&
        p.split('/').filter(Boolean).length >= 4 &&
        !p.includes('/news') && !p.includes('/staff') && !p.includes('/research')
      );
    },
    slugPrefix: 'glasgow',
    country: 'United Kingdom',
    currency: 'GBP', annualGBP: 24000, livingCostGBP: 11500,
    ieltsMin: 6.5, intakeMonths: ['September'], campus: 'Gilmorehill',
    city: 'Glasgow', state: 'Scotland', countryCode: 'GB',
  },
  {
    id: 'monash',
    name: 'Monash University',
    // Monash sitemap.xml returns 403; try alternate subdomain
    sitemapCandidates: [
      'https://www.monash.edu/sitemap.xml',
      'https://www.monash.edu/sitemap_index.xml',
      'https://study.monash.edu/sitemap.xml',
    ],
    urlFilter: function(u) {
      try {
        var p = new URL(u).pathname;
        return (
          (p.includes('/find-a-course/') || p.includes('/courses/') || p.includes('/study/courses/')) &&
          p.split('/').filter(Boolean).length >= 4 &&
          !p.endsWith('/find-a-course/') && !p.endsWith('/courses/')
        );
      } catch { return false; }
    },
    slugPrefix: 'monash',
    country: 'Australia',
    currency: 'AUD', annualAUD: 38000, livingCostAUD: 21000,
    ieltsMin: 6.5, intakeMonths: ['February', 'July'], campus: 'Clayton, Melbourne',
    city: 'Melbourne', state: 'Victoria', countryCode: 'AU',
  },
  {
    id: 'rmit',
    name: 'RMIT University',
    sitemapUrl: 'https://www.rmit.edu.au/sitemap.xml',
    urlFilter: function(u) {
      var p = new URL(u).pathname;
      // Must be /study-with-us/levels-of-study/[level]/[course-slug]
      var segs = p.split('/').filter(Boolean);
      return (
        segs[0] === 'study-with-us' &&
        segs[1] === 'levels-of-study' &&
        segs.length === 4 &&
        !p.includes('/short-courses/') && !p.includes('/tafe/') &&
        !p.endsWith('/levels-of-study/') && !segs[3].endsWith('apply-now')
      );
    },
    slugPrefix: 'rmit',
    country: 'Australia',
    currency: 'AUD', annualAUD: 38000, livingCostAUD: 21000,
    ieltsMin: 6.5, intakeMonths: ['February', 'July'], campus: 'Melbourne City',
    city: 'Melbourne', state: 'Victoria', countryCode: 'AU',
  },
  {
    id: 'uq',
    name: 'University of Queensland',
    // study.uq.edu.au has paginated sitemap with actual program pages
    sitemapUrls: [
      'https://study.uq.edu.au/sitemap.xml?page=1',
      'https://study.uq.edu.au/sitemap.xml?page=2',
      'https://study.uq.edu.au/sitemap.xml?page=3',
      'https://study.uq.edu.au/sitemap.xml?page=4',
    ],
    urlFilter: function(u) {
      try {
        var p = new URL(u).pathname;
        var segs = p.split('/').filter(Boolean);
        // /study-options/programs/[program-name]/[major] (6-7 segs total with host)
        return (
          segs[0] === 'study-options' && segs[1] === 'programs' &&
          segs.length === 4 && // study-options, programs, program-name, major-name
          !u.includes('?year=') // skip year-param duplicates
        );
      } catch { return false; }
    },
    slugPrefix: 'uq',
    country: 'Australia',
    currency: 'AUD', annualAUD: 38000, livingCostAUD: 21000,
    ieltsMin: 6.5, intakeMonths: ['February', 'July'], campus: 'St Lucia, Brisbane',
    city: 'Brisbane', state: 'Queensland', countryCode: 'AU',
  },
  {
    id: 'western',
    name: 'Western University',
    // www.uwo.ca/sitemap.xml returns 404; try grad subdomain
    sitemapCandidates: [
      'https://grad.uwo.ca/sitemap.xml',
      'https://www.uwo.ca/sitemap.xml',
      'https://www.westernu.ca/sitemap.xml',
    ],
    urlFilter: function(u) {
      var p = new URL(u).pathname;
      return (
        (p.includes('/grad/') || p.includes('/graduate/') || p.includes('/academics/graduate')) &&
        p.split('/').filter(Boolean).length >= 3 &&
        !p.includes('/news') && !p.includes('/events')
      );
    },
    slugPrefix: 'western',
    country: 'Canada',
    currency: 'CAD', annualCAD: 25000, livingCostCAD: 13000,
    ieltsMin: 6.5, intakeMonths: ['September', 'January'], campus: 'London, Ontario',
    city: 'London', state: 'Ontario', countryCode: 'CA',
  },
  {
    id: 'calgary',
    name: 'University of Calgary',
    // grad.ucalgary.ca has real individual program pages in /explore-programs/
    sitemapUrls: ['https://grad.ucalgary.ca/sitemap.xml'],
    urlFilter: function(u) {
      try {
        var p = new URL(u).pathname;
        return (
          p.includes('/explore-programs/') &&
          !p.endsWith('/explore-programs/') &&
          p.split('/').filter(Boolean).length >= 6
        );
      } catch { return false; }
    },
    slugPrefix: 'calgary',
    country: 'Canada',
    currency: 'CAD', annualCAD: 25000, livingCostCAD: 13000,
    ieltsMin: 6.5, intakeMonths: ['September', 'January'], campus: 'Main Campus',
    city: 'Calgary', state: 'Alberta', countryCode: 'CA',
  },
];

// ── HTTP helper ───────────────────────────────────────────────────────────────
function fetchUrl(url, isXml) {
  return new Promise(function(resolve) {
    try {
      var p = new URL(url);
      var lib = p.protocol === 'https:' ? https : http;
      var req = lib.request({
        hostname: p.hostname,
        path: p.pathname + p.search,
        method: 'GET',
        timeout: FETCH_TIMEOUT,
        headers: {
          'User-Agent': UA,
          'Accept': isXml ? 'text/xml,application/xml,*/*' : 'text/html,*/*',
          'Accept-Language': 'en-GB,en;q=0.9',
        },
      }, function(res) {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
          var loc = res.headers.location.startsWith('http')
            ? res.headers.location
            : p.protocol + '//' + p.hostname + res.headers.location;
          return fetchUrl(loc, isXml).then(resolve);
        }
        var body = '';
        res.setEncoding('utf8');
        res.on('data', function(d) { body += d; if (body.length > 3000000) res.destroy(); });
        res.on('end', function() { resolve({ status: res.statusCode, body: body }); });
        res.on('error', function() { resolve({ status: 0, body: '' }); });
      });
      req.on('timeout', function() { req.destroy(); resolve({ status: 408, body: '' }); });
      req.on('error', function() { resolve({ status: 0, body: '' }); });
      req.end();
    } catch (e) { resolve({ status: 0, body: '' }); }
  });
}

function extractXmlUrls(xml) {
  return [...xml.matchAll(/<loc>(https?:\/\/[^<\s]+)<\/loc>/g)].map(function(m) { return m[1].trim(); });
}

// ── Sitemap fetcher (handles paginated + index) ───────────────────────────────
async function getSitemapUrls(uni) {
  var allUrls = [];

  // Multi-page sitemap
  if (uni.sitemapUrls) {
    for (var su of uni.sitemapUrls) {
      var r = await fetchUrl(su, true);
      if (r.status === 200) {
        var us = extractXmlUrls(r.body);
        allUrls.push.apply(allUrls, us);
        console.log('    ↳ ' + su.split('/').slice(-1)[0] + ' → ' + r.status + ' (' + us.length + ' URLs)');
      } else {
        console.log('    ↳ ' + su + ' → HTTP ' + r.status);
      }
    }
    return { status: allUrls.length > 0 ? 200 : 0, urls: allUrls };
  }

  // Single or candidate sitemaps
  var candidates = uni.sitemapCandidates || (uni.sitemapUrl ? [uni.sitemapUrl] : []);
  for (var candidate of candidates) {
    var res = await fetchUrl(candidate, true);
    if (res.status !== 200 || !res.body) {
      console.log('    ↳ ' + candidate + ' → HTTP ' + res.status);
      continue;
    }
    console.log('    ↳ ' + candidate + ' → OK (' + res.body.length.toLocaleString() + ' chars)');

    if (res.body.includes('<sitemapindex')) {
      var subs = extractXmlUrls(res.body);
      console.log('       Sitemap index: ' + subs.length + ' child sitemaps');
      var keywords = ['course', 'programme', 'program', 'study', 'academic', 'graduate', 'degree'];
      var priority = subs.filter(function(s) { return keywords.some(function(k) { return s.toLowerCase().includes(k); }); });
      var others = subs.filter(function(s) { return !priority.includes(s); }).slice(0, 4);
      var toCheck = priority.concat(others).slice(0, 10);
      console.log('       Checking ' + toCheck.length + ' child sitemaps');
      for (var sub of toCheck) {
        var sr = await fetchUrl(sub, true);
        var subUrls = extractXmlUrls(sr.body);
        allUrls.push.apply(allUrls, subUrls);
      }
      return { status: 200, urls: allUrls };
    }

    allUrls.push.apply(allUrls, extractXmlUrls(res.body));
    return { status: 200, urls: allUrls };
  }

  // Last resort: robots.txt
  try {
    var origin = new URL((uni.sitemapUrl || candidates[0])).origin;
    var rb = await fetchUrl(origin + '/robots.txt');
    var m = rb.body.match(/^Sitemap:\s*(.+)$/im);
    if (m) {
      var sRes = await fetchUrl(m[1].trim(), true);
      if (sRes.status === 200) return { status: 200, urls: extractXmlUrls(sRes.body) };
    }
  } catch (e) {}

  return { status: 0, urls: [] };
}

// ── Name extraction ───────────────────────────────────────────────────────────
function extractName(html, url) {
  // og:title
  var og = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']{5,120})["']/i)
          || html.match(/<meta[^>]+content=["']([^"']{5,120})["'][^>]+property=["']og:title["']/i);
  if (og) {
    var n1 = og[1].split('|')[0].split(' - ')[0].split(' — ')[0].replace(/\s+/g, ' ').trim();
    if (isGoodName(n1)) return n1;
  }
  // H1
  var h1 = html.match(/<h1[^>]*>([^<]{5,120})<\/h1>/i);
  if (h1) {
    var n2 = h1[1].replace(/\s+/g, ' ').trim();
    if (isGoodName(n2)) return n2;
  }
  // title tag
  var title = html.match(/<title>([^<]+)<\/title>/i);
  if (title) {
    var n3 = title[1].split('|')[0].split(' - ')[0].split(' — ')[0].replace(/\s+/g, ' ').trim();
    if (isGoodName(n3)) return n3;
  }
  // Slug fallback
  var segs = new URL(url).pathname.split('/').filter(Boolean);
  var slug = segs[segs.length - 1] || '';
  return slug.replace(/-/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
}

function isGoodName(name) {
  if (!name || name.length < 5 || name.length > 120) return false;
  if (/404|error|cookie|login|home page|sitemap|access denied|page not found/i.test(name)) return false;
  if (/^\d+$/.test(name)) return false;
  return true;
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// ── Level inference from name or URL slug ─────────────────────────────────────
function inferLevel(nameOrSlug) {
  var n = nameOrSlug.toLowerCase();
  if (/\bphd\b|doctor(?:ate|al)/.test(n)) return 'PhD';
  if (/\bmba\b/.test(n)) return 'MBA';
  if (/\bllm\b/.test(n)) return 'LLM';
  if (/\bmres\b/.test(n)) return 'MRes';
  if (/\bpgcert\b|pg-cert|-cert\b|certificate/.test(n)) return 'PGCert';
  if (/\bpgdip\b|pg-dip|-dip\b/.test(n)) return 'PGDip';
  if (/\bmsc\b|-msc/.test(n)) return 'MSc';
  if (/\bma\b|-ma\b/.test(n)) return 'MA';
  if (/\bmeng\b|-meng/.test(n)) return 'MEng';
  if (/\bmarch\b|-march/.test(n)) return 'MArch';
  if (/\bmfa\b|-mfa/.test(n)) return 'MFA';
  if (/\bmaster/.test(n)) return 'MSc';
  if (/\bbsc\b/.test(n)) return 'BSc';
  if (/\bba\b/.test(n)) return 'BA';
  if (/\bbeng\b/.test(n)) return 'BEng';
  if (/\bllb\b/.test(n)) return 'LLB';
  if (/\bbachelor/.test(n)) return 'BSc';
  if (/\bgradcert\b|-gc\d/.test(n)) return 'PGCert';
  return 'MSc';
}

function inferStudyLevel(level) {
  return ['BSc', 'BA', 'BEng', 'BArch', 'LLB'].includes(level) ? 'Undergraduate' : 'Postgraduate';
}

function inferDuration(level) {
  if (level === 'PhD') return { dur: '3-4 years', yrs: 3 };
  if (['BSc', 'BA', 'BEng', 'LLB'].includes(level)) return { dur: '3 years', yrs: 3 };
  return { dur: '1 year', yrs: 1 };
}

// ── Course builder ────────────────────────────────────────────────────────────
function buildCourse(uni, name, url) {
  var levelHint = name + ' ' + url;
  var level = inferLevel(levelHint);
  var dur = inferDuration(level);
  var studyLevel = inferStudyLevel(level);
  var base = {
    name: name, slug: uni.slugPrefix + '-' + slugify(name), url: url,
    level: level, studyLevel: studyLevel,
    duration: dur.dur, durationYears: dur.yrs,
    ieltsMin: uni.ieltsMin, toeflMin: 90, pteMin: 62,
    intakeMonths: uni.intakeMonths, campus: uni.campus, country: uni.country,
  };
  if (uni.currency === 'GBP') {
    return Object.assign({}, base, {
      annualGBP: uni.annualGBP,
      annualINR: Math.round(uni.annualGBP * 107),
      annualUSD: Math.round(uni.annualGBP * 1.27),
      totalGBP: uni.annualGBP * dur.yrs,
      livingCostGBP: uni.livingCostGBP,
    });
  }
  if (uni.currency === 'AUD') {
    return Object.assign({}, base, {
      annualAUD: uni.annualAUD,
      annualINR: Math.round(uni.annualAUD * 55),
      annualUSD: Math.round(uni.annualAUD * 0.65),
      totalAUD: uni.annualAUD * dur.yrs,
      livingCostAUD: uni.livingCostAUD,
    });
  }
  return Object.assign({}, base, {
    annualCAD: uni.annualCAD,
    annualINR: Math.round(uni.annualCAD * 62),
    annualUSD: Math.round(uni.annualCAD * 0.74),
    totalCAD: uni.annualCAD * dur.yrs,
    livingCostCAD: uni.livingCostCAD,
  });
}

// ── TypeScript file writer ────────────────────────────────────────────────────
function writeTS(uni, courses) {
  var iface      = uni.id.charAt(0).toUpperCase() + uni.id.slice(1) + 'Course';
  var exportName = uni.id + 'Courses';
  var getterName = 'get' + iface + 'BySlug';

  var feeFields = uni.currency === 'GBP'
    ? '  annualGBP: number; annualINR: number; annualUSD: number; totalGBP: number; livingCostGBP: number;'
    : uni.currency === 'AUD'
    ? '  annualAUD: number; annualINR: number; annualUSD: number; totalAUD: number; livingCostAUD: number;'
    : '  annualCAD: number; annualINR: number; annualUSD: number; totalCAD: number; livingCostCAD: number;';

  var entries = courses.map(function(c) {
    var feeStr = uni.currency === 'GBP'
      ? 'annualGBP:' + c.annualGBP + ',annualINR:' + c.annualINR + ',annualUSD:' + c.annualUSD + ',totalGBP:' + c.totalGBP + ',livingCostGBP:' + c.livingCostGBP
      : uni.currency === 'AUD'
      ? 'annualAUD:' + c.annualAUD + ',annualINR:' + c.annualINR + ',annualUSD:' + c.annualUSD + ',totalAUD:' + c.totalAUD + ',livingCostAUD:' + c.livingCostAUD
      : 'annualCAD:' + c.annualCAD + ',annualINR:' + c.annualINR + ',annualUSD:' + c.annualUSD + ',totalCAD:' + c.totalCAD + ',livingCostCAD:' + c.livingCostCAD;
    return '  {name:' + JSON.stringify(c.name) + ',slug:' + JSON.stringify(c.slug) + ',url:' + JSON.stringify(c.url) + ',level:' + JSON.stringify(c.level) + ',studyLevel:' + JSON.stringify(c.studyLevel) + ',duration:' + JSON.stringify(c.duration) + ',durationYears:' + c.durationYears + ',ieltsMin:' + c.ieltsMin + ',toeflMin:' + c.toeflMin + ',pteMin:' + c.pteMin + ',intakeMonths:' + JSON.stringify(c.intakeMonths) + ',campus:' + JSON.stringify(c.campus) + ',country:' + JSON.stringify(c.country) + ',' + feeStr + '}';
  }).join(',\n');

  return '// Auto-generated — sitemap crawl (crawl-10unis.js)\n// ' + courses.length + ' courses | crawled: ' + new Date().toISOString().slice(0, 10) + '\n\nexport interface ' + iface + ' {\n  name: string; slug: string; url: string;\n  level: string; studyLevel: string; duration: string; durationYears: number;\n  ieltsMin: number; toeflMin: number; pteMin: number;\n  intakeMonths: string[]; campus: string; country: string;\n' + feeFields + '\n}\n\nexport const ' + exportName + ': ' + iface + '[] = [\n' + entries + '\n];\n\nexport function ' + getterName + '(slug: string): ' + iface + ' | undefined {\n  return ' + exportName + '.find(c => c.slug === slug);\n}\n';
}

// ── Concurrency helper ────────────────────────────────────────────────────────
async function pLimit(items, limit, fn) {
  var idx = 0;
  var results = new Array(items.length);
  async function worker() {
    while (idx < items.length) {
      var i = idx++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

// ── Main per-university ───────────────────────────────────────────────────────
async function processUniversity(uni) {
  console.log('\n' + '═'.repeat(68));
  console.log('▶ ' + uni.name.toUpperCase());
  console.log('═'.repeat(68));

  console.log('  Fetching sitemap...');
  var { status, urls } = await getSitemapUrls(uni);

  if (status !== 200 || urls.length === 0) {
    console.log('  ✗ Sitemap failed (HTTP ' + status + ', ' + urls.length + ' urls)');
    // Check if existing file already has data
    var existingPath = path.join(__dirname, '../data/' + uni.id + '-courses.ts');
    if (fs.existsSync(existingPath)) {
      var existingContent = fs.readFileSync(existingPath, 'utf8');
      var existingCount = (existingContent.match(/"name":|name:/g) || []).length;
      console.log('  → Keeping existing data/' + uni.id + '-courses.ts (' + existingCount + ' courses)');
      return { uni: uni, count: existingCount, status: 'existing' };
    }
    return { uni: uni, count: 0, status: 'blocked' };
  }

  console.log('  ✓ Sitemap: ' + urls.length.toLocaleString() + ' total URLs');

  var courseUrls = urls.filter(function(u) {
    try { return uni.urlFilter(u); } catch (e) { return false; }
  });

  // Dedupe
  courseUrls = [...new Set(courseUrls)];
  console.log('  → ' + courseUrls.length + ' URLs match course pattern');

  if (courseUrls.length === 0) {
    console.log('  ⚠ No course URL matches. Sample sitemap URLs:');
    urls.slice(0, 6).forEach(function(u) { console.log('    ' + u); });
    // Keep existing
    var existingPath2 = path.join(__dirname, '../data/' + uni.id + '-courses.ts');
    if (fs.existsSync(existingPath2)) {
      var existingContent2 = fs.readFileSync(existingPath2, 'utf8');
      var existingCount2 = (existingContent2.match(/"name":|name:/g) || []).length;
      console.log('  → Keeping existing data/' + uni.id + '-courses.ts (' + existingCount2 + ' courses)');
      return { uni: uni, count: existingCount2, status: 'existing' };
    }
    return { uni: uni, count: 0, status: 'no_match' };
  }

  var toCrawl = courseUrls.slice(0, MAX_PAGES);
  console.log('  Crawling ' + toCrawl.length + ' pages (concurrency=' + CONCURRENCY + ')...');

  var done = 0, ok = 0;
  var courses = [];
  var seenNames = new Set();

  await pLimit(toCrawl, CONCURRENCY, async function(url) {
    var r = await fetchUrl(url);
    done++;
    if (done % 50 === 0) process.stdout.write('    ' + done + '/' + toCrawl.length + '...\n');
    if (r.status !== 200 || !r.body) return;
    ok++;
    var name = extractName(r.body, url);
    if (!isGoodName(name) || seenNames.has(name.toLowerCase())) return;
    seenNames.add(name.toLowerCase());
    courses.push(buildCourse(uni, name, url));
  });

  console.log('\n  ✓ ' + ok + '/' + toCrawl.length + ' pages OK → ' + courses.length + ' unique courses');

  if (courses.length < 8) {
    console.log('  ⚠ Too few courses (' + courses.length + ') — keeping existing file');
    var existingPath3 = path.join(__dirname, '../data/' + uni.id + '-courses.ts');
    if (fs.existsSync(existingPath3)) {
      var existingContent3 = fs.readFileSync(existingPath3, 'utf8');
      var existingCount3 = (existingContent3.match(/"name":|name:/g) || []).length;
      console.log('  → Existing: ' + existingCount3 + ' courses');
      return { uni: uni, count: existingCount3, status: 'existing' };
    }
    return { uni: uni, count: courses.length, status: 'too_few' };
  }

  var outPath = path.join(__dirname, '../data/' + uni.id + '-courses.ts');
  fs.writeFileSync(outPath, writeTS(uni, courses), 'utf8');
  console.log('  ✅ Written: data/' + uni.id + '-courses.ts (' + courses.length + ' courses)');

  return { uni: uni, count: courses.length, status: 'crawled' };
}

// ── Entry point ───────────────────────────────────────────────────────────────
async function main() {
  var filter = process.argv[2];
  var toRun = filter
    ? UNIVERSITIES.filter(function(u) { return u.id === filter; })
    : UNIVERSITIES;

  if (toRun.length === 0) {
    console.error('University not found: ' + filter);
    process.exit(1);
  }

  console.log('\n╔' + '═'.repeat(66) + '╗');
  console.log('║  SITEMAP CRAWL — ' + toRun.length + ' UNIVERSITIES' + ''.padEnd(66 - 21 - String(toRun.length).length) + '║');
  console.log('╚' + '═'.repeat(66) + '╝\n');

  var results = [];
  for (var i = 0; i < toRun.length; i++) {
    var r = await processUniversity(toRun[i]);
    results.push(r);
    if (i < toRun.length - 1) {
      await new Promise(function(res) { setTimeout(res, 2000); });
    }
  }

  console.log('\n\n' + '═'.repeat(68));
  console.log('SUMMARY');
  console.log('═'.repeat(68));
  console.log('University'.padEnd(36) + 'Status'.padEnd(12) + 'Courses');
  console.log('─'.repeat(68));
  results.forEach(function(r) {
    var icon = r.status === 'crawled' ? '✅' : r.status === 'existing' ? '📂' : '⚠';
    console.log(icon + ' ' + r.uni.name.slice(0, 33).padEnd(34) + ' ' + r.status.padEnd(12) + ' ' + r.count);
  });
  var total = results.reduce(function(s, r) { return s + r.count; }, 0);
  var crawled = results.filter(function(r) { return r.status === 'crawled'; }).length;
  console.log('\n  Crawled: ' + crawled + '/' + results.length + ' | Total courses: ' + total);
}

main().catch(console.error);
