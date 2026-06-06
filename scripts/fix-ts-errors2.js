const fs = require('fs');
const path = require('path');
const BASE = 'C:/Users/Harshita/jaivik-seo';

function removeEntriesWithField(filePath, fieldName) {
  const fp = path.join(BASE, filePath);
  if (!fs.existsSync(fp)) { console.log('SKIP: ' + fp); return; }

  const content = fs.readFileSync(fp, 'utf8');
  const arrayStart = content.indexOf('= [');
  if (arrayStart === -1) { console.log('No array: ' + fp); return; }

  const header = content.slice(0, arrayStart + 3);
  const lastClose = content.lastIndexOf('];');
  const footer = content.slice(lastClose);
  const arrayContent = content.slice(arrayStart + 3, lastClose);

  function splitEntries(str) {
    const entries = [];
    let depth = 0, start = -1, inStr = false, strCh = '';
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (inStr) { if (ch === strCh && str[i-1] !== '\') inStr = false; continue; }
      if (ch === '"' || ch === "'") { inStr = true; strCh = ch; continue; }
      if (ch === '{') { if (depth === 0) start = i; depth++; }
      else if (ch === '}') { depth--; if (depth === 0 && start !== -1) { entries.push(str.slice(start, i+1)); start = -1; } }
    }
    return entries;
  }

  const entries = splitEntries(arrayContent);
  const good = entries.filter(e => !e.includes('"' + fieldName + '"') && !e.includes(fieldName + ':') && !e.includes(fieldName + ' :'));
  console.log(filePath + ': removed ' + (entries.length - good.length) + ' ('+entries.length+'->'+good.length+')');
  fs.writeFileSync(fp, header + '\n' + good.join(',\n') + '\n' + footer, 'utf8');
}

removeEntriesWithField('data/dtu-courses.ts', 'annualDKK');
removeEntriesWithField('data/technical-university-of-denmark-courses.ts', 'annualDKK');
removeEntriesWithField('data/embry-courses.ts', 'totalUSD');
removeEntriesWithField('data/khalifa-courses.ts', 'annualAED');
removeEntriesWithField('data/khalifa-university-courses.ts', 'annualAED');
removeEntriesWithField('data/uae-university-courses.ts', 'annualAED');
removeEntriesWithField('data/umea-university-courses.ts', 'annualEUR');
console.log('Done!');
