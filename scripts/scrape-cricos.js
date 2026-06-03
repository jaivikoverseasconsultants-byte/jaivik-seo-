// Explore CRICOS API for Australian university courses
const https = require('https');
const cheerio = require('cheerio');

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json, text/html, */*',
        ...options.headers
      },
      timeout: 10000,
    }, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = res.headers.location.startsWith('http')
          ? res.headers.location
          : 'https://cricos.education.gov.au' + res.headers.location;
        return fetchUrl(redirectUrl, options).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

async function exploreCRICOS() {
  console.log('=== Exploring CRICOS ===');

  // Try different CRICOS endpoints
  const endpoints = [
    'https://cricos.education.gov.au/Course/CourseSearch.aspx',
    'https://cricos.education.gov.au/Course/CourseDetail.aspx?CRICOSCode=000',
    'https://cricos.education.gov.au/Provider/ProviderSearch.aspx',
    // Try if there's a REST API
    'https://cricos.education.gov.au/api/courses?providerName=University+of+Melbourne',
    'https://cricos.education.gov.au/Course/CourseSearch.aspx?ProviderName=University+of+Melbourne&CourseSector=&CourseLevel=&CourseName=&NominalDuration=&ESOS=&submit=Search',
  ];

  for (const url of endpoints) {
    try {
      const r = await fetchUrl(url);
      const $ = cheerio.load(r.body);
      // Look for search results, course data, API hints
      const title = $('title').text();
      const forms = $('form').length;
      const tables = $('table').length;
      const inputs = $('input[type="text"]').length;
      // Check for JSON data or API hints
      const hasJson = r.headers['content-type']?.includes('json');
      console.log(`\n${url.substring(0,70)}`);
      console.log(`  Status: ${r.status} | Title: ${title.substring(0,60)}`);
      console.log(`  Forms: ${forms}, Tables: ${tables}, Text inputs: ${inputs}, JSON: ${hasJson}`);

      // Look for course data in tables
      if (tables > 0) {
        const rows = $('table tr').length;
        console.log(`  Table rows: ${rows}`);
        // Get first few data rows
        $('table tr').slice(1, 4).each((i, row) => {
          const cells = $(row).find('td').map((j, td) => $(td).text().trim().substring(0,40)).get();
          if (cells.length > 0) console.log(`  Row ${i}: ${cells.join(' | ')}`);
        });
      }
    } catch(e) {
      console.log(`${url.substring(0,70)}: ERROR ${e.message}`);
    }
  }
}

async function exploreMastersPortal() {
  console.log('\n=== Exploring MastersPortal ===');
  // MastersPortal has a public API for program listings
  const endpoints = [
    'https://api.mastersportal.eu/v2/studies?limit=20&offset=0&discipline=computer-science&destinations=6',
    'https://www.mastersportal.eu/search/api/studies.json?discipline=computer-science&destination=australia',
    'https://search.mastersportal.eu/?q=computer+science&country=Australia',
  ];

  for (const url of endpoints) {
    try {
      const r = await fetchUrl(url);
      const ctype = r.headers['content-type'] || '';
      console.log(`${url.substring(0,70)}: ${r.status} ${ctype.substring(0,30)}`);
      if (ctype.includes('json') && r.status === 200) {
        console.log('JSON DATA:', r.body.substring(0,500));
      } else {
        console.log('Preview:', r.body.substring(0,200).replace(/\s+/g,' '));
      }
    } catch(e) {
      console.log(`${url.substring(0,70)}: ${e.message}`);
    }
  }
}

exploreCRICOS().then(() => exploreMastersPortal()).catch(console.error);
