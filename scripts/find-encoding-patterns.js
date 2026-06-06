const fs = require('fs');
const path = require('path');
const cwd = 'C:/Users/Harshita/jaivik-seo';

const dir = path.join(cwd, 'app', 'universities');
const patterns = new Set();
const flagPatterns = new Set();

function walk(d) {
  const entries = fs.readdirSync(d, {withFileTypes: true});
  for (const e of entries) {
    if (e.isDirectory()) walk(path.join(d, e.name));
    else if (e.name === 'page.tsx') {
      const content = fs.readFileSync(path.join(d, e.name), 'utf8');
      if (!content.includes('Â·')) continue;
      // Find all non-ASCII sequences
      const re = /[^\x00-\x7F]+/g;
      let m = re.exec(content);
      while (m) { patterns.add(m[0]); m = re.exec(content); }
    }
  }
}
walk(dir);

// Sort and display all unique patterns
const sorted = [...patterns].sort();
console.log('All non-ASCII patterns:', sorted.length);
sorted.forEach(p => {
  const codes = [...p].map(c => 'U+' + c.charCodeAt(0).toString(16).padStart(4,'0').toUpperCase()).join(' ');
  console.log(JSON.stringify(p) + ' -> codes: ' + codes);
});
