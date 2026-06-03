const fs = require('fs');

// All universities we're generating data for
const unis = [
  // UK
  { prefix: 'edinburgh', slug: 'university-of-edinburgh', name: 'University of Edinburgh', country: 'UK' },
  { prefix: 'soton', slug: 'university-of-southampton', name: 'University of Southampton', country: 'UK' },
  // Canada
  { prefix: 'ubc', slug: 'university-of-british-columbia', name: 'University of British Columbia', country: 'Canada' },
  { prefix: 'ualberta', slug: 'university-of-alberta', name: 'University of Alberta', country: 'Canada' },
  { prefix: 'waterloo', slug: 'university-of-waterloo', name: 'University of Waterloo', country: 'Canada' },
  { prefix: 'mcmaster', slug: 'mcmaster-university', name: 'McMaster University', country: 'Canada' },
  { prefix: 'western', slug: 'western-university', name: 'Western University', country: 'Canada' },
  // Australia
  { prefix: 'uq', slug: 'university-of-queensland', name: 'University of Queensland', country: 'Australia' },
  { prefix: 'monash', slug: 'monash-university', name: 'Monash University', country: 'Australia' },
  { prefix: 'unsw', slug: 'university-of-new-south-wales', name: 'UNSW Sydney', country: 'Australia' },
  { prefix: 'uwa', slug: 'university-of-western-australia', name: 'University of Western Australia', country: 'Australia' },
  { prefix: 'uoa', slug: 'university-of-adelaide', name: 'University of Adelaide', country: 'Australia' },
  { prefix: 'macq', slug: 'macquarie-university', name: 'Macquarie University', country: 'Australia' },
  // USA
  { prefix: 'nyu', slug: 'new-york-university', name: 'New York University', country: 'USA' },
  { prefix: 'umich', slug: 'university-of-michigan', name: 'University of Michigan', country: 'USA' },
  { prefix: 'bu', slug: 'boston-university', name: 'Boston University', country: 'USA' },
  { prefix: 'gatech', slug: 'georgia-institute-of-technology', name: 'Georgia Institute of Technology', country: 'USA' },
  { prefix: 'usc', slug: 'university-of-southern-california', name: 'University of Southern California', country: 'USA' },
  { prefix: 'purdue', slug: 'purdue-university', name: 'Purdue University', country: 'USA' },
  { prefix: 'penn-state', slug: 'penn-state-university', name: 'Penn State University', country: 'USA' },
  // Germany
  { prefix: 'lmu', slug: 'lmu-munich', name: 'LMU Munich', country: 'Germany' },
  { prefix: 'rwth', slug: 'rwth-aachen-university', name: 'RWTH Aachen University', country: 'Germany' },
  { prefix: 'heidelberg', slug: 'heidelberg-university', name: 'Heidelberg University', country: 'Germany' },
  { prefix: 'humboldt', slug: 'humboldt-university-of-berlin', name: 'Humboldt University of Berlin', country: 'Germany' },
  { prefix: 'fu-berlin', slug: 'free-university-of-berlin', name: 'Free University of Berlin', country: 'Germany' },
  { prefix: 'kit', slug: 'karlsruhe-institute-of-technology', name: 'KIT', country: 'Germany' },
  // Ireland
  { prefix: 'ucd', slug: 'university-college-dublin', name: 'University College Dublin', country: 'Ireland' },
  { prefix: 'tcd', slug: 'trinity-college-dublin', name: 'Trinity College Dublin', country: 'Ireland' },
  { prefix: 'nuig', slug: 'university-of-galway', name: 'University of Galway', country: 'Ireland' },
  { prefix: 'ucc', slug: 'university-college-cork', name: 'University College Cork', country: 'Ireland' },
  { prefix: 'dcu', slug: 'dublin-city-university', name: 'Dublin City University', country: 'Ireland' },
  // Singapore
  { prefix: 'nus', slug: 'national-university-of-singapore', name: 'National University of Singapore', country: 'Singapore' },
  { prefix: 'ntu', slug: 'nanyang-technological-university', name: 'NTU Singapore', country: 'Singapore' },
  { prefix: 'smu', slug: 'singapore-management-university', name: 'Singapore Management University', country: 'Singapore' },
];

const missing = [];
const existing = [];

for (const u of unis) {
  const coursesPage = `app/universities/${u.slug}/courses/page.tsx`;
  const courseDetailPage = `app/universities/${u.slug}/courses/[slug]/page.tsx`;
  const hasListing = fs.existsSync(coursesPage);
  const hasDetail = fs.existsSync(courseDetailPage);

  if (!hasListing || !hasDetail) {
    missing.push({ ...u, hasListing, hasDetail });
    console.log(`❌ MISSING: ${u.name} (${u.slug})`);
    console.log(`   Listing: ${hasListing ? '✅' : '❌'} | Detail: ${hasDetail ? '✅' : '❌'}`);
  } else {
    existing.push(u);
  }
}

console.log(`\n✅ Complete: ${existing.length}/${unis.length}`);
console.log(`❌ Missing pages: ${missing.length}`);
