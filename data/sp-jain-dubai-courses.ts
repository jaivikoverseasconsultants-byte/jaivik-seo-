// Auto-generated — do not edit manually
// University: S P Jain School of Global Management

export interface SpJainDubaiCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualAED: number; annualUSD: number; annualINR: number; totalAED: number;
  livingCostAED: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
}

export const spJainDubaiCourses: SpJainDubaiCourse[] = [
  {
    id: 'spjaindu-c001', name: 'BBA Global Management', slug: 'bba-global-management', url: 'https://www.spjain.org',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualAED: 120000, annualUSD: 32640, annualINR: 2724000, totalAED: 480000,
    livingCostAED: 65000, livingCostUSD: 17680, livingCostINR: 1475500,
    ieltsMin: 6.5, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","January"], campus: 'Dubai',
    country: 'United Arab Emirates', state: 'Dubai', city: 'Dubai', countryCode: 'AE',
  },
  {
    id: 'spjaindu-c002', name: 'MBA', slug: 'mba', url: 'https://www.spjain.org',
    level: 'Master', studyLevel: 'Master', duration: '1 year', durationYears: 1,
    annualAED: 120000, annualUSD: 32640, annualINR: 2724000, totalAED: 120000,
    livingCostAED: 65000, livingCostUSD: 17680, livingCostINR: 1475500,
    ieltsMin: 6.5, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","January"], campus: 'Dubai',
    country: 'United Arab Emirates', state: 'Dubai', city: 'Dubai', countryCode: 'AE',
  },
  {
    id: 'spjaindu-c003', name: 'Executive MBA', slug: 'executive-mba', url: 'https://www.spjain.org',
    level: 'Master', studyLevel: 'Master', duration: '1 year', durationYears: 1,
    annualAED: 120000, annualUSD: 32640, annualINR: 2724000, totalAED: 120000,
    livingCostAED: 65000, livingCostUSD: 17680, livingCostINR: 1475500,
    ieltsMin: 6.5, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","January"], campus: 'Dubai',
    country: 'United Arab Emirates', state: 'Dubai', city: 'Dubai', countryCode: 'AE',
  },
  {
    id: 'spjaindu-c004', name: 'Global MBA', slug: 'global-mba', url: 'https://www.spjain.org',
    level: 'Master', studyLevel: 'Master', duration: '1 year', durationYears: 1,
    annualAED: 120000, annualUSD: 32640, annualINR: 2724000, totalAED: 120000,
    livingCostAED: 65000, livingCostUSD: 17680, livingCostINR: 1475500,
    ieltsMin: 6.5, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","January"], campus: 'Dubai',
    country: 'United Arab Emirates', state: 'Dubai', city: 'Dubai', countryCode: 'AE',
  },
  {
    id: 'spjaindu-c005', name: 'Master in Global Business', slug: 'master-in-global-business', url: 'https://www.spjain.org',
    level: 'Master', studyLevel: 'Master', duration: '1 year', durationYears: 1,
    annualAED: 120000, annualUSD: 32640, annualINR: 2724000, totalAED: 120000,
    livingCostAED: 65000, livingCostUSD: 17680, livingCostINR: 1475500,
    ieltsMin: 6.5, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","January"], campus: 'Dubai',
    country: 'United Arab Emirates', state: 'Dubai', city: 'Dubai', countryCode: 'AE',
  }
];

export function getSpJainDubaiCourseBySlug(slug: string) {
  return spJainDubaiCourses.find(c => c.slug === slug);
}
