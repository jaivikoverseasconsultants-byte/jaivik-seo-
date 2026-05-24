export interface CountryData {
  name: string;
  flag: string;
  match?: number;
  visaSuccessRate: number; // %
  avgTuitionUSD: number;
  avgLivingCostUSD: number;
  postStudyWorkYears: number;
  prPathway: boolean;
  prTimeline: string;
  partTimeHours: number;
  ieltsRequirement: number;
  intakeMonths: string[];
  jobMarket: Record<string, string>; // course keyword -> rating
  jocScore: number; // /10
  highlights: string[];
  visaType: string;
  currency: string;
  minIELTS: number;
  minBudgetUSD: number; // per year total
}

export interface CompareUniversity {
  name: string;
  country: string;
  city: string;
  qsRanking: number;
  feesPerYearUSD: number;
  scholarship: string;
  ieltsMin: number;
  acceptanceRate: number;
  intakeMonths: string[];
  campusSize: string;
  notableAlumni: string[];
  jocPartner: boolean;
  courses: string[];
  slug: string;
  minCGPA: number;
}

export interface CompareCourse {
  name: string;
  avgFeesUSD: number;
  durationYears: number;
  jobGrowthPct: number;
  avgSalaryAfterUSD: number;
  topCompanies: string[];
  prEligible: boolean;
  ieltsMin: number;
  roiScore: number; // /10
  countries: string[];
  level: string;
}

