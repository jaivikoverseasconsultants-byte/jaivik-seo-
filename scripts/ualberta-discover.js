// University of Alberta — programme discovery from its own Acalog calendar.
//
// The earlier attempts failed for two reasons now understood:
//   * www.ualberta.ca/en/undergraduate-programs/ is JS-paginated and surfaced only 25 of
//     its programmes to a scroll-and-harvest pass.
//   * calendar.ualberta.ca answered 202 (a bot challenge) at the time, which read as
//     "blocked". It answers 200 now.
// Same shape as the KPU correction: the real list is on the calendar host, not the
// marketing site. UAlberta runs Acalog (content.php?catoid&navoid, programmes at
// preview_program.php?catoid&poid), paginated with filter[cpage].
const { execFileSync } = require('child_process');
const fs = require('fs');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const BASE = 'https://calendar.ualberta.ca';
const CATOID = 69;

function get(u) {
  try { return execFileSync('curl', ['-sL', '-A', UA, '-m', '60', '--compressed', u],
    { maxBuffer: 2e8, encoding: 'utf8' }); } catch { return ''; }
}

// Acalog programme links look like: preview_program.php?catoid=69&poid=12345&returnto=...
function programLinks(html) {
  const out = new Map();
  const re = /<a[^>]*href="([^"]*preview_program\.php[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    let href = m[1].replace(/&amp;/g, '&');
    const poid = (href.match(/poid=(\d+)/) || [])[1];
    if (!poid) continue;
    // canonical form — drop returnto so the same programme doesn't appear twice
    const url = `${BASE}/preview_program.php?catoid=${CATOID}&poid=${poid}`;
    const name = m[2].replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&')
      .replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
    if (!name || name.length < 3) continue;
    if (!out.has(url) || out.get(url).length < name.length) out.set(url, name);
  }
  return out;
}

const SECTIONS = [
  { navoid: 20886, studyLevel: 'Undergraduate' },
  { navoid: 20894, studyLevel: 'Postgraduate' },
];

const all = new Map();
for (const sec of SECTIONS) {
  let pageCount = 0, added = 0;
  for (let page = 1; page <= 40; page++) {
    const url = `${BASE}/content.php?catoid=${CATOID}&navoid=${sec.navoid}&filter%5Bcpage%5D=${page}`;
    const html = get(url);
    if (!html) break;
    const found = programLinks(html);
    if (!found.size) break;
    let newOnPage = 0;
    for (const [u, n] of found) {
      if (all.has(u)) continue;
      all.set(u, { name: n, url: u, studyLevel: sec.studyLevel });
      newOnPage++;
    }
    pageCount++; added += newOnPage;
    process.stderr.write(`  navoid=${sec.navoid} page ${page}: ${found.size} links, ${newOnPage} new\n`);
    if (newOnPage === 0) break;  // pagination exhausted or looping back
  }
  console.log(`navoid=${sec.navoid} (${sec.studyLevel}): ${pageCount} pages, ${added} programmes`);
}

const rows = [...all.values()];
fs.writeFileSync('data/wave-canada/ualberta2-discovery.json', JSON.stringify(rows, null, 2));
console.log(`\nUAlberta total: ${rows.length} programmes`);
rows.slice(0, 5).forEach(r => console.log(`   ${r.name}  [${r.studyLevel}]`));
