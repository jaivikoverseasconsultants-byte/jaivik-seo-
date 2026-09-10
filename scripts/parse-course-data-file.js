// Parse any data/*-courses.ts into a plain JS array, without a TS toolchain.
//
// Written for the Option A pilot (reports/option-a-pilot-coverage-2026-09-09.json) and
// kept because every bulk course-data pass needs it. Two traps it already handles:
//   1. The array start is NOT the first '[' after `export const` — that matches the
//      `BathCourse[]` in the type annotation and silently yields an empty array.
//   2. Files use three different formats ("key": v, key:v, {id:'x'}), and several have
//      more exports after the array, so a naive slice-to-end never parses.
//
// Usage:  const { parseCourseFile, listRegistryFiles } = require('./parse-course-data-file');

const fs = require('fs');
const path = require('path');

const BS = String.fromCharCode(92);
const DATA_DIR = path.join(__dirname, '..', 'data');

/** Slice out the top-level array literal by bracket-matching, string-aware. */
function extractArrayLiteral(src) {
  const base = src.indexOf('export const');
  if (base === -1) return null;
  const eq = src.indexOf('= [', base);
  if (eq === -1) return null;
  const start = src.indexOf('[', eq);

  let depth = 0, inStr = false, quote = '', escaped = false;
  for (let i = start; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (escaped) escaped = false;
      else if (ch === BS) escaped = true;
      else if (ch === quote) inStr = false;
      continue;
    }
    if (ch === '"' || ch === "'") { inStr = true; quote = ch; continue; }
    if (ch === '[' || ch === '{') depth++;
    else if (ch === ']' || ch === '}') {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  return null;
}

/** @param {string} nameOrPath e.g. 'bath-courses' or an absolute path. */
function parseCourseFile(nameOrPath) {
  const file = nameOrPath.endsWith('.ts')
    ? nameOrPath
    : path.join(DATA_DIR, nameOrPath + '.ts');
  const literal = extractArrayLiteral(fs.readFileSync(file, 'utf8'));
  if (!literal) throw new Error('no array literal found in ' + file);
  // eslint-disable-next-line no-eval -- data files are repo-owned, generated, and inert.
  return eval(literal);
}

/** The data-file basenames actually wired into the live registry, in import order. */
function listRegistryFiles() {
  const reg = fs.readFileSync(path.join(DATA_DIR, 'university-course-registry.ts'), 'utf8');
  return [...reg.matchAll(/import \{ \w+ as m_[\w]+ \} from '\.\/([\w-]+)'/g)].map(m => m[1]);
}

module.exports = { parseCourseFile, listRegistryFiles, extractArrayLiteral };

if (require.main === module) {
  const files = listRegistryFiles();
  let total = 0;
  for (const f of files) total += parseCourseFile(f).length;
  console.log(files.length + ' registry files, ' + total + ' courses');
}