export const COUNTRIES: CountryData[] = [
  {
    name: 'Canada',
    flag: '🇨🇦',
    visaSuccessRate: 65,
    avgTuitionUSD: 22000,
    avgLivingCostUSD: 12000,
    postStudyWorkYears: 3,
    prPathway: true,
    prTimeline: '2–3 years via Express Entry',
    partTimeHours: 20,
    ieltsRequirement: 6.0,
    intakeMonths: ['January', 'May', 'September'],
    jobMarket: { cs: 'Excellent', engineering: 'Excellent', business: 'Good', healthcare: 'Excellent', finance: 'Good', law: 'Moderate', arts: 'Moderate' },
    jocScore: 9.2,
    highlights: ['3-year PGWP', 'Express Entry PR', 'High Indian community', '3 intakes/year'],
    visaType: 'Study Permit',
    currency: 'CAD',
    minIELTS: 6.0,
    minBudgetUSD: 25000,
  },
  {
    name: 'UK',
    flag: '🇬🇧',
    visaSuccessRate: 72,
    avgTuitionUSD: 28000,
    avgLivingCostUSD: 14000,
    postStudyWorkYears: 2,
    prPathway: true,
    prTimeline: '5 years + ILR route',
    partTimeHours: 20,
    ieltsRequirement: 6.0,
    intakeMonths: ['January', 'September'],
    jobMarket: { cs: 'Good', engineering: 'Good', business: 'Excellent', healthcare: 'Good', finance: 'Excellent', law: 'Excellent', arts: 'Good' },
    jocScore: 8.8,
    highlights: ['1-year PG degrees', 'Graduate Route Visa 2yr', 'Global financial hub', 'Russell Group unis'],
    visaType: 'Student Visa',
    currency: 'GBP',
    minIELTS: 6.0,
    minBudgetUSD: 30000,
  },
  {
    name: 'Australia',
    flag: '🇦🇺',
    visaSuccessRate: 76,
    avgTuitionUSD: 25000,
    avgLivingCostUSD: 13000,
    postStudyWorkYears: 2,
    prPathway: true,
    prTimeline: '2–4 years via SkillSelect',
    partTimeHours: 48,
    ieltsRequirement: 6.0,
    intakeMonths: ['February', 'July'],
    jobMarket: { cs: 'Good', engineering: 'Excellent', business: 'Good', healthcare: 'Excellent', finance: 'Good', law: 'Moderate', arts: 'Moderate' },
    jocScore: 8.5,
    highlights: ['Unlimited work during study', '485 Grad visa 2–4yr', 'Group of Eight unis', 'High quality of life'],
    visaType: 'Student Visa (500)',
    currency: 'AUD',
    minIELTS: 6.0,
    minBudgetUSD: 28000,
  },
  {
    name: 'Germany',
    flag: '🇩🇪',
    visaSuccessRate: 68,
    avgTuitionUSD: 1000,
    avgLivingCostUSD: 11000,
    postStudyWorkYears: 1.5,
    prPathway: true,
    prTimeline: '3–5 years + Blue Card',
    partTimeHours: 20,
    ieltsRequirement: 6.0,
    intakeMonths: ['April', 'October'],
    jobMarket: { cs: 'Excellent', engineering: 'Excellent', business: 'Good', healthcare: 'Moderate', finance: 'Moderate', law: 'Low', arts: 'Low' },
    jocScore: 8.0,
    highlights: ['Near-zero tuition fees', 'EU Blue Card PR', 'Engineering powerhouse', 'No student debt stress'],
    visaType: 'National Visa (D)',
    currency: 'EUR',
    minIELTS: 6.0,
    minBudgetUSD: 12000,
  },
  {
    name: 'USA',
    flag: '🇺🇸',
    visaSuccessRate: 60,
    avgTuitionUSD: 45000,
    avgLivingCostUSD: 18000,
    postStudyWorkYears: 3,
    prPathway: true,
    prTimeline: '6–10+ years (EB series)',
    partTimeHours: 20,
    ieltsRequirement: 6.5,
    intakeMonths: ['January', 'August'],
    jobMarket: { cs: 'Excellent', engineering: 'Excellent', business: 'Excellent', healthcare: 'Excellent', finance: 'Excellent', law: 'Good', arts: 'Good' },
    jocScore: 8.7,
    highlights: ['World #1 universities', 'OPT 3yr STEM', 'Highest salaries globally', 'Research powerhouse'],
    visaType: 'F-1 Student Visa',
    currency: 'USD',
    minIELTS: 6.5,
    minBudgetUSD: 50000,
  },
  {
    name: 'Ireland',
    flag: '🇮🇪',
    visaSuccessRate: 80,
    avgTuitionUSD: 18000,
    avgLivingCostUSD: 12000,
    postStudyWorkYears: 2,
    prPathway: true,
    prTimeline: '5 years + IRP',
    partTimeHours: 20,
    ieltsRequirement: 6.0,
    intakeMonths: ['January', 'September'],
    jobMarket: { cs: 'Excellent', engineering: 'Good', business: 'Good', healthcare: 'Good', finance: 'Excellent', law: 'Moderate', arts: 'Moderate' },
    jocScore: 8.3,
    highlights: ['EU tech hub', 'English speaking', 'Stay-back 2yr', 'Google/Meta/Apple HQ'],
    visaType: 'Student Permission',
    currency: 'EUR',
    minIELTS: 6.0,
    minBudgetUSD: 22000,
  },
  {
    name: 'Singapore',
    flag: '🇸🇬',
    visaSuccessRate: 82,
    avgTuitionUSD: 20000,
    avgLivingCostUSD: 15000,
    postStudyWorkYears: 1,
    prPathway: true,
    prTimeline: '2–3 years Employment Pass',
    partTimeHours: 16,
    ieltsRequirement: 6.0,
    intakeMonths: ['January', 'August'],
    jobMarket: { cs: 'Excellent', engineering: 'Good', business: 'Excellent', healthcare: 'Moderate', finance: 'Excellent', law: 'Moderate', arts: 'Low' },
    jocScore: 8.1,
    highlights: ['Asia financial hub', 'Safe & clean', 'NUS/NTU top 15 global', 'Short duration courses'],
    visaType: 'Student\'s Pass',
    currency: 'SGD',
    minIELTS: 6.0,
    minBudgetUSD: 28000,
  },
  {
    name: 'New Zealand',
    flag: '🇳🇿',
    visaSuccessRate: 84,
    avgTuitionUSD: 18000,
    avgLivingCostUSD: 11000,
    postStudyWorkYears: 3,
    prPathway: true,
    prTimeline: '3 years via Skilled Migrant',
    partTimeHours: 20,
    ieltsRequirement: 6.0,
    intakeMonths: ['February', 'July'],
    jobMarket: { cs: 'Good', engineering: 'Good', business: 'Moderate', healthcare: 'Excellent', finance: 'Moderate', law: 'Moderate', arts: 'Moderate' },
    jocScore: 7.8,
    highlights: ['High visa success rate', '3yr post-study work', 'Quality of life', 'Healthcare demand'],
    visaType: 'Student Visa',
    currency: 'NZD',
    minIELTS: 6.0,
    minBudgetUSD: 22000,
  },
];

