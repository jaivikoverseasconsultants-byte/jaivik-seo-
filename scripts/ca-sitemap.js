const { execFileSync } = require('child_process'); const fs = require('fs');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const get = u => { try { return execFileSync('curl', ['-sL','-A',UA,'-m','60','--compressed',u], {maxBuffer:3e8, encoding:'utf8'}); } catch { return ''; } };
const locs = x => [...x.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map(m => m[1]);

const CFG = {
  redriver: { index: 'https://www.rrc.ca/sitemap_index.xml', keep: /rrc\.ca\/explore\/program\/[a-z0-9-]+\/?$/i },
  uvic:     { index: 'https://www.uvic.ca/sitemapindex.xml',  keep: /uvic\.ca\/.*\/(programs|program)\/[a-z0-9-]+\/?$/i },
  windsor:  { index: 'https://www.future.uwindsor.ca/sitemap.xml', keep: /uwindsor\.ca\/programs\/[a-z0-9-]+\/?$/i },
  ubco:     { index: 'https://you.ubc.ca/sitemap_index.xml',  keep: /you\.ubc\.ca\/ubc_program\/[a-z0-9-]+\/?$/i },
};
for (const name of process.argv.slice(2)) {
  const cfg = CFG[name];
  const root = get(cfg.index);
  if (!root) { console.log(`${name}: index FETCH FAILED ${cfg.index}`); continue; }
  let subs = locs(root).filter(u => /\.xml/i.test(u));
  if (!subs.length) subs = [cfg.index];
  let all = [];
  for (const s of subs.slice(0, 40)) all.push(...locs(get(s)));
  const hits = [...new Set(all.filter(u => cfg.keep.test(u)))];
  console.log(`${name}: sitemaps=${subs.length} urls=${all.length} matched=${hits.length}`);
  hits.slice(0,3).forEach(h => console.log(`    ${h}`));
  if (hits.length) fs.writeFileSync(`data/wave-canada/${name}-sitemap.json`, JSON.stringify(hits.map(url=>({url})), null, 2));
  else {
    const sample = [...new Set(all)].filter(u=>/program|study|academic|degree/i.test(u)).slice(0,10);
    console.log('    no match — program-ish URLs seen:'); sample.forEach(s=>console.log('      ',s));
  }
}
