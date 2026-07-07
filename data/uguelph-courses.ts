// Auto-generated — do not edit manually
// Source: data/scraped/canada/uguelph.json

export interface UguelphCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualCAD: number; annualUSD: number; annualINR: number; totalCAD: number;
  livingCostCAD: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; province: string; city: string; countryCode: string;
  pgwp: boolean;
}

export const uguelphCourses = [
  {
    "id": "uguelph-2",
    "name": "MBA — Gordon S. Lang School of Business",
    "slug": "uguelph-mba-lang",
    "url": "https://www.uoguelph.ca/lang",
    "level": "Masters",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualCAD": 26000,
    "annualUSD": 18980,
    "annualINR": 1586000,
    "totalCAD": 26000,
    "livingCostCAD": 16500,
    "livingCostUSD": 12045,
    "livingCostINR": 1006500,
    "ieltsMin": 6.5,
    "toeflMin": 89,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Main Campus",
    "country": "Canada",
    "province": "Ontario",
    "city": "Guelph",
    "countryCode": "CA",
    "pgwp": true
  },
  {
    "id": "uguelph-10",
    "name": "Graduate Certificate in Business Administration",
    "slug": "uguelph-grad-cert-business-administration",
    "url": "https://www.uoguelph.ca/lang",
    "level": "Graduate Certificate",
    "studyLevel": "Graduate Certificate",
    "duration": "8 months",
    "durationYears": 1,
    "annualCAD": 14000,
    "annualUSD": 10220,
    "annualINR": 854000,
    "totalCAD": 14000,
    "livingCostCAD": 16500,
    "livingCostUSD": 12045,
    "livingCostINR": 1006500,
    "ieltsMin": 6.5,
    "toeflMin": 89,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Main Campus",
    "country": "Canada",
    "province": "Ontario",
    "city": "Guelph",
    "countryCode": "CA",
    "pgwp": true
  },
  {
    "id": "uguelph-14",
    "name": "Bachelor of Commerce",
    "slug": "uguelph-bcom",
    "url": "https://www.uoguelph.ca/lang",
    "level": "Undergraduate",
    "studyLevel": "Undergraduate",
    "duration": "4 years",
    "durationYears": 4,
    "annualCAD": 20000,
    "annualUSD": 14600,
    "annualINR": 1220000,
    "totalCAD": 80000,
    "livingCostCAD": 16500,
    "livingCostUSD": 12045,
    "livingCostINR": 1006500,
    "ieltsMin": 6.5,
    "toeflMin": 89,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Main Campus",
    "country": "Canada",
    "province": "Ontario",
    "city": "Guelph",
    "countryCode": "CA",
    "pgwp": true
  }
] as const;

export function getUguelphCoursesBySlug(slug: string) {
  return (uguelphCourses as unknown as any[]).find((c: any) => c.slug === slug) ?? null;
}
