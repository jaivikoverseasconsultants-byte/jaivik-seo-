// Auto-generated — do not edit manually
// University: IBA International Business Academy

export interface IbaKoldingCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualDKK: number; annualUSD: number; annualINR: number; totalDKK: number;
  livingCostDKK: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
}

export const ibaKoldingCourses: IbaKoldingCourse[] = [
  {
    id: 'ibakoldi-c001', name: 'BSc International Business', slug: 'bsc-international-business', url: 'https://www.iba.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 58000, annualUSD: 8294, annualINR: 684400, totalDKK: 232000,
    livingCostDKK: 88000, livingCostUSD: 12584, livingCostINR: 1038400,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Kolding',
    country: 'Denmark', state: 'Southern Denmark', city: 'Kolding', countryCode: 'DK',
  },
  {
    id: 'ibakoldi-c002', name: 'BSc Marketing Management', slug: 'bsc-marketing-management', url: 'https://www.iba.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 58000, annualUSD: 8294, annualINR: 684400, totalDKK: 232000,
    livingCostDKK: 88000, livingCostUSD: 12584, livingCostINR: 1038400,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Kolding',
    country: 'Denmark', state: 'Southern Denmark', city: 'Kolding', countryCode: 'DK',
  },
  {
    id: 'ibakoldi-c003', name: 'BSc Digital Marketing', slug: 'bsc-digital-marketing', url: 'https://www.iba.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 58000, annualUSD: 8294, annualINR: 684400, totalDKK: 232000,
    livingCostDKK: 88000, livingCostUSD: 12584, livingCostINR: 1038400,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Kolding',
    country: 'Denmark', state: 'Southern Denmark', city: 'Kolding', countryCode: 'DK',
  },
  {
    id: 'ibakoldi-c004', name: 'BSc Innovation Management', slug: 'bsc-innovation-management', url: 'https://www.iba.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 58000, annualUSD: 8294, annualINR: 684400, totalDKK: 232000,
    livingCostDKK: 88000, livingCostUSD: 12584, livingCostINR: 1038400,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Kolding',
    country: 'Denmark', state: 'Southern Denmark', city: 'Kolding', countryCode: 'DK',
  },
  {
    id: 'ibakoldi-c005', name: 'BSc Financial Management', slug: 'bsc-financial-management', url: 'https://www.iba.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 58000, annualUSD: 8294, annualINR: 684400, totalDKK: 232000,
    livingCostDKK: 88000, livingCostUSD: 12584, livingCostINR: 1038400,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Kolding',
    country: 'Denmark', state: 'Southern Denmark', city: 'Kolding', countryCode: 'DK',
  },
  {
    id: 'ibakoldi-c006', name: 'BSc Logistics Management', slug: 'bsc-logistics-management', url: 'https://www.iba.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 58000, annualUSD: 8294, annualINR: 684400, totalDKK: 232000,
    livingCostDKK: 88000, livingCostUSD: 12584, livingCostINR: 1038400,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Kolding',
    country: 'Denmark', state: 'Southern Denmark', city: 'Kolding', countryCode: 'DK',
  }
];

export function getIbaKoldingCourseBySlug(slug: string) {
  return ibaKoldingCourses.find(c => c.slug === slug);
}
