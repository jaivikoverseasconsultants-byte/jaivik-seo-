/**
 * Fast sitemap sniffer — no page crawling, just URL pattern analysis.
 * Shows actual URL patterns so we can fix filters.
 */
const https = require('https');
const http  = require('http');
const { URL } = require('url');

const UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

const TARGETS = [
  { id: 'bristol',  url: 'https://www.bristol.ac.uk/sitemap.xml' },
  { id: 'queens',   url: 'https://www.queensu.ca/sitemap.xml' },
  { id: 'dalhousie',url: 'https://www.dal.ca/sitemap.xml' },
  { id: 'rmit',     url: 'https://www.rmit.edu.au/sitemap.xml' },
  { id: 'adelaide', url: 'https://www.adelaide.edu.au/sitemap.xml' },
  { id: 'ucd',      url: 'https://www.ucd.ie/sitemap.xml' },
  { id: 'tcd',      url: 'https://www.tcd.ie/sitemap.xml' },
  // Leeds needs actual pattern
  { id: 'leeds-check', url: 'https://www.leeds.ac.uk/sitemap.xml' },
  // Sheffield
  { id: 'sheffield-check', url: 'https://www.sheffield.ac.uk/sitemap.xml' },
];

function fetchUrl(url, isXml = false) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      const lib = parsed.protocol === 'https:' ? https : http;
      const req = lib.request({
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        method: 'GET',
        timeout: 15000,
        headers: { 'User-Agent': UA, 'Accept': isXml ? 'text/xml,*/*' : 'text/html,*/*' },
      }, (res) => {
        if ([301,302,303].includes(res.statusCode) && res.headers.location) {
          const loc = res.headers.location.startsWith('http')
            ? res.headers.location
            : `${parsed.protocol}//${parsed.hostname}${res.headers.location}`;
          return fetchUrl(loc, isXml).then(resolve);
        }
        let body = '';
        res.setEncoding('utf8');
        res.on('data', d => { body += d; if (body.length > 5_000_000) res.destroy(); });
        res.on('end', () => resolve({ status: res.statusCode, body }));
        res.on('error', () => resolve({ status: 0, body: '' }));
      });
      req.on('timeout', () => { req.destroy(); resolve({ status: 408, body: '' }); });
      req.on('error', () => resolve({ status: 0, body: '' }));
      req.end();
    } catch (e) {
      resolve({ status: 0, body: '' });
    }
  });
}

function extractUrls(xml) {
  return [...xml.matchAll(/<loc>(https?:\/\/[^<\s]+)<\/loc>/g)].map(m => m[1].trim());
}

async function sniff(target) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`[${target.id.toUpperCase()}] ${target.url}`);

  const { status, body } = await fetchUrl(target.url, true);
  if (status !== 200) {
    console.log(`  → HTTP ${status} — BLOCKED/UNREACHABLE`);
    return;
  }

  // Sitemap index?
  if (body.includes('<sitemapindex')) {
    const subSitemaps = extractUrls(body);
    console.log(`  Sitemap INDEX with ${subSitemaps.length} sub-sitemaps:`);
    subSitemaps.slice(0, 8).forEach(s => console.log(`    ${s}`));
    if (subSitemaps.length > 8) console.log(`    ... and ${subSitemaps.length - 8} more`);

    // Fetch first 3 sub-sitemaps to get URL samples
    for (const sub of subSitemaps.slice(0, 3)) {
      const { status: s2, body: b2 } = await fetchUrl(sub, true);
      if (s2 !== 200) { console.log(`    Sub ${sub}: HTTP ${s2}`); continue; }
      const urls = extractUrls(b2);
      console.log(`\n  Sub-sitemap: ${sub} (${urls.length} URLs)`);
      // Show path segments to understand structure
      const pathSamples = urls.slice(0, 12).map(u => {
        try { return new URL(u).pathname; } catch { return u; }
      });
      pathSamples.forEach(p => console.log(`    ${p}`));
    }
    return;
  }

  // Direct sitemap
  const urls = extractUrls(body);
  console.log(`  Direct sitemap: ${urls.length} URLs`);

  // Analyze path patterns
  const pathCounts = {};
  for (const u of urls) {
    try {
      const segs = new URL(u).pathname.split('/').filter(Boolean);
      const key = '/' + segs.slice(0, 3).join('/');
      pathCounts[key] = (pathCounts[key] || 0) + 1;
    } catch {}
  }
  const sorted = Object.entries(pathCounts).sort((a,b) => b[1]-a[1]).slice(0, 15);
  console.log('\n  Top URL path prefixes:');
  sorted.forEach(([k,v]) => console.log(`    ${String(v).padStart(5)}x  ${k}`));

  // Show 10 sample full URLs that look course-like
  const courseLike = urls.filter(u => /course|programme|study|master|degree|postgrad/i.test(u));
  if (courseLike.length > 0) {
    console.log(`\n  Course-like URLs (${courseLike.length} total), sample:`);
    courseLike.slice(0, 10).forEach(u => {
      try { console.log(`    ${new URL(u).pathname}`); } catch {}
    });
  }
}

(async () => {
  for (const t of TARGETS) {
    await sniff(t);
  }
  console.log(`\n${'═'.repeat(60)}\nDone.\n`);
})();
