/**
 * generate-courses.js
 *
 * Uses the Anthropic SDK (already in your deps) to generate realistic course
 * data for universities that have empty stub files.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... node scripts/generate-courses.js --uni abdn
 *   ANTHROPIC_API_KEY=sk-ant-... node scripts/generate-courses.js --batch 5
 *
 * Reads each empty stub to get the interface shape, generates 30-50 courses
 * per university matching the exact TypeScript type, writes back to the file.
 */

const Anthropic = require('@anthropic-ai/sdk');
const fs        = require('fs');
const path      = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const client   = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Find empty stubs ──────────────────────────────────────────────────────────

function findEmptyStubs() {
  return fs.readdirSync(DATA_DIR)
    .filter(f => f.endsWith('-courses.ts'))
    .map(f => {
      const content = fs.readFileSync(path.join(DATA_DIR, f), 'utf8');
      const courseCount = (content.match(/id: '/g) || []).length;
      return { file: f, slug: f.replace('-courses.ts', ''), content, courseCount };
    })
    .filter(f => f.courseCount === 0);
}

// ── Derive university info from slug + stub content ───────────────────────────

function extractStubInfo(stub) {
  // Extract university name from comment or interface name
  const nameMatch = stub.content.match(/University:\s*(.+)/);
  const uniName = nameMatch ? nameMatch[1].trim() : stub.slug.replace(/-/g, ' ');

  // Extract interface name to know the type name and field names
  const interfaceMatch = stub.content.match(/export interface (\w+Course)\s*\{([^}]+)\}/s);
  const interfaceName = interfaceMatch ? interfaceMatch[1] : null;
  const interfaceBody = interfaceMatch ? interfaceMatch[2] : null;

  // Extract array export name
  const arrayMatch = stub.content.match(/export const (\w+):\s*\w+\[\]/);
  const arrayName = arrayMatch ? arrayMatch[1] : null;

  // Detect currency fields to know the country
  const hasDKK = stub.content.includes('DKK');
  const hasGBP = stub.content.includes('GBP');
  const hasAUD = stub.content.includes('AUD');
  const hasCAD = stub.content.includes('CAD');
  const hasSGD = stub.content.includes('SGD');
  const hasEUR = stub.content.includes('EUR');

  let country = 'USA', currency = 'USD', typicalFee = 45000;
  if (hasDKK) { country = 'Denmark'; currency = 'DKK'; typicalFee = 95000; }
  else if (hasGBP) { country = 'UK'; currency = 'GBP'; typicalFee = 28000; }
  else if (hasAUD) { country = 'Australia'; currency = 'AUD'; typicalFee = 38000; }
  else if (hasCAD) { country = 'Canada'; currency = 'CAD'; typicalFee = 30000; }
  else if (hasSGD) { country = 'Singapore'; currency = 'SGD'; typicalFee = 40000; }
  else if (hasEUR) { country = 'Germany/Europe'; currency = 'EUR'; typicalFee = 15000; }

  return { uniName, interfaceName, interfaceBody, arrayName, country, currency, typicalFee };
}

// ── Generate courses via Claude ───────────────────────────────────────────────

async function generateCoursesForStub(stub) {
  const info = extractStubInfo(stub);
  if (!info.interfaceName || !info.arrayName) {
    console.log(`  ⚠️  Could not parse interface in ${stub.file} — skipping`);
    return null;
  }

  console.log(`  Generating for ${info.uniName} (${info.country})...`);

  const prompt = `Generate realistic course data for ${info.uniName} (${info.country}).

The TypeScript interface is:
\`\`\`typescript
${info.interfaceBody}
\`\`\`

Array name: ${info.arrayName}
Interface name: ${info.interfaceName}

Generate 35 realistic courses covering a mix of:
- Bachelor's programs (level: "Bachelor", ~12 courses)
- Master's programs (level: "Master", ~15 courses)
- PhD programs (level: "PhD", ~5 courses)
- MBA if applicable (level: "Master", ~3 courses)

Use realistic course names that ${info.uniName} would actually offer.
For fees: typical annual fee is around ${info.typicalFee} ${currency}.
Use IELTS scores: Bachelor=6.0, Master=6.5, PhD=7.0.
Intakes: typically September/October and January/February.
Slugs must be kebab-case of the course name.
IDs must be unique, format: "xx-c001", "xx-c002", etc. where xx = first 2 letters of slug.

Return ONLY a valid JSON array (no markdown, no explanation), like:
[
  {
    "id": "ab-c001",
    "name": "Computer Science",
    "slug": "computer-science",
    "url": "https://example.ac.uk/courses/computer-science",
    ...all other fields from the interface
  },
  ...
]`;

  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = msg.content[0].type === 'text' ? msg.content[0].text : '';

    // Extract JSON array from response
    const jsonMatch = responseText.match(/\[[\s\S]+\]/);
    if (!jsonMatch) {
      console.log(`  ❌ No JSON array found in response`);
      return null;
    }

    let courses;
    try {
      courses = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.log(`  ❌ JSON parse failed: ${e.message}`);
      return null;
    }

    console.log(`  ✅ Generated ${courses.length} courses`);
    return { courses, info };

  } catch (e) {
    console.log(`  ❌ API error: ${e.message}`);
    return null;
  }
}

