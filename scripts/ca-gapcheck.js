// Gap-check the 4 already-REAL Canadian universities against their live catalogues.
// Produces, per university: courses the live site has that our file lacks (candidates to ADD),
// and courses our file has that the live site no longer lists (candidates to FLAG for review).
//
// Deliberately does NOT write to data/*.ts — a live-site absence can mean "renamed", "moved",
// or "catalogue paginated differently", not "discontinued". Removal is a human call; this
// produces the evidence for it.
const { execFileSync } = require('child_process');
const fs = require('fs');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
function get(u) {
  try { return execFileSync('curl', ['-sL','-A',UA,'-m','60','--compressed',u],
    { maxBuffer: 3e8, encoding: 'utf8' }); } catch { return ''; }
}
const norm = s => (s || '').toLowerCase()
  .replace(/&amp;/g, '&').replace(/&[a-z#0-9]+;/gi, ' ')
  .replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();

// Pull { name, url } pairs out of an HTML index by href pattern.
function indexPairs(html, base, keepRe) {
  const out = new Map();
  const re = /<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    let h = m[1].split('#')[0].split('?')[0];
    if (h.startsWith('/')) h = base + h;
    if (!keepRe.test(h)) continue;
    const name = m[2].replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&')
      .replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
    if (!name || name.length < 3) continue;
    if (!out.has(h) || out.get(h).length < name.length) out.set(h, name);
  }
  return [...out].map(([url, name]) => ({ url, name }));
}

function readDataFile(path, arrayName) {
  const raw = fs.readFileSync(path, 'utf8');
  const marker = arrayName + ' = ';
  const i = raw.indexOf(marker);
  if (i < 0) throw new Error('marker not found: ' + marker);
  // NB: the marker itself contains "[]" (the type annotation), so the array's opening
  // bracket must be searched for AFTER the marker ends, not from the marker's start.
  const start = raw.indexOf('[', i + marker.length);
  // find the matching close bracket of the top-level array
  let depth = 0, end = -1;
  for (let k = start; k < raw.length; k++) {
    if (raw[k] === '[') depth++;
    else if (raw[k] === ']') { depth--; if (depth === 0) { end = k; break; } }
  }
  return JSON.parse(raw.slice(start, end + 1));
}

// The original Wave-1 crawls filtered each catalogue by a degree-keyword whitelist and
// dropped Minors / Majors / Microprograms / policy pages. The live side of this diff has to
// apply the SAME filter or it reports those exclusions as "missing courses" — the first pass
// flagged 176 uOttawa Minors and 375 Manitoba policy pages exactly that way.
const DEGREE_NAME = /\b(bachelor|baccalaur|honours|hons|b\.?sc|b\.?a\b|b\.?comm|basc|bsocsc|beng|master|m\.?sc|m\.?a\b|mba|meng|ph\.?d|doctorate|doctor of|juris doctor|diploma|certificate)\b/i;
const NOT_A_PROGRAM = /^(minor|major|microprogram|micro-program)\b|\bminor in\b|academic guide|university polic|procedures|accessibility policy|general regulations|admission requirements$/i;
const programLike = name => DEGREE_NAME.test(name) && !NOT_A_PROGRAM.test(name);

const JOBS = [
  {
    uni: 'University of Ottawa',
    file: 'data/uottawa-courses.ts', arr: 'uottawaCourses: UottawaCourse[]',
    // The A-Z index is the same source the original 2026-07-07 crawl used, and is the only
    // complete listing — the /en/undergrad/ and /en/grad/ landing pages show a partial subset.
    seeds: ['https://catalogue.uottawa.ca/azindex/'],
    base: 'https://catalogue.uottawa.ca',
    keep: /catalogue\.uottawa\.ca\/en\/(undergrad|grad)\/[a-z0-9-]+\/$/i,
  },
  {
    uni: 'University of Manitoba',
    file: 'data/umanitoba-courses.ts', arr: 'umanitobaCourses: UmanitobaCourse[]',
    seeds: ['https://catalog.umanitoba.ca/azindex/'],
    base: 'https://catalog.umanitoba.ca',
    keep: /catalog\.umanitoba\.ca\/(undergraduate|graduate)-studies\/[a-z0-9-]+\/[a-z0-9-]+\/$/i,
  },
  {
    uni: 'Dalhousie University',
    file: 'data/dal-courses.ts', arr: 'dalCourses: DalCourse[]',
    api: 'https://www.dal.ca/study/programs/_jcr_content/root/maincontent/main/programfinder.model.json',
  },
  {
    uni: "Queen's University",
    file: 'data/queens-courses.ts', arr: 'queensCourses: QueensCourse[]',
    seeds: ['https://www.queensu.ca/academics/programs'],
    base: 'https://www.queensu.ca',
    keep: /queensu\.ca\/[a-z0-9-]+\/(undergraduate|graduate)\/programs?/i,
  },
];

const report = {};
for (const job of JOBS) {
  let ours = [];
  try { ours = readDataFile(job.file, job.arr); }
  catch (e) { console.log(`${job.uni}: could not parse ${job.file} — ${e.message.slice(0, 70)}`); continue; }

  let live = [];
  if (job.api) {
    const raw = get(job.api);
    try {
      const j = JSON.parse(raw);
      // Each entry carries name / mappedURL / types[]. A naive recursive walk picks up the
      // nested faculties[] and units[] objects (which also have title+url) and yields faculty
      // pages instead of programmes — that produced a bogus live=72 on the first pass.
      const DEGREE = /^(Bachelor|Master|PhD|Diploma|Certificate|Entry-to-practice)$/i;
      for (const p of (j.programs || [])) {
        const types = (p.types || []).map(t => (t && t.title) || t).filter(Boolean);
        if (!types.some(t => DEGREE.test(t))) continue;      // drops Course / Upgrading / Non-credit
        if (!p.name || !p.mappedURL) continue;
        live.push({ name: p.name, url: p.mappedURL });
      }
    } catch { /* fall through to empty */ }
  } else {
    for (const s of job.seeds) live.push(...indexPairs(get(s), job.base, job.keep));
  }
  // URL is the reliable join key. Names diverge cosmetically between our file and the live
  // catalogue ("Accounting, B. Comm., Honours" vs "Accounting (B.Comm. Hons)"), which made a
  // name-only diff report ~80% of a matching catalogue as missing. Name is the fallback only.
  const keyUrl = u => (u || '').toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '').replace(/^www\./, '');

  const beforeFilter = live.length;
  if (!job.api) live = live.filter(l => programLike(l.name));   // Dal already filters on its own types[]
  const droppedByFilter = beforeFilter - live.length;

  const seenL = new Set();
  live = live.filter(l => { const k = keyUrl(l.url) || norm(l.name); if (!k || seenL.has(k)) return false; seenL.add(k); return true; });

  const ourUrls = new Set(ours.map(c => keyUrl(c.url)).filter(Boolean));
  const ourNames = new Set(ours.map(c => norm(c.name)));
  const liveUrls = new Set(live.map(l => keyUrl(l.url)).filter(Boolean));
  const liveNames = new Set(live.map(l => norm(l.name)));

  const missing = live.filter(l => !ourUrls.has(keyUrl(l.url)) && !ourNames.has(norm(l.name)));
  const stale = live.length ? ours.filter(c => !liveUrls.has(keyUrl(c.url)) && !liveNames.has(norm(c.name))) : [];

  report[job.uni] = {
    ourCount: ours.length,
    liveCount: live.length,
    liveFetchOk: live.length > 0,
    droppedByProgramFilter: droppedByFilter,
    missingFromOurs: missing.slice(0, 400),
    notOnLiveSite: stale.slice(0, 400).map(c => ({ name: c.name, url: c.url, slug: c.slug })),
  };
  console.log(
    `${job.uni.padEnd(24)} ours=${String(ours.length).padStart(4)}  live=${String(live.length).padStart(4)}` +
    `  MISSING(add)=${String(missing.length).padStart(4)}  NOT-ON-LIVE(review)=${String(stale.length).padStart(4)}` +
    (live.length ? '' : '   << live fetch returned nothing — diff suppressed')
  );
}
fs.writeFileSync('data/wave-canada/gapcheck.json', JSON.stringify(report, null, 2));
console.log('\nwrote data/wave-canada/gapcheck.json');
