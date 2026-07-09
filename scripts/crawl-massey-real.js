// Massey University real course crawl
// Source: live sitemap discovery -> /study/all-qualifications-and-degrees/ catalogue page
// -> each qualification page has a schema.org EducationalOccupationalProgram JSON-LD block
const https = require('https');
const fs = require('fs');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

function get(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { headers: { 'User-Agent': UA, 'Accept': 'text/html,*/*', 'Accept-Language': 'en-US,en;q=0.9' }, timeout: 20000 }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', () => resolve({ status: 0, body: '' }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: '' }); });
  });
}

function extractJsonLd(html) {
  const idx = html.indexOf('EducationalOccupationalProgram');
  if (idx === -1) return null;
  const start = html.lastIndexOf('{"@context"', idx);
  if (start === -1) return null;
  // find matching closing brace by scanning (schema is single-line, ends with "}\n    </script>")
  const end = html.indexOf('</script>', start);
  if (end === -1) return null;
  const jsonStr = html.substring(start, end).trim();
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    return null;
  }
}

async function main() {
  const links = fs.readFileSync(__dirname + '/crawl-output/massey-links.txt', 'utf8')
    .split('\n').map(l => l.trim()).filter(Boolean)
    .map(l => {
      const m = l.match(/href="([^"]+)"/);
      return m ? m[1] : null;
    }).filter(Boolean);

  console.log(`Found ${links.length} qualification links`);

  const results = [];
  for (let i = 0; i < links.length; i++) {
    const path = links[i];
    const url = `https://www.massey.ac.nz${path}`;
    const res = await get(url);
    if (res.status !== 200) {
      console.log(`[${i + 1}/${links.length}] FAIL ${res.status}: ${path}`);
      await wait(300);
      continue;
    }
    const ld = extractJsonLd(res.body);
    if (!ld) {
      console.log(`[${i + 1}/${links.length}] NO-SCHEMA: ${path}`);
      await wait(300);
      continue;
    }
    results.push({
      name: ld.name.replace(/\s*[–-]\s*[A-Z]{2,6}$/, '').trim(),
      code: (path.match(/-([A-Z]{4,6})\/?$/) || [])[1] || '',
      programType: ld.programType || '',
      timeToComplete: ld.timeToComplete || '',
      url,
    });
    console.log(`[${i + 1}/${links.length}] OK: ${ld.name}`);
    await wait(300);
  }

  fs.writeFileSync(__dirname + '/crawl-output/massey-real.json', JSON.stringify(results, null, 2));
  console.log(`\nWrote ${results.length} programs to crawl-output/massey-real.json`);
}

main().catch(e => { console.error(e); process.exit(1); });
