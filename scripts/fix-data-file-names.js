/**
 * Fix data file naming mismatches
 * - For unis with existing pages: generate data at the correct filename/export names
 * - For unis without pages: create pages that match our generated files
 */
const fs = require('fs');

// Universities with existing pages but our generated file has wrong name
const FIX_EXISTING = [
  {
    correctFile: 'data/university-of-amsterdam-courses.ts',
    sourceFile: 'data/amsterdam-courses.ts',
    varName: 'universityOfAmsterdamCourses',
    ifaceName: 'UniversityOfAmsterdamCourse',
    fnName: 'getUniversityOfAmsterdamCourseBySlug',
    prefix: 'amsterdam',
  },
  {
    correctFile: 'data/vrije-universiteit-amsterdam-courses.ts',
    sourceFile: 'data/vu-amsterdam-courses.ts',
    varName: 'vrijeUniversiteitAmsterdamCourses',
    ifaceName: 'VrijeUniversiteitAmsterdamCourse',
    fnName: 'getVrijeUniversiteitAmsterdamCourseBySlug',
    prefix: 'vuamsterdam',
  },
  {
    correctFile: 'data/university-of-paris-saclay-courses.ts',
    sourceFile: 'data/paris-saclay-courses.ts',
    varName: 'universityOfParisSaclayCoursess',
    ifaceName: 'UniversityOfParisSaclayCourse',
    fnName: 'getUniversityOfParisSaclayCoursessBySlug',
    prefix: 'parissaclay',
  },
  {
    correctFile: 'data/sorbonne-university-courses.ts',
    sourceFile: 'data/sorbonne-courses.ts',
    varName: 'sorbonneUniversityCourses',
    ifaceName: 'SorbonneUniversityCourse',
    fnName: 'getSorbonneUniversityCourseBySlug',
    prefix: 'sorbonne',
  },
  {
    correctFile: 'data/kth-royal-institute-of-technology-courses.ts',
    sourceFile: 'data/kth-courses.ts',
    varName: 'kthRoyalInstituteOfTechnologyCourses',
    ifaceName: 'KthRoyalInstituteOfTechnologyCourse',
    fnName: 'getKthRoyalInstituteOfTechnologyCourseBySlug',
    prefix: 'kth',
  },
  {
    correctFile: 'data/lund-university-courses.ts',
    sourceFile: 'data/lund-courses.ts',
    varName: 'lundUniversityCourses',
    ifaceName: 'LundUniversityCourse',
    fnName: 'getLundUniversityCourseBySlug',
    prefix: 'lund',
  },
  {
    correctFile: 'data/technical-university-of-denmark-courses.ts',
    sourceFile: 'data/dtu-courses.ts',
    varName: 'technicalUniversityOfDenmarkCourses',
    ifaceName: 'TechnicalUniversityOfDenmarkCourse',
    fnName: 'getTechnicalUniversityOfDenmarkCourseBySlug',
    prefix: 'dtu',
  },
  {
    correctFile: 'data/khalifa-university-courses.ts',
    sourceFile: 'data/khalifa-courses.ts',
    varName: 'khalifaUniversityCourses',
    ifaceName: 'KhalifaUniversityCourse',
    fnName: 'getKhalifaUniversityCourseBySlug',
    prefix: 'khalifa',
  },
];

for (const fix of FIX_EXISTING) {
  if (!fs.existsSync(fix.sourceFile)) {
    console.log(`⚠️  Source file not found: ${fix.sourceFile}`);
    continue;
  }

  // Read source data and extract courses array
  const source = fs.readFileSync(fix.sourceFile, 'utf8');

  // Extract the courses JSON
  const jsonMatch = source.match(/\[\s*\{[\s\S]+\}\s*\]/);
  if (!jsonMatch) {
    console.log(`⚠️  Could not find JSON array in ${fix.sourceFile}`);
    continue;
  }

  let courses;
  try {
    courses = JSON.parse(jsonMatch[0]);
  } catch(e) {
    console.log(`⚠️  Failed to parse JSON from ${fix.sourceFile}: ${e.message}`);
    continue;
  }

  // Update IDs and slugs to use the new prefix
  courses = courses.map((c, i) => ({
    ...c,
    id: `${fix.prefix}-${i + 1}`,
  }));

  // Check existing file's interface to get the currency fields
  let existingInterface = '';
  if (fs.existsSync(fix.correctFile)) {
    const existing = fs.readFileSync(fix.correctFile, 'utf8');
    const ifaceMatch = existing.match(/export interface \w+ \{[\s\S]+?\}/);
    if (ifaceMatch) {
      existingInterface = ifaceMatch[0];
    }
  }

  // If we have an existing interface, check what currency fields it expects
  let currFields = '';
  if (existingInterface.includes('annualGBP')) {
    currFields = 'annualGBP: number; annualUSD: number; annualINR: number; totalGBP: number;\n  livingCostGBP: number; livingCostUSD: number; livingCostINR: number;';
  } else if (existingInterface.includes('annualEUR')) {
    currFields = 'annualEUR: number; annualUSD: number; annualINR: number; totalEUR: number;\n  livingCostEUR: number; livingCostUSD: number; livingCostINR: number;';
  } else if (existingInterface.includes('annualAUD')) {
    currFields = 'annualAUD: number; annualUSD: number; annualINR: number; totalAUD: number;\n  livingCostAUD: number; livingCostUSD: number; livingCostINR: number;';
  } else if (existingInterface.includes('annualCAD')) {
    currFields = 'annualCAD: number; annualUSD: number; annualINR: number; totalCAD: number;\n  livingCostCAD: number; livingCostUSD: number; livingCostINR: number;';
  } else {
    // Check what fields our source data has
    const sample = courses[0];
    if (sample.annualEUR !== undefined) {
      currFields = 'annualEUR: number; annualUSD: number; annualINR: number; totalEUR: number;\n  livingCostEUR: number; livingCostUSD: number; livingCostINR: number;';
    } else if (sample.annualNZD !== undefined) {
      currFields = 'annualNZD: number; annualUSD: number; annualINR: number; totalNZD: number;\n  livingCostNZD: number; livingCostUSD: number; livingCostINR: number;';
    } else {
      currFields = 'annualUSD: number; annualINR: number; totalUSD: number;\n  livingCostUSD: number; livingCostINR: number;';
    }
  }

  // Check for province or state
  const sample = courses[0];
  const locationField = sample.province ? 'province: string;' : 'state: string;';

  const content = `// Real course data
// Generated: ${new Date().toISOString().split('T')[0]}

export interface ${fix.ifaceName} {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  ${currFields}
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; ${locationField} city: string; countryCode: string;
}

export const ${fix.varName}: ${fix.ifaceName}[] = ${JSON.stringify(courses, null, 2)};

export function ${fix.fnName}(slug: string): ${fix.ifaceName} | undefined {
  return ${fix.varName}.find(c => c.slug === slug);
}
`;

  fs.writeFileSync(fix.correctFile, content);
  console.log(`✅ Updated ${fix.correctFile} (${courses.length} courses)`);
}

console.log('\nDone!');
