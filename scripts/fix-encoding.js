/**
 * Fix UTF-8 mojibake in courses/page.tsx files.
 * Root cause: UTF-8 bytes were misread as CP1252, creating garbled text.
 * Fix: reverse the CP1252 decode to recover original UTF-8.
 */
const fs = require('fs');
const path = require('path');

// CP1252 special range: byte 0x80-0x9F -> Unicode code point
const CP1252_MAP = {
  0x80:0x20AC, 0x82:0x201A, 0x83:0x0192, 0x84:0x201E, 0x85:0x2026,
  0x86:0x2020, 0x87:0x2021, 0x88:0x02C6, 0x89:0x2030, 0x8A:0x0160,
  0x8B:0x2039, 0x8C:0x0152, 0x8E:0x017D, 0x91:0x2018, 0x92:0x2019,
  0x93:0x201C, 0x94:0x201D, 0x95:0x2022, 0x96:0x2013, 0x97:0x2014,
  0x98:0x02DC, 0x99:0x2122, 0x9A:0x0161, 0x9B:0x203A, 0x9C:0x0153,
  0x9E:0x017E, 0x9F:0x0178
};

// Reverse: Unicode code point -> CP1252 byte
const UNICODE_TO_CP1252 = {};
for (const [byte, uni] of Object.entries(CP1252_MAP)) {
  UNICODE_TO_CP1252[uni] = parseInt(byte);
}

function unicodeToCp1252Byte(code) {
  if (code <= 0x7F) return code;           // ASCII: 1:1
  if (UNICODE_TO_CP1252[code] !== undefined) return UNICODE_TO_CP1252[code]; // CP1252 special
  if (code <= 0xFF) return code;           // Latin-1: 1:1
  return -1;                               // Cannot map
}

function fixMojibake(content) {
  const out = [];
  const pendingBytes = [];

  function flushBytes() {
    if (pendingBytes.length === 0) return;
    try {
      out.push(Buffer.from(pendingBytes).toString('utf8'));
    } catch(e) {
      // If invalid UTF-8, keep as-is
      out.push(String.fromCharCode(...pendingBytes));
    }
    pendingBytes.length = 0;
  }

  for (let i = 0; i < content.length; i++) {
    const code = content.charCodeAt(i);

    if (code <= 0x7F) {
      // ASCII: flush pending, emit as-is
      flushBytes();
      out.push(content[i]);
    } else if (code >= 0xD800 && code <= 0xDFFF) {
      // Surrogate pair (high surrogate 0xD800-0xDBFF, low surrogate 0xDC00-0xDFFF)
      // These represent Unicode chars > U+FFFF encoded as surrogate pairs in JS
      flushBytes();
      out.push(content[i]);
    } else {
      const byte = unicodeToCp1252Byte(code);
      if (byte >= 0) {
        pendingBytes.push(byte);
      } else {
        // Unmappable char (e.g. high Unicode that doesn't fit CP1252)
        flushBytes();
        out.push(content[i]);
      }
    }
  }
  flushBytes();
  return out.join('');
}

// Walk all courses/page.tsx files
const appDir = path.join('C:/Users/Harshita/jaivik-seo', 'app', 'universities');
let fixed = 0, skipped = 0, errors = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { walk(full); continue; }
    if (e.name !== 'page.tsx') continue;

    const content = fs.readFileSync(full, 'utf8');
    // Only fix files with the telltale garbled marker
    if (!content.includes('Â·') && !content.includes('â€"') && !content.includes('Â£') &&
        !content.includes('ðŸ‡') && !content.includes('âœ…') && !content.includes('â‚¬') &&
        !content.includes('Ã©') && !content.includes('Ã¨') && !content.includes('Ã¼')) {
      continue;
    }

    try {
      const fixed_content = fixMojibake(content);
      if (fixed_content !== content) {
        fs.writeFileSync(full, fixed_content, 'utf8');
        fixed++;
      }
    } catch(e) {
      console.error('ERROR:', full, e.message);
      errors++;
    }
  }
}

walk(appDir);
console.log('Fixed:', fixed, '| Skipped (clean):', skipped, '| Errors:', errors);
