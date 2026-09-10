// Scan every page in out/ for a missing <h1> and for over-long <title> text.
//
// Written because a Screaming Frog run only reached 477 of 21,789 built pages, so the
// sample could not say whether a gap was per-page or template-level. This reads the
// actual build output, so the counts are the whole site, not an extrapolation.
//
// Title width: Google truncates on rendered pixel width (~561px), not character count.
// A rough per-character width table is used so that wide caps and narrow punctuation
// are not treated as equal — it is an approximation, and labelled as one.
//
// Usage: node scripts/audit-h1-and-titles.js [--json reports/x.json] [--limit N]

const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'out');
const PIXEL_LIMIT = 561;
const CHAR_LIMIT = 60;

// Approximate widths at Google's ~20px Arial SERP rendering, normalised.
const NARROW = "iljtfr.,;:'|!()[]-";
const WIDE = 'mwMW@%';
const CAPS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function pxWidth(s) {
  let w = 0;
  for (const ch of s) {
    if (ch === ' ') w += 4.6;
    else if (NARROW.includes(ch)) w += 4.4;
    else if (WIDE.includes(ch)) w += 15.5;
    else if (CAPS.includes(ch)) w += 12.2;
    else if (ch >= '0' && ch <= '9') w += 10.0;
    else w += 9.6;
  }
  return Math.round(w);
}

function decode(s) {
  return s.replace(/&amp;/g, '&').replace(/&#0?39;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
    .replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
}

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

/** Route path as served, derived from the file location in out/. */
function toRoute(file) {
  let r = path.relative(OUT, file).split(path.sep).join('/');
  r = r.replace(/\.html$/, '');
  if (r === 'index') return '/';
  r = r.replace(/\/index$/, '');
  return '/' + r;
}

/** Group routes into the template that produced them, so a systemic gap is visible. */
function templateOf(route) {
  const seg = route.split('/').filter(Boolean);
  if (seg.length === 0) return '/';
  if (seg[0] === 'universities') {
    if (seg.length === 1) return '/universities';
    if (seg[1] === 'country') return '/universities/country/[country]';
    if (seg[2] === 'courses' && seg.length === 4) return '/universities/[uni]/courses/[slug]';
    if (seg[2] === 'courses') return '/universities/[uni]/courses';
    return '/universities/[slug]';
  }
  if (seg[0] === 'courses') {
    if (seg.length === 1) return '/courses';
    if (seg[1] === 'category') return '/courses/category/[category]';
    return '/courses/[slug]';
  }
  if (seg[0] === 'mock-test') return seg.length === 1 ? '/mock-test' : '/mock-test/[level]';
  if (seg[0] === 'blog') return seg.length === 1 ? '/blog' : '/blog/[slug]';
  if (seg[0] === 'courses-with-psw') return '/courses-with-psw/[country]';
  if (seg.length === 1) return route;
  return '/' + seg[0] + '/*';
}

function main() {
  const args = process.argv.slice(2);
  const jsonAt = args.indexOf('--json');
  const files = walk(OUT);
  console.log('scanning ' + files.length + ' built pages...\n');

  const rows = [];
  for (const f of files) {
    const html = fs.readFileSync(f, 'utf8');
    // <h1 ...>...</h1> anywhere in the body, including self-nested markup.
    const h1 = /<h1[\s>]/i.test(html);
    const tm = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
    const title = tm ? decode(tm[1]) : '';
    const route = toRoute(f);
    rows.push({
      route,
      template: templateOf(route),
      hasH1: h1,
      title,
      titleChars: title.length,
      titlePx: pxWidth(title),
    });
  }

  // ---- H1 ----
  const noH1 = rows.filter(r => !r.hasH1);
  console.log('=== MISSING <h1> ===');
  console.log('pages without an h1: ' + noH1.length + ' of ' + rows.length +
    ' (' + (noH1.length / rows.length * 100).toFixed(1) + '%)\n');
  const byTpl = {};
  for (const r of noH1) {
    byTpl[r.template] = byTpl[r.template] || { missing: 0, total: 0, examples: [] };
    byTpl[r.template].missing++;
    if (byTpl[r.template].examples.length < 3) byTpl[r.template].examples.push(r.route);
  }
  for (const r of rows) {
    if (byTpl[r.template]) byTpl[r.template].total++;
  }
  const tplRows = Object.entries(byTpl).sort((a, b) => b[1].missing - a[1].missing);
  console.log('template'.padEnd(42) + 'missing'.padStart(8) + '  of'.padStart(8) + '   verdict');
  for (const [tpl, v] of tplRows) {
    const systemic = v.missing === v.total;
    console.log(tpl.padEnd(42) + String(v.missing).padStart(8) + String(v.total).padStart(10) +
      '   ' + (systemic ? 'TEMPLATE-WIDE' : 'partial (' + (v.missing / v.total * 100).toFixed(0) + '%)'));
  }
  console.log('\nexamples:');
  for (const [tpl, v] of tplRows) console.log('  ' + tpl + ': ' + v.examples.join(', '));

  // ---- titles ----
  const withTitle = rows.filter(r => r.title);
  const overPx = withTitle.filter(r => r.titlePx > PIXEL_LIMIT);
  const overChars = withTitle.filter(r => r.titleChars > CHAR_LIMIT);
  console.log('\n=== TITLE LENGTH ===');
  console.log('pages with a title: ' + withTitle.length);
  console.log('over ~' + PIXEL_LIMIT + 'px (est.): ' + overPx.length +
    ' (' + (overPx.length / withTitle.length * 100).toFixed(1) + '%)');
  console.log('over ' + CHAR_LIMIT + ' chars:     ' + overChars.length +
    ' (' + (overChars.length / withTitle.length * 100).toFixed(1) + '%)');

  const tplTitle = {};
  for (const r of withTitle) {
    const t = tplTitle[r.template] = tplTitle[r.template] || { over: 0, total: 0, maxPx: 0, sample: '' };
    t.total++;
    if (r.titlePx > PIXEL_LIMIT) t.over++;
    if (r.titlePx > t.maxPx) { t.maxPx = r.titlePx; t.sample = r.title; }
  }
  console.log('\ntemplate'.padEnd(43) + 'over'.padStart(7) + 'of'.padStart(8) + 'maxPx'.padStart(8));
  Object.entries(tplTitle).sort((a, b) => b[1].over - a[1].over).slice(0, 20)
    .forEach(([tpl, v]) => console.log(tpl.padEnd(43) + String(v.over).padStart(7) + String(v.total).padStart(8) + String(v.maxPx).padStart(8)));

  if (jsonAt !== -1) {
    fs.writeFileSync(args[jsonAt + 1], JSON.stringify({
      generated: new Date().toISOString(),
      pixelLimit: PIXEL_LIMIT,
      charLimit: CHAR_LIMIT,
      totals: { pages: rows.length, missingH1: noH1.length, titlesOverPx: overPx.length, titlesOverChars: overChars.length },
      missingH1ByTemplate: byTpl,
      titlesByTemplate: tplTitle,
      missingH1Routes: noH1.map(r => r.route),
    }, null, 2));
    console.log('\nwritten to ' + args[jsonAt + 1]);
  }
}

main();
