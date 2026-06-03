/**
 * CRICOS v2 - Australian gov database of registered overseas student courses
 * Try direct provider URL patterns
 */
const https = require('https');
const cheerio = require('cheerio');

function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        ...(options.headers || {})
      },
      timeout: 15000,
    };
    if (options.body) {
      reqOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      reqOptions.headers['Content-Length'] = Buffer.byteLength(options.body);
    }
    const req = https.request(reqOptions, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const loc = res.headers.location.startsWith('http')
          ? res.headers.location
          : 'https://cricos.education.gov.au' + res.headers.location;
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

// Known CRICOS provider codes for major Australian universities
const AUS_UNIS = [
  { name: 'University of Melbourne', code: '00116K', slug: 'university-of-melbourne' },
  { name: 'University of Sydney', code: '00026A', slug: 'university-of-sydney' },
  { name: 'Australian National University', code: '00120C', slug: 'australian-national-university' },
  { name: 'University of Queensland', code: '00025B', slug: 'university-of-queensland' },
  { name: 'Monash University', code: '00008C', slug: 'monash-university' },
  { name: 'University of New South Wales', code: '00098G', slug: 'university-of-new-south-wales' },
  { name: 'University of Western Australia', code: '00124J', slug: 'university-of-western-australia' },
  { name: 'University of Adelaide', code: '00123M', slug: 'university-of-adelaide' },
  { name: 'Macquarie University', code: '00002J', slug: 'macquarie-university' },
  { name: 'University of Technology Sydney', code: '00099F', slug: 'university-of-technology-sydney' },
];

async function getProviderCourses(providerCode, providerName) {
  console.log(`\n=== ${providerName} (${providerCode}) ===`);

  try {
    // CRICOS provider detail page
    const url = `https://cricos.education.gov.au/Provider/ProviderDetail.aspx?ProviderID=${providerCode}`;
    const r = await fetch(url);
    const $ = cheerio.load(r.body);

    const title = $('title').text().trim();
    const tables = $('table').length;
    console.log(`  Status: ${r.status}, Title: ${title.substring(0, 60)}`);
    console.log(`  Tables: ${tables}`);

    // Look for course links
    const courseLinks = [];
    $('a').each((i, a) => {
      const href = $(a).attr('href') || '';
      const text = $(a).text().trim();
      if (href.includes('Course') || href.includes('course')) {
        courseLinks.push({ href, text: text.substring(0, 60) });
      }
    });
    console.log(`  Course links: ${courseLinks.length}`);
    courseLinks.slice(0, 5).forEach(l => console.log(`    ${l.text} -> ${l.href.substring(0, 60)}`));

    // Try to get course list
    if (courseLinks.length > 0) {
      const firstCourseUrl = courseLinks[0].href.startsWith('http')
        ? courseLinks[0].href
        : 'https://cricos.education.gov.au/' + courseLinks[0].href;
      console.log(`  Fetching courses from: ${firstCourseUrl}`);
      const cr = await fetch(firstCourseUrl);
      const $c = cheerio.load(cr.body);
      const rows = [];
      $c('table tr').each((i, row) => {
        if (i === 0) return;
        const cells = $c(row).find('td').map((j, td) => $c(td).text().trim()).get();
        if (cells.length >= 2) rows.push(cells);
      });
      console.log(`  Courses found: ${rows.length}`);
      rows.slice(0, 5).forEach(r => console.log(`    ${r.slice(0, 3).join(' | ')}`));
    }

  } catch(e) {
    console.log(`  Error: ${e.message}`);
  }
}

// Also try the course search by institution
async function searchCoursesByInstitution(providerName) {
  console.log(`\n=== Course Search for: ${providerName} ===`);
  try {
    // Get the search page first for VIEWSTATE
    const formPage = await fetch('https://cricos.education.gov.au/Course/CourseSearch.aspx');
    const $ = cheerio.load(formPage.body);
    const viewstate = $('input[name="__VIEWSTATE"]').val() || '';
    const vsgen = $('input[name="__VIEWSTATEGENERATOR"]').val() || '';
    const eventval = $('input[name="__EVENTVALIDATION"]').val() || '';
    const cookies = formPage.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';

    console.log(`  Got form, VIEWSTATE length: ${viewstate.length}, cookies: ${cookies.substring(0, 60)}`);

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

    const r = await fetch('https://cricos.education.gov.au/Course/CourseSearch.aspx', {
      method: 'POST',
      body,
      headers: {
        'Cookie': cookies,
        'Referer': 'https://cricos.education.gov.au/Course/CourseSearch.aspx'
      }
    });

    const $r = cheerio.load(r.body);
    const rows = [];
    $r('table tr').each((i, row) => {
      const cells = $r(row).find('td').map((j, td) => $r(td).text().trim()).get();
      if (cells.length >= 2 && i > 0) rows.push(cells);
    });

    console.log(`  Results rows: ${rows.length}`);
    rows.slice(0, 5).forEach(r => console.log(`    ${r.slice(0, 3).join(' | ')}`));

    // Check for provider links
    const providerLinks = [];
    $r('a').each((i, a) => {
      const href = $r(a).attr('href') || '';
      const text = $r(a).text().trim();
      if (href.includes('Provider') && text.length > 3) {
        providerLinks.push({ href, text: text.substring(0, 60) });
      }
    });
    console.log(`  Provider links found: ${providerLinks.length}`);
    providerLinks.slice(0, 3).forEach(l => console.log(`    ${l.text} -> ${l.href}`));

  } catch(e) {
    console.log(`  Error: ${e.message}`);
  }
}

async function main() {
  // Test provider detail pages
  await getProviderCourses('00116K', 'University of Melbourne');
  await getProviderCourses('00026A', 'University of Sydney');

  // Test course search by institution name
  await searchCoursesByInstitution('University of Melbourne');
}

main().catch(console.error);
