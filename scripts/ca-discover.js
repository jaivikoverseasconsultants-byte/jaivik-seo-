// Canada wave — course DISCOVERY from each university's own site.
// curl-based (Node's TLS fingerprint gets 403'd by several .ca WAFs — see memory: fee-crawl-traps #3).
const { execFileSync } = require('child_process');
const fs = require('fs');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';

function get(url, timeout = 45) {
  try {
    return execFileSync('curl', ['-sL', '-A', UA, '-m', String(timeout), '--compressed', url],
      { maxBuffer: 200 * 1024 * 1024, encoding: 'utf8' });
  } catch { return ''; }
}
function anchors(html, base) {
  const out = [];
  const re = /<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    let href = m[1].trim();
    if (href.startsWith('//')) href = 'https:' + href;
    else if (href.startsWith('/')) href = base.replace(/\/$/, '') + href;
    else if (!/^https?:/i.test(href)) continue;
    const text = m[2].replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;|&rsquo;/g, "'")
      .replace(/&nbsp;/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
    out.push({ href, text });
  }
  return out;
}

const CONFIGS = {
  algonquin: {
    base: 'https://www.algonquincollege.com',
    seeds: ['https://www.algonquincollege.com/future-students/programs/'],
    keep: h => /algonquincollege\.com\/[a-z0-9-]+\/program\/[a-z0-9-]+\/?$/i.test(h),
  },
  kpu: {
    base: 'https://www.kpu.ca',
    seeds: ['https://www.kpu.ca/programs'],
    keep: h => /kpu\.ca\/programs-az\/[a-z0-9-]+\/[a-z0-9-]+/i.test(h),
  },
  york: {
    base: 'https://futurestudents.yorku.ca',
    seeds: ['https://futurestudents.yorku.ca/program-search'],
    keep: h => /futurestudents\.yorku\.ca\/program\/[a-z0-9-]+\/?$/i.test(h),
  },
  waterloo_ug: {
    base: 'https://uwaterloo.ca',
    seeds: ['https://uwaterloo.ca/future-students/programs'],
    keep: h => /uwaterloo\.ca\/future-students\/programs\/[a-z0-9-]+\/?$/i.test(h),
  },
  tmu: {
    base: 'https://www.torontomu.ca',
    seeds: ['https://www.torontomu.ca/programs/undergraduate/', 'https://www.torontomu.ca/graduate/programs/'],
    keep: h => /torontomu\.ca\/programs\/(undergraduate|graduate)\/[a-z0-9-]+\/?$/i.test(h),
  },
};

const targets = process.argv.slice(2);
for (const name of targets) {
  const cfg = CONFIGS[name];
  if (!cfg) { console.log(`?? no config for ${name}`); continue; }
  const seen = new Map();
  for (const seed of cfg.seeds) {
    const html = get(seed);
    if (!html) { console.log(`${name}: seed FAILED ${seed}`); continue; }
    for (const a of anchors(html, cfg.base)) {
      const h = a.href.split('#')[0].split('?')[0];
      if (!cfg.keep(h)) continue;
      if (!seen.has(h) || (a.text && a.text.length > (seen.get(h) || '').length)) {
        if (a.text && a.text.length > 2) seen.set(h, a.text);
        else if (!seen.has(h)) seen.set(h, '');
      }
    }
  }
  const rows = [...seen].map(([url, text]) => ({ url, text }));
  fs.writeFileSync(`data/wave-canada/${name}-discovery.json`, JSON.stringify(rows, null, 2));
  console.log(`${name}: ${rows.length} program URLs  (named: ${rows.filter(r => r.text).length})`);
  rows.slice(0, 3).forEach(r => console.log(`    ${r.text || '(no text)'} -> ${r.url}`));
}
