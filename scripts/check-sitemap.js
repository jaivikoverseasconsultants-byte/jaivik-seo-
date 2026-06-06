const fs = require('fs');
const path = require('path');
const cwd = 'C:/Users/Harshita/jaivik-seo';

function extractSlugs(fp) {
  try {
    const c = fs.readFileSync(fp, 'utf-8');
    const r = [];
    const re = /["']?slug["']?\s*:\s*["']([^"']+)["']/g;
    let m = re.exec(c);
    while (m) { r.push(m[1]); m = re.exec(c); }
    return r;
  } catch(e) { return []; }
}

function findDataFile(pp) {
  try {
    const c = fs.readFileSync(pp, 'utf-8');
    const m = c.match(/from\s+['"]@\/data\/([\w-]+-courses)['"]/);
    if (m) return path.join(cwd, 'data', m[1] + '.ts');
  } catch(e) {}
  return null;
}

const appDir = path.join(cwd, 'app', 'universities');
const dirs = fs.readdirSync(appDir, {withFileTypes: true}).filter(function(d) {
  return d.isDirectory() && d.name[0] !== '[' && d.name !== 'country' && d.name !== 'city' &&
    fs.existsSync(path.join(appDir, d.name, 'courses'));
});

let total = 0, noImport = 0, missing = 0, gaps = [];
dirs.forEach(function(d) {
  const pg = path.join(appDir, d.name, 'courses', 'page.tsx');
  const df = findDataFile(pg);
  if (!df) { noImport++; return; }
  if (!fs.existsSync(df)) { missing++; gaps.push(d.name + '->' + path.basename(df)); return; }
  const n = extractSlugs(df).length;
  total += n;
});
console.log('Dirs:', dirs.length, '| No import:', noImport, '| Missing:', missing, '| Total slugs:', total);
if (gaps.length) gaps.forEach(function(g) { console.log('  MISSING:', g); });
