// Auto-generated — do not edit manually
// Source: data/scraped/australia/swinburne.json

export interface SwinburneCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualAUD: number; annualUSD: number; annualINR: number; totalAUD: number;
  livingCostAUD: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
}

export const swinburneCourses = [
  {
    "id": "swinburne-1",
    "name": "Student visas",
    "slug": "swinburne-",
    "url": "https://www.swinburne.edu.au/courses/visas/",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "18 years",
    "durationYears": 18,
    "annualAUD": 32000,
    "annualUSD": 20800,
    "annualINR": 1747200,
    "totalAUD": 576000,
    "livingCostAUD": 21000,
    "livingCostUSD": 13650,
    "livingCostINR": 1146600,
    "ieltsMin": 6.5,
    "toeflMin": 79,
    "pteMin": 58,
    "intakeMonths": [
      "February",
      "July"
    ],
    "campus": "Hawthorn Campus",
    "country": "Australia",
    "state": "Victoria",
    "city": "Melbourne",
    "countryCode": "AU"
  },
  {
    "id": "swinburne-2",
    "name": "Enrolling",
    "slug": "swinburne-",
    "url": "https://www.swinburne.edu.au/courses/enrolling/",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualAUD": 32000,
    "annualUSD": 20800,
    "annualINR": 1747200,
    "totalAUD": 64000,
    "livingCostAUD": 21000,
    "livingCostUSD": 13650,
    "livingCostINR": 1146600,
    "ieltsMin": 6.5,
    "toeflMin": 79,
    "pteMin": 58,
    "intakeMonths": [
      "February",
      "July"
    ],
    "campus": "Hawthorn Campus",
    "country": "Australia",
    "state": "Victoria",
    "city": "Melbourne",
    "countryCode": "AU"
  },
  {
    "id": "swinburne-3",
    "name": "Orientation",
    "slug": "swinburne-",
    "url": "https://www.swinburne.edu.au/courses/orientation/",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualAUD": 32000,
    "annualUSD": 20800,
    "annualINR": 1747200,
    "totalAUD": 64000,
    "livingCostAUD": 21000,
    "livingCostUSD": 13650,
    "livingCostINR": 1146600,
    "ieltsMin": 6.5,
    "toeflMin": 79,
    "pteMin": 58,
    "intakeMonths": [
      "February",
      "July"
    ],
    "campus": "Hawthorn Campus",
    "country": "Australia",
    "state": "Victoria",
    "city": "Melbourne",
    "countryCode": "AU"
  },
  {
    "id": "swinburne-4",
    "name": "Swinburne intakes",
    "slug": "swinburne-",
    "url": "https://www.swinburne.edu.au/courses/intakes/",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualAUD": 32000,
    "annualUSD": 20800,
    "annualINR": 1747200,
    "totalAUD": 64000,
    "livingCostAUD": 21000,
    "livingCostUSD": 13650,
    "livingCostINR": 1146600,
    "ieltsMin": 6.5,
    "toeflMin": 79,
    "pteMin": 58,
    "intakeMonths": [
      "February",
      "July"
    ],
    "campus": "Hawthorn Campus",
    "country": "Australia",
    "state": "Victoria",
    "city": "Melbourne",
    "countryCode": "AU"
  },
  {
    "id": "swinburne-5",
    "name": "Study levels and options",
    "slug": "swinburne-",
    "url": "https://www.swinburne.edu.au/courses/study-levels-explained/",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualAUD": 32000,
    "annualUSD": 20800,
    "annualINR": 1747200,
    "totalAUD": 64000,
    "livingCostAUD": 21000,
    "livingCostUSD": 13650,
    "livingCostINR": 1146600,
    "ieltsMin": 6.5,
    "toeflMin": 79,
    "pteMin": 58,
    "intakeMonths": [
      "February",
      "July"
    ],
    "campus": "Hawthorn Campus",
    "country": "Australia",
    "state": "Victoria",
    "city": "Melbourne",
    "countryCode": "AU"
  },
  {
    "id": "swinburne-6",
    "name": "Course delivery options",
    "slug": "swinburne-",
    "url": "https://www.swinburne.edu.au/courses/course-delivery-options/",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualAUD": 32000,
    "annualUSD": 20800,
    "annualINR": 1747200,
    "totalAUD": 64000,
    "livingCostAUD": 21000,
    "livingCostUSD": 13650,
    "livingCostINR": 1146600,
    "ieltsMin": 6.5,
    "toeflMin": 79,
    "pteMin": 58,
    "intakeMonths": [
      "February",
      "July"
    ],
    "campus": "Hawthorn Campus",
    "country": "Australia",
    "state": "Victoria",
    "city": "Melbourne",
    "countryCode": "AU"
  }
] as const;

export function getSwinburneCoursesBySlug(slug: string) {
  return (swinburneCourses as unknown as any[]).find((c: any) => c.slug === slug) ?? null;
}
