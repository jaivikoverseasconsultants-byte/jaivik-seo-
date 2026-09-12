// Apply the 2026-09-12 Dalhousie gap-check to data/dal-courses.ts.
//
//   ADD    16 programmes the live Dalhousie program-finder lists and our file lacked.
//   REMOVE  4 programmes whose Dalhousie pages now return HTTP 404 (verified individually,
//           not inferred from a listing diff).
//
// Every added row follows the conventions already established in this file, read off the
// existing 299 rows rather than invented:
//   /undergraduate/ <degree>   -> Bachelor,              4y, 28000, Halifax
//   /undergraduate/ (DipTech)  -> Undergraduate Diploma, 2y, 18000, Truro and Bible Hill
//   /graduate-professional/    -> Master,                2y, 19500, Halifax   (all 154 existing ones)
//   /non-degree/ Certificate   -> Graduate Certificate,  1y, 14000, Online
// ieltsMin/toeflMin/pteMin are 6.5 / 90 / 61 on all 299 existing rows; new rows match.
// feeVerified:false on every row — Dalhousie publishes no international fee on programme pages.
const fs = require('fs');

const FILE = 'data/dal-courses.ts';
const raw = fs.readFileSync(FILE, 'utf8');
const MARK = 'dalCourses: DalCourse[] = ';
const mi = raw.indexOf(MARK);
const start = raw.indexOf('[', mi + MARK.length);
let depth = 0, end = -1;
for (let k = start; k < raw.length; k++) {
  if (raw[k] === '[') depth++;
  else if (raw[k] === ']') { depth--; if (depth === 0) { end = k; break; } }
}
const rows = JSON.parse(raw.slice(start, end + 1));
const before = rows.length;

// ── REMOVE ────────────────────────────────────────────────────────────────────
const REMOVE_URL_FRAGMENTS = [
  'managed-landscapes-diploma',
  'ocean-sciences-bsc-ba',
  'plant-science-bsc-agr-dip-tech',
  'certificate-in-inclusive-leadership',
];
const removed = rows.filter(c => REMOVE_URL_FRAGMENTS.some(f => c.url.includes(f)));
const kept = rows.filter(c => !REMOVE_URL_FRAGMENTS.some(f => c.url.includes(f)));

// ── ADD ───────────────────────────────────────────────────────────────────────
const slugify = name => 'dal-' + name.toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);

function shape(url, name) {
  if (/\/non-degree\//.test(url))
    return { level: 'Graduate Certificate', studyLevel: 'Postgraduate', years: 1, fee: 14000, campus: 'Online Campus', city: 'Halifax' };
  if (/\/graduate-professional\//.test(url))
    return { level: 'Master', studyLevel: 'Postgraduate', years: 2, fee: 19500, campus: 'Halifax Campus', city: 'Halifax' };
  if (/\(diptech\)/i.test(name))
    return { level: 'Undergraduate Diploma', studyLevel: 'Undergraduate', years: 2, fee: 18000, campus: 'Truro and Bible Hill Campus', city: 'Truro' };
  const agricultural = /plant science|agricultur/i.test(name);
  return { level: 'Bachelor', studyLevel: 'Undergraduate', years: 4, fee: 28000,
           campus: agricultural ? 'Truro and Bible Hill Campus' : 'Halifax Campus',
           city: agricultural ? 'Truro' : 'Halifax' };
}

const detail = JSON.parse(fs.readFileSync('data/wave-canada/dal-adds-detail.json', 'utf8'));
const detailByUrl = new Map(detail.map(d => [d.url, d]));

const existingSlugs = new Set(kept.map(c => c.slug));
let nextId = 1 + kept.reduce((m, c) => Math.max(m, parseInt((c.id || '').replace('dal-', ''), 10) || 0), 0);

const adds = [];
for (const cand of JSON.parse(fs.readFileSync('data/wave-canada/dal-adds-discovery.json', 'utf8'))) {
  const name = cand.name.trim();
  const slug = slugify(name);
  if (existingSlugs.has(slug)) { console.log(`  skip (slug already present): ${name}`); continue; }
  existingSlugs.add(slug);
  const s = shape(cand.url, name);
  const d = detailByUrl.get(cand.url);
  const intakes = (d && d.intakes || []).filter(m => /^(January|February|March|April|May|June|July|August|September|October|November|December)$/.test(m));
  adds.push({
    id: `dal-${nextId++}`,
    name, slug, url: cand.url,
    level: s.level, studyLevel: s.studyLevel,
    duration: `${s.years} year${s.years === 1 ? '' : 's'}`, durationYears: s.years,
    annualCAD: s.fee,
    annualUSD: Math.round(s.fee * 0.73),
    annualINR: Math.round(s.fee * 61),
    totalCAD: s.fee * s.years,
    livingCostCAD: 15000, livingCostUSD: 10950, livingCostINR: 915000,
    ieltsMin: 6.5, toeflMin: 90, pteMin: 61,
    intakeMonths: intakes.length ? intakes : ['September'],
    campus: s.campus,
    country: 'Canada', province: 'Nova Scotia', city: s.city, countryCode: 'CA',
    pgwp: true,
    feeVerified: false,
  });
}

const final = kept.concat(adds);

// ── Header ────────────────────────────────────────────────────────────────────
const stamp = `//
// 2026-09-12 gap-check against the live program finder (scripts/ca-gapcheck.js):
//   +${adds.length} programmes added — present on dal.ca, absent here.
//   -${removed.length} programmes removed — their Dalhousie pages now return HTTP 404, each
//      verified individually with scripts/ca-stale-probe.js rather than inferred from the
//      listing diff (the diff alone flagged 6; 2 of those were still live and were kept).
//      Removed: ${removed.map(r => r.name).join('; ')}
//   Two of the removals were SPLIT by Dalhousie rather than discontinued — "Ocean Sciences
//   (BSc)(BA)" -> "Ocean Sciences (BSc)" and "Plant Science (BSc Agr, DipTech)" -> separate
//   "Plant Science (BSc Agr)" and "Plant Science (DipTech)". Those two old course URLs have
//   301s to their successors in vercel.json, added in the same commit. The other two have no
//   equivalent and are left as natural 404s rather than redirected to something unrelated.
`;
let out = raw.slice(0, start) + JSON.stringify(final, null, 2) + raw.slice(end + 1);
const headerEnd = out.indexOf('\n\nexport interface');
out = out.slice(0, headerEnd) + '\n' + stamp + out.slice(headerEnd);
out = out.replace(/^(\/\/ \d+ courses \| crawled: [\d-]+)$/m, `// ${final.length} courses | original crawl 2026-07-07, gap-checked 2026-09-12`);

fs.writeFileSync(FILE, out);
console.log(`\nremoved ${removed.length}:`);
removed.forEach(r => console.log(`   - ${r.slug}  (${r.name})`));
console.log(`added ${adds.length}:`);
adds.forEach(a => console.log(`   + ${a.slug}  [${a.level}]  ${a.name}`));
console.log(`\n${before} -> ${final.length} courses`);
