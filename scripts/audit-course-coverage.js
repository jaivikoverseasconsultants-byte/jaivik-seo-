// Registry-wide completeness audit: which universities have no courses, which show only one
// study level, and how stale each one's data is — ranked by the search demand the site actually
// gets for that university.
//
// Answers the question "which university pages are thin?" without anyone clicking through
// hundreds of pages. Run: node scripts/audit-course-coverage.js [path-to-gsc-json]
//
// The optional GSC file is a Search Console page-performance export (rows[].keys[0] = URL,
// impressions, clicks). Without it the audit still runs; it just can't rank by demand.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const R = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

// ── the registry: which universities have course data, and from which files ──
const registrySrc = R('data/university-course-registry.ts');
const fileOf = new Map();
for (const m of registrySrc.matchAll(/import \{\s*\w+ as (m_\w+)\s*\} from '\.\/([\w-]+)';/g)) {
  fileOf.set(m[1], `data/${m[2]}.ts`);
}
const registry = new Map();
for (const m of registrySrc.matchAll(/^\s*'([a-z0-9-]+)':\s*([^,\n]+),/gm)) {
  const files = [...new Set((m[2].match(/m_\w+/g) ?? []).map((r) => fileOf.get(r)).filter(Boolean))];
  if (files.length) registry.set(m[1], files);
}

// ── every university profile on the site ────────────────────────────────────
const uniSrc = R('data/universities.ts');
const profiles = [];
for (const m of uniSrc.matchAll(/slug: '([a-z0-9-]+)', country: '([^']+)'/g)) {
  profiles.push({ slug: m[1], country: m[2] });
}

// ── course rows per data file ───────────────────────────────────────────────
const loadRows = (file) => {
  try {
    const src = R(file);
    const m = src.match(/export const \w+\s*:\s*[\w\[\]<>]+\s*=\s*(\[[\s\S]*?\n\]);/);
    return m ? JSON.parse(m[1]) : [];
  } catch { return []; }
};

const gitDate = (file) => {
  try {
    return execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { cwd: ROOT }).toString().trim() || null;
  } catch { return null; }
};
// the crawl date the generators write into each file's header, when there is one
const headerDate = (file) => {
  try {
    const head = R(file).split('\n').slice(0, 12).join(' ');
    const m = head.match(/(?:crawled|Canada wave|Generated|generated)[^0-9]{0,20}(\d{4}-\d{2}-\d{2})/);
    return m ? m[1] : null;
  } catch { return null; }
};

// ── demand, from Search Console ─────────────────────────────────────────────
const demand = new Map(); // slug -> {impressions, clicks, profileImpressions}
const gscFile = process.argv[2];
if (gscFile && fs.existsSync(gscFile)) {
  const json = JSON.parse(fs.readFileSync(gscFile, 'utf8'));
  for (const row of json.rows ?? []) {
    const url = row.keys?.[0] ?? '';
    const m = url.match(/\/universities\/([a-z0-9-]+)(\/|$)/);
    if (!m) continue;
    const slug = m[1];
    const d = demand.get(slug) ?? { impressions: 0, clicks: 0, profileImpressions: 0 };
    d.impressions += row.impressions ?? 0;
    d.clicks += row.clicks ?? 0;
    if (/\/universities\/[a-z0-9-]+\/?$/.test(url)) d.profileImpressions += row.impressions ?? 0;
    demand.set(slug, d);
  }
}

// ── build the picture ───────────────────────────────────────────────────────
// Read BOTH fields: the files disagree about which holds what. The Canada files put
// "Undergraduate"/"Postgraduate" in studyLevel and "Bachelor"/"Masters" in level; several UK files
// have it the other way round (level "Masters", studyLevel "MSc"). Testing one field alone left
// those universities unclassified, and "Undergraduate Certificate" contains the substring
// "graduate", which once counted 34 of SFU's undergraduate rows as postgraduate.
const levelText = (c) => `${c.studyLevel || ''} ${c.level || ''}`.toLowerCase().replace(/under[ -]?graduate/g, ' ug ');
const isPG = (c) => /post[ -]?grad|master|\bmsc\b|\bma\b|\bmba\b|\bmeng\b|\bmasc\b|\bllm\b|\bmres\b|\bmphil\b|\bmpa\b|\bmph\b|phd|doctor|pgdip|pgce|graduate/.test(levelText(c));
const isUG = (c) => !isPG(c) && /\bug\b|bachelor|\bba\b|\bbsc\b|\bbeng\b|\bbcom\b|\bbba\b|diploma|certificate|honours|foundation/.test(levelText(c));
const LEVELS = (rows) => {
  const ug = rows.filter(isUG).length;
  const pg = rows.filter(isPG).length;
  return { ug, pg, unknown: rows.length - ug - pg };
};

