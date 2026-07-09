const https = require('https');
const fs = require('fs');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

function head(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD', headers: { 'User-Agent': UA }, timeout: 15000 }, (res) => {
      resolve(res.statusCode);
    });
    req.on('error', () => resolve(0));
    req.on('timeout', () => { req.destroy(); resolve(0); });
    req.end();
  });
}

async function main() {
  const items = JSON.parse(fs.readFileSync(__dirname + '/crawl-output/anu-real.json', 'utf8'));
  const results = [];
  const CONCURRENCY = 8;
  let idx = 0;
  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      const item = items[i];
      const status = await head(item.url);
      results[i] = { ...item, status };
      if (status !== 200) console.log(`FAIL ${status}: ${item.name} -> ${item.url}`);
    }
  }
  await Promise.all(Array.from({length: CONCURRENCY}, worker));

  const ok = results.filter(r => r.status === 200);
  const bad = results.filter(r => r.status !== 200);
  console.log(`\nOK: ${ok.length}, FAILED: ${bad.length}`);
  fs.writeFileSync(__dirname + '/crawl-output/anu-verified.json', JSON.stringify(ok, null, 2));
  console.log(`Wrote ${ok.length} verified programs to crawl-output/anu-verified.json`);
}

main().catch(e => { console.error(e); process.exit(1); });
