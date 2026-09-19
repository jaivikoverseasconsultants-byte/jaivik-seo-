// Canada wave: turn the verified detail crawl into data/<uni>-courses.ts files.
//
// Verification rules (deliberately conservative — see memory: fee-verification-system):
//   * feeVerified is TRUE only when the university's own program page published an
//     INTERNATIONAL figure AND the surrounding text stated an annual basis. An
//     international figure with an unstated basis is recorded but left unverified,
//     because annual-vs-total is the trap that put a UoM MBA in at 2x its real fee.
//   * IELTS/TOEFL/PTE come from the institution-level English-requirements page when the
//     program page does not publish its own. `englishScope` records which it was, so a
//     later reader never mistakes an institution-wide floor for a programme requirement.
const fs = require('fs');

const FX = { usd: 0.73, inr: 61 };          // matches existing Canada rows (27000 -> 19710 / 1647000)
const LIVING = { cad: 14000 };

function slugify(prefix, name) {
  return prefix + '-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}
function levelOf(name) {
  const n = name.toLowerCase();
  if (/\bph\.?d\b|doctor of philosophy|doctorate/.test(n)) return ['PhD', 'Postgraduate'];
  if (/\bmaster|\bm\.?sc\b|\bm\.?a\b|\bmba\b|\bm\.?eng\b|\bmfa\b|\bllm\b|graduate certificate|graduate diploma|postgraduate|\bpmdip\b|\bmasc\b/.test(n)) return ['Masters', 'Postgraduate'];
  if (/\bbachelor|\bb\.?sc\b|\bb\.?a\b|\bbcomm\b|\bbeng\b|honours|\bhons\b|\bbba\b|undergraduate/.test(n)) return ['Bachelor', 'Undergraduate'];
  if (/diploma|certificate|advanced diploma/.test(n)) return ['Bachelor', 'Undergraduate'];
  return ['Bachelor', 'Undergraduate'];
}
function cleanName(s, uniName) {
  if (!s) return '';
  let n = s.replace(/\s+/g, ' ').trim();
  // strip the trailing credential/campus/format metadata some listings append
  n = n.replace(/\s*[-–|]\s*(Toronto Metropolitan University|Durham College|Algonquin College|University of Guelph|York University|Kwantlen Polytechnic University|University of New Brunswick|University of Waterloo).*$/i, '');
  n = n.replace(new RegExp('\\s*[-–|]\\s*' + uniName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '.*$', 'i'), '');
  n = n.replace(/\s*\(NEW\)\s*$/i, '').replace(/\s*[-–]\s*NEW\s*$/i, '');
  // Waterloo suffixes every listing entry with " degree" ("Biochemistry degree").
  n = n.replace(/\s+degree$/i, '');
  // "Waterloo s business programs" — the apostrophe is lost upstream when entities are stripped.
  n = n.replace(/\bWaterloo s\b/g, "Waterloo's");
  return n.trim();
}

const UNIS = {
  durham:      { prefix: 'durham',    varName: 'durham',      iface: 'Durham',      uniName: 'Durham College',                 province: 'Ontario',          city: 'Oshawa',      campus: 'Oshawa Campus',        english: 'Durham College' },
  tmu:         { prefix: 'tmu',       varName: 'tmu',         iface: 'Tmu',         uniName: 'Toronto Metropolitan University', province: 'Ontario',         city: 'Toronto',     campus: 'Downtown Toronto',     english: 'Toronto Metropolitan' },
  unb:         { prefix: 'unb',       varName: 'unb',         iface: 'Unb',         uniName: 'University of New Brunswick',    province: 'New Brunswick',    city: 'Fredericton', campus: 'Fredericton Campus',   english: 'Univ of New Brunswick' },
  waterloo_ug: { prefix: 'waterlooug',varName: 'waterlooUg',  iface: 'WaterlooUg',  uniName: 'University of Waterloo',         province: 'Ontario',          city: 'Waterloo',    campus: 'Main Campus',          english: 'University of Waterloo' },
  york:        { prefix: 'yorku',     varName: 'yorku',       iface: 'Yorku',       uniName: 'York University',                province: 'Ontario',          city: 'Toronto',     campus: 'Keele Campus',         english: 'York University' },
  guelph:      { prefix: 'guelph',    varName: 'guelph',      iface: 'Guelph',      uniName: 'University of Guelph',           province: 'Ontario',          city: 'Guelph',      campus: 'Main Campus',          english: 'University of Guelph' },
  algonquin:   { prefix: 'algonquin', varName: 'algonquinReal', iface: 'AlgonquinReal', uniName: 'Algonquin College',          province: 'Ontario',          city: 'Ottawa',      campus: 'Ottawa Campus',        english: 'Algonquin College' },
  ualberta:    { prefix: 'ualberta',  varName: 'ualberta',    iface: 'Ualberta',   uniName: 'University of Alberta',     province: 'Alberta',          city: 'Edmonton',    campus: 'North Campus',          english: 'University of Alberta' },
  kpu:         { prefix: 'kpu',       varName: 'kpuReal',     iface: 'KpuReal',     uniName: 'Kwantlen Polytechnic University', province: 'British Columbia', city: 'Surrey',      campus: 'Surrey Campus',        english: 'Kwantlen (KPU)' },
};

const english = JSON.parse(fs.readFileSync('data/wave-canada/institution-english.json', 'utf8'));
const instFees = JSON.parse(fs.readFileSync('data/wave-canada/institution-fees.json', 'utf8'));

function build(key, detailFiles) {
  const cfg = UNIS[key];
  let rows = [];
  for (const f of detailFiles) {
    if (!fs.existsSync(f)) { console.log(`  (missing ${f})`); continue; }
    rows.push(...JSON.parse(fs.readFileSync(f, 'utf8')));
  }
  rows = rows.filter(r => r.fetch !== 'FAIL' && (r.officialName || r.sourceName));

  // Which field actually carries the programme name differs per university, and picking wrong
  // silently collapses the whole set under dedup:
  //   UNB     - <h1> is "Search UNB" on all 130 pages; the listing anchor text is the real name.
  //   Guelph  - <h1> is "2026-2027 Academic Calendar" on 197 of 198.
  //   Algonquin - <h1> is the School name (11 distinct across 180 programmes).
  //   York    - the reverse: <h1> is the real name, the anchor text is "See Program Details".
  // So choose by measured distinctness rather than by a fixed preference.
  const distinct = f => new Set(rows.map(r => (r[f] || '').trim()).filter(Boolean)).size;
  const nameField = distinct('officialName') >= distinct('sourceName') ? 'officialName' : 'sourceName';
  const fallback = nameField === 'officialName' ? 'sourceName' : 'officialName';
  console.log(`  name field: ${nameField} (${distinct(nameField)} distinct) over ${fallback} (${distinct(fallback)})`);

  const inst = english[cfg.english] || {};
  const instIelts = inst.ielts && inst.ielts.length ? Math.min(...inst.ielts.map(Number)) : null;
  const instToefl = inst.toefl && inst.toefl.length ? Math.min(...inst.toefl.map(Number)) : null;
  const instPte   = inst.pte   && inst.pte.length   ? Math.min(...inst.pte.map(Number))   : null;

  const seen = new Set(); const out = []; let verified = 0;
  for (const r of rows) {
    const name = cleanName(r[nameField] || r[fallback], cfg.uniName);
    if (!name || name.length < 4) continue;
    if (/^(home|programs?|search|page not found|404)$/i.test(name)) continue;
    // Listing pages mix hub/landing entries in with real programmes — Waterloo's index links
    // "Customize your degree with minors..." -> /future-students/programs/minors alongside its
    // actual degrees. A degree-keyword WHITELIST cannot be used here (Guelph's catalogue names
    // are bare subjects like "Accounting (ACCT)"), so exclude the hub shapes instead.
    if (/^(customize|explore|discover|learn about|browse|view all|see all|find your|compare)\b/i.test(name)) continue;
    if (/\bat a glance\b|\ball programs\b|\bprogram finder\b|\bhow to apply\b/i.test(name)) continue;
    if (/\/(minors|programs|courses|index)\/?$/i.test(r.url || '')) continue;
    // Waterloo's index lists 5 faculty/theme hubs alongside its ~107 real degrees.
    if (/\/future-students\/programs\/(business|environmental-degrees|exchange-programs|themes|by-faculty|co-op)\/?$/i.test(r.url || '')) continue;
    const slug = slugify(cfg.prefix, name);
    if (seen.has(slug)) continue;
    seen.add(slug);

    const [level, studyLevel] = levelOf(name);
    const years = r.duration && r.duration.years ? Math.min(Math.max(r.duration.years, 0.5), 6) : (studyLevel === 'Postgraduate' ? 2 : 4);
    const fee = (r.tuitionIntl || [])[0] || null;
    // feeVerified requires BOTH: the university published an international figure, AND it
    // stated an annual basis. A per-term institution-wide figure is recorded for reference
    // but never verified as annual — converting it would be our arithmetic, not their claim.
    const feeVerified = !!(fee && fee.basis === 'annual');
    if (feeVerified) verified++;
    const annualCAD = fee ? fee.amountCAD : (studyLevel === 'Postgraduate' ? 25000 : 28000);
    const instFee = instFees[cfg.english];
    const hasInstFee = instFee && instFee.found;

    out.push({
      id: `${cfg.prefix}-${out.length + 1}`,
      name, slug, url: r.url,
      level, studyLevel,
      duration: `${years} year${years === 1 ? '' : 's'}`, durationYears: years,
      annualCAD,
      annualUSD: Math.round(annualCAD * FX.usd),
      annualINR: Math.round(annualCAD * FX.inr),
      totalCAD: Math.round(annualCAD * years),
      livingCostCAD: LIVING.cad,
      livingCostUSD: Math.round(LIVING.cad * FX.usd),
      livingCostINR: Math.round(LIVING.cad * FX.inr),
      ieltsMin: r.ielts || instIelts || 6.5,
      toeflMin: r.toefl || instToefl || 86,
      pteMin: r.pte || instPte || 58,
      intakeMonths: (r.intakes && r.intakes.length ? r.intakes : ['September']).filter(m => /^[A-Z][a-z]+$/.test(m)),
      campus: cfg.campus,
      country: 'Canada', province: cfg.province, city: cfg.city, countryCode: 'CA',
      pgwp: true,
      feeVerified,
      englishScope: (r.ielts ? 'programme page' : (instIelts ? 'institution-wide' : 'not published — house default')),
      feeScope: fee ? 'programme page' : (hasInstFee ? 'institution-wide' : 'not published'),
      feeBasis: fee ? fee.basis : (hasInstFee ? instFee.feeBasis : 'not published'),
      feeSourceUrl: fee ? r.url : (hasInstFee ? instFee.sourceUrl : null),
      instTuitionPerTermCAD: (!fee && hasInstFee) ? (instFee.maxTuitionPerTerm ?? null) : null,
    });
  }

  const header = `// ${cfg.uniName} — REAL crawl of the university's own website (Canada wave, ${new Date().toISOString().slice(0, 10)}).
// Discovery: scripts/ca-discover*.js   Detail: scripts/ca-detail.js   Generator: scripts/ca-generate.js
// ${out.length} programmes | international tuition published on ${out.filter(c => c.feeSourceUrl).length} | annual basis stated on ${verified}
//
// feeVerified is TRUE only where the programme page published an INTERNATIONAL figure AND
// stated an annual basis. International figures with an unstated basis are kept with
// feeBasis:'unknown' and feeVerified:false, so nothing publishes as fact that the source
// did not actually assert (fee-crawl-traps #1 and #2).
// englishScope records whether IELTS/TOEFL/PTE came from the programme page or from the
// institution-wide English-requirements page — these are NOT per-programme minimums in Canada.

export interface ${cfg.iface}Course {
  feeVerified?: boolean;
  englishScope?: string;
  feeScope?: string;
  feeBasis?: string;
  feeSourceUrl?: string | null;
  instTuitionPerTermCAD?: number | null;
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualCAD: number; annualUSD: number; annualINR: number; totalCAD: number;
  livingCostCAD: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; province: string; city: string; countryCode: string;
  pgwp: boolean;
}

export const ${cfg.varName}Courses: ${cfg.iface}Course[] = ${JSON.stringify(out, null, 2)};

export function get${cfg.iface}CourseBySlug(slug: string) {
  return ${cfg.varName}Courses.find(c => c.slug === slug) ?? null;
}
`;
  const path = `data/${cfg.prefix}-courses.ts`;
  fs.writeFileSync(path, header);
  console.log(`${path.padEnd(34)} ${String(out.length).padStart(4)} courses | intl fee on ${String(out.filter(c => c.feeSourceUrl).length).padStart(4)} | feeVerified ${String(verified).padStart(4)} | english: ${instIelts ? 'IELTS ' + instIelts + ' (institution)' : 'none found'}`);
  return { key, count: out.length, withFee: out.filter(c => c.feeSourceUrl).length, verified };
}

const JOBS = [
  ['durham',      ['data/wave-canada/durham-detail.json']],
  ['tmu',         ['data/wave-canada/tmu_ug-detail.json', 'data/wave-canada/tmu_pg-detail.json']],
  ['unb',         ['data/wave-canada/unb-detail.json']],
  ['waterloo_ug', ['data/wave-canada/waterloo_ug-detail.json']],
  ['york',        ['data/wave-canada/york-detail.json']],
  ['guelph',      ['data/wave-canada/guelph-detail.json']],
  ['algonquin',   ['data/wave-canada/algonquin-detail.json']],
  // KPU, corrected 2026-09-14. The first pass harvested www.kpu.ca/programs-az/... and every
  // one of those 249 URLs 404s — in curl AND in a real browser (verified with a control URL,
  // scripts/kpu-verify.js). The cause was NOT bot-blocking: KPU's programme pages live on a
  // different HOST, the CourseLeaf catalogue at calendar.kpu.ca, which serves 200 to plain
  // curl. No Puppeteer needed. The dead www.kpu.ca set is kept as kpu-discovery.json for the
  // record; kpu2-* is the real one.
  ['kpu',         ['data/wave-canada/kpu2-detail.json']],
  // UAlberta: www.ualberta.ca answers curl with HTTP 202 + an 8-byte body on every path,
  // so discovery AND detail both ran in-browser (ualberta-sitemap-pptr.js / ualberta-detail-pptr.js).
  ['ualberta',    ['data/wave-canada/ualberta2-detail.json']],
];
const summary = [];
for (const [k, files] of JOBS) {
  if (!files.some(f => fs.existsSync(f))) { console.log(`${k}: no detail file yet — skipped`); continue; }
  summary.push(build(k, files));
}
fs.writeFileSync('data/wave-canada/generation-summary.json', JSON.stringify(summary, null, 2));
