// Probe all accessible data sources for real course data
const https = require('https');
const http = require('http');

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...options.headers
      },
      timeout: 8000,
    }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

async function main() {
  const sources = [
    // CRICOS - Australian government database of registered courses
    ['CRICOS AUS', 'https://cricos.education.gov.au/Course/CourseSearch.aspx'],
    // myMaster.de - German university courses
    ['myMaster Germany', 'https://www.mastersportal.eu/search/#q=keyword/computer-science|country/6/'],
    // StudyPortals
    ['StudyPortals', 'https://www.mastersportal.eu/search/#q=keyword/computer-science|country/6/'],
    // Coursefinder NZ
    ['NZ Coursefinder', 'https://www.studywithnewzealand.govt.nz/en/study/find-a-course'],
    // NZQA
    ['NZQA', 'https://www.nzqa.govt.nz/providers-partners/qa-docs-tertiary/'],
    // Study in Singapore
    ['Singapore EDB', 'https://www.edb.gov.sg/en/business-insights/education-services.html'],
    // Irish education
    ['CAO Ireland', 'https://www.cao.ie/courses.php'],
    // UKVI Tier4 list
    ['UKVI sponsors', 'https://www.gov.uk/government/publications/register-of-licensed-sponsors-students'],
    // Times Higher Education
    ['THE rankings', 'https://www.timeshighereducation.com/'],
    // QS Rankings
    ['QS Rankings', 'https://www.topuniversities.com/'],
    // DAAD Germany
    ['DAAD Germany', 'https://www.daad.de/en/studying-in-germany/studying/university-search/'],
  ];

  for (const [name, url] of sources) {
    try {
      const r = await fetchUrl(url);
      const ctype = r.headers['content-type'] || '';
      const preview = r.body.substring(0, 200).replace(/\n/g, ' ').trim();
      console.log(`✅ ${name}: ${r.status} | ${ctype.substring(0,30)} | "${preview.substring(0,100)}"`);
    } catch(e) {
      console.log(`❌ ${name}: ${e.message || e.code}`);
    }
  }
}
main();
