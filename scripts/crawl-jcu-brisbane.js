// Reads JCU Brisbane's own course facts and 2026 international fees.
//
//   node scripts/crawl-jcu-brisbane.js
//
// Discovery only came from KC (data/wave-australia/kc/jcu-brisbane-courses-KC-raw.csv): it says which
// programmes exist. Every figure here is JCU's:
//   - Fees: JCU Brisbane's "Tuition Fees 2026 — International Students" schedule, linked from
//     jcu.edu.au/brisbane/courses/fees. Annual fee for 8 subjects a year, including the Student
//     Services and Amenities Fee, plus JCU's estimated total. Needs `pdftotext` (poppler) on PATH.
//   - Course facts: each jcu.edu.au/courses/<course> page embeds its data as base64 JSON in
//     <meta name="domesticJson">: Brisbane commencing months, full-time duration, course code,
//     CRICOS code, and the international fee, which is cross-checked against the schedule.
// Output: data/wave-australia/jcu-brisbane.json, reviewed before scripts/gen-jcu-brisbane.js uses it.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data/wave-australia/jcu-brisbane.json');
const KC = path.join(ROOT, 'data/wave-australia/kc/jcu-brisbane-courses-KC-raw.csv');
const FEES_PAGE = 'https://www.jcu.edu.au/brisbane/courses/fees';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';

// KC name -> JCU course page, decided by hand where KC's name is not JCU's.
//   "Master of Business Administration" on KC is 24 months; JCU Brisbane offers it as
//   "Master of Business Administration [2-Year]" (the schedule's only MBA line).
//   The four "Master of IT (...)" rows are majors of the one Master of Information Technology: its
//   page says "offers the choice of four majors: Artificial Intelligence, Cybersecurity, Software
//   Engineering, IT Management" and "All majors are offered across all locations".
//   "Master of International Hospitality & Tourism Management" duplicates "Master of International
//   Tourism and Hospitality Management" (JCU's name) and is dropped.
const KC_TO_JCU = {
  'Master of Business Administration': { page: 'master-of-business-administration-2-year', schedule: 'Master of Business Administration [2-Year]' },
  'Master of IT (Artificial Intelligence)': { page: 'master-of-information-technology', schedule: 'Master of Information Technology', major: 'Artificial Intelligence' },
  'Master of IT (Cyber Security)': { page: 'master-of-information-technology', schedule: 'Master of Information Technology', major: 'Cybersecurity' },
  'Master of IT (IT Management)': { page: 'master-of-information-technology', schedule: 'Master of Information Technology', major: 'IT Management' },
  'Master of IT (Software Engineering)': { page: 'master-of-information-technology', schedule: 'Master of Information Technology', major: 'Software Engineering' },
  'Master of International Hospitality & Tourism Management': { duplicateOf: 'Master of International Tourism and Hospitality Management' },
  'Master of Education - MBA': { schedule: 'Master of Education - Master of Business Administration' },
  'Master of IT - MBA': { schedule: 'Master of Information Technology - Master of Business Administration' },
  'Master of International Tourism and Hospitality Management - MBA': { schedule: 'Master of International Tourism and Hospitality Management - Master of Business Administration' },
  'Master of Professional Accounting - MBA': { schedule: 'Master of Professional Accounting - Master of Business Administration' },
  'Bachelor of Tourism Hospitality and Events': { schedule: 'Bachelor of Tourism, Hospitality & Events' },
};

const norm = (s) => s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();
const money = (s) => Number(String(s).replace(/[^0-9.]/g, ''));

function parseCsv(text) {
  const [head, ...lines] = text.trim().split(/\r?\n/);
  const cols = head.split(',');
  return lines.map((line) => {
    const cells = [...line.matchAll(/("([^"]*)"|[^,]*)(,|$)/g)].map((m) => m[2] ?? m[1]).slice(0, cols.length);
    return Object.fromEntries(cols.map((c, i) => [c, cells[i]]));
  });
}

// "Master of Data Science (Professional) 16 $4,749.00 $38,365.00 $76,730.00"; a long name can wrap
// onto the line before its figures.
function parseSchedule(text) {
  const rows = [];
  let carry = '';
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    const m = line.match(/^(.*?)\s*(\d+)\s+\$([\d,]+\.\d\d)\s+\$([\d,]+\.\d\d)\s+\$([\d,]+\.\d\d)$/);
    if (m) {
      const name = `${carry} ${m[1]}`.trim();
      carry = '';
      if (!name || /Subjects|Programs/i.test(name)) continue;
      rows.push({ name, subjects: Number(m[2]), perSubject: money(m[3]), annual2026: money(m[4]), estimatedTotal: money(m[5]) });
    } else if (/^(Master|Bachelor|Management|Postgraduate|Post Qualifying)/.test(line) && !/Subjects/.test(line)) {
      carry = carry ? `${carry} ${line}` : line;
    } else carry = '';
  }
  return rows;
}

// jcu.edu.au serves Node's fetch a Cloudflare challenge (403) on the TLS fingerprint alone, while curl
// with the same headers gets the page — so requests go through curl.
async function get(url) {
  const out = execFileSync('curl', ['-sSL', '-A', UA, '-H', 'Accept-Language: en', '--max-time', '60', '-w', '\n%{http_code}', url], { maxBuffer: 64 * 1024 * 1024 });
  const nl = out.lastIndexOf(10);
  const body = out.subarray(0, nl);
  const status = Number(out.subarray(nl + 1).toString());
  return { status, text: async () => body.toString('utf8'), arrayBuffer: async () => body };
}

