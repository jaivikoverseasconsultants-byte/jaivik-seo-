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

// Sample some key unis
const checkUnis = ['queens', 'ucalgary', 'sfu', 'warwick', 'durham-university', 'kaplan-business-school', 'swinburne-university'];
checkUnis.forEach(function(uniName) {
  const pg = path.join(appDir, uniName, 'courses', 'page.tsx');
  if (!fs.existsSync(pg)) { console.log(uniName + ': no page.tsx'); return; }
  const df = findDataFile(pg);
  if (!df) { console.log(uniName + ': no data file found'); return; }
  const slugs = extractSlugs(df);
  console.log(uniName + ': ' + slugs.length + ' courses -> ' + path.basename(df));
});

let total = 0;
dirs.forEach(function(d) {
  const df = findDataFile(path.join(appDir, d.name, 'courses', 'page.tsx'));
  if (!df || !fs.existsSync(df)) return;
  total += extractSlugs(df).length;
});
console.log('TOTAL course URLs for sitemap:', total);