const out = [];
for (const p of profiles) {
  const files = registry.get(p.slug) ?? [];
  const rows = files.flatMap(loadRows);
  const { ug, pg, unknown } = LEVELS(rows);
  const d = demand.get(p.slug) ?? { impressions: 0, clicks: 0, profileImpressions: 0 };
  const dates = files.map((f) => ({ file: f, git: gitDate(f), header: headerDate(f) }));
  const flags = [];
  if (!files.length) flags.push('NO COURSE DATA');
  else if (!rows.length) flags.push('DATA FILE EMPTY');
  else {
    // only claim "one level only" when the other level is genuinely absent, never when the rows
    // simply failed to classify
    if (ug > 0 && pg === 0) flags.push('UG ONLY');
    if (pg > 0 && ug === 0) flags.push('PG ONLY');
    if (unknown > rows.length / 2) flags.push(`LEVEL UNCLEAR (${unknown}/${rows.length})`);
    if (rows.length < 15) flags.push(`THIN (${rows.length})`);
  }
  const hasRoute = fs.existsSync(path.join(ROOT, 'app', 'universities', p.slug, 'courses', '[slug]', 'page.tsx'));
  if (files.length && rows.length && !hasRoute) flags.push('NO COURSE ROUTE');
  out.push({ slug: p.slug, country: p.country, courses: rows.length, ug, pg, unknown, flags, dates, ...d });
}

const flagged = out.filter((u) => u.flags.length).sort((a, b) => b.impressions - a.impressions || b.courses - a.courses);
const tot = (f) => out.filter((u) => u.flags.some((x) => x.startsWith(f))).length;

console.log(`universities with a profile page: ${out.length}`);
console.log(`  in the course registry:          ${registry.size}`);
console.log(`  flagged below:                   ${flagged.length}`);
console.log(`    no course data at all:         ${tot('NO COURSE DATA')}`);
console.log(`    only undergraduate:            ${tot('UG ONLY')}`);
console.log(`    only postgraduate:             ${tot('PG ONLY')}`);
console.log(`    fewer than 15 courses:         ${tot('THIN')}`);
console.log(`    data but no course route:      ${tot('NO COURSE ROUTE')}\n`);

console.log('Top 40 by Search Console impressions (last 90 days)');
console.log('impressions  clicks  courses  UG/PG        last commit  university (flags)');
for (const u of flagged.slice(0, 40)) {
  const when = u.dates.map((d) => d.header || d.git).filter(Boolean)[0] ?? '—';
  console.log(
    String(u.impressions).padStart(11) + String(u.clicks).padStart(8) + String(u.courses).padStart(9) +
    `  ${String(u.ug).padStart(4)}/${String(u.pg).padEnd(5)}` + `  ${when.padEnd(11)}  ${u.slug} (${u.flags.join(', ')})`,
  );
}

// ── course data sitting in the repo that the registry never imports ─────────
// Registering a slug is what makes its courses reachable, so a data file the registry skips is
// invisible on the site no matter how good it is.
const usedFiles = new Set([...registrySrc.matchAll(/from '\.\/([\w-]+)';/g)].map((m) => `data/${m[1]}.ts`));
const profileBySlug = new Map(out.map((u) => [u.slug, u]));
const names = [];
for (const m of uniSrc.matchAll(/name: '([^']+)', shortName: '([^']+)',\s*\n?\s*slug: '([a-z0-9-]+)'/g)) {
  names.push({ name: m[1], short: m[2], slug: m[3] });
}
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const orphans = [];
for (const f of fs.readdirSync(path.join(ROOT, 'data'))) {
  if (!/-courses\.ts$/.test(f) || usedFiles.has(`data/${f}`)) continue;
  const rows = loadRows(`data/${f}`);
  if (!rows.length) continue;
  const stem = norm(f.replace(/-(w2-)?courses\.ts$/, ''));
  const hit = names.find((n) => norm(n.slug) === stem || norm(n.short) === stem || norm(n.name) === stem)
    ?? names.find((n) => norm(n.slug).includes(stem) && stem.length >= 4);
  orphans.push({ file: `data/${f}`, courses: rows.length, slug: hit?.slug ?? null, profile: hit ? profileBySlug.get(hit.slug) : null });
}
orphans.sort((a, b) => (b.profile?.impressions ?? 0) - (a.profile?.impressions ?? 0) || b.courses - a.courses);
const fillable = orphans.filter((o) => o.profile && o.profile.courses === 0);
console.log(`\nCourse data in the repo the registry never imports: ${orphans.length} files, ${orphans.reduce((s, o) => s + o.courses, 0)} courses`);
console.log(`  of those, files whose university currently shows ZERO courses: ${fillable.length} files, ${fillable.reduce((s, o) => s + o.courses, 0)} courses`);
console.log('  top by that university\'s search demand:');
for (const o of fillable.slice(0, 15)) {
  console.log(`    ${String(o.profile.impressions).padStart(4)} impr  ${String(o.courses).padStart(4)} courses  ${o.slug.padEnd(38)} ${o.file}`);
}

fs.mkdirSync(path.join(ROOT, 'reports'), { recursive: true });
const stamp = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(ROOT, `reports/course-coverage-${stamp}.json`), JSON.stringify({ generated: stamp, universities: out, unregisteredDataFiles: orphans.map(o => ({ file: o.file, courses: o.courses, university: o.slug, universityShowsZero: o.profile ? o.profile.courses === 0 : null })) }, null, 1));
const csv = ['slug,country,courses,ug,pg,flags,impressions_90d,clicks_90d,last_data_date']
  .concat(out.map((u) => [u.slug, u.country, u.courses, u.ug, u.pg, `"${u.flags.join('; ')}"`, u.impressions, u.clicks, u.dates.map((d) => d.header || d.git).filter(Boolean)[0] ?? ''].join(',')));
fs.writeFileSync(path.join(ROOT, `reports/course-coverage-${stamp}.csv`), csv.join('\n'));
console.log(`\nwrote reports/course-coverage-${stamp}.json and .csv`);
