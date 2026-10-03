// NTU undergraduate fees from NTU's own 2026 table — the close-out decided for Singapore.
//
//   node scripts/apply-ntu-ug-fees.js
//
// Source: ntu.edu.sg/admissions/undergraduate/financial-matters/tuition-fees/accepted-programme-offer-in-2026,
// one table, per academic year, inclusive of GST for international students. For "All Other IS"
// (international students outside ASEAN, i.e. Indian students) it gives two prices:
//   subsidised      — with the MOE Tuition Grant, which carries a 3-year work commitment in Singapore
//   non-subsidised  — no grant, no commitment; split Lab Based / Non-Lab Based for most programmes
// Decision (2026-10-02): the non-subsidised fee is the headline; the Tuition Grant fee is shown
// separately with its commitment.
//
// NTU does not publish which programmes are lab based. So a programme gets a single verified fee only
// where NTU's table gives one number: the accountancy/business group (one non-subsidised fee) and
// Medicine (no non-subsidised place exists; the Tuition Grant fee is the only fee). Every other
// programme carries NTU's non-subsidised range as published and stays out of budget matching, which
// needs one figure. Postgraduate rows are untouched (on request) until the Singapore country pass.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const FILE = path.join(ROOT, 'data/ntu-courses.ts');
const EVIDENCE = path.join(ROOT, 'data/wave-singapore/ntu-ug-fees-2026.json');
const PAGE = 'https://www.ntu.edu.sg/admissions/undergraduate/financial-matters/tuition-fees/accepted-programme-offer-in-2026';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const RATE_TO_INR = { SGD: 62.3, USD: 83.5 }; // must match lib/currency.ts RATE_TO_INR

// NTU's fee groups, as its table names them, and the portal rows that belong to each.
//   BBA + BSc Computer Science is NTU's "Business & Computing" double degree.
//   "BBA + BEng Double Degree Programme" could be any BEng pairing, and NTU lists only "Business &
//   Computer Engineering" in the business group, so it is left on the general range.
const GROUP_OF = {
  'Bachelor of Business Administration (BBA)': 'business',
  'Bachelor of Accountancy': 'business',
  'BBA + BSc Computer Science Double Degree': 'business',
  'Bachelor of Medicine, Bachelor of Surgery (MBBS)': 'medicine',
};

function findArray(src) {
  const m = src.match(/export const \w+(?:\s*:\s*[\w[\]<>]+)?\s*=\s*\[/);
  const start = m.index + m[0].length - 1;
  let depth = 0, str = null, esc = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (str) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === str) str = null; continue; }
    if (c === '"' || c === "'" || c === '`') { str = c; continue; }
    if (c === '[') depth++;
    else if (c === ']' && --depth === 0) return { lit: src.slice(start, i + 1), start, end: i + 1 };
  }
  return null;
}

const cell = (h) => h.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const sgd = (s) => { const m = String(s).match(/\$\s*([\d,]+)/); return m ? Number(m[1].replace(/,/g, '')) : null; };

