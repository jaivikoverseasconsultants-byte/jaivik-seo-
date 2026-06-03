const fs = require('fs');
const dataFiles = fs.readdirSync('data').filter(f => f.endsWith('-courses.ts'));

const toCheck = [
  'university-of-edinburgh',
  'university-of-southampton',
  'university-of-british-columbia',
  'university-of-alberta',
  'university-of-waterloo',
  'mcmaster-university',
  'western-university',
  'national-university-of-singapore',
  'nanyang-technological-university',
  'university-of-queensland',
  'monash-university',
  'university-of-new-south-wales',
  'university-of-western-australia',
  'university-of-adelaide',
  'macquarie-university',
  'university-of-california-los-angeles',
  'university-of-california-berkeley',
  'new-york-university',
  'university-of-chicago',
  'university-of-michigan',
  'rwth-aachen-university',
  'heidelberg-university',
  'lmu-munich',
  'humboldt-university-of-berlin',
  'university-college-dublin',
  'trinity-college-dublin',
  'university-of-galway',
];

for (const slug of toCheck) {
  const appDir = `app/universities/${slug}`;
  const hasAppDir = fs.existsSync(appDir);

  // Find exact data file by reading course page import
  let importedFile = '?';
  if (hasAppDir) {
    const coursePage = `${appDir}/courses/[slug]/page.tsx`;
    if (fs.existsSync(coursePage)) {
      const content = fs.readFileSync(coursePage, 'utf8');
      const importMatch = content.match(/from ['"]@\/data\/([^'"]+)['"]/);
      if (importMatch) importedFile = importMatch[1];
    }
  }

  console.log(`${slug}:`);
  console.log(`  App: ${hasAppDir ? '✅' : '❌ MISSING'}  |  Data: ${importedFile}`);
}
