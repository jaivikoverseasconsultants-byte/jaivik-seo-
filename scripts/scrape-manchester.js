/**
 * Scrape University of Manchester program listings
 */
const https = require('https');
const cheerio = require('cheerio');

function fetch(url, opts = {}) {
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(url);
      const req = https.request({
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120',
          'Accept': 'text/html,application/xhtml+xml,*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          ...opts.headers
        },
        timeout: 15000,
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const loc = res.headers.location.startsWith('http') ? res.headers.location : 'https://www.manchester.ac.uk' + res.headers.location;
          return fetch(loc, opts).then(resolve).catch(reject);
        }
        let data = '';
        res.on('data', d => data += d);
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
      req.end();
    } catch(e) { reject(e); }
  });
}

async function scrapeManchesterMasters() {
  console.log('=== Manchester Masters Programs ===');
  const r = await fetch('https://www.manchester.ac.uk/study/masters/courses/list/');
  const $ = cheerio.load(r.body);

  console.log('Status:', r.status);
  console.log('Title:', $('title').text().trim());

  // Extract all program links
  const programs = [];
  $('a').each((i, a) => {
    const href = $(a).attr('href') || '';
    const text = $(a).text().trim();
    if (href.includes('/courses/') && text.length > 5 && text.length < 120) {
      if (!href.includes('#') && !href.includes('javascript')) {
        programs.push({ name: text, href });
      }
    }
  });

  console.log('\nPrograms found:', programs.length);
  programs.slice(0, 30).forEach(p => console.log(`  ${p.name} -> ${p.href}`));

  // Also look for structured course data
  console.log('\n--- Checking for structured data ---');
  const courseItems = $('[class*="course"], [class*="program"], .search-result, article, .result-item');
  console.log('Course elements:', courseItems.length);

  // Look at the page structure
  console.log('\n--- Page structure ---');
  $('h1, h2, h3').slice(0, 10).each((i, el) => {
    console.log(`  ${el.tagName}: ${$(el).text().trim().substring(0, 60)}`);
  });

  // Try to find course listing
  console.log('\n--- All links containing "msc" or "meng" or "mba" ---');
  const gradLinks = [];
  $('a').each((i, a) => {
    const href = $(a).attr('href') || '';
    const text = $(a).text().trim();
    if ((href.toLowerCase().includes('msc') || href.toLowerCase().includes('meng') || href.toLowerCase().includes('mba') ||
        text.toLowerCase().startsWith('msc') || text.toLowerCase().startsWith('master') || text.toLowerCase().startsWith('bsc')) && text.length > 5) {
      gradLinks.push({ name: text.substring(0, 80), href: href.substring(0, 80) });
    }
  });
  console.log('Degree links:', gradLinks.length);
  gradLinks.slice(0, 20).forEach(l => console.log(`  ${l.name}`));

  return programs;
}

async function scrapeManchesterUG() {
  console.log('\n=== Manchester UG Programs ===');
  const r = await fetch('https://www.manchester.ac.uk/study/undergraduate/courses/list/');
  const $ = cheerio.load(r.body);
  console.log('Status:', r.status);

  const programs = [];
  $('a').each((i, a) => {
    const href = $(a).attr('href') || '';
    const text = $(a).text().trim();
    if (href.includes('/courses/') && text.length > 5 && text.length < 120 && !href.includes('#')) {
      programs.push({ name: text, href });
    }
  });

  console.log('UG Programs:', programs.length);
  programs.slice(0, 20).forEach(p => console.log(`  ${p.name}`));

  return programs;
}

async function scrapeTUMPrograms() {
  console.log('\n=== TU Munich Programs ===');
  const urls = [
    'https://www.tum.de/en/studies/degree-programs',
    'https://www.tum.de/en/studies/degree-programs/detail/computer-science-bachelors-of-science-bsc',
  ];

  for (const url of urls) {
    try {
      const r = await fetch(url);
      const $ = cheerio.load(r.body);
      console.log(`\n${url}`);
      console.log('Status:', r.status);

      // Find all degree program links
      const programs = [];
      $('a').each((i, a) => {
        const href = $(a).attr('href') || '';
        const text = $(a).text().trim();
        if ((href.includes('degree') || href.includes('program') || href.includes('bachelor') || href.includes('master')) && text.length > 5 && text.length < 100) {
          programs.push({ name: text.substring(0, 80), href: href.substring(0, 80) });
        }
      });
      console.log('Programs found:', programs.length);
      programs.slice(0, 15).forEach(p => console.log(`  ${p.name} -> ${p.href.substring(0, 60)}`));

    } catch(e) {
      console.log('Error:', e.message);
    }
  }
}

async function main() {
  await scrapeManchesterMasters();
  await scrapeManchesterUG();
  await scrapeTUMPrograms();
}

main().catch(console.error);
