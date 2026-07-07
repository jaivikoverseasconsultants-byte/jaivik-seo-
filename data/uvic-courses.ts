// Auto-generated — do not edit manually
// Source: data/scraped/canada/uvic.json

export interface UvicCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualCAD: number; annualUSD: number; annualINR: number; totalCAD: number;
  livingCostCAD: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; province: string; city: string; countryCode: string;
  pgwp: boolean;
}

export const uvicCourses = [
  {
    "id": "uvic-2",
    "name": "MBA — Gustavson School of Business",
    "slug": "uvic-mba-gustavson",
    "url": "https://www.uvic.ca/gustavson",
    "level": "Masters",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualCAD": 25000,
    "annualUSD": 18250,
    "annualINR": 1525000,
    "totalCAD": 50000,
    "livingCostCAD": 19000,
    "livingCostUSD": 13870,
    "livingCostINR": 1159000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Ring Road Campus",
    "country": "Canada",
    "province": "British Columbia",
    "city": "Victoria",
    "countryCode": "CA",
    "pgwp": true
  },
  {
    "id": "uvic-6",
    "name": "LLM Faculty of Law",
    "slug": "uvic-llm-faculty-of-law",
    "url": "https://www.uvic.ca/law",
    "level": "Masters",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualCAD": 18000,
    "annualUSD": 13140,
    "annualINR": 1098000,
    "totalCAD": 18000,
    "livingCostCAD": 19000,
    "livingCostUSD": 13870,
    "livingCostINR": 1159000,
    "ieltsMin": 7,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Ring Road Campus",
    "country": "Canada",
    "province": "British Columbia",
    "city": "Victoria",
    "countryCode": "CA",
    "pgwp": true
  },
  {
    "id": "uvic-10",
    "name": "Graduate Certificate in Business Administration",
    "slug": "uvic-grad-cert-business-administration",
    "url": "https://www.uvic.ca/gustavson",
    "level": "Graduate Certificate",
    "studyLevel": "Graduate Certificate",
    "duration": "8 months",
    "durationYears": 1,
    "annualCAD": 11000,
    "annualUSD": 8030,
    "annualINR": 671000,
    "totalCAD": 11000,
    "livingCostCAD": 19000,
    "livingCostUSD": 13870,
    "livingCostINR": 1159000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Ring Road Campus",
    "country": "Canada",
    "province": "British Columbia",
    "city": "Victoria",
    "countryCode": "CA",
    "pgwp": true
  },
  {
    "id": "uvic-14",
    "name": "Bachelor of Commerce",
    "slug": "uvic-bcom",
    "url": "https://www.uvic.ca/gustavson",
    "level": "Undergraduate",
    "studyLevel": "Undergraduate",
    "duration": "4 years",
    "durationYears": 4,
    "annualCAD": 17500,
    "annualUSD": 12775,
    "annualINR": 1067500,
    "totalCAD": 70000,
    "livingCostCAD": 19000,
    "livingCostUSD": 13870,
    "livingCostINR": 1159000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Ring Road Campus",
    "country": "Canada",
    "province": "British Columbia",
    "city": "Victoria",
    "countryCode": "CA",
    "pgwp": true
  }
] as const;

export function getUvicCoursesBySlug(slug: string) {
  return (uvicCourses as unknown as any[]).find((c: any) => c.slug === slug) ?? null;
}
