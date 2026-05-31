// Auto-generated — do not edit manually
// University: Copenhagen Business Academy

export interface EaBusinessAcademyCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualDKK: number; annualUSD: number; annualINR: number; totalDKK: number;
  livingCostDKK: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
}

export const eaBusinessAcademyCourses: EaBusinessAcademyCourse[] = [
  {
    id: 'eabusine-c001', name: 'BSc Financial Management', slug: 'bsc-financial-management', url: 'https://www.cphbusiness.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 60000, annualUSD: 8580, annualINR: 708000, totalDKK: 240000,
    livingCostDKK: 110000, livingCostUSD: 15730, livingCostINR: 1298000,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Copenhagen',
    country: 'Denmark', state: 'Capital Region', city: 'Copenhagen', countryCode: 'DK',
  },
  {
    id: 'eabusine-c002', name: 'BSc Marketing Management', slug: 'bsc-marketing-management', url: 'https://www.cphbusiness.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 60000, annualUSD: 8580, annualINR: 708000, totalDKK: 240000,
    livingCostDKK: 110000, livingCostUSD: 15730, livingCostINR: 1298000,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Copenhagen',
    country: 'Denmark', state: 'Capital Region', city: 'Copenhagen', countryCode: 'DK',
  },
  {
    id: 'eabusine-c003', name: 'BSc IT Technology', slug: 'bsc-it-technology', url: 'https://www.cphbusiness.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 60000, annualUSD: 8580, annualINR: 708000, totalDKK: 240000,
    livingCostDKK: 110000, livingCostUSD: 15730, livingCostINR: 1298000,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Copenhagen',
    country: 'Denmark', state: 'Capital Region', city: 'Copenhagen', countryCode: 'DK',
  },
  {
    id: 'eabusine-c004', name: 'BSc Logistics', slug: 'bsc-logistics', url: 'https://www.cphbusiness.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 60000, annualUSD: 8580, annualINR: 708000, totalDKK: 240000,
    livingCostDKK: 110000, livingCostUSD: 15730, livingCostINR: 1298000,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Copenhagen',
    country: 'Denmark', state: 'Capital Region', city: 'Copenhagen', countryCode: 'DK',
  },
  {
    id: 'eabusine-c005', name: 'BSc International Sales', slug: 'bsc-international-sales', url: 'https://www.cphbusiness.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 60000, annualUSD: 8580, annualINR: 708000, totalDKK: 240000,
    livingCostDKK: 110000, livingCostUSD: 15730, livingCostINR: 1298000,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Copenhagen',
    country: 'Denmark', state: 'Capital Region', city: 'Copenhagen', countryCode: 'DK',
  },
  {
    id: 'eabusine-c006', name: 'BSc Multimedia Design', slug: 'bsc-multimedia-design', url: 'https://www.cphbusiness.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 60000, annualUSD: 8580, annualINR: 708000, totalDKK: 240000,
    livingCostDKK: 110000, livingCostUSD: 15730, livingCostINR: 1298000,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Copenhagen',
    country: 'Denmark', state: 'Capital Region', city: 'Copenhagen', countryCode: 'DK',
  },
  {
    id: 'eabusine-c007', name: 'BSc Financial Controller', slug: 'bsc-financial-controller', url: 'https://www.cphbusiness.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 60000, annualUSD: 8580, annualINR: 708000, totalDKK: 240000,
    livingCostDKK: 110000, livingCostUSD: 15730, livingCostINR: 1298000,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Copenhagen',
    country: 'Denmark', state: 'Capital Region', city: 'Copenhagen', countryCode: 'DK',
  }
];

export function getEaBusinessAcademyCourseBySlug(slug: string) {
  return eaBusinessAcademyCourses.find(c => c.slug === slug);
}
