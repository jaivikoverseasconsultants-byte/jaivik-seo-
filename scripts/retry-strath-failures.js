// Re-fetch only the entries that failed in reports/strath-real-names.json and merge any
// that now succeed. Kept separate from the main crawl so a retry never re-hammers 561 pages.
//
// A transient network error and a real 404 look identical in a single pass; this pass is
// what separates them. Anything still failing after this is treated as genuinely gone.

const fs = require('fs');
const path = require('path');

const REPORT = path.join(__dirname, '..', 'reports', 'strath-real-names.json');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

function decode(s) {
  return s.replace(/&amp;/g, '&').replace(/&#0?39;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
}

function fromH1(html) {
  const re = /<h1[^>]*>([\s\S]{0,600}?)<\/h1>/gi;
  let m;
  while ((m = re.exec(html))) {
    const title = /<span[^>]*class="[^"]*course-title[^"]*"[^>]*>([\s\S]*?)<\/span>/i.exec(m[1]);
    if (!title) continue;
    const sup = /<span[^>]*class="[^"]*superscript[^"]*"[^>]*>([\s\S]*?)<\/span>/i.exec(m[1]);
    const award = sup ? decode(sup[1].replace(/<[^>]+>/g, ' ')) : '';
    const name = decode(title[1].replace(/<[^>]+>/g, ' '));
    if (!name) continue;
    return { name: (award ? award + ' ' + name : name).trim(), source: award ? 'h1:award+title' : 'h1:title' };
  }
  return null;
}

async function main() {
  const report = JSON.parse(fs.readFileSync(REPORT, 'utf8'));
  const failures = report.results.filter(r => !r.newName);
  console.log('retrying ' + failures.length + ' failures...');

  let recovered = 0;
  for (const rec of failures) {
    try {
      const res = await fetch(rec.url, {
        headers: { 'User-Agent': UA, Accept: 'text/html' },
        redirect: 'follow',
        signal: AbortSignal.timeout(45000),
      });
      rec.status = res.status;
      if (!res.ok) { rec.error = 'HTTP ' + res.status; continue; }
      const got = fromH1(await res.text());
      if (!got) { rec.error = 'no name found in markup'; continue; }
      rec.newName = got.name;
      rec.source = got.source;
      delete rec.error;
      recovered++;
      console.log('  recovered: ' + rec.slug + ' -> ' + got.name);
    } catch (e) {
      rec.status = 0;
      rec.error = String(e && e.message ? e.message : e).slice(0, 120);
    }
    await new Promise(r => setTimeout(r, 400));
  }

  const ok = report.results.filter(r => r.newName);
  const stillFailed = report.results.filter(r => !r.newName);
  report.extracted = ok.length;
  report.failed = stillFailed.length;
  report.wouldChange = ok.filter(r => r.newName !== r.oldName).length;
  report.bySource = ok.reduce((a, r) => (a[r.source] = (a[r.source] || 0) + 1, a), {});
  report.retriedAt = new Date().toISOString();
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));

  console.log('\nrecovered ' + recovered + ' | still failing ' + stillFailed.length);
  console.log('these are genuinely gone from strath.ac.uk (names left untouched):');
  stillFailed.forEach(r => console.log('  ' + r.slug + '  [' + (r.error || '?') + ']'));
}

main();