// Cloudflare challenges some requests even through curl; the same URL loads on a retry. `ok` says
// whether a response is the real thing.
async function getUntil(url, ok) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    const res = await get(url);
    const body = await res.arrayBuffer();
    if (res.status === 200 && ok(body)) return body;
    await new Promise((done) => setTimeout(done, 5000 * attempt));
  }
  throw new Error(`still challenged after 5 attempts: ${url}`);
}

(async () => {
  // 1. the 2026 schedule, found from the fees page rather than hard-coded
  const feesHtml = (await getUntil(FEES_PAGE, (b) => b.includes('Tuition-Fees-2026'))).toString('utf8');
  const pdfUrl = (feesHtml.match(/href="(https:\/\/www\.jcu\.edu\.au\/__data\/assets\/pdf_file\/[^"]*Tuition-Fees-2026\.pdf)"/) || [])[1];
  if (!pdfUrl) throw new Error('2026 tuition schedule link not found on the fees page');
  const pdfPath = path.join(require('os').tmpdir(), 'jcub-tuition-2026.pdf');
  fs.writeFileSync(pdfPath, await getUntil(pdfUrl, (b) => b.subarray(0, 5).toString() === '%PDF-'));
  const schedule = parseSchedule(execFileSync('pdftotext', ['-raw', pdfPath, '-'], { encoding: 'utf8' }));
  const scheduleBy = new Map(schedule.map((r) => [norm(r.name), r]));

  // 2. JCU's Brisbane course list, for page URLs
  const listHtml = (await getUntil('https://www.jcu.edu.au/brisbane/courses', (b) => b.includes('/courses/master-of-'))).toString('utf8');
  const pages = new Map();
  for (const m of listHtml.matchAll(/<a [^>]*href="https:\/\/www\.jcu\.edu\.au\/courses\/([a-z0-9-]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
    const text = m[2].replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
    if (text && !pages.has(norm(text))) pages.set(norm(text), m[1]);
  }

  // 3. each KC programme, resolved to JCU's page and schedule line
  const kc = parseCsv(fs.readFileSync(KC, 'utf8'));
  const results = [];
  for (const row of kc) {
    const kcName = row['Program Name'];
    const map = KC_TO_JCU[kcName] || {};
    const rec = { kcName, kc: row };
    if (map.duplicateOf) { results.push({ ...rec, dropped: `duplicate of "${map.duplicateOf}"` }); continue; }
    const scheduleName = map.schedule || kcName;
    const pageSlug = map.page || pages.get(norm(scheduleName)) || pages.get(norm(kcName));
    rec.major = map.major || null;
    rec.scheduleLine = scheduleBy.get(norm(scheduleName)) || null;
    if (!pageSlug) { results.push({ ...rec, error: 'no JCU course page found' }); continue; }
    rec.url = `https://www.jcu.edu.au/courses/${pageSlug}`;
    const html = (await getUntil(rec.url, (b) => b.includes('name="domesticJson"'))).toString('utf8');
    rec.status = 200;
    const meta = html.match(/<meta name="domesticJson" content="([^"]+)"/);
    if (!meta) { results.push({ ...rec, error: 'no domesticJson on the page' }); continue; }
    const j = JSON.parse(Buffer.from(meta[1], 'base64').toString('utf8'));
    const brisbane = (j.fastFacts?.location || []).find((l) => l.name === 'Brisbane');
    const clean = (h) => String(h || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    rec.jcu = {
      name: j.name,
      courseCode: j.courseCode,
      cricos: j.fastFacts?.courseCodes?.cricos || j.courseCodes?.cricos || null,
      courseType: j.courseType,
      brisbaneCommencing: brisbane ? brisbane.commencingDate : null,
      durationFullTime: clean(j.fastFacts?.duration?.fullTime),
      internationalFeeOnPage: j.fastFacts?.fees?.cost?.international || null,
      englishBand: j.fastFacts?.entryRequirements?.englishBand ?? j.entryRequirements?.englishBand ?? null,
    };
    if (rec.major) rec.majorConfirmed = new RegExp(`majors?:[^<]*${rec.major.split(' ')[0]}`, 'i').test(clean(html));
    results.push(rec);
    await new Promise((ok) => setTimeout(ok, 500));
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({
    _sources: { fees: pdfUrl, feesPage: FEES_PAGE, coursePages: 'jcu.edu.au/courses/<course>, <meta name="domesticJson">', discovery: 'KC (coursefinder.ai), discovery only' },
    _basis: '2026 fees are based on 8 subjects per year and include the Student Services and Amenities Fee (SSAF); the estimated total is JCU\'s, for students commencing in 2026',
    _crawledOn: new Date().toISOString().slice(0, 10),
    schedule,
    results,
  }, null, 1));

  for (const r of results) {
    if (r.dropped) { console.log(`DROP  ${r.kcName}: ${r.dropped}`); continue; }
    if (r.error) { console.log(`ERR   ${r.kcName}: ${r.error}`); continue; }
    const s = r.scheduleLine;
    const page = r.jcu.internationalFeeOnPage ? money(r.jcu.internationalFeeOnPage) : null;
    const kcFee = Number(r.kc['Tuition/yr (AUD)']);
    console.log(`${s ? 'ok   ' : 'NOFEE'} ${r.kcName}${r.major ? ` [major ${r.majorConfirmed ? 'confirmed' : 'NOT FOUND'}]` : ''} | schedule ${s ? s.annual2026 : '-'} | page ${page ?? '-'} | KC ${kcFee}${s && kcFee !== s.annual2026 ? ' <- KC differs' : ''} | Brisbane: ${r.jcu.brisbaneCommencing ?? 'NOT LISTED'} | ${r.jcu.durationFullTime}`);
  }
})();