export const COMPARE_UNIVERSITIES: CompareUniversity[] = [
  { name: 'University of Toronto', country: 'Canada', city: 'Toronto', qsRanking: 21, feesPerYearUSD: 28000, scholarship: 'Up to CAD 15,000', ieltsMin: 6.5, acceptanceRate: 43, intakeMonths: ['September', 'January'], campusSize: 'Large (97,000 students)', notableAlumni: ['Lester B. Pearson', 'Frederick Banting'], jocPartner: true, courses: ['MS Computer Science', 'MBA', 'MS Data Science', 'MS Electrical Engineering'], slug: 'university-of-toronto', minCGPA: 7.0 },
  { name: 'McGill University', country: 'Canada', city: 'Montreal', qsRanking: 30, feesPerYearUSD: 24000, scholarship: 'Merit-based up to CAD 10,000', ieltsMin: 6.5, acceptanceRate: 46, intakeMonths: ['September', 'January'], campusSize: 'Large (39,000 students)', notableAlumni: ['William Shatner', 'Justin Trudeau'], jocPartner: true, courses: ['MS Computer Science', 'MBA', 'MS Finance', 'Engineering'], slug: 'mcgill-university', minCGPA: 7.5 },
  { name: 'University of British Columbia', country: 'Canada', city: 'Vancouver', qsRanking: 34, feesPerYearUSD: 26000, scholarship: 'International Leader of Tomorrow Award', ieltsMin: 6.5, acceptanceRate: 52, intakeMonths: ['September', 'January'], campusSize: 'Large (68,000 students)', notableAlumni: ['Evi Nemeth', 'Kim Campbell'], jocPartner: false, courses: ['MS Computer Science', 'MS Data Science', 'MBA', 'Engineering'], slug: 'university-of-british-columbia', minCGPA: 7.0 },
  { name: 'University of Waterloo', country: 'Canada', city: 'Waterloo', qsRanking: 112, feesPerYearUSD: 22000, scholarship: 'President\'s Scholarship CAD 2,000', ieltsMin: 6.5, acceptanceRate: 53, intakeMonths: ['September', 'January'], campusSize: 'Large (42,000 students)', notableAlumni: ['Mike Lazaridis', 'Jim Balsillie'], jocPartner: true, courses: ['MS Computer Science', 'MS Data Science', 'MS Electrical Engineering'], slug: 'university-of-waterloo', minCGPA: 7.5 },
  { name: 'University of Oxford', country: 'UK', city: 'Oxford', qsRanking: 3, feesPerYearUSD: 35000, scholarship: 'Rhodes Scholarship (Full)', ieltsMin: 7.0, acceptanceRate: 17, intakeMonths: ['October'], campusSize: 'Medium (26,000 students)', notableAlumni: ['Stephen Hawking', 'Tony Blair', 'J.R.R. Tolkien'], jocPartner: false, courses: ['MBA', 'MS Computer Science', 'MS Finance', 'LLM'], slug: 'university-of-oxford', minCGPA: 8.5 },
  { name: 'University College London', country: 'UK', city: 'London', qsRanking: 9, feesPerYearUSD: 30000, scholarship: 'Denys Holland Scholarship', ieltsMin: 6.5, acceptanceRate: 63, intakeMonths: ['September', 'January'], campusSize: 'Large (42,000 students)', notableAlumni: ['Mahatma Gandhi', 'Alexander Graham Bell'], jocPartner: true, courses: ['MS Computer Science', 'MS Data Science', 'MBA', 'LLM', 'MS Finance'], slug: 'university-college-london', minCGPA: 7.5 },
  { name: 'University of Manchester', country: 'UK', city: 'Manchester', qsRanking: 32, feesPerYearUSD: 26000, scholarship: 'Global Futures Scholarship', ieltsMin: 6.5, acceptanceRate: 57, intakeMonths: ['September'], campusSize: 'Large (40,000 students)', notableAlumni: ['Alan Turing', 'Ernest Rutherford'], jocPartner: true, courses: ['MS Computer Science', 'MBA', 'MS Data Science', 'Engineering'], slug: 'university-of-manchester', minCGPA: 7.0 },
  { name: 'University of Edinburgh', country: 'UK', city: 'Edinburgh', qsRanking: 22, feesPerYearUSD: 28000, scholarship: 'Edinburgh Global Scholarship', ieltsMin: 6.5, acceptanceRate: 43, intakeMonths: ['September'], campusSize: 'Large (36,000 students)', notableAlumni: ['Charles Darwin', 'Arthur Conan Doyle'], jocPartner: false, courses: ['MS Computer Science', 'MS Data Science', 'MBA', 'MS AI'], slug: 'university-of-edinburgh', minCGPA: 7.5 },
  { name: 'University of Melbourne', country: 'Australia', city: 'Melbourne', qsRanking: 14, feesPerYearUSD: 32000, scholarship: 'Melbourne International Scholarship', ieltsMin: 6.5, acceptanceRate: 70, intakeMonths: ['February', 'July'], campusSize: 'Large (52,000 students)', notableAlumni: ['Cate Blanchett', 'Rupert Murdoch'], jocPartner: true, courses: ['MS Computer Science', 'MBA', 'MS Data Science', 'Engineering'], slug: 'university-of-melbourne', minCGPA: 7.0 },
  { name: 'Australian National University', country: 'Australia', city: 'Canberra', qsRanking: 30, feesPerYearUSD: 28000, scholarship: 'ANU Chancellor\'s International Scholarship', ieltsMin: 6.5, acceptanceRate: 35, intakeMonths: ['February', 'July'], campusSize: 'Medium (25,000 students)', notableAlumni: ['John Gorton', 'Helen Hughes'], jocPartner: false, courses: ['MS Computer Science', 'MS Data Science', 'Engineering', 'Public Policy'], slug: 'australian-national-university', minCGPA: 7.5 },
  { name: 'University of Sydney', country: 'Australia', city: 'Sydney', qsRanking: 18, feesPerYearUSD: 30000, scholarship: 'Sydney Scholars Award', ieltsMin: 6.5, acceptanceRate: 30, intakeMonths: ['February', 'July'], campusSize: 'Large (60,000 students)', notableAlumni: ['Tony Abbott', 'Gough Whitlam'], jocPartner: true, courses: ['MBA', 'MS Computer Science', 'Engineering', 'LLM'], slug: 'university-of-sydney', minCGPA: 7.0 },
  { name: 'TU Munich', country: 'Germany', city: 'Munich', qsRanking: 37, feesPerYearUSD: 500, scholarship: 'Deutschlandstipendium EUR 300/month', ieltsMin: 6.5, acceptanceRate: 8, intakeMonths: ['October', 'April'], campusSize: 'Large (45,000 students)', notableAlumni: ['Carl Linde', 'Rudolf Diesel'], jocPartner: false, courses: ['MS Computer Science', 'MS Electrical Engineering', 'Engineering', 'MS Data Science'], slug: 'tu-munich', minCGPA: 8.0 },
  { name: 'RWTH Aachen University', country: 'Germany', city: 'Aachen', qsRanking: 106, feesPerYearUSD: 300, scholarship: 'DAAD Scholarship', ieltsMin: 6.5, acceptanceRate: 17, intakeMonths: ['October'], campusSize: 'Large (45,000 students)', notableAlumni: ['Aloys Wobben', 'Peter Grünberg'], jocPartner: false, courses: ['MS Electrical Engineering', 'MS Computer Science', 'Engineering', 'MS Mechanical Engineering'], slug: 'rwth-aachen', minCGPA: 7.5 },
  { name: 'MIT', country: 'USA', city: 'Cambridge', qsRanking: 1, feesPerYearUSD: 58000, scholarship: 'MIT Fellowship (Full)', ieltsMin: 7.0, acceptanceRate: 4, intakeMonths: ['September'], campusSize: 'Medium (11,500 students)', notableAlumni: ['Kofi Annan', 'Buzz Aldrin'], jocPartner: false, courses: ['MS Computer Science', 'MS Electrical Engineering', 'MS Data Science', 'Engineering'], slug: 'mit-massachusetts', minCGPA: 9.0 },
  { name: 'University of Illinois', country: 'USA', city: 'Urbana-Champaign', qsRanking: 20, feesPerYearUSD: 32000, scholarship: 'Graduate College Fellowship', ieltsMin: 6.5, acceptanceRate: 45, intakeMonths: ['August', 'January'], campusSize: 'Large (56,000 students)', notableAlumni: ['Marc Andreessen', 'Jack Kilby'], jocPartner: true, courses: ['MS Computer Science', 'MS Data Science', 'MBA', 'MS Electrical Engineering'], slug: 'uiuc-illinois', minCGPA: 7.5 },
  { name: 'Northeastern University', country: 'USA', city: 'Boston', qsRanking: 344, feesPerYearUSD: 30000, scholarship: 'Deans Scholarship up to $20,000', ieltsMin: 6.5, acceptanceRate: 18, intakeMonths: ['September', 'January'], campusSize: 'Large (21,000 students)', notableAlumni: ['John Moakley', 'Dennis Lehane'], jocPartner: true, courses: ['MS Computer Science', 'MS Data Science', 'MBA', 'MS Information Systems'], slug: 'northeastern-university', minCGPA: 7.0 },
];

