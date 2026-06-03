/**
 * Add plural function aliases to data files that had them
 * This fixes the getCoursesBySlug vs getCourseBySlug mismatch
 */
const fs = require('fs');

// Files that need plural aliases (based on what pages import)
const ALIASES = [
  { file: 'data/durham-courses.ts', singular: 'getDurhamCourseBySlug', plural: 'getDurhamCoursesBySlug', type: 'DurhamCourse' },
  { file: 'data/mcmaster-courses.ts', singular: 'getMcmasterCourseBySlug', plural: 'getMcmasterCoursesBySlug', type: 'McMasterCourse' },
  { file: 'data/ualberta-courses.ts', singular: 'getUalbertaCourseBySlug', plural: 'getUalbertaCoursesBySlug', type: 'UalbertaCourse' },
  { file: 'data/birmingham-courses.ts', singular: 'getBirminghamCourseBySlug', plural: 'getBirminghamCoursesBySlug', type: 'BirminghamCourse' },
  { file: 'data/ubc-courses.ts', singular: 'getUbcCourseBySlug', plural: 'getUbcCoursesBySlug', type: 'UbcCourse' },
  { file: 'data/leeds-courses.ts', singular: 'getLeedsCourseBySlug', plural: 'getLeedsCoursesBySlug', type: 'LeedsCourse' },
  { file: 'data/waterloo-courses.ts', singular: 'getWaterlooCourseBySlug', plural: 'getWaterlooCoursesBySlug', type: 'WaterlooCourse' },
  { file: 'data/western-courses.ts', singular: 'getWesternCourseBySlug', plural: 'getWesternCoursesBySlug', type: 'WesternCourse' },
];

for (const { file, singular, plural, type } of ALIASES) {
  if (!fs.existsSync(file)) {
    console.log(`⚠️  File not found: ${file}`);
    continue;
  }

  let content = fs.readFileSync(file, 'utf8');

  // Check if plural already exists
  if (content.includes(plural)) {
    console.log(`  Already has ${plural}: ${file}`);
    continue;
  }

  // Check if singular exists
  if (!content.includes(singular)) {
    console.log(`  ⚠️  Singular not found: ${singular} in ${file}`);
    continue;
  }

  // Add plural alias
  const alias = `\nexport const ${plural} = ${singular};\n`;
  content = content + alias;
  fs.writeFileSync(file, content);
  console.log(`  ✅ Added alias ${plural} to ${file}`);
}

// Also check the mcmaster page - might need different interface name
const mcmasterPage = 'app/universities/mcmaster-university/courses/[slug]/page.tsx';
if (fs.existsSync(mcmasterPage)) {
  const content = fs.readFileSync(mcmasterPage, 'utf8');
  const imports = content.match(/from '@\/data\/([^']+)'/g);
  console.log(`\nMcMaster page imports: ${imports?.join(', ')}`);
}
