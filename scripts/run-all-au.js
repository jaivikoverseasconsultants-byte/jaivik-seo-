/**
 * Master orchestrator: scrape + generate pages for all 13 AU universities.
 * Usage: node scripts/run-all-au.js
 * Then deploys: vercel --prod --yes
 *
 * Runs scrapers sequentially to avoid IP bans.
 * Progress saved per-university so you can resume if interrupted.
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CONFIGS = require('./au-universities-config');

// Skip if already has data (allows resuming overnight)
const SKIP_IF_DONE = process.argv.includes('--resume');

const OUT_DIR = path.join(__dirname, '../data/scraped/australia');
fs.mkdirSync(OUT_DIR, { recursive: true });

const SUMMARY = [];

function run(cmd, label) {
  console.log(`\n▶ ${label}`);
  console.log(`  $ ${cmd}`);
  const result = spawnSync(cmd, { shell: true, stdio: 'inherit', cwd: path.join(__dirname, '..') });
  if (result.status !== 0) {
    console.error(`  ✗ FAILED (exit ${result.status})`);
    return false;
  }
  return true;
}

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('  Australian Universities Overnight Scraper & Page Generator');
  console.log('  ' + new Date().toLocaleString());
  console.log('='.repeat(70));
  console.log(`\nProcessing ${CONFIGS.length} universities:\n`);
  CONFIGS.forEach((c, i) => console.log(`  ${i+1}. ${c.name}`));

  const startTime = Date.now();

  for (const config of CONFIGS) {
    const outFile = path.join(OUT_DIR, `${config.id}.json`);
    const tsFile = path.join(__dirname, `../data/${config.id}-courses.ts`);
    const pageFile = path.join(__dirname, `../app/universities/${config.slug}/courses/[slug]/page.tsx`);

    // Skip if already fully done
    if (SKIP_IF_DONE && fs.existsSync(outFile) && fs.existsSync(pageFile)) {
      const courses = JSON.parse(fs.readFileSync(outFile, 'utf8'));
      console.log(`\n⏭  SKIP ${config.name} (${courses.length} courses already done)`);
      SUMMARY.push({ name: config.name, courses: courses.length, status: 'skipped' });
      continue;
    }

    console.log(`\n${'━'.repeat(70)}`);
    console.log(`  ${CONFIGS.indexOf(config) + 1}/${CONFIGS.length}: ${config.name}`);
    console.log(`${'━'.repeat(70)}`);

    const scrapeOk = run(
      `node scripts/scrape-au-university.js ${config.id}`,
      `Scraping ${config.name}`
    );

    let courseCount = 0;
    if (fs.existsSync(outFile)) {
      try {
        courseCount = JSON.parse(fs.readFileSync(outFile, 'utf8')).length;
      } catch {}
    }

    if (courseCount === 0) {
      console.log(`  ⚠️  No courses found for ${config.name} — skipping page generation`);
      SUMMARY.push({ name: config.name, courses: 0, status: 'no-data' });
      continue;
    }

    const genOk = run(
      `node scripts/generate-au-pages.js ${config.id}`,
      `Generating pages for ${config.name}`
    );

    SUMMARY.push({
      name: config.name,
      courses: courseCount,
      status: scrapeOk && genOk ? 'done' : 'partial',
    });

    // Brief pause between universities
    await new Promise(r => setTimeout(r, 2000));
  }

  // Print summary
  const elapsed = Math.round((Date.now() - startTime) / 60000);
  const total = SUMMARY.reduce((s, u) => s + u.courses, 0);

  console.log('\n' + '='.repeat(70));
  console.log('  SUMMARY');
  console.log('='.repeat(70));
  SUMMARY.forEach(u => {
    const icon = u.status === 'done' ? '✅' : u.status === 'skipped' ? '⏭' : u.status === 'no-data' ? '⚠️' : '❌';
    console.log(`  ${icon} ${u.name.padEnd(40)} ${u.courses} courses`);
  });
  console.log(`\n  Total courses scraped: ${total}`);
  console.log(`  Elapsed: ${elapsed} minutes`);
  console.log('='.repeat(70));

  // Check TypeScript
  console.log('\n▶ TypeScript check…');
  const tsCheck = spawnSync('npx tsc --noEmit', {
    shell: true, stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
  });

  if (tsCheck.status !== 0) {
    console.error('\n❌ TypeScript errors found. Fix before deploying.');
    process.exit(1);
  }
  console.log('✅ TypeScript OK');

  // Deploy
  console.log('\n▶ Deploying to Vercel…');
  const deploy = spawnSync('vercel --prod --yes', {
    shell: true, stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
    timeout: 600000, // 10 min
  });

  if (deploy.status !== 0) {
    console.error('\n❌ Deployment failed');
    process.exit(1);
  }

  console.log(`\n🚀 Deployed! ${total} total courses across ${CONFIGS.length} universities.`);
  console.log(`   UTS (333) + AU universities (${total}) = ${333 + total} total course pages`);
}

main().catch(e => {
  console.error('\n💥 Fatal error:', e.message);
  process.exit(1);
});
