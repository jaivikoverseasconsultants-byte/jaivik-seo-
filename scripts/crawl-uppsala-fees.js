// Reads Uppsala University's own tuition figures for every programme on the portal.
//
//   node scripts/crawl-uppsala-fees.js
//
// Each uu.se programme page is rendered from JSON handed to AppRegistry.registerInitialState().
// Every programme instance (one per start semester) carries two fee fields, both in SEK and both
// stated by Uppsala for students outside the EU/EEA and Switzerland:
//   firstFee  the fee for the first semester
//   totalFee  the fee for the whole programme
// Uppsala states no annual figure. Nothing is derived here: this script only records what the
// page says, and writes it to data/wave-europe/uppsala-fees.json for review before it is applied.
//
// A page with no fee fields (joint programmes billed by a partner, for instance) is recorded as
// such, not guessed. Redirects are checked against the requested URL so a retired programme cannot
// hand over a different programme's fee.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data/wave-europe/uppsala-fees.json');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';

function findArray(src) {
  const m = src.match(/export const \w+(?:\s*:\s*[\w[\]<>]+)?\s*=\s*\[/);
  const start = m.index + m[0].length - 1;
  let depth = 0, str = null, esc = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (str) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === str) str = null; continue; }
    if (c === '"' || c === "'" || c === '`') { str = c; continue; }
    if (c === '[') depth++;
    else if (c === ']' && --depth === 0) return src.slice(start, i + 1);
  }
  return null;
}

function states(s) {
  const out = [];
  const re = /AppRegistry\.registerInitialState\('[^']+',/g;
  let m;
  while ((m = re.exec(s))) {
    const i = m.index + m[0].length;
    let d = 0, str = false, esc = false;
    for (let j = i; j < s.length; j++) {
      const c = s[j];
      if (str) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') str = false; continue; }
      if (c === '"') { str = true; continue; }
      if (c === '{') d++;
      else if (c === '}' && --d === 0) { try { out.push(JSON.parse(s.slice(i, j + 1))); } catch (e) { /* not JSON */ } break; }
    }
  }
  return out;
}

const text = (h) => String(h ?? '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
const sek = (h) => {
  const t = text(h);
  const m = t.match(/^SEK\s*([\d,]+)$/);
  return m ? Number(m[1].replace(/,/g, '')) : null;
};

async function read(course) {
  const res = await fetch(course.url, { headers: { 'User-Agent': UA, 'Accept-Language': 'en' }, redirect: 'follow' });
  const rec = { slug: course.slug, name: course.name, url: course.url, status: res.status, finalUrl: res.url };
  if (!res.ok) return rec;
  if (res.url.replace(/\/$/, '') !== course.url.replace(/\/$/, '')) rec.redirected = true;
  const html = await res.text();
  const st = states(html).find((o) => Array.isArray(o.semesters));
  rec.instances = [];
  for (const sem of st?.semesters ?? []) {
    for (const inst of sem.instances ?? []) {
      rec.instances.push({
        semester: inst.semester ?? sem.name,
        code: inst.code,
        cancelled: !!inst.cancelled,
        firstFeeText: text(inst.firstFee) || null,
        totalFeeText: text(inst.totalFee) || null,
        firstFeeSEK: sek(inst.firstFee),
        totalFeeSEK: sek(inst.totalFee),
      });
    }
  }
  rec.allStudentsPay = /all students \(including citizens of a EU\/EEA/i.test(html);
  return rec;
}

(async () => {
  const src = fs.readFileSync(path.join(ROOT, 'data/uppsala-university-courses.ts'), 'utf8');
  const rows = eval(`(${findArray(src)})`); // eslint-disable-line no-eval
  const results = [];
  const queue = [...rows];
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (queue.length) {
      const c = queue.shift();
      try { results.push(await read(c)); } catch (e) { results.push({ slug: c.slug, url: c.url, error: String(e.message || e) }); }
    }
  }));
  results.sort((a, b) => rows.findIndex((r) => r.slug === a.slug) - rows.findIndex((r) => r.slug === b.slug));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({
    _source: 'uu.se programme pages, fee fields firstFee/totalFee from the page state JSON',
    _crawledOn: new Date().toISOString().slice(0, 10),
    results,
  }, null, 1));
  const priced = results.filter((r) => r.instances?.some((i) => i.firstFeeSEK));
  console.log(`pages ${results.length} | ok ${results.filter((r) => r.status === 200).length} | redirected ${results.filter((r) => r.redirected).length} | with a fee ${priced.length} | errors ${results.filter((r) => r.error || (r.status && r.status !== 200)).length}`);
})();
