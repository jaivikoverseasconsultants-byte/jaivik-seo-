/**
 * Try to get course data from university sitemaps and program search APIs
 */
const https = require('https');
const cheerio = require('cheerio');

function fetch(url, opts = {}) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : require('http');
    try {
      const urlObj = new URL(url);
      const req = mod.request({
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xml,application/json,*/*',
          ...opts.headers
        },
        timeout: 10000,
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const loc = res.headers.location.startsWith('http') ? res.headers.location : url.split('/').slice(0,3).join('/') + res.headers.location;
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

const TESTS = [
  // University of Waterloo - has open API
  ['UWaterloo courses API', 'https://openapi.data.uwaterloo.ca/v3/Courses'],
  ['UWaterloo terms', 'https://openapi.data.uwaterloo.ca/v3/Terms'],

  // University of Toronto - open data
  ['UofT open courses', 'https://cobalt.qas.im/api/1.0/courses/filter?q=instructor:John%20Smith&limit=5'],

  // UK Universities - direct program pages
  ['Manchester programs', 'https://www.manchester.ac.uk/study/masters/courses/list/'],
  ['UCL programs', 'https://www.ucl.ac.uk/prospective-students/graduate/taught-degrees'],

  // Australian - official program searches
  ['Melbourne programs', 'https://study.unimelb.edu.au/find/courses/'],
  ['Sydney programs', 'https://www.sydney.edu.au/courses/'],

  // German universities
  ['TU Munich programs', 'https://www.tum.de/en/studies/degree-programs'],

  // Coursedog (used by many US universities)
  ['Stanford catalog', 'https://explorecourses.stanford.edu/search?q=computer+science&view=catalog&filter-catalogs-UGHB=on'],

  // Course catalogs
  ['MIT OpenCourseWare', 'https://ocw.mit.edu/courses/'],
];

async function main() {
  for (const [name, url] of TESTS) {
    try {
      const r = await fetch(url);
      const isJson = r.headers['content-type']?.includes('json');
      const isXml = r.headers['content-type']?.includes('xml');
      console.log(`\n${name}: ${r.status} | ${r.headers['content-type']?.substring(0,30)}`);

      if (isJson && r.status === 200) {
        console.log('  JSON:', r.body.substring(0, 400));
      } else if (r.status === 200) {
        const $ = cheerio.load(r.body);
        // Count potential course items
        const links = $('a').length;
        const items = $('li, .course, .program, .degree').length;
        const text = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 200);
        console.log(`  Links: ${links}, Items: ${items}`);
        console.log(`  Text: ${text.substring(0, 150)}`);

        // Look for course names
        const courseNames = [];
        $('a, h2, h3, .course-title, .program-title').each((i, el) => {
          const t = $(el).text().trim();
          if (t.length > 10 && t.length < 100 && (t.includes('Master') || t.includes('Bachelor') || t.includes('Engineering') || t.includes('Science'))) {
            courseNames.push(t.substring(0, 60));
          }
        });
        if (courseNames.length > 0) {
          console.log(`  Courses found: ${courseNames.slice(0, 8).join(' | ')}`);
        }
      }
    } catch(e) {
      console.log(`${name}: ${e.message?.substring(0,50) || e.code}`);
    }
  }
}

main();
