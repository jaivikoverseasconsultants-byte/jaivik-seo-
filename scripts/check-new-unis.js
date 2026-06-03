const fs = require('fs');

const unis = [
  { prefix: 'delft', slug: 'delft-university-of-technology' },
  { prefix: 'amsterdam', slug: 'university-of-amsterdam' },
  { prefix: 'eindhoven', slug: 'eindhoven-university-of-technology' },
  { prefix: 'vu-amsterdam', slug: 'vrije-universiteit-amsterdam' },
  { prefix: 'paris-saclay', slug: 'university-of-paris-saclay' },
  { prefix: 'sorbonne', slug: 'sorbonne-university' },
  { prefix: 'auckland', slug: 'university-of-auckland' },
  { prefix: 'victoria', slug: 'victoria-university-of-wellington' },
  { prefix: 'kth', slug: 'kth-royal-institute-of-technology' },
  { prefix: 'lund', slug: 'lund-university' },
  { prefix: 'dtu', slug: 'technical-university-of-denmark' },
  { prefix: 'khalifa', slug: 'khalifa-university' },
  { prefix: 'uae-university', slug: 'united-arab-emirates-university' },
];

for (const u of unis) {
  const coursePage = `app/universities/${u.slug}/courses/[slug]/page.tsx`;
  const hasPage = fs.existsSync(coursePage);
  let importedFile = null;
  if (hasPage) {
    const content = fs.readFileSync(coursePage, 'utf8');
    const m = content.match(/from ['"]@\/data\/([^'"]+)['"]/);
    if (m) importedFile = m[1];
  }
  console.log(`${u.slug}: ${hasPage ? '✅' : '❌ no page'} | imports: ${importedFile || 'N/A'}`);
}
