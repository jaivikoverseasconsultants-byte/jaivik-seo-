const puppeteer = require('puppeteer');
const fs = require('fs');

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

const DEGREE_WHITELIST = /\b(Bachelor|BSc|B\.Sc|BA|B\.A|BBA|Master|MSc|M\.Sc|MA|M\.A|MBA|PhD|Ph\.D|Doctor|Diploma|Certificate|Graduate Certificate|Graduate Diploma|Associate Degree)\b/i;

async function main() {
  const raw = JSON.parse(fs.readFileSync(__dirname + '/crawl-output/ecu-wayback-raw.json', 'utf8'));
  const whitelisted = raw.filter(c => DEGREE_WHITELIST.test(c.courseTitle));
  console.log(`Total: ${raw.length}, passed whitelist: ${whitelisted.length}`);

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36');

  const results = [];
  for (let i = 0; i < whitelisted.length; i++) {
    const item = whitelisted[i];
    const url = item.courseHref.replace(/^http:/, 'https:');
    let status = 0;
    let finalUrl = url;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
        status = res.status();
        finalUrl = page.url();
        if (status === 200) break;
      } catch (e) {
        status = 0;
      }
      if (status !== 200) await wait(1500);
    }
    results.push({ ...item, status, finalUrl });
    console.log(`[${i + 1}/${whitelisted.length}] ${status === 200 ? 'OK  ' : 'FAIL'} ${status}: ${item.courseTitle}`);
    await wait(500);
  }

  await browser.close();

  const ok = results.filter(r => r.status === 200);
  const bad = results.filter(r => r.status !== 200);
  console.log(`\nOK: ${ok.length}, FAILED: ${bad.length}`);
  fs.writeFileSync(__dirname + '/crawl-output/ecu-verified.json', JSON.stringify(ok, null, 2));
  fs.writeFileSync(__dirname + '/crawl-output/ecu-failed.json', JSON.stringify(bad, null, 2));
  console.log(`Wrote ${ok.length} verified courses to crawl-output/ecu-verified.json`);
}

main().catch(e => { console.error(e); process.exit(1); });
