// ANU (Australian National University) real course crawl
// Data source: programsandcourses.anu.edu.au internal JSON search API
const https = require('https');
const fs = require('fs');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': UA, 'Accept': 'application/json,*/*' }, timeout: 20000 }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject).on('timeout', function() { this.destroy(); reject(new Error('timeout')); });
  });
}

const ENDPOINTS = [
  { key: 'GetProgramsUnderGraduate', level: 'Undergraduate' },
  { key: 'GetProgramsPostGraduate', level: 'Postgraduate' },
  { key: 'GetProgramsResearch', level: 'Research' },
];

const DEGREE_WHITELIST = /\b(Bachelor|BSc|B\.Sc|BA|B\.A|BBA|Master|MSc|M\.Sc|MA|M\.A|MBA|PhD|Ph\.D|Doctor|Diploma|Certificate|Graduate Certificate|Graduate Diploma)\b/i;

async function main() {
  const all = [];
  for (const ep of ENDPOINTS) {
    const url = `https://programsandcourses.anu.edu.au/data/ProgramSearch/${ep.key}?PageSize=300`;
    console.log(`Fetching ${ep.key}...`);
    const res = await get(url);
    console.log(`  status ${res.status}, body ${res.body.length} bytes`);
    if (res.status !== 200) continue;
    const json = JSON.parse(res.body);
    console.log(`  TotalCount: ${json.TotalCount}, Items: ${json.Items.length}`);
    for (const item of json.Items) {
      all.push({
        name: item.ProgramName,
        code: item.AcademicPlanCode,
        level: ep.level,
        duration: item.Duration,
        career: item.AcademicCareer,
        year: item.ProgramAcademicYear || '2026',
      });
    }
  }
  console.log(`\nTotal programs fetched: ${all.length}`);

  const whitelisted = all.filter(p => DEGREE_WHITELIST.test(p.name));
  console.log(`Passed degree-keyword whitelist: ${whitelisted.length}`);

  // dedupe by code
  const seen = new Set();
  const deduped = whitelisted.filter(p => {
    if (seen.has(p.code)) return false;
    seen.add(p.code);
    return true;
  });
  console.log(`After dedupe: ${deduped.length}`);

  const withUrls = deduped.map(p => ({
    ...p,
    url: `https://programsandcourses.anu.edu.au/${p.year}/program/${p.code}`,
  }));

  fs.writeFileSync(
    __dirname + '/crawl-output/anu-real.json',
    JSON.stringify(withUrls, null, 2)
  );
  console.log(`Wrote ${withUrls.length} programs to crawl-output/anu-real.json`);
}

main().catch(e => { console.error(e); process.exit(1); });