// ── Write back to stub file ───────────────────────────────────────────────────

function writeGeneratedCourses(stub, courses, info) {
  // Build the TypeScript const from JSON data
  const coursesTS = JSON.stringify(courses, null, 2)
    // Convert JSON to TypeScript (minimal: just format nicely)
    .replace(/"([^"]+)":/g, '$1:')   // unquote keys
    .replace(/: "([^"]*)"/g, ": '$1'")  // double → single quotes for strings
    .replace(/: null/g, ': 0')        // null → 0 for number fields
    ;

  const newContent = stub.content.replace(
    /export const \w+:\s*\w+\[\]\s*=\s*\[\s*\]/,
    `export const ${info.arrayName}: ${info.interfaceName}[] = ${coursesTS}`
  );

  if (newContent === stub.content) {
    // Fallback: replace the empty array at the end
    const fallback = stub.content.replace(/\[\s*\]\s*;?\s*$/, `${coursesTS};`);
    fs.writeFileSync(path.join(DATA_DIR, stub.file), fallback);
  } else {
    fs.writeFileSync(path.join(DATA_DIR, stub.file), newContent);
  }

  console.log(`  📁 Written → data/${stub.file}`);
}

// ── CLI ───────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY not set');
    console.error('   Run: ANTHROPIC_API_KEY=sk-ant-... node scripts/generate-courses.js --batch 5');
    process.exit(1);
  }

  const emptyStubs = findEmptyStubs();
  console.log(`Found ${emptyStubs.length} empty course stubs`);

  let targets = [];

  const uniArg = args.indexOf('--uni');
  const batchArg = args.indexOf('--batch');
  const allArg = args.includes('--all');

  if (uniArg !== -1 && args[uniArg + 1]) {
    const slugPart = args[uniArg + 1];
    targets = emptyStubs.filter(s => s.slug.includes(slugPart));
    if (targets.length === 0) {
      console.log(`No empty stub matching "${slugPart}". Available empty stubs (first 10):`);
      emptyStubs.slice(0, 10).forEach(s => console.log(' ', s.slug));
      process.exit(1);
    }
  } else if (batchArg !== -1) {
    const n = parseInt(args[batchArg + 1] || '5', 10);
    targets = emptyStubs.slice(0, n);
    console.log(`Processing first ${targets.length} empty stubs...`);
  } else if (allArg) {
    targets = emptyStubs;
    console.log(`Processing all ${targets.length} empty stubs (this will take a while and cost ~$${(targets.length * 0.02).toFixed(2)} in API credits)...`);
  } else {
    console.log('Usage:');
    console.log('  node scripts/generate-courses.js --uni abdn       # single university');
    console.log('  node scripts/generate-courses.js --batch 10       # first N empty stubs');
    console.log('  node scripts/generate-courses.js --all             # all 373 empty stubs');
    console.log('');
    console.log('Estimated cost: ~$0.02 per university (~$7.50 for all 373)');
    console.log('');
    console.log('First 5 empty stubs:');
    emptyStubs.slice(0, 5).forEach(s => console.log(' ', s.slug));
    process.exit(0);
  }

  let success = 0;
  for (const stub of targets) {
    console.log(`\n[${targets.indexOf(stub) + 1}/${targets.length}] ${stub.slug}`);
    const result = await generateCoursesForStub(stub);
    if (result) {
      writeGeneratedCourses(stub, result.courses, result.info);
      success++;
    }
    // Small delay to avoid rate limiting
    if (targets.length > 1) await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n✅ Done: ${success}/${targets.length} stubs populated`);
}

main().catch(e => { console.error(e); process.exit(1); });
