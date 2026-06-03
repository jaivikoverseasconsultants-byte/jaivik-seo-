/**
 * Try various accessible course API endpoints
 */
const https = require('https');
const http = require('http');
const cheerio = require('cheerio');

function fetch(url, opts = {}) {
  return new Promise((resolve, reject) => {
    try {
      const mod = url.startsWith('https') ? https : http;
      const urlObj = new URL(url);
      const req = mod.request({
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: opts.method || 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, text/html, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          ...opts.headers
        },
        timeout: 12000,
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const loc = res.headers.location.startsWith('http') ? res.headers.location : urlObj.origin + res.headers.location;
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

const COURSE_APIS = [
  // Manchester - try to find their course search API
  ['Manchester search API', 'https://www.manchester.ac.uk/study/masters/courses/list/?subject=computer-science'],
  ['Manchester JSON feed', 'https://www.manchester.ac.uk/study/masters/courses/list/?format=json'],

  // Birmingham
  ['Birmingham courses', 'https://www.birmingham.ac.uk/postgraduate/courses'],

  // Edinburgh
  ['Edinburgh courses', 'https://www.ed.ac.uk/studying/postgraduate/degrees/index.php?r=site/taught'],

  // Sheffield
  ['Sheffield courses', 'https://www.sheffield.ac.uk/postgraduate/taught/courses'],

  // Bristol
  ['Bristol courses', 'https://www.bristol.ac.uk/study/postgraduate/taught/'],

  // Leeds
  ['Leeds courses', 'https://masters.leeds.ac.uk/'],

  // Nottingham
  ['Nottingham courses', 'https://www.nottingham.ac.uk/pgstudy/applications/research-and-taught-programmes.aspx'],

  // Southampton
  ['Southampton courses', 'https://www.southampton.ac.uk/study/postgraduate-taught/courses'],

  // Warwick
  ['Warwick courses', 'https://warwick.ac.uk/study/postgraduate/courses/'],

  // UK Discover Uni
  ['Discover Uni', 'https://discoveruni.gov.uk/course-search/results/?subjects=1&provider=10007154'],

  // UCAS search
  ['UCAS API', 'https://digital.ucas.com/coursedisplay/api/courses?providerName=university+of+manchester'],

  // Canada - UBC
  ['UBC courses', 'https://www.ubc.ca/academics/programs/'],
  ['UBC search', 'https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subjareas&sesscd=W&session=2024'],

  // McGill
  ['McGill courses', 'https://www.mcgill.ca/students/courses/'],

  // Singapore
  ['NUS programs', 'https://www.nus.edu.sg/registrar/academic-information-policies/graduate-studies/graduate-degree-programmes'],
  ['NTU programs', 'https://www.ntu.edu.sg/admissions/graduate/coursework'],
];

async function main() {
  for (const [name, url] of COURSE_APIS) {
    try {
      const r = await fetch(url);
      const isJson = r.headers['content-type']?.includes('json');
      console.log(`\n${name}: ${r.status} | ${r.headers['content-type']?.substring(0, 30)}`);

      if (isJson && r.status === 200) {
        const data = JSON.parse(r.body);
        console.log('  JSON keys:', Object.keys(data).slice(0, 5).join(', '));
        console.log('  Data:', r.body.substring(0, 300));
      } else if (r.status === 200) {
        const $ = cheerio.load(r.body);
        const programs = [];
        $('a').each((i, a) => {
          const text = $(a).text().trim();
          if (text.length > 10 && text.length < 100 &&
            (text.match(/\b(BSc|BEng|BA|BCom|Master|MSc|MEng|MBA|PhD|PG Cert)\b/i) ||
              text.match(/\b(Engineering|Science|Business|Computer|Data|Finance)\b/i))) {
            programs.push(text);
          }
        });
        // Also check lists
        $('li, h3, h4').each((i, el) => {
          const text = $(el).text().trim();
          if (text.length > 10 && text.length < 100 &&
            (text.match(/\b(BSc|BEng|BA|Master|MSc|MEng|MBA)\b/i) ||
              (text.match(/\b(Engineering|Science|Business|Computing)\b/i) && text.length < 80))) {
            programs.push(text);
          }
        });
        const unique = [...new Set(programs)];
        if (unique.length > 0) {
          console.log(`  Programs found: ${unique.length}`);
          unique.slice(0, 10).forEach(p => console.log(`    ${p}`));
        } else {
          // Show basic structure
          const title = $('title').text().trim().substring(0, 60);
          console.log(`  Title: ${title}`);
          const links = $('a').length;
          console.log(`  Links: ${links}`);
        }
      }
    } catch(e) {
      console.log(`${name}: ${e.message?.substring(0, 50)}`);
    }
  }
}

main();
