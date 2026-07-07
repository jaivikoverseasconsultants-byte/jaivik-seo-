// Real crawl: Simon Fraser University undergraduate A-Z program directory.
// Source: https://www.sfu.ca/students/admission/programs/a-z.html (static HTML, no JS needed)
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'crawl-output');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function pool(items, limit, fn) {
  const results = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      try { results[idx] = await fn(items[idx], idx); }
      catch (e) { results[idx] = { error: e.message }; }
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}

async function main() {
  console.log('Fetching SFU undergrad A-Z index...');
  const azHtml = await fetchText('https://www.sfu.ca/students/admission/programs/a-z.html');

  const linkRe = /<a href="(\/students\/admission\/programs\/a-z\/[a-z]\/[^"]+\.html)"[^>]*>([^<]+)<\/a>/g;
  const seen = new Set();
  const listing = [];
  let m;
  while ((m = linkRe.exec(azHtml))) {
    const url = 'https://www.sfu.ca' + m[1];
    if (seen.has(url)) continue;
    seen.add(url);
    listing.push({ url, listingName: m[2].replace(/&rsquo;/g, "'").replace(/&amp;/g, '&').trim() });
  }
  console.log(`Found ${listing.length} candidate program pages.`);

  const KNOWN_DEGREES = [
    'Bachelor of Business Administration',
    'Bachelor of Applied Science',
    'Bachelor of Fine Arts',
    'Bachelor of General Studies',
    'Bachelor of Environment',
    'Bachelor of Education',
    'Bachelor of Science',
    'Bachelor of Arts',
    'Master of Science',
    'Master of Arts',
    'Certificate',
    'Diploma',
  ];
  function cleanDegree(raw) {
    if (!raw) return null;
    const s = raw.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    const found = [];
    for (const d of KNOWN_DEGREES) {
      if (s.includes(d) && !found.some(f => f.includes(d))) found.push(d);
    }
    if (!found.length) return null;
    return found.join(' or ');
  }

  console.log('Fetching each program page to validate + extract degree/faculty...');
  const results = await pool(listing, 10, async (item) => {
    const html = await fetchText(item.url);
    const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
    const credMatch = text.match(/(?:Degree|Credential):\s*([^.]{3,150}?)(?:\s+(?:The|If|This|Program description)\b|\.|$)/i);
    const facultyMatch = html.match(/Faculty of [A-Za-z,\s+]+/);
    const degree = cleanDegree(credMatch ? credMatch[1] : null);
    return {
      url: item.url,
      name: item.listingName.replace(/&rsquo;/g, "'").replace(/&amp;/g, '&').trim(),
      degree,
      faculty: facultyMatch ? facultyMatch[0].replace(/\s+/g, ' ').trim() : null,
    };
  });

  const valid = results.filter(r => !r.error && r.degree);
  const invalid = results.filter(r => r.error || !r.degree);

  console.log(`Valid (real degree programs): ${valid.length}`);
  console.log(`Rejected (no valid Degree: line found): ${invalid.length}`);
  if (invalid.length) {
    console.log('Rejected examples:', JSON.stringify(invalid.slice(0, 10).map(r => ({ url: r.url, error: r.error, degreeLine: r.degreeLine })), null, 1));
  }

  const outPath = path.join(OUT_DIR, 'simon-fraser-university.json');
  fs.writeFileSync(outPath, JSON.stringify({
    slug: 'simon-fraser-university',
    sourceUrl: 'https://www.sfu.ca/students/admission/programs/a-z.html',
    crawledAt: new Date().toISOString(),
    courses: valid,
  }, null, 2));
  console.log(`Wrote ${valid.length} courses -> ${outPath}`);
}

main().catch(e => { console.error('FATAL', e); process.exit(1); });
