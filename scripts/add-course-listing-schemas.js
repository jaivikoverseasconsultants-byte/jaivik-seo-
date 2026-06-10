#!/usr/bin/env node
/**
 * add-course-listing-schemas.js
 *
 * Adds FAQ schema + ItemList (courses) schema to every university course
 * listing page at app/universities/[slug]/courses/page.tsx.
 *
 * Usage:
 *   node scripts/add-course-listing-schemas.js
 *   node scripts/add-course-listing-schemas.js --dry-run
 */

const fs   = require('fs');
const path = require('path');

const UNI_DIR = path.join(__dirname, '..', 'app', 'universities');
const DRY_RUN = process.argv.includes('--dry-run');

function getAllCoursesPages() {
  const results = [];
  const entries = fs.readdirSync(UNI_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const p = path.join(UNI_DIR, entry.name, 'courses', 'page.tsx');
    if (fs.existsSync(p)) results.push({ slug: entry.name, file: p });
  }
  return results;
}

function extractUniversityName(content, slug) {
  // From h1 text
  const h1 = content.match(/<h1[^>]*>\s*([^<\n{]+?)\s*(?:—[^<\n{]*)?\s*<\/h1>/);
  if (h1) return h1[1].trim().replace(/\s*—.*$/, '').trim();
  // From metadata title
  const title = content.match(/title:\s*`?'?"?([^'"\n`]+?)(?:\s+(?:International|Courses|Programs)[^'"\n`]*)?`?'?"/);
  if (title) return title[1].trim().replace(/\\'/g, "'");
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function extractCountry(content) {
  if (/addressCountry.*['"](GB|UK)['"]/i.test(content) || /study in UK|UK university/i.test(content)) return 'United Kingdom';
  if (/addressCountry.*['"]AU['"]/i.test(content) || /study in Australia|Australia university/i.test(content)) return 'Australia';
  if (/addressCountry.*['"]CA['"]/i.test(content) || /study in Canada|Canada university/i.test(content)) return 'Canada';
  if (/addressCountry.*['"]DE['"]/i.test(content) || /study in Germany|Germany university/i.test(content)) return 'Germany';
  if (/addressCountry.*['"]NL['"]/i.test(content) || /Netherlands/i.test(content)) return 'Netherlands';
  if (/addressCountry.*['"]SE['"]/i.test(content) || /Sweden/i.test(content)) return 'Sweden';
  if (/addressCountry.*['"]DK['"]/i.test(content) || /Denmark/i.test(content)) return 'Denmark';
  if (/addressCountry.*['"]SG['"]/i.test(content) || /Singapore/i.test(content)) return 'Singapore';
  if (/addressCountry.*['"]AE['"]/i.test(content) || /UAE|Dubai/i.test(content)) return 'UAE';
  if (/addressCountry.*['"]IE['"]/i.test(content) || /Ireland/i.test(content)) return 'Ireland';
  if (/addressCountry.*['"]NZ['"]/i.test(content) || /New Zealand/i.test(content)) return 'New Zealand';
  if (/addressCountry.*['"]IT['"]/i.test(content) || /Italy/i.test(content)) return 'Italy';
  if (/addressCountry.*['"]ES['"]/i.test(content) || /Spain/i.test(content)) return 'Spain';
  if (/addressCountry.*['"]FR['"]/i.test(content) || /France/i.test(content)) return 'France';
  return 'USA';
}

// The schema + JsonLd code we inject before the return() in the component function
function buildSchemaVars(universityName, country) {
  // Only escape backticks (apostrophes are safe inside template literals)
  const safe = universityName.replace(/`/g, '\\`');
  return `
  const _minIelts = courses.length ? Math.min(...courses.map((c: any) => Number(c.ieltsMin) || 6.0)) : 6.0;
  const _avgFeeUSD = courses.length
    ? Math.round(courses.reduce((s: number, c: any) => s + (Number(c.annualUSD) || 0), 0) / courses.length)
    : 0;
  const _intakeSample: string[] = (courses[0] as any)?.intakeMonths ?? ['September'];
  const _intakesText = _intakeSample.join(' and ');

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: \`How many courses does ${safe} offer for international students?\`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: \`${safe} offers \${courses.length} programs for international students including Undergraduate, Master's, and PhD degrees.\`,
        },
      },
      {
        '@type': 'Question',
        name: \`What is the minimum IELTS score required at ${safe}?\`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: \`The minimum IELTS score at ${safe} is \${_minIelts}+. High-demand programs may require up to 7.0.\`,
        },
      },
      {
        '@type': 'Question',
        name: \`What is the average tuition fee at ${safe}?\`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: \`The average annual tuition at ${safe} is approximately $\${_avgFeeUSD.toLocaleString()} USD (≈ ₹\${(_avgFeeUSD * 84 / 100000).toFixed(1)}L INR). Fees vary by program and level.\`,
        },
      },
      {
        '@type': 'Question',
        name: \`What intake options does ${safe} offer?\`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: \`${safe} offers \${_intakesText} intake\${_intakeSample.length > 1 ? 's' : ''}. Apply 3–6 months before the intake opening.\`,
        },
      },
      {
        '@type': 'Question',
        name: \`How can Indian students apply to ${safe}?\`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: \`Indian students can apply to ${safe} in ${country} through Jaivik Overseas Consultants — free application guidance, SOP writing, and visa assistance included.\`,
        },
      },
    ],
  };

  const courseListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: \`${safe} — Courses for International Students\`,
    description: \`\${courses.length} programs at ${safe}, ${country}. Min IELTS \${_minIelts}+.\`,
    numberOfItems: courses.length,
    itemListElement: courses.slice(0, 5).map((c: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Course',
        name: c.name,
        provider: { '@type': 'CollegeOrUniversity', name: '${safe}' },
        offers: { '@type': 'Offer', price: Number(c.annualUSD) || 0, priceCurrency: 'USD' },
        educationalLevel: c.level ?? c.studyLevel ?? 'Undergraduate',
      },
    })),
  };`;
}

// ── Pattern B: pages that already have `const schema = {` ────────────────────
function upgradePatternB(content, universityName, country) {
  if (!content.includes('const schema = {')) return null;

  const vars = buildSchemaVars(universityName, country);

  // Inject before `const schema = {`
  content = content.replace(/(\s+)(const schema = \{)/, `$1${vars}\n$1$2`);

  // Add JsonLd renders after existing <JsonLd data={schema} />
  content = content.replace(
    /(<JsonLd data=\{schema\} \/>)/,
    `$1\n      <JsonLd data={faqSchema} />\n      <JsonLd data={courseListSchema} />`
  );

  return content;
}

// ── Pattern A: simple pages (no schema code, no hero) ────────────────────────
function upgradePatternA(content, universityName, country) {
  // These pages have `const courses = xyzCourses;` (no cast) or similar
  // and return a plain <div className="max-w-7xl..."

  // 1. Add JsonLd import if missing
  if (!content.includes("import JsonLd")) {
    content = content.replace(
      /import \{ buildMetadata \} from '@\/lib\/seo';/,
      `import { buildMetadata } from '@/lib/seo';\nimport JsonLd from '@/components/JsonLd';`
    );
  }

  // 2. Find the function body's `const courses = ...` line and also `const avgFee =` if present
  // We inject schema vars just before `return (`
  const vars = buildSchemaVars(universityName, country);
  if (!content.includes('return (')) return null;

  // Insert before return (
  content = content.replace(
    /(\n  )(return \()/,
    `\n  ${vars}\n$1$2`
  );

  // 3. Wrap return value with fragment and prepend JsonLd
  // The return starts with <div className="max-w-7xl...
  const divReturn = content.match(/return \(\s*\n(\s*)<div className="max-w-7xl/);
  if (divReturn) {
    const indent = divReturn[1];
    content = content.replace(
      /(return \(\s*\n)(\s*)(<div className="max-w-7xl)/,
      `$1$2<>\n$2  <JsonLd data={faqSchema} />\n$2  <JsonLd data={courseListSchema} />\n$2  $3`
    );
    // Close the fragment before the closing ); of return
    content = content.replace(/(\n\s*<\/div>\s*\n\s*\);\s*\}\s*$)/m, (m) => {
      return m.replace(/(\n\s*<\/div>\s*\n)(\s*\);\s*\}\s*$)/m, `$1${indent}</>\n$2`);
    });
  }

  return content;
}

function main() {
  const pages = getAllCoursesPages();
  console.log(`Found ${pages.length} university course listing pages`);

  let patternA = 0, patternB = 0, alreadyDone = 0, failed = 0;

  for (const { slug, file } of pages) {
    try {
      let content = fs.readFileSync(file, 'utf8');

      // Already upgraded?
      if (content.includes('faqSchema') && content.includes('courseListSchema')) {
        alreadyDone++;
        continue;
      }

      const uniName = extractUniversityName(content, slug);
      const country = extractCountry(content);

      let updated = null;
      const hasSchemaBlock = content.includes('const schema = {');

      if (hasSchemaBlock) {
        updated = upgradePatternB(content, uniName, country);
        if (updated) patternB++;
      } else {
        updated = upgradePatternA(content, uniName, country);
        if (updated) patternA++;
      }

      if (!updated || updated === content) {
        console.warn(`  ⚠️  Skipped (no injection point found): ${slug}`);
        failed++;
        continue;
      }

      if (DRY_RUN) {
        console.log(`  [dry-run] ✓ ${slug} (Pattern ${hasSchemaBlock ? 'B' : 'A'})`);
      } else {
        fs.writeFileSync(file, updated, 'utf8');
      }
    } catch (e) {
      console.error(`  ❌ Error: ${slug}: ${e.message}`);
      failed++;
    }
  }

  console.log(`\n✅ Done`);
  console.log(`   Pattern A updated: ${patternA}`);
  console.log(`   Pattern B updated: ${patternB}`);
  console.log(`   Already done:      ${alreadyDone}`);
  console.log(`   Failed/skipped:    ${failed}`);
}

main();
