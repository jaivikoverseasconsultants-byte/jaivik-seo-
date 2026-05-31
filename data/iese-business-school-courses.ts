// Auto-generated — do not edit manually
// University: IESE Business School

export interface IeseBusinessSchoolCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualEUR: number; annualUSD: number; annualINR: number; totalEUR: number;
  livingCostEUR: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
}

export const ieseBusinessSchoolCourses: IeseBusinessSchoolCourse[] = [
  {
    id: 'iesebusi-c001', name: 'MBA', slug: 'mba', url: 'https://www.iese.edu',
    level: 'Master', studyLevel: 'Master', duration: '1 year', durationYears: 1,
    annualEUR: 95000, annualUSD: 101650, annualINR: 8360000, totalEUR: 95000,
    livingCostEUR: 13000, livingCostUSD: 13910, livingCostINR: 1144000,
    ieltsMin: 7, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","January"], campus: 'Barcelona',
    country: 'Spain', state: 'Catalonia', city: 'Barcelona', countryCode: 'ES',
  },
  {
    id: 'iesebusi-c002', name: 'Executive MBA', slug: 'executive-mba', url: 'https://www.iese.edu',
    level: 'Master', studyLevel: 'Master', duration: '1 year', durationYears: 1,
    annualEUR: 95000, annualUSD: 101650, annualINR: 8360000, totalEUR: 95000,
    livingCostEUR: 13000, livingCostUSD: 13910, livingCostINR: 1144000,
    ieltsMin: 7, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","January"], campus: 'Barcelona',
    country: 'Spain', state: 'Catalonia', city: 'Barcelona', countryCode: 'ES',
  },
  {
    id: 'iesebusi-c003', name: 'Advanced Management Program', slug: 'advanced-management-program', url: 'https://www.iese.edu',
    level: 'Master', studyLevel: 'Master', duration: '1 year', durationYears: 1,
    annualEUR: 95000, annualUSD: 101650, annualINR: 8360000, totalEUR: 95000,
    livingCostEUR: 13000, livingCostUSD: 13910, livingCostINR: 1144000,
    ieltsMin: 7, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","January"], campus: 'Barcelona',
    country: 'Spain', state: 'Catalonia', city: 'Barcelona', countryCode: 'ES',
  },
  {
    id: 'iesebusi-c004', name: 'Global CEO Program', slug: 'global-ceo-program', url: 'https://www.iese.edu',
    level: 'Master', studyLevel: 'Master', duration: '1 year', durationYears: 1,
    annualEUR: 95000, annualUSD: 101650, annualINR: 8360000, totalEUR: 95000,
    livingCostEUR: 13000, livingCostUSD: 13910, livingCostINR: 1144000,
    ieltsMin: 7, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","January"], campus: 'Barcelona',
    country: 'Spain', state: 'Catalonia', city: 'Barcelona', countryCode: 'ES',
  },
  {
    id: 'iesebusi-c005', name: 'Finance for Senior Executives', slug: 'finance-for-senior-executives', url: 'https://www.iese.edu',
    level: 'Master', studyLevel: 'Master', duration: '1 year', durationYears: 1,
    annualEUR: 95000, annualUSD: 101650, annualINR: 8360000, totalEUR: 95000,
    livingCostEUR: 13000, livingCostUSD: 13910, livingCostINR: 1144000,
    ieltsMin: 7, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","January"], campus: 'Barcelona',
    country: 'Spain', state: 'Catalonia', city: 'Barcelona', countryCode: 'ES',
  },
  {
    id: 'iesebusi-c006', name: 'MSc Finance', slug: 'msc-finance', url: 'https://www.iese.edu',
    level: 'Master', studyLevel: 'Master', duration: '1 year', durationYears: 1,
    annualEUR: 95000, annualUSD: 101650, annualINR: 8360000, totalEUR: 95000,
    livingCostEUR: 13000, livingCostUSD: 13910, livingCostINR: 1144000,
    ieltsMin: 7, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","January"], campus: 'Barcelona',
    country: 'Spain', state: 'Catalonia', city: 'Barcelona', countryCode: 'ES',
  },
  {
    id: 'iesebusi-c007', name: 'Entrepreneurship Program', slug: 'entrepreneurship-program', url: 'https://www.iese.edu',
    level: 'Master', studyLevel: 'Master', duration: '1 year', durationYears: 1,
    annualEUR: 95000, annualUSD: 101650, annualINR: 8360000, totalEUR: 95000,
    livingCostEUR: 13000, livingCostUSD: 13910, livingCostINR: 1144000,
    ieltsMin: 7, toeflMin: 90, pteMin: 65,
    intakeMonths: ["September","January"], campus: 'Barcelona',
    country: 'Spain', state: 'Catalonia', city: 'Barcelona', countryCode: 'ES',
  }
];

export function getIeseBusinessSchoolCourseBySlug(slug: string) {
  return ieseBusinessSchoolCourses.find(c => c.slug === slug);
}
