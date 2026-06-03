/**
 * Real course data scraper
 * Uses accessible endpoints to get actual program data
 */
const https = require('https');
const http = require('http');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        ...options.headers
      },
      timeout: 12000,
    };
    if (options.body) {
      reqOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      reqOptions.headers['Content-Length'] = Buffer.byteLength(options.body);
    }

    const req = mod.request(reqOptions, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const loc = res.headers.location.startsWith('http') ? res.headers.location : url.split('/').slice(0,3).join('/') + res.headers.location;
        return fetch(loc, options).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    if (options.body) req.write(options.body);
    req.end();
  });
}

// === CRICOS: Australian Government Course Database ===
async function scrapeCRICOS(providerName) {
  console.log(`Scraping CRICOS for: ${providerName}`);
  try {
    // First get the form with VIEWSTATE
    const formPage = await fetch('https://cricos.education.gov.au/Course/CourseSearch.aspx');
    const $ = cheerio.load(formPage.body);
    const viewstate = $('input[name="__VIEWSTATE"]').val() || '';
    const eventval = $('input[name="__EVENTVALIDATION"]').val() || '';
    const vsgen = $('input[name="__VIEWSTATEGENERATOR"]').val() || '';

    // POST the search
    const body = new URLSearchParams({
      '__VIEWSTATE': viewstate,
      '__VIEWSTATEGENERATOR': vsgen,
      '__EVENTVALIDATION': eventval,
      'ctl00$ContentPlaceHolder1$txtProviderName': providerName,
      'ctl00$ContentPlaceHolder1$ddlCourseSector': '',
      'ctl00$ContentPlaceHolder1$ddlCourseLevel': '',
      'ctl00$ContentPlaceHolder1$txtCourseName': '',
      'ctl00$ContentPlaceHolder1$btnSearch': 'Search',
    }).toString();

    const results = await fetch('https://cricos.education.gov.au/Course/CourseSearch.aspx', {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://cricos.education.gov.au/Course/CourseSearch.aspx',
        'Cookie': formPage.headers['set-cookie']?.join('; ') || '',
      }
    });

    const $r = cheerio.load(results.body);
    const rows = [];
    $r('table tr').each((i, row) => {
      if (i === 0) return; // skip header
      const cells = $r(row).find('td').map((j, td) => $r(td).text().trim()).get();
      if (cells.length >= 3) rows.push(cells);
    });

    console.log(`  Found ${rows.length} providers`);
    rows.slice(0,3).forEach(r => console.log('  ', r.join(' | ').substring(0,100)));
    return rows;
  } catch(e) {
    console.log(`  CRICOS error: ${e.message}`);
    return [];
  }
}

// === CAO Ireland: Irish Course Listings ===
async function scrapeCAOIreland() {
  console.log('\n=== Scraping CAO Ireland ===');
  try {
    const r = await fetch('https://www.cao.ie/courses.php');
    const $ = cheerio.load(r.body);
    // Find course lists
    const links = [];
    $('a').each((i, a) => {
      const href = $(a).attr('href') || '';
      const text = $(a).text().trim();
      if (href.includes('course') && text.length > 5) {
        links.push({ href, text: text.substring(0,60) });
      }
    });
    console.log(`  Found ${links.length} course links`);
    links.slice(0,10).forEach(l => console.log('  ', l.text, '->', l.href));

    // Try to find direct course data
    const tableRows = $('table tr').length;
    console.log(`  Tables rows: ${tableRows}`);
    return links;
  } catch(e) {
    console.log(`  CAO error: ${e.message}`);
    return [];
  }
}

// === THE (Times Higher Education): University rankings data ===
async function scrapeTHE() {
  console.log('\n=== Probing THE Rankings ===');
  const endpoints = [
    'https://www.timeshighereducation.com/rankings/world-university-rankings/2025',
    'https://www.timeshighereducation.com/sites/default/files/the_data_rankings/world_university_rankings_2025_0__8b9c3c2e4a3bb4f9b1e0a3c7d6e5f4e3.json',
  ];
  for (const url of endpoints) {
    try {
      const r = await fetch(url);
      console.log(`  ${url.substring(40,90)}: ${r.status} ${r.headers['content-type']?.substring(0,30)}`);
      if (r.headers['content-type']?.includes('json')) {
        console.log('  JSON:', r.body.substring(0,300));
      }
    } catch(e) {
      console.log(`  ${url.substring(40,70)}: ${e.message}`);
    }
  }
}

// === QS Subject Rankings API ===
async function scrapeQS() {
  console.log('\n=== Probing QS ===');
  const endpoints = [
    'https://www.topuniversities.com/universities',
    'https://api.qs.topuniversities.com/ranking-widget/v1/ranking/?nid=4&type=uni&year=2025&indicators=academic,employer,faculty,citations,international,network&region=&country=&city=&faculty=&stars=FALSE&search=MIT',
  ];
  for (const url of endpoints) {
    try {
      const r = await fetch(url, { headers: { 'Accept': 'application/json' } });
      console.log(`  ${url.substring(30,80)}: ${r.status} | type: ${r.headers['content-type']?.substring(0,30)}`);
      if (r.status === 200 && r.headers['content-type']?.includes('json')) {
        console.log('  JSON data found!', r.body.substring(0,400));
      }
    } catch(e) {
      console.log(`  ${url.substring(30,60)}: ${e.message}`);
    }
  }
}

// === Test University Open Data APIs ===
async function testOpenAPIs() {
  console.log('\n=== Testing Open University APIs ===');
  const apis = [
    // Open Access APIs
    ['UWaterloo Open API', 'https://openapi.data.uwaterloo.ca/v3/Courses/1245'],
    ['UBC Open Data', 'https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subjareas'],
    ['AU gov education', 'https://data.gov.au/api/3/action/package_search?q=university+courses'],
    ['data.gov.au', 'https://data.gov.au/api/3/action/datastore_search?resource_id=cricos&limit=5'],
    // HESA UK
    ['HESA UK data', 'https://www.hesa.ac.uk/data-and-analysis'],
    // UK gov
    ['UK open data', 'https://api.data.gov.uk/v1/datasets'],
  ];
  for (const [name, url] of apis) {
    try {
      const r = await fetch(url, { headers: { 'Accept': 'application/json' } });
      const isJson = r.headers['content-type']?.includes('json');
      console.log(`  ${name}: ${r.status} | json:${isJson}`);
      if (isJson && r.status === 200) console.log('    ', r.body.substring(0,200));
    } catch(e) {
      console.log(`  ${name}: ${e.message?.substring(0,50) || e.code}`);
    }
  }
}

async function main() {
  // Try CRICOS for a few Australian unis
  await scrapeCRICOS('University of Melbourne');
  await scrapeCRICOS('University of Sydney');
  await scrapeCAOIreland();
  await scrapeTHE();
  await scrapeQS();
  await testOpenAPIs();
}

main().catch(console.error);
