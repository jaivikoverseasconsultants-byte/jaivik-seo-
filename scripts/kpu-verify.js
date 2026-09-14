// KPU returns 404 to curl but 200 in a real browser session. Before reversing the earlier
// "all 249 URLs are dead" call, confirm the browser is getting a REAL programme page and not
// a soft-404 shell that happens to clear a length threshold.
const puppeteer = require('puppeteer');

const URLS = [
  'https://www.kpu.ca/programs-az/arts/anthropology/anthropology-ba/',
  'https://www.kpu.ca/programs-az/business/accounting/accounting-bba/',
  'https://www.kpu.ca/programs-az/design/fashion-design-technology/',
  // a URL that should NOT exist — the control. If this also "passes", the check is worthless.
  'https://www.kpu.ca/programs-az/arts/this-program-does-not-exist-xyz/',
];

(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await b.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36');
  for (const u of URLS) {
    let out = { url: u };
    try {
      const resp = await page.goto(u, { waitUntil: 'networkidle2', timeout: 60000 });
      out.status = resp ? resp.status() : 0;
      Object.assign(out, await page.evaluate(() => {
        const txt = document.body ? document.body.innerText.replace(/\s+/g, ' ').trim() : '';
        return {
          title: (document.title || '').trim(),
          h1: (document.querySelector('h1')?.innerText || '').trim(),
          chars: txt.length,
          // programme pages carry these; a shell will not
          hasCredential: /bachelor|diploma|certificate|associate|citation/i.test(txt),
          hasAdmission: /admission|entry requirement|how to apply|prerequisite/i.test(txt),
          hasCourses: /course|curriculum|credits/i.test(txt),
          notFound: /page not found|cannot be found|no longer available/i.test(txt),
          excerpt: txt.slice(0, 150),
        };
      }));
    } catch (e) { out.error = e.message.slice(0, 80); }
    const verdict = out.status === 200 && !out.notFound && out.hasCredential && out.hasAdmission ? 'REAL PAGE' : 'NOT A PROGRAMME PAGE';
    console.log(`${String(out.status).padEnd(4)} ${verdict.padEnd(22)} chars=${String(out.chars).padStart(5)} cred=${out.hasCredential} adm=${out.hasAdmission}`);
    console.log(`     h1: ${JSON.stringify(out.h1 || '').slice(0, 70)}`);
    console.log(`     ${out.url.replace('https://www.kpu.ca', '')}`);
    console.log(`     «${(out.excerpt || '').slice(0, 120)}»`);
  }
  await b.close();
})();
