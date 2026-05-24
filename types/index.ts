export interface Scholarship {
  name: string;
  amount: string;
  eligibility: string;
}

export interface Requirements {
  ieltsMin: number;
  toeflMin: number;
  greMin?: number;
  gmatMin?: number;
  gpaMin: number;
  backlogs: number;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  country: string;
  state: string;
  city: string;
  qsRanking?: number;
  theRanking?: number;
  annualTuitionUSD: number;
  annualTuitionINR: number;
  livingCostUSD: number;
  livingCostINR: number;
  intakeMonths: string[];
  visaApprovalRate: number;
  acceptanceRate: number;
  popularCourses: string[];
  scholarships: Scholarship[];
  requirements: Requirements;
  employmentRate: number;
  avgSalaryUSD: number;
  avgSalaryINR: number;
  establishedYear: number;
  totalStudents: number;
  internationalStudentPercent: number;
  campusType: 'Urban' | 'Suburban' | 'Rural';
  description: string;
  highlights: string[];
  popularAmongIndians: boolean;
  applicationFeeUSD: number;
  feeHistory: { year: number; tuitionUSD: number }[];
  rankingHistory: { year: number; rank: number }[];
  topEmployers: string[];
  countryCode: string;
}

export interface ROIData {
  avgSalaryYear1INR: number;
  avgSalaryYear5INR: number;
  paybackPeriodYears: number;
  jobGrowthRate: number;
}

export interface Eligibility {
  minGPA: number;
  minIELTS: number;
  minTOEFL: number;
  minGRE?: number;
  minGMAT?: number;
  workExperienceYears: number;
  backlogs: number;
}

export interface Course {
  id: string;
  name: string;
  slug: string;
  category: string;
  duration: string;
  durationMonths: number;
  level: 'Undergraduate' | 'Postgraduate' | 'Doctoral' | 'Certificate';
  eligibility: Eligibility;
  avgFeesUSD: number;
  avgFeesINR: number;
  roi: ROIData;
  topUniversitySlugs: string[];
  careerOutcomes: string[];
  avgSalaryINR: number;
  avgSalaryUSD: number;
  description: string;
  syllabus: string[];
  countriesOffered: string[];
  demandLevel: 'High' | 'Very High' | 'Moderate';
  salaryByCountry: { country: string; avgSalaryUSD: number }[];
  jobRoles: { role: string; percentage: number }[];
  highlights: string[];
  tags: string[];
}

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  targetCountry: string;
  interestedCourse: string;
  budget: string;
  ieltsScore: string;
  greScore: string;
  message: string;
  source: string;
  timestamp: string;
}

export type CourseCategory =
  | 'Engineering & Technology'
  | 'Business & Management'
  | 'Healthcare & Medicine'
  | 'Law & Social Sciences'
  | 'Arts & Design'
  | 'Science & Research'
  | 'PhD & Research'
  | 'Undergraduate';
