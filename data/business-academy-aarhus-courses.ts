// Auto-generated — do not edit manually
// University: Business Academy Aarhus

export interface BusinessAcademyAarhusCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualDKK: number; annualUSD: number; annualINR: number; totalDKK: number;
  livingCostDKK: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
}

export const businessAcademyAarhusCourses: BusinessAcademyAarhusCourse[] = [
  {
    id: 'business-c001', name: 'BSc Business Administration', slug: 'bsc-business-administration', url: 'https://www.baaa.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 60000, annualUSD: 8580, annualINR: 708000, totalDKK: 240000,
    livingCostDKK: 100000, livingCostUSD: 14300, livingCostINR: 1180000,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Aarhus',
    country: 'Denmark', state: 'Central Denmark', city: 'Aarhus', countryCode: 'DK',
  },
  {
    id: 'business-c002', name: 'BSc Marketing Management', slug: 'bsc-marketing-management', url: 'https://www.baaa.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 60000, annualUSD: 8580, annualINR: 708000, totalDKK: 240000,
    livingCostDKK: 100000, livingCostUSD: 14300, livingCostINR: 1180000,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Aarhus',
    country: 'Denmark', state: 'Central Denmark', city: 'Aarhus', countryCode: 'DK',
  },
  {
    id: 'business-c003', name: 'BSc Financial Controller', slug: 'bsc-financial-controller', url: 'https://www.baaa.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 60000, annualUSD: 8580, annualINR: 708000, totalDKK: 240000,
    livingCostDKK: 100000, livingCostUSD: 14300, livingCostINR: 1180000,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Aarhus',
    country: 'Denmark', state: 'Central Denmark', city: 'Aarhus', countryCode: 'DK',
  },
  {
    id: 'business-c004', name: 'BSc IT Technology', slug: 'bsc-it-technology', url: 'https://www.baaa.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 60000, annualUSD: 8580, annualINR: 708000, totalDKK: 240000,
    livingCostDKK: 100000, livingCostUSD: 14300, livingCostINR: 1180000,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Aarhus',
    country: 'Denmark', state: 'Central Denmark', city: 'Aarhus', countryCode: 'DK',
  },
  {
    id: 'business-c005', name: 'BSc Logistics Management', slug: 'bsc-logistics-management', url: 'https://www.baaa.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 60000, annualUSD: 8580, annualINR: 708000, totalDKK: 240000,
    livingCostDKK: 100000, livingCostUSD: 14300, livingCostINR: 1180000,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Aarhus',
    country: 'Denmark', state: 'Central Denmark', city: 'Aarhus', countryCode: 'DK',
  },
  {
    id: 'business-c006', name: 'BSc International Sales & Marketing', slug: 'bsc-international-sales-marketing', url: 'https://www.baaa.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 60000, annualUSD: 8580, annualINR: 708000, totalDKK: 240000,
    livingCostDKK: 100000, livingCostUSD: 14300, livingCostINR: 1180000,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Aarhus',
    country: 'Denmark', state: 'Central Denmark', city: 'Aarhus', countryCode: 'DK',
  },
  {
    id: 'business-c007', name: 'BSc Multimedia Design', slug: 'bsc-multimedia-design', url: 'https://www.baaa.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 60000, annualUSD: 8580, annualINR: 708000, totalDKK: 240000,
    livingCostDKK: 100000, livingCostUSD: 14300, livingCostINR: 1180000,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Aarhus',
    country: 'Denmark', state: 'Central Denmark', city: 'Aarhus', countryCode: 'DK',
  }
];

export function getBusinessAcademyAarhusCourseBySlug(slug: string) {
  return businessAcademyAarhusCourses.find(c => c.slug === slug);
}
