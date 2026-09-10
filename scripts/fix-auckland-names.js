// Repair Auckland course names that were stored as scraped metadata blobs.
//
// Why: the original crawl captured a metadata panel instead of the page title, so 349 of
// 527 entries are stored as e.g.
//     "Programme name: Bachelor of Commerce Faculty: Business School Type: Bachelors degree"
// The real name is inside that string, in a perfectly regular shape, so this is a
// re-extraction rather than a guess. The Faculty and Type are real captured data too and
// are preserved as fields instead of being thrown away.
//
// The other 178 entries already carry clean names and are left untouched.
//
// Modes:
//   --verify [--sample N]   fetch live pages and check the parsed name against the page's
//                           own <h1>/<title>. Writes reports/auckland-name-verification.json.
//   --apply                 rewrite data/auckland-courses.ts in place.
//   (default)               dry run: print what would change.
//
// Slugs are never touched, so no live URL changes and no redirects are required.

const fs = require('fs');
const path = require('path');
const { parseCourseFile } = require('./parse-course-data-file');

const DATA = path.join(__dirname, '..', 'data', 'auckland-courses.ts');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const BLOB = /^(Programme|Subject) name:\s*(.+?)\s*Faculty:\s*(.+?)\s*Type:\s*(.+?)\s*$/;

/** @returns {{name,faculty,programmeType,kind}|null} null = not a blob, leave alone. */
function parseBlob(raw) {
  const m = BLOB.exec(raw);
  if (!m) return null;
  const [, kind, name, faculty, type] = m;
  if (!name) return null;
  return {
    name: name.trim(),
    faculty: faculty.trim(),
    programmeType: type.trim(),
    kind: kind.toLowerCase(), // 'programme' | 'subject'
  };
}

function decode(s) {
  return s.replace(/&amp;/g, '&').replace(/&#0?39;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
}

async function verify(courses, sampleSize) {
  const blobs = courses.filter(c => parseBlob(c.name));
  const step = Math.max(1, Math.floor(blobs.length / sampleSize));
  const sample = blobs.filter((_, i) => i % step === 0).slice(0, sampleSize);
  console.log('verifying ' + sample.length + ' of ' + blobs.length + ' parsed names against live pages...');

  const rows = [];
  for (const c of sample) {
    const parsed = parseBlob(c.name);
    const row = { slug: c.slug, url: c.url, parsedName: parsed.name };
    try {
      const res = await fetch(c.url, {
        headers: { 'User-Agent': UA, Accept: 'text/html' },
        redirect: 'follow',
        signal: AbortSignal.timeout(30000),
      });
      row.status = res.status;
      if (res.ok) {
        const html = await res.text();
        const h1 = /<h1[^>]*>([\s\S]{0,400}?)<\/h1>/i.exec(html);
        const title = /<title>([\s\S]*?)<\/title>/i.exec(html);
        row.pageH1 = h1 ? decode(h1[1].replace(/<[^>]+>/g, ' ')) : null;
        row.pageTitle = title ? decode(title[1]).split('-')[0].trim() : null;
        const hay = ((row.pageH1 || '') + ' ' + (row.pageTitle || '')).toLowerCase();
        row.match = hay.includes(parsed.name.toLowerCase());
      }
    } catch (e) {
      row.status = 0;
      row.error = String(e && e.message ? e.message : e).slice(0, 100);
    }
    rows.push(row);
    await new Promise(r => setTimeout(r, 200));
  }

  const checked = rows.filter(r => r.match !== undefined);
  const matched = checked.filter(r => r.match);
  fs.writeFileSync(
    path.join(__dirname, '..', 'reports', 'auckland-name-verification.json'),
    JSON.stringify({ generated: new Date().toISOString(), sampled: rows.length, checked: checked.length, matched: matched.length, rows }, null, 2)
  );
  console.log('checked ' + checked.length + ' | parsed name found on the live page: ' + matched.length);
  const bad = checked.filter(r => !r.match);
  if (bad.length) {
    console.log('\nMISMATCHES (parsed name not found on page):');
    bad.forEach(r => console.log('  ' + r.parsedName + '\n     h1: ' + r.pageH1 + '\n     title: ' + r.pageTitle));
  }
  console.log('\nwritten to reports/auckland-name-verification.json');
}

function apply(courses, write) {
  let src = fs.readFileSync(DATA, 'utf8');
  const changes = [];

  for (const c of courses) {
    const parsed = parseBlob(c.name);
    if (!parsed) continue;
    changes.push({ slug: c.slug, from: c.name, to: parsed.name, faculty: parsed.faculty, programmeType: parsed.programmeType, kind: parsed.kind });
  }

  if (!write) {
    console.log('DRY RUN - ' + changes.length + ' names would change (of ' + courses.length + ' entries)\n');
    changes.slice(0, 15).forEach(c => console.log('  ' + c.to + '\n      was: ' + c.from.slice(0, 90) + '...'));
    console.log('\n  ...and ' + Math.max(0, changes.length - 15) + ' more');
    const kinds = changes.reduce((a, c) => (a[c.kind] = (a[c.kind] || 0) + 1, a), {});
    console.log('\n  by kind: ' + JSON.stringify(kinds));
    console.log('  untouched (already clean): ' + (courses.length - changes.length));
    return changes;
  }

  // Replace each blob name in place, and attach faculty/programmeType to the same record.
  let applied = 0;
  for (const c of changes) {
    const needle = '"name":' + JSON.stringify(c.from);
    const idx = src.indexOf(needle);
    if (idx === -1) {
      console.warn('  ! could not locate record for ' + c.slug);
      continue;
    }
    const replacement = '"name":' + JSON.stringify(c.to) +
      ',"faculty":' + JSON.stringify(c.faculty) +
      ',"programmeType":' + JSON.stringify(c.programmeType);
    src = src.slice(0, idx) + replacement + src.slice(idx + needle.length);
    applied++;
  }

  // Widen the interface for the two new optional fields (once).
  if (!/faculty\?: string;/.test(src)) {
    src = src.replace(
      /(export interface AucklandCourse \{)/,
      '$1\n  /** Recovered from the metadata blob the original crawl stored as `name`. */\n  faculty?: string;\n  /** Auckland\'s own programme/subject type, e.g. "Bachelors degree", "Postgraduate subject". */\n  programmeType?: string;'
    );
  }

  fs.writeFileSync(DATA, src);
  console.log('applied ' + applied + ' name fixes to data/auckland-courses.ts');
  return changes;
}

async function main() {
  const args = process.argv.slice(2);
  const courses = parseCourseFile('auckland-courses');

  if (args.includes('--verify')) {
    const i = args.indexOf('--sample');
    return verify(courses, i === -1 ? 20 : Number(args[i + 1]));
  }
  apply(courses, args.includes('--apply'));
}

main();
