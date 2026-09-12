// Canada wave (a): per-course detail extraction from each university's own program page.
// curl-based: several .ca sites 403 Node's TLS fingerprint but answer curl (fee-crawl-traps #3).
const { execFileSync } = require('child_process');
const fs = require('fs');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';

function get(u) {
  try {
    return execFileSync('curl', ['-sL', '-A', UA, '-m', '35', '--compressed', u],
      { maxBuffer: 6e7, encoding: 'utf8' });
  } catch { return ''; }
}

function plain(h) {
  return h
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8211;|&ndash;|&#8212;/g, '-')
    .replace(/&#x27;|&rsquo;|&#8217;/g, "'")
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function officialName(h) {
  const h1 = h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) { const t = plain(h1[1]); if (t) return t; }
  const og = h.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i);
  if (og) return plain(og[1]);
  const ti = h.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return ti ? plain(ti[1]) : '';
}

// ── Tuition ──────────────────────────────────────────────────────────────────
// fee-crawl-traps #1: on Canadian fee tables the domestic/out-of-province figures sit
// immediately BEFORE the international one ("Ontario: $11,883  Out-of-province: $13,136
// International: $44,476"). Matching amount-then-label silently captures the wrong column.
// This matches label-then-amount only, and the [^$] bound means the match can never skip
// past another dollar figure — so it always binds to the FIRST amount after the label.
const FEE_RE = new RegExp(
  '(international|intl|non-?canadian|visa student)' +
  '[^$]{0,60}?' +
  '\\$\\s?([\\d,]{4,12})',
  'gi'
);

function tuition(txt) {
  const out = [];
  let m;
  FEE_RE.lastIndex = 0;
  while ((m = FEE_RE.exec(txt))) {
    const n = parseInt(m[2].replace(/[,\s]/g, ''), 10);
    if (!(n >= 2000 && n <= 200000)) continue;
    const ctx = txt.slice(Math.max(0, m.index - 110), m.index + 200).replace(/\s+/g, ' ');
    // fee-crawl-traps #2: annual vs total is carried only by a words-long qualifier.
    const basis = /per year|per annum|annually|\/ ?year|annual/i.test(ctx) ? 'annual'
                : /total|entire program|full program|program fee/i.test(ctx) ? 'total'
                : 'unknown';
    out.push({ amountCAD: n, basis, evidence: ctx.slice(0, 190) });
  }
  const seen = new Set();
  return out.filter(o => { if (seen.has(o.amountCAD)) return false; seen.add(o.amountCAD); return true; });
}

function minScore(txt, re, lo, hi) {
  const vals = [...txt.matchAll(re)].map(x => parseFloat(x[1])).filter(v => v >= lo && v <= hi);
  return vals.length ? Math.min(...vals) : null;
}

function duration(txt) {
  const y = txt.match(/\b(\d(?:\.\d)?)\s*[-–]?\s*(year|yr)s?\b/i);
  if (y) return { text: y[0].trim(), years: parseFloat(y[1]) };
  const s = txt.match(/\b(\d{1,2})\s*(semester|term|month)s?\b/i);
  if (s) {
    const n = parseInt(s[1], 10);
    const years = /month/i.test(s[2]) ? n / 12 : n / 2;
    return { text: s[0].trim(), years: Math.round(years * 10) / 10 };
  }
  return null;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];

function intakes(txt) {
  const found = new Set();
  for (const mo of MONTHS) {
    const re = new RegExp(
      '\\b' + mo + '\\b[^.]{0,60}?(intake|start|entry|admission|term)' +
      '|(intake|start|entry|admission|term)[^.]{0,60}?\\b' + mo + '\\b', 'i');
    if (re.test(txt)) found.add(mo);
  }
  if (!found.size) {
    for (const t of ['Fall', 'Winter', 'Summer', 'Spring']) {
      if (new RegExp('\\b' + t + '\\b[^.]{0,40}(intake|start|entry|admission|term)', 'i').test(txt)) found.add(t);
    }
  }
  return [...found];
}

const IELTS_RE = /IELTS[^.]{0,110}?\b([5-9](?:\.\d)?)\b/gi;
const TOEFL_RE = /TOEFL[^.]{0,130}?\b(\d{2,3})\b/gi;
const PTE_RE   = /PTE[^.]{0,110}?\b(\d{2})\b/gi;

// ── Runner ───────────────────────────────────────────────────────────────────
const [listFile, outFile, limitArg] = process.argv.slice(2);
const limit = parseInt(limitArg || '0', 10);
let rows = JSON.parse(fs.readFileSync(listFile, 'utf8'));
if (limit) rows = rows.slice(0, limit);

const results = [];
let i = 0, feeHits = 0;
for (const r of rows) {
  i++;
  const url = r.url || r.href || r.link;
  const html = get(url);
  if (!html) { results.push({ sourceName: r.name || r.text || '', url, fetch: 'FAIL' }); continue; }
  const txt = plain(html);
  const fees = tuition(txt);
  if (fees.length) feeHits++;
  results.push({
    sourceName: r.name || r.text || '',
    url,
    officialName: officialName(html) || r.name || '',
    duration: duration(txt),
    intakes: intakes(txt),
    ielts: minScore(txt, IELTS_RE, 5, 9),
    toefl: minScore(txt, TOEFL_RE, 50, 120),
    pte: minScore(txt, PTE_RE, 40, 90),
    tuitionIntl: fees.slice(0, 3),
    chars: txt.length,
  });
  if (i % 25 === 0) process.stderr.write(`  ${i}/${rows.length} (fees on ${feeHits})\n`);
}

fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
const ok = results.filter(r => r.fetch !== 'FAIL').length;
console.log(
  `${outFile}: ${ok}/${results.length} fetched` +
  ` | tuition ${results.filter(r => r.tuitionIntl && r.tuitionIntl.length).length}` +
  ` | duration ${results.filter(r => r.duration).length}` +
  ` | intake ${results.filter(r => r.intakes && r.intakes.length).length}` +
  ` | IELTS ${results.filter(r => r.ielts).length}`
);
