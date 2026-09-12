// Is a "not on live site" row actually discontinued, or just missing from the listing we diffed?
// A listing diff cannot tell those apart — the live index may simply name things differently or
// paginate. The only honest test is to fetch the stored URL and see whether the university still
// serves a real page for it. (Same lesson as the Massey dead-sitemap trap: validate the source
// before trusting the diff.)
const { execFileSync } = require('child_process');
const fs = require('fs');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';

function probe(u) {
  try {
    const out = execFileSync('curl', ['-sL', '-A', UA, '-m', '30', '--compressed',
      '-o', '-', '-w', '\n@@%{http_code}|%{url_effective}@@', u],
      { maxBuffer: 4e7, encoding: 'utf8' });
    const m = out.match(/@@(\d{3})\|([^@]*)@@\s*$/);
    const code = m ? m[1] : '000';
    const finalUrl = m ? m[2] : '';
    const body = out.replace(/@@\d{3}\|[^@]*@@\s*$/, '');
    const txt = body.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    // A CourseLeaf catalogue serves 200 for a retired slug but the body says so.
    const gone = /page not found|no longer offered|has been discontinued|not currently admitting|page you requested could not be found/i.test(txt);
    return { code, finalUrl, chars: txt.length, gone };
  } catch { return { code: '000', finalUrl: '', chars: 0, gone: false }; }
}

const report = JSON.parse(fs.readFileSync('data/wave-canada/gapcheck.json', 'utf8'));
const SAMPLE = parseInt(process.argv[2] || '30', 10);
const out = {};

for (const [uni, r] of Object.entries(report)) {
  const stale = r.notOnLiveSite || [];
  if (!stale.length) { console.log(`${uni}: no stale rows`); continue; }
  // even spread across the list rather than the first N (which cluster alphabetically)
  const step = Math.max(1, Math.floor(stale.length / SAMPLE));
  const picks = [];
  for (let i = 0; i < stale.length && picks.length < SAMPLE; i += step) picks.push(stale[i]);

  const res = picks.map(p => ({ name: p.name, url: p.url, ...probe(p.url) }));
  const alive = res.filter(x => x.code === '200' && !x.gone && x.chars > 1200);
  const dead = res.filter(x => x.code !== '200' || x.gone);
  out[uni] = { staleTotal: stale.length, sampled: res.length, aliveInSample: alive.length, deadInSample: dead.length, detail: res };
  const pct = Math.round(100 * alive.length / res.length);
  console.log(
    `${uni.padEnd(24)} stale=${String(stale.length).padStart(4)}  sampled=${String(res.length).padStart(3)}` +
    `  STILL-LIVE=${String(alive.length).padStart(3)} (${pct}%)  dead=${String(dead.length).padStart(3)}` +
    `   => ${pct >= 80 ? 'listing artefact, NOT discontinued' : pct <= 20 ? 'genuinely gone' : 'mixed — needs per-URL pass'}`
  );
  dead.slice(0, 3).forEach(d => console.log(`      dead: ${d.code} ${d.name.slice(0, 46)}`));
}
fs.writeFileSync('data/wave-canada/stale-probe.json', JSON.stringify(out, null, 2));
console.log('\nwrote data/wave-canada/stale-probe.json');