// 1. read NTU's table
const html = execFileSync('curl', ['-sSL', '-A', UA, '--max-time', '60', PAGE], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
const table = (html.match(/<table[\s\S]*?<\/table>/) || [])[0];
if (!table) throw new Error('fee table not found on NTU\'s 2026 page');
const rows = (table.match(/<tr[\s\S]*?<\/tr>/g) || []).map((r) => (r.match(/<t[hd][\s\S]*?<\/t[hd]>/g) || []).map(cell));
const find = (re) => rows.find((r) => re.test(r[0]));
const all = find(/^All Programmes/);
const biz = find(/^Accountancy/);
const med = find(/^Medicine/);
// columns: programme | SC | PR | ASEAN IS | All Other IS (subsidised) | non-subsidised (lab | non-lab, or one merged cell)
const fees = {
  general: { tuitionGrant: sgd(all[4]), nonSubsidisedLab: sgd(all[5]), nonSubsidisedNonLab: sgd(all[6]) },
  business: { tuitionGrant: sgd(biz[4]), nonSubsidised: sgd(biz[5]), programmes: biz[0] },
  medicine: { tuitionGrant: sgd(med[4]), nonSubsidised: /Not Applicable/i.test(med[5]) ? null : sgd(med[5]) },
};
for (const [k, v] of Object.entries(fees)) if (!v.tuitionGrant) throw new Error(`could not read the ${k} row: ${JSON.stringify(v)}`);
if (!fees.general.nonSubsidisedLab || !fees.general.nonSubsidisedNonLab || !fees.business.nonSubsidised) throw new Error(`non-subsidised figures missing: ${JSON.stringify(fees)}`);
if (fees.medicine.nonSubsidised) throw new Error('Medicine now has a non-subsidised fee — revisit the Medicine rule');
fs.mkdirSync(path.dirname(EVIDENCE), { recursive: true });
fs.writeFileSync(EVIDENCE, JSON.stringify({ _source: PAGE, _readOn: new Date().toISOString().slice(0, 10), _basis: 'per academic year, inclusive of 9% GST, "All Other IS" columns', table: rows, fees }, null, 1));

// 2. apply to the undergraduate rows
let src = fs.readFileSync(FILE, 'utf8');
const a = findArray(src);
const courses = eval(`(${a.lit})`); // eslint-disable-line no-eval
const n = (x) => x.toLocaleString('en-US');
const TG = 'with the MOE Tuition Grant, which requires a 3-year work commitment in Singapore after graduation';
const report = { single: [], range: 0 };

for (const c of courses) {
  if (c.level !== 'Bachelor') continue;
  delete c.totalSGD;
  delete c.nonSubsidisedRangeSGD; delete c.tuitionGrantSGD;
  const group = GROUP_OF[c.name] || 'general';
  const set = (annual, basis, tg) => {
    c.annualSGD = annual;
    c.annualINR = Math.round(annual * RATE_TO_INR.SGD);
    c.annualUSD = Math.round((annual * RATE_TO_INR.SGD) / RATE_TO_INR.USD);
    c.feeVerified = true; c.feeScope = 'programme group'; c.feeBasis = basis; c.feeSourceUrl = PAGE;
    if (tg) c.tuitionGrantSGD = tg;
  };
  if (group === 'business') {
    set(fees.business.nonSubsidised, `non-subsidised annual tuition for international students, 2026 intake, GST included — NTU charges one fee across ${fees.business.programmes}`, fees.business.tuitionGrant);
    report.single.push(c.name);
  } else if (group === 'medicine') {
    set(fees.medicine.tuitionGrant, `annual tuition for international students, 2026 intake, GST included — NTU offers Medicine to international students only ${TG}; there is no non-subsidised place`);
    c.tuitionGrantOnly = true;
    report.single.push(c.name);
  } else {
    c.annualSGD = 0; c.annualUSD = 0; c.annualINR = 0;
    c.feeVerified = false;
    c.feeScope = 'range';
    c.nonSubsidisedRangeSGD = [fees.general.nonSubsidisedNonLab, fees.general.nonSubsidisedLab];
    c.tuitionGrantSGD = fees.general.tuitionGrant;
    c.feeBasis = `NTU's non-subsidised annual tuition for international students is S$${n(fees.general.nonSubsidisedLab)} for lab-based and S$${n(fees.general.nonSubsidisedNonLab)} for non-lab-based programmes (2026 intake, GST included); NTU does not publish which of the two this programme is`;
    c.feeSourceUrl = PAGE;
    report.range++;
  }
}

src = src.slice(0, a.start) + `[\n${courses.map((r) => `  ${JSON.stringify(r)}`).join(',\n')}\n]` + src.slice(a.end);
src = src.replace(
  'annualSGD: number; annualUSD: number; annualINR: number; totalSGD: number;',
  'annualSGD: number; annualUSD: number; annualINR: number; totalSGD?: number; feeScope?: string; feeBasis?: string; feeSourceUrl?: string | null; nonSubsidisedRangeSGD?: [number, number]; tuitionGrantSGD?: number; tuitionGrantOnly?: boolean;',
);
if (!src.includes('tuitionGrantSGD?: number;')) throw new Error('interface not updated — check its fee fields');
fs.writeFileSync(FILE, src);
console.log(`NTU 2026: general TG ${fees.general.tuitionGrant}, non-sub ${fees.general.nonSubsidisedNonLab}-${fees.general.nonSubsidisedLab}; business TG ${fees.business.tuitionGrant}, non-sub ${fees.business.nonSubsidised}; medicine TG ${fees.medicine.tuitionGrant}`);
console.log(`single verified fee: ${report.single.join('; ')}\nrange (not in budget matching): ${report.range}`);
