// Recover real Strathclyde course names from the university's own pages.
//
// Why: data/strath-courses.ts stores names derived from the URL slug, so 561 live pages
// render H1s like "Advancedcomputerscience" and "Bschonscomputersciencesliit". The real
// display name only exists on Strathclyde's page, in a two-span H1:
//     <h1><span class="superscript">MSc</span><span class="course-title">Advanced Computer Science</span></h1>
//
// This script ONLY reads. It writes a JSON report; applying the names is a separate step,
// so a bad extraction can never silently land in the data file.
//
// Rules it follows:
//   - Never invent a name. A page that fails extraction is recorded as a failure and its
//     existing name is left alone by the apply step.
//   - <title> is a fallback only, and only after stripping the marketing suffix.
//
// Usage: node scripts/crawl-strath-real-names.js [--limit N] [--concurrency N]

const fs = require('fs');
const path = require('path');
const { parseCourseFile } = require('./parse-course-data-file');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const OUT = path.join(__dirname, '..', 'reports', 'strath-real-names.json');

const args = process.argv.slice(2);
const argVal = (flag, dflt) => {
  const i = args.indexOf(flag);
  return i === -1 ? dflt : Number(args[i + 1]);
};
const LIMIT = argVal('--limit', Infinity);
const CONCURRENCY = argVal('--concurrency', 6);

function decode(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&#0?39;|&rsquo;|&apos;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&ndash;/g, '-')
    .replace(/&mdash;/g, '-')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Preferred: the two-span course H1. Returns null rather than guessing. */
function fromH1(html) {
  // Find an <h1> that actually contains a .course-title span.
  const re = /<h1[^>]*>([\s\S]{0,600}?)<\/h1>/gi;
  let m;
  while ((m = re.exec(html))) {
    const inner = m[1];
    const title = /<span[^>]*class="[^"]*course-title[^"]*"[^>]*>([\s\S]*?)<\/span>/i.exec(inner);
    if (!title) continue;
    const sup = /<span[^>]*class="[^"]*superscript[^"]*"[^>]*>([\s\S]*?)<\/span>/i.exec(inner);
    const award = sup ? decode(sup[1].replace(/<[^>]+>/g, ' ')) : '';
    const name = decode(title[1].replace(/<[^>]+>/g, ' '));
    if (!name) continue;
    return { name: (award ? award + ' ' + name : name).trim(), source: award ? 'h1:award+title' : 'h1:title' };
  }
  return null;
}

/** Fallback: <title> minus Strathclyde's marketing suffix. */
function fromTitle(html) {
  const m = /<title>([\s\S]*?)<\/title>/i.exec(html);
  if (!m) return null;
  let t = decode(m[1]);
  t = t.split('|')[0].trim();
  // Strip trailing SEO words the course name never actually contains.
  t = t.replace(/\s+(Masters|Undergraduate|Postgraduate|Degree|Course)?\s*(UK|Scotland|Glasgow)\s*$/i, '').trim();
  t = t.replace(/\s+(Masters|Undergraduate|Postgraduate)\s*$/i, '').trim();
  if (!t || /^University of Strathclyde$/i.test(t)) return null;
  return { name: t, source: 'title' };
}

async function fetchOne(course) {
  const rec = { slug: course.slug, url: course.url, oldName: course.name };
  try {
    const res = await fetch(course.url, {
      headers: { 'User-Agent': UA, 'Accept': 'text/html' },
      redirect: 'follow',
      signal: AbortSignal.timeout(30000),
    });
    rec.status = res.status;
    if (!res.ok) { rec.error = 'HTTP ' + res.status; return rec; }
    const html = await res.text();
    const got = fromH1(html) || fromTitle(html);
    if (!got) { rec.error = 'no name found in markup'; return rec; }
    rec.newName = got.name;
    rec.source = got.source;
  } catch (e) {
    rec.status = 0;
    rec.error = String(e && e.message ? e.message : e).slice(0, 120);
  }
  return rec;
}

async function main() {
  const courses = parseCourseFile('strath-courses').slice(0, LIMIT);
  console.log('crawling ' + courses.length + ' Strathclyde pages at concurrency ' + CONCURRENCY + '...');

  const results = [];
  let cursor = 0, done = 0;
  async function worker() {
    while (cursor < courses.length) {
      const c = courses[cursor++];
      results.push(await fetchOne(c));
      if (++done % 25 === 0) console.log('  ' + done + '/' + courses.length);
      await new Promise(r => setTimeout(r, 120)); // be polite
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  results.sort((a, b) => a.slug.localeCompare(b.slug));
  const ok = results.filter(r => r.newName);
  const failed = results.filter(r => !r.newName);
  const changed = ok.filter(r => r.newName !== r.oldName);

  fs.writeFileSync(OUT, JSON.stringify({
    generated: new Date().toISOString(),
    crawled: results.length,
    extracted: ok.length,
    failed: failed.length,
    wouldChange: changed.length,
    bySource: ok.reduce((a, r) => (a[r.source] = (a[r.source] || 0) + 1, a), {}),
    results,
  }, null, 2));

  console.log('\ncrawled ' + results.length + ' | extracted ' + ok.length + ' | failed ' + failed.length);
  console.log('names that would change: ' + changed.length);
  console.log('by source: ' + JSON.stringify(ok.reduce((a, r) => (a[r.source] = (a[r.source] || 0) + 1, a), {})));
  if (failed.length) {
    console.log('\nfirst failures:');
    failed.slice(0, 10).forEach(r => console.log('  ' + r.slug + ' -> ' + r.error));
  }
  console.log('\nwritten to reports/strath-real-names.json');
}

main();
