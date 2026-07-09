const https = require('https');
const fs = require('fs');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

function get(url, redirects = 0) {
  return new Promise((resolve) => {
    const req = https.get(url, { headers: { 'User-Agent': UA, 'Accept': 'text/html,*/*', 'Accept-Language': 'en-US,en;q=0.9' }, timeout: 20000 }, (res) => {
      res.resume();
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location && redirects < 3) {
        const next = new URL(res.headers.location, url).toString();
        resolve(get(next, redirects + 1));
      } else {
        resolve({ status: res.statusCode, finalUrl: url });
      }
    });
    req.on('error', () => resolve({ status: 0, finalUrl: url }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, finalUrl: url }); });
  });
}

async function withRetry(url, tries = 3) {
  let last;
  for (let i = 0; i < tries; i++) {
    last = await get(url.replace(/^http:/, 'https:'));
    if (last.status === 200) return last;
    await wait(1000 + i * 500);
  }
  return last;
}

const DEGREE_WHITELIST = /\b(Bachelor|BSc|B\.Sc|BA|B\.A|BBA|Master|MSc|M\.Sc|MA|M\.A|MBA|PhD|Ph\.D|Doctor|Diploma|Certificate|Graduate Certificate|Graduate Diploma|Associate Degree)\b/i;

async function main() {
  const raw = JSON.parse(fs.readFileSync(__dirname + '/crawl-output/ecu-wayback-raw.json', 'utf8'));
  const whitelisted = raw.filter(c => DEGREE_WHITELIST.test(c.courseTitle));
  console.log(`Total: ${raw.length}, passed whitelist: ${whitelisted.length}`);

  const results = [];
  for (let i = 0; i < whitelisted.length; i++) {
    const item = whitelisted[i];
    const res = await withRetry(item.courseHref);
    results.push({ ...item, status: res.status, finalUrl: res.finalUrl });
    console.log(`[${i + 1}/${whitelisted.length}] ${res.status === 200 ? 'OK  ' : 'FAIL'} ${res.status}: ${item.courseTitle}`);
    await wait(400);
  }

  const ok = results.filter(r => r.status === 200);
  const bad = results.filter(r => r.status !== 200);
  console.log(`\nOK: ${ok.length}, FAILED: ${bad.length}`);
  fs.writeFileSync(__dirname + '/crawl-output/ecu-verified.json', JSON.stringify(ok, null, 2));
  fs.writeFileSync(__dirname + '/crawl-output/ecu-failed.json', JSON.stringify(bad, null, 2));
  console.log(`Wrote ${ok.length} verified courses to crawl-output/ecu-verified.json`);
}

main().catch(e => { console.error(e); process.exit(1); });
