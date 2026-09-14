// Wire the Canada wave's seven data files into data/university-course-registry.ts.
//
// Registering a slug is what makes its courses reachable: app/universities/[slug]/page.tsx
// reads getCoursesBySlug(), and every hub (nursing, subject/cost pillars, find-my-course,
// course search) reads getAllRealCourses(). All seven already have profile entries in
// data/universities.ts, so no new profile rows are needed.
//
// Waterloo is the one special case: 'university-of-waterloo' is ALREADY registered against
// waterloo-courses.ts (92 graduate programmes). The new waterlooug-courses.ts holds 107
// undergraduate ones for the same institution. Their slug prefixes differ (waterloo-* vs
// waterlooug-*) so there is no collision, and the registry value is just an array — the two
// are concatenated rather than one replacing the other.
const fs = require('fs');
const P = 'data/university-course-registry.ts';
let s = fs.readFileSync(P, 'utf8');

const IMPORTS = [
  ["import { algonquinRealCourses as m_algonquin_college } from './algonquin-courses';", 'algonquin'],
  ["import { durhamCourses as m_durham_college } from './durham-courses';", 'durham'],
  ["import { guelphCourses as m_university_of_guelph } from './guelph-courses';", 'guelph'],
  ["import { tmuCourses as m_toronto_metropolitan_university } from './tmu-courses';", 'tmu'],
  ["import { unbCourses as m_university_of_new_brunswick } from './unb-courses';", 'unb'],
  ["import { waterlooUgCourses as m_university_of_waterloo_ug } from './waterlooug-courses';", 'waterlooug'],
  ["import { yorkuCourses as m_york_university } from './yorku-courses';", 'yorku'],
];

// insert imports after the last existing import line
const lines = s.split(/\r?\n/);
let lastImport = -1;
lines.forEach((l, i) => { if (/^import .* from '\.\//.test(l)) lastImport = i; });
const toAdd = IMPORTS.filter(([line]) => !s.includes(line)).map(([line]) => line);
lines.splice(lastImport + 1, 0, ...toAdd);
s = lines.join('\n');

const ENTRIES = [
  ["  'algonquin-college': m_algonquin_college,", 'algonquin-college'],
  ["  'durham-college': m_durham_college,", 'durham-college'],
  ["  'toronto-metropolitan-university': m_toronto_metropolitan_university,", 'toronto-metropolitan-university'],
  ["  'university-of-guelph': m_university_of_guelph,", 'university-of-guelph'],
  ["  'university-of-new-brunswick': m_university_of_new_brunswick,", 'university-of-new-brunswick'],
  ["  'york-university': m_york_university,", 'york-university'],
];

// add the six brand-new slugs just before the registry's closing brace
const regStart = s.indexOf('const REGISTRY: Record<string, readonly unknown[]> = {');
const regEnd = s.indexOf('\n};', regStart);
let block = s.slice(regStart, regEnd);
for (const [entry, slug] of ENTRIES) {
  if (new RegExp(`'${slug}':`).test(block)) { console.log(`  already registered: ${slug}`); continue; }
  block += '\n' + entry;
  console.log(`  + ${slug}`);
}
s = s.slice(0, regStart) + block + s.slice(regEnd);

// Waterloo: concatenate undergraduate onto the existing graduate array.
const WAT_OLD = "  'university-of-waterloo': m_university_of_waterloo,";
const WAT_NEW = "  // Graduate (waterloo-courses.ts, 92) + undergraduate (waterlooug-courses.ts, 107).\n" +
                "  // Slug prefixes differ (waterloo-* / waterlooug-*), so no course slug collides.\n" +
                "  'university-of-waterloo': [...m_university_of_waterloo, ...m_university_of_waterloo_ug],";
if (s.includes(WAT_OLD)) { s = s.replace(WAT_OLD, WAT_NEW); console.log('  ~ university-of-waterloo: grad + undergrad concatenated'); }
else console.log('  ! waterloo entry not in expected form — left alone');

fs.writeFileSync(P, s);
console.log('\nimports added:', toAdd.length);
