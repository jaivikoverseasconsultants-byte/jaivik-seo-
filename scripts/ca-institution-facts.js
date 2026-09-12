// Canada wave (b): institution-level facts — application fee, tuition deposit, scholarships.
// These are published once per institution in Canada, not per course, so they are captured
// per university with the exact source URL and the sentence they were read from.
const { execFileSync } = require('child_process');
const fs = require('fs');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';

function get(u) {
  try {
    return execFileSync('curl', ['-sL', '-A', UA, '-m', '35', '--compressed', '-w', '\n@@%{http_code}@@', u],
      { maxBuffer: 6e7, encoding: 'utf8' });
  } catch { return ''; }
}
function plain(h) {
  return h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
}
function anchors(html, origin) {
  const out = []; const re = /<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi; let m;
  while ((m = re.exec(html))) {
    let h = m[1].split('#')[0].trim(); if (!h) continue;
    if (h.startsWith('//')) h = 'https:' + h;
    else if (h.startsWith('/')) h = origin + h;
    else if (!/^https?:/i.test(h)) continue;
    out.push({ href: h, text: plain(m[2]) });
  }
  return out;
}

// Each fact gets: a regex that must match, and a window we keep as evidence.
const FACTS = {
  applicationFee: {
    link: /application fee|fees|apply|admission/i,
    find: t => {
      const m = t.match(/application fee[^.]{0,90}?\$\s?([\d,]{2,7})|(?:\$\s?([\d,]{2,7}))[^.]{0,50}?application fee/i);
      if (!m) return null;
      const amt = (m[1] || m[2] || '').replace(/[,\s]/g, '');
      const n = parseInt(amt, 10);
      if (!(n >= 20 && n <= 500)) return null;
      return { amountCAD: n, evidence: t.slice(Math.max(0, m.index - 60), m.index + 170) };
    },
  },
  deposit: {
    link: /deposit|tuition deposit|confirm|offer/i,
    find: t => {
      const m = t.match(/(?:tuition |confirmation |registration )?deposit[^.]{0,110}?\$\s?([\d,]{3,8})|(?:\$\s?([\d,]{3,8}))[^.]{0,60}?deposit/i);
      if (!m) return null;
      const n = parseInt((m[1] || m[2] || '').replace(/[,\s]/g, ''), 10);
      if (!(n >= 100 && n <= 25000)) return null;
      return { amountCAD: n, evidence: t.slice(Math.max(0, m.index - 60), m.index + 170) };
    },
  },
  scholarship: {
    link: /scholarship|award|bursar|financial aid|entrance award/i,
    find: t => {
      const m = t.match(/(scholarship|entrance award|bursary)[^.]{0,120}?\$\s?([\d,]{3,9})/i);
      if (!m) return null;
      const n = parseInt(m[2].replace(/[,\s]/g, ''), 10);
      if (!(n >= 250 && n <= 200000)) return null;
      return { maxAmountCAD: n, evidence: t.slice(Math.max(0, m.index - 60), m.index + 190) };
    },
  },
};

const HUBS = {
  'Algonquin College':      ['https://www.algonquincollege.com/international/', 'https://www.algonquincollege.com/ro/pay/fees/'],
  'Durham College':         ['https://durhamcollege.ca/international', 'https://durhamcollege.ca/student-life/financial-aid-and-awards'],
  'Kwantlen (KPU)':         ['https://www.kpu.ca/admission', 'https://www.kpu.ca/awards'],
  'University of Waterloo': ['https://uwaterloo.ca/future-students/financing', 'https://uwaterloo.ca/future-students/admissions'],
  "Queen's University":     ['https://www.queensu.ca/admission/', 'https://www.queensu.ca/admission/tuition-fees-and-financing'],
  'University of Ottawa':   ['https://www.uottawa.ca/study/undergraduate-studies', 'https://www.uottawa.ca/study/fees-financial-support'],
  'Dalhousie University':   ['https://www.dal.ca/study/admissions.html', 'https://www.dal.ca/admissions/money_matters.html'],
  'York University':        ['https://futurestudents.yorku.ca/', 'https://futurestudents.yorku.ca/fees'],
  'University of Guelph':   ['https://admission.uoguelph.ca/', 'https://www.uoguelph.ca/registrar/studentfinance/'],
  'University of Manitoba': ['https://umanitoba.ca/admissions/', 'https://umanitoba.ca/financial-aid-awards/'],
  'Toronto Metropolitan':   ['https://www.torontomu.ca/admissions/undergraduate/', 'https://www.torontomu.ca/student-fees/'],
  'Univ of New Brunswick':  ['https://www.unb.ca/international/admission/', 'https://www.unb.ca/admissions/'],
};

const store = {};
for (const [uni, hubs] of Object.entries(HUBS)) {
  const rec = { university: uni, applicationFee: null, deposit: null, scholarship: null, pagesTried: 0 };
  const pool = new Map();
  for (const hub of hubs) {
    const raw = get(hub);
    if (!/@@200@@/.test(raw)) continue;
    const html = raw.replace(/@@\d{3}@@\s*$/, '');
    const origin = new URL(hub).origin;
    pool.set(hub, 'hub');
    for (const a of anchors(html, origin)) {
      for (const [key, f] of Object.entries(FACTS)) {
        if (f.link.test(a.text) || f.link.test(a.href)) { if (pool.size < 26) pool.set(a.href, key); }
      }
    }
  }
  for (const [u] of pool) {
    if (rec.applicationFee && rec.deposit && rec.scholarship) break;
    const raw = get(u);
    if (!/@@200@@/.test(raw)) continue;
    rec.pagesTried++;
    const t = plain(raw.replace(/@@\d{3}@@\s*$/, ''));
    for (const [key, f] of Object.entries(FACTS)) {
      if (rec[key]) continue;
      const hit = f.find(t);
      if (hit) rec[key] = { ...hit, sourceUrl: u };
    }
  }
  store[uni] = rec;
  const fmt = k => rec[k] ? (rec[k].amountCAD ?? rec[k].maxAmountCAD) : '—';
  console.log(`${uni.padEnd(24)} pages=${String(rec.pagesTried).padStart(2)}  appFee=${String(fmt('applicationFee')).padStart(6)}  deposit=${String(fmt('deposit')).padStart(7)}  scholarshipMax=${String(fmt('scholarship')).padStart(7)}`);
}
fs.writeFileSync('data/wave-canada/institution-facts.json', JSON.stringify(store, null, 2));
console.log('\nwrote data/wave-canada/institution-facts.json');
