// Auto-generated — do not edit manually
// University: Dania Academy

export interface DaniaAcademyCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualDKK: number; annualUSD: number; annualINR: number; totalDKK: number;
  livingCostDKK: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
}

export const daniaAcademyCourses: DaniaAcademyCourse[] = [
  {
    id: 'daniaaca-c001', name: 'BSc Business Administration', slug: 'bsc-business-administration', url: 'https://www.dania.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 55000, annualUSD: 7865, annualINR: 649000, totalDKK: 220000,
    livingCostDKK: 88000, livingCostUSD: 12584, livingCostINR: 1038400,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Silkeborg',
    country: 'Denmark', state: 'Central Denmark', city: 'Silkeborg', countryCode: 'DK',
  },
  {
    id: 'daniaaca-c002', name: 'BSc Marketing Management', slug: 'bsc-marketing-management', url: 'https://www.dania.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 55000, annualUSD: 7865, annualINR: 649000, totalDKK: 220000,
    livingCostDKK: 88000, livingCostUSD: 12584, livingCostINR: 1038400,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Silkeborg',
    country: 'Denmark', state: 'Central Denmark', city: 'Silkeborg', countryCode: 'DK',
  },
  {
    id: 'daniaaca-c003', name: 'BSc Sports Management', slug: 'bsc-sports-management', url: 'https://www.dania.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 55000, annualUSD: 7865, annualINR: 649000, totalDKK: 220000,
    livingCostDKK: 88000, livingCostUSD: 12584, livingCostINR: 1038400,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Silkeborg',
    country: 'Denmark', state: 'Central Denmark', city: 'Silkeborg', countryCode: 'DK',
  },
  {
    id: 'daniaaca-c004', name: 'BSc Music Management', slug: 'bsc-music-management', url: 'https://www.dania.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 55000, annualUSD: 7865, annualINR: 649000, totalDKK: 220000,
    livingCostDKK: 88000, livingCostUSD: 12584, livingCostINR: 1038400,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Silkeborg',
    country: 'Denmark', state: 'Central Denmark', city: 'Silkeborg', countryCode: 'DK',
  },
  {
    id: 'daniaaca-c005', name: 'BSc Financial Controller', slug: 'bsc-financial-controller', url: 'https://www.dania.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 55000, annualUSD: 7865, annualINR: 649000, totalDKK: 220000,
    livingCostDKK: 88000, livingCostUSD: 12584, livingCostINR: 1038400,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Silkeborg',
    country: 'Denmark', state: 'Central Denmark', city: 'Silkeborg', countryCode: 'DK',
  },
  {
    id: 'daniaaca-c006', name: 'BSc International Marketing', slug: 'bsc-international-marketing', url: 'https://www.dania.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 55000, annualUSD: 7865, annualINR: 649000, totalDKK: 220000,
    livingCostDKK: 88000, livingCostUSD: 12584, livingCostINR: 1038400,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Silkeborg',
    country: 'Denmark', state: 'Central Denmark', city: 'Silkeborg', countryCode: 'DK',
  }
];

export function getDaniaAcademyCourseBySlug(slug: string) {
  return daniaAcademyCourses.find(c => c.slug === slug);
}
