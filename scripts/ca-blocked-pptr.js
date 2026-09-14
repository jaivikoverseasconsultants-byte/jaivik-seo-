// Canada wave, second pass: the six universities that curl could not reach.
//
// Each failed for a different reason, so each needs a different handle:
//   redriver  - /explore/ renders its programme list only after the JS filter runs
//   uvic      - /undergraduate/programs/ returns 403 to curl; a real browser session passes
//   windsor   - future.uwindsor.ca is fully client-rendered, no JSON API behind it
//   ubco      - you.ubc.ca/ubc_programs/<slug> confirmed, but the index is JS-paginated
//               and the Okanagan campus is a filter, not a separate path
//   ualberta  - programme list comes from a Coveo API that needs a token lifted from page context
//   kpu       - every /programs-az/ URL 404s on direct fetch; verify whether the pages exist
//               at all inside a real browser session, or whether the listing links are stale
//
// Verification rule for this pass (the lesson KPU taught): a discovered URL is only kept if
// navigating to it in the browser yields a real page — not a soft-404 shell. Names without
// working URLs are worse than no data.
const puppeteer = require('puppeteer');
const fs = require('fs');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';

const CFG = {
  redriver: {
    url: 'https://www.rrc.ca/explore/',
    keep: /rrc\.ca\/explore\/program\/[a-z0-9-]+/i,
    prep: async page => {
      // the listing is filter-driven; click through every "load more" it offers
      for (let i = 0; i < 25; i++) {
        const more = await page.$$('button, a');
        let clicked = false;
        for (const el of more) {
          const t = (await page.evaluate(e => (e.innerText || '').trim().toLowerCase(), el)) || '';
          if (/load more|show more|view all|next/.test(t)) {
            try { await el.click(); clicked = true; await new Promise(r => setTimeout(r, 1200)); } catch {}
            break;
          }
        }
        if (!clicked) break;
      }
    },
  },
  uvic: {
    url: 'https://www.uvic.ca/undergraduate/programs/index.php',
    keep: /uvic\.ca\/(undergraduate|graduate)\/programs\/[a-z0-9-]+/i,
  },
  windsor: {
    url: 'https://www.future.uwindsor.ca/programs/',
    keep: /future\.uwindsor\.ca\/programs\/[a-z0-9-]+/i,
  },
  ubco: {
    url: 'https://you.ubc.ca/programs/?campus=okanagan',
    keep: /you\.ubc\.ca\/ubc_programs\/[a-z0-9-]+/i,
  },
  ualberta: {
    url: 'https://www.ualberta.ca/en/undergraduate-programs/index.html',
    keep: /ualberta\.ca\/en\/(undergraduate-programs|programs)\/[a-z0-9-]+/i,
  },
  kpu: {
    url: 'https://www.kpu.ca/programs',
    keep: /kpu\.ca\/programs-az\/[a-z0-9-]+\/[a-z0-9-]+/i,
  },
};

async function harvest(page, cfg) {
  await page.goto(cfg.url, { waitUntil: 'networkidle2', timeout: 120000 });
  if (cfg.prep) { try { await cfg.prep(page); } catch {} }
  // scroll to trigger lazy lists
  await page.evaluate(async () => {
    for (let i = 0; i < 25; i++) { window.scrollBy(0, document.body.scrollHeight); await new Promise(r => setTimeout(r, 350)); }
  });
  const links = await page.evaluate(() =>
    [...document.querySelectorAll('a[href]')].map(a => ({
      href: a.href.split('#')[0],
      text: (a.innerText || a.textContent || '').replace(/\s+/g, ' ').trim(),
    })));
  const seen = new Map();
  for (const l of links) {
    if (!cfg.keep.test(l.href)) continue;
    const prev = seen.get(l.href);
    if (!prev || (l.text && l.text.length > prev.length)) seen.set(l.href, l.text || '');
  }
  return [...seen].map(([url, name]) => ({ url, name }));
}

// Navigate to a candidate and decide whether it is a real programme page.
async function validate(page, url) {
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    const status = resp ? resp.status() : 0;
    const info = await page.evaluate(() => ({
      title: (document.title || '').trim(),
      h1: (document.querySelector('h1')?.innerText || '').trim(),
      chars: (document.body?.innerText || '').length,
    }));
    const soft404 = /page not found|not found|404|error/i.test(info.title) || /page not found/i.test(info.h1);
    return { status, ...info, ok: status === 200 && !soft404 && info.chars > 1500 };
  } catch (e) { return { status: 0, title: '', h1: '', chars: 0, ok: false, error: e.message.slice(0, 70) }; }
}

(async () => {
  const targets = process.argv.slice(2);
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const summary = {};
  for (const name of targets) {
    const cfg = CFG[name];
    if (!cfg) { console.log(`?? no config: ${name}`); continue; }
    const page = await browser.newPage();
    await page.setUserAgent(UA);
    let rows = [];
    try { rows = await harvest(page, cfg); }
    catch (e) { console.log(`${name}: harvest FAILED — ${e.message.slice(0, 90)}`); }

    // validate a spread sample before trusting the whole set
    const step = Math.max(1, Math.floor(rows.length / 8));
    const sample = [];
    for (let i = 0; i < rows.length && sample.length < 8; i += step) sample.push(rows[i]);
    const checks = [];
    for (const r of sample) checks.push({ url: r.url, ...(await validate(page, r.url)) });
    const okCount = checks.filter(c => c.ok).length;

    summary[name] = { found: rows.length, sampled: checks.length, validOk: okCount, checks };
    fs.writeFileSync(`data/wave-canada/${name}-pptr-discovery.json`, JSON.stringify(rows, null, 2));
    console.log(
      `${name.padEnd(10)} found=${String(rows.length).padStart(4)}  sampled=${checks.length}  valid=${okCount}` +
      (rows.length === 0 ? '  << nothing harvested'
        : okCount === 0 ? '  << ALL SAMPLES DEAD — do not generate'
        : okCount < checks.length ? '  << partially dead' : '  ok')
    );
    checks.slice(0, 3).forEach(c => console.log(`     ${c.status} chars=${String(c.chars).padStart(6)} ${c.ok ? 'OK ' : 'BAD'} ${(c.h1 || c.title).slice(0, 46)}`));
    await page.close();
  }
  fs.writeFileSync('data/wave-canada/blocked-pptr-summary.json', JSON.stringify(summary, null, 2));
  await browser.close();
})();
