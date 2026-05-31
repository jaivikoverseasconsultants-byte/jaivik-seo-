// Auto-generated — do not edit manually
// University: Zealand Institute of Business and Technology

export interface ZealandBusinessTechnologyCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualDKK: number; annualUSD: number; annualINR: number; totalDKK: number;
  livingCostDKK: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
}

export const zealandBusinessTechnologyCourses: ZealandBusinessTechnologyCourse[] = [
  {
    id: 'zealandb-c001', name: 'BSc Business Administration', slug: 'bsc-business-administration', url: 'https://www.zealand.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 58000, annualUSD: 8294, annualINR: 684400, totalDKK: 232000,
    livingCostDKK: 95000, livingCostUSD: 13585, livingCostINR: 1121000,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Roskilde',
    country: 'Denmark', state: 'Zealand', city: 'Roskilde', countryCode: 'DK',
  },
  {
    id: 'zealandb-c002', name: 'BSc IT Technology', slug: 'bsc-it-technology', url: 'https://www.zealand.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 58000, annualUSD: 8294, annualINR: 684400, totalDKK: 232000,
    livingCostDKK: 95000, livingCostUSD: 13585, livingCostINR: 1121000,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Roskilde',
    country: 'Denmark', state: 'Zealand', city: 'Roskilde', countryCode: 'DK',
  },
  {
    id: 'zealandb-c003', name: 'BSc Financial Controller', slug: 'bsc-financial-controller', url: 'https://www.zealand.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 58000, annualUSD: 8294, annualINR: 684400, totalDKK: 232000,
    livingCostDKK: 95000, livingCostUSD: 13585, livingCostINR: 1121000,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Roskilde',
    country: 'Denmark', state: 'Zealand', city: 'Roskilde', countryCode: 'DK',
  },
  {
    id: 'zealandb-c004', name: 'BSc Marketing Management', slug: 'bsc-marketing-management', url: 'https://www.zealand.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 58000, annualUSD: 8294, annualINR: 684400, totalDKK: 232000,
    livingCostDKK: 95000, livingCostUSD: 13585, livingCostINR: 1121000,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Roskilde',
    country: 'Denmark', state: 'Zealand', city: 'Roskilde', countryCode: 'DK',
  },
  {
    id: 'zealandb-c005', name: 'BSc Logistics', slug: 'bsc-logistics', url: 'https://www.zealand.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 58000, annualUSD: 8294, annualINR: 684400, totalDKK: 232000,
    livingCostDKK: 95000, livingCostUSD: 13585, livingCostINR: 1121000,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Roskilde',
    country: 'Denmark', state: 'Zealand', city: 'Roskilde', countryCode: 'DK',
  },
  {
    id: 'zealandb-c006', name: 'BSc Software Development', slug: 'bsc-software-development', url: 'https://www.zealand.dk',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '4 years', durationYears: 4,
    annualDKK: 58000, annualUSD: 8294, annualINR: 684400, totalDKK: 232000,
    livingCostDKK: 95000, livingCostUSD: 13585, livingCostINR: 1121000,
    ieltsMin: 6, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","February"], campus: 'Roskilde',
    country: 'Denmark', state: 'Zealand', city: 'Roskilde', countryCode: 'DK',
  }
];

export function getZealandBusinessTechnologyCourseBySlug(slug: string) {
  return zealandBusinessTechnologyCourses.find(c => c.slug === slug);
}