export const COMPARE_COURSES: CompareCourse[] = [
  { name: 'MS Computer Science', avgFeesUSD: 45000, durationYears: 2, jobGrowthPct: 25, avgSalaryAfterUSD: 110000, topCompanies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'], prEligible: true, ieltsMin: 6.5, roiScore: 9.5, countries: ['USA', 'Canada', 'UK', 'Germany', 'Australia'], level: 'Postgraduate' },
  { name: 'MS Data Science', avgFeesUSD: 42000, durationYears: 2, jobGrowthPct: 36, avgSalaryAfterUSD: 105000, topCompanies: ['Amazon', 'Google', 'IBM', 'McKinsey', 'Deloitte'], prEligible: true, ieltsMin: 6.5, roiScore: 9.2, countries: ['USA', 'Canada', 'UK', 'Germany', 'Australia', 'Singapore'], level: 'Postgraduate' },
  { name: 'MS Artificial Intelligence', avgFeesUSD: 48000, durationYears: 2, jobGrowthPct: 40, avgSalaryAfterUSD: 120000, topCompanies: ['OpenAI', 'Google DeepMind', 'Microsoft', 'Meta AI', 'Tesla'], prEligible: true, ieltsMin: 6.5, roiScore: 9.7, countries: ['USA', 'Canada', 'UK', 'Germany'], level: 'Postgraduate' },
  { name: 'MBA', avgFeesUSD: 55000, durationYears: 2, jobGrowthPct: 14, avgSalaryAfterUSD: 95000, topCompanies: ['McKinsey', 'Bain', 'BCG', 'Goldman Sachs', 'JP Morgan'], prEligible: true, ieltsMin: 6.5, roiScore: 8.5, countries: ['USA', 'Canada', 'UK', 'Australia', 'Singapore'], level: 'Postgraduate' },
  { name: 'MS Finance', avgFeesUSD: 38000, durationYears: 1, jobGrowthPct: 17, avgSalaryAfterUSD: 88000, topCompanies: ['Goldman Sachs', 'Morgan Stanley', 'Bloomberg', 'HSBC', 'Barclays'], prEligible: true, ieltsMin: 6.5, roiScore: 8.3, countries: ['USA', 'UK', 'Canada', 'Singapore', 'Australia'], level: 'Postgraduate' },
  { name: 'MS Mechanical Engineering', avgFeesUSD: 35000, durationYears: 2, jobGrowthPct: 11, avgSalaryAfterUSD: 82000, topCompanies: ['Boeing', 'Tesla', 'GE', 'Siemens', 'Rolls-Royce'], prEligible: true, ieltsMin: 6.0, roiScore: 7.8, countries: ['USA', 'Canada', 'UK', 'Germany', 'Australia'], level: 'Postgraduate' },
  { name: 'MS Electrical Engineering', avgFeesUSD: 38000, durationYears: 2, jobGrowthPct: 19, avgSalaryAfterUSD: 98000, topCompanies: ['Intel', 'Qualcomm', 'Texas Instruments', 'Samsung', 'NVIDIA'], prEligible: true, ieltsMin: 6.0, roiScore: 8.7, countries: ['USA', 'Canada', 'UK', 'Germany'], level: 'Postgraduate' },
  { name: 'LLM', avgFeesUSD: 32000, durationYears: 1, jobGrowthPct: 9, avgSalaryAfterUSD: 75000, topCompanies: ['Clifford Chance', 'Linklaters', 'Baker McKenzie', 'Allen & Overy', 'Freshfields'], prEligible: false, ieltsMin: 7.0, roiScore: 7.2, countries: ['USA', 'UK', 'Australia'], level: 'Postgraduate' },
  { name: 'MS Public Health', avgFeesUSD: 30000, durationYears: 2, jobGrowthPct: 13, avgSalaryAfterUSD: 65000, topCompanies: ['WHO', 'CDC', 'NHS', 'Médecins Sans Frontières', 'UNICEF'], prEligible: true, ieltsMin: 6.5, roiScore: 7.5, countries: ['USA', 'UK', 'Canada', 'Australia'], level: 'Postgraduate' },
  { name: 'Bachelor of Computer Science', avgFeesUSD: 25000, durationYears: 4, jobGrowthPct: 25, avgSalaryAfterUSD: 75000, topCompanies: ['Google', 'Microsoft', 'Amazon', 'IBM', 'TCS'], prEligible: true, ieltsMin: 6.0, roiScore: 8.0, countries: ['USA', 'Canada', 'UK', 'Germany', 'Australia'], level: 'Undergraduate' },
];

export function calcCountryMatch(country: CountryData, profile: {
  ielts: number | null;
  budgetUSD: number;
  courseKeyword: string;
  level: string;
  gapYears: number;
}): number {
  let score = 60;

  // Budget fit
  const totalNeeded = country.avgTuitionUSD + country.avgLivingCostUSD;
  if (profile.budgetUSD >= totalNeeded * 1.2) score += 15;
  else if (profile.budgetUSD >= totalNeeded) score += 10;
  else if (profile.budgetUSD >= totalNeeded * 0.8) score += 5;
  else score -= 10;

  // IELTS
  if (profile.ielts !== null) {
    if (profile.ielts >= country.minIELTS + 0.5) score += 10;
    else if (profile.ielts >= country.minIELTS) score += 5;
    else score -= 10;
  }

  // Job market for course
  const keyword = profile.courseKeyword.toLowerCase();
  const jobRating = Object.entries(country.jobMarket).find(([k]) => keyword.includes(k))?.[1] ?? 'Moderate';
  if (jobRating === 'Excellent') score += 8;
  else if (jobRating === 'Good') score += 4;
  else if (jobRating === 'Low') score -= 5;

  // PR pathway bonus
  if (country.prPathway) score += 5;

  // Gap year penalty
  if (profile.gapYears >= 3) score -= 8;
  else if (profile.gapYears >= 2) score -= 4;

  return Math.min(99, Math.max(40, score));
}
