// Auto-generated — do not edit manually
// Source: data/scraped/canada/concordia.json

export interface ConcordiaCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualCAD: number; annualUSD: number; annualINR: number; totalCAD: number;
  livingCostCAD: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; province: string; city: string; countryCode: string;
  pgwp: boolean;
}

export const concordiaCourses = [
  {
    "id": "concordia-2",
    "name": "MBA — John Molson School of Business",
    "slug": "concordia-mba-john-molson",
    "url": "https://www.concordia.ca/jmsb",
    "level": "Masters",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualCAD": 18000,
    "annualUSD": 13140,
    "annualINR": 1098000,
    "totalCAD": 36000,
    "livingCostCAD": 16500,
    "livingCostUSD": 12045,
    "livingCostINR": 1006500,
    "ieltsMin": 6.5,
    "toeflMin": 86,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Sir George Williams Campus",
    "country": "Canada",
    "province": "Quebec",
    "city": "Montreal",
    "countryCode": "CA",
    "pgwp": true
  },
  {
    "id": "concordia-5",
    "name": "MSc Finance — John Molson",
    "slug": "concordia-msc-finance",
    "url": "https://www.concordia.ca/jmsb",
    "level": "Masters",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualCAD": 22000,
    "annualUSD": 16060,
    "annualINR": 1342000,
    "totalCAD": 22000,
    "livingCostCAD": 16500,
    "livingCostUSD": 12045,
    "livingCostINR": 1006500,
    "ieltsMin": 6.5,
    "toeflMin": 86,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Sir George Williams Campus",
    "country": "Canada",
    "province": "Quebec",
    "city": "Montreal",
    "countryCode": "CA",
    "pgwp": true
  },
  {
    "id": "concordia-10",
    "name": "Graduate Certificate in Business Administration",
    "slug": "concordia-grad-cert-business-administration",
    "url": "https://www.concordia.ca/jmsb",
    "level": "Graduate Certificate",
    "studyLevel": "Graduate Certificate",
    "duration": "8 months",
    "durationYears": 1,
    "annualCAD": 10000,
    "annualUSD": 7300,
    "annualINR": 610000,
    "totalCAD": 10000,
    "livingCostCAD": 16500,
    "livingCostUSD": 12045,
    "livingCostINR": 1006500,
    "ieltsMin": 6.5,
    "toeflMin": 86,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January",
      "Summer"
    ],
    "campus": "Sir George Williams Campus",
    "country": "Canada",
    "province": "Quebec",
    "city": "Montreal",
    "countryCode": "CA",
    "pgwp": true
  },
  {
    "id": "concordia-11",
    "name": "MSc Supply Chain Operations Management",
    "slug": "concordia-msc-supply-chain-operations-management",
    "url": "https://www.concordia.ca/jmsb",
    "level": "Masters",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualCAD": 14500,
    "annualUSD": 10585,
    "annualINR": 884500,
    "totalCAD": 14500,
    "livingCostCAD": 16500,
    "livingCostUSD": 12045,
    "livingCostINR": 1006500,
    "ieltsMin": 6.5,
    "toeflMin": 86,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Sir George Williams Campus",
    "country": "Canada",
    "province": "Quebec",
    "city": "Montreal",
    "countryCode": "CA",
    "pgwp": true
  },
  {
    "id": "concordia-14",
    "name": "Bachelor of Commerce",
    "slug": "concordia-bcom",
    "url": "https://www.concordia.ca/jmsb",
    "level": "Undergraduate",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualCAD": 14000,
    "annualUSD": 10220,
    "annualINR": 854000,
    "totalCAD": 42000,
    "livingCostCAD": 16500,
    "livingCostUSD": 12045,
    "livingCostINR": 1006500,
    "ieltsMin": 6.5,
    "toeflMin": 86,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Sir George Williams Campus",
    "country": "Canada",
    "province": "Quebec",
    "city": "Montreal",
    "countryCode": "CA",
    "pgwp": true
  }
] as const;

export function getConcordiaCoursesBySlug(slug: string) {
  return (concordiaCourses as unknown as any[]).find((c: any) => c.slug === slug) ?? null;
}
