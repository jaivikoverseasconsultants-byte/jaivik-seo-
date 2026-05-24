// Auto-generated — do not edit manually
// Source: data/scraped/australia/kaplan.json

export interface KaplanCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualAUD: number; annualUSD: number; annualINR: number; totalAUD: number;
  livingCostAUD: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
}

export const kaplanCourses = [
  {
    "id": "kaplan-1",
    "name": "Business Administration",
    "slug": "kaplan-english-for-academic-purposes",
    "url": "https://www.kbs.edu.au/courses/english-for-academic-purposes",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualAUD": 20000,
    "annualUSD": 13000,
    "annualINR": 1092000,
    "totalAUD": 40000,
    "livingCostAUD": 21000,
    "livingCostUSD": 13650,
    "livingCostINR": 1146600,
    "ieltsMin": 2,
    "toeflMin": 60,
    "pteMin": 50,
    "intakeMonths": [
      "January",
      "April",
      "July",
      "October"
    ],
    "campus": "Sydney Campus",
    "country": "Australia",
    "state": "New South Wales",
    "city": "Sydney",
    "countryCode": "AU"
  },
  {
    "id": "kaplan-2",
    "name": "Non-Award Single Subject Enrolment",
    "slug": "kaplan-non-award-single-subject-enrolment",
    "url": "https://www.kbs.edu.au/courses/non-award-single-subject-enrolment",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualAUD": 20000,
    "annualUSD": 13000,
    "annualINR": 1092000,
    "totalAUD": 40000,
    "livingCostAUD": 21000,
    "livingCostUSD": 13650,
    "livingCostINR": 1146600,
    "ieltsMin": 6,
    "toeflMin": 60,
    "pteMin": 50,
    "intakeMonths": [
      "January",
      "April",
      "July",
      "October"
    ],
    "campus": "Sydney Campus",
    "country": "Australia",
    "state": "New South Wales",
    "city": "Sydney",
    "countryCode": "AU"
  },
  {
    "id": "kaplan-3",
    "name": "IT Specialisations and System Requirements",
    "slug": "kaplan-it-specialisations-system-requirements",
    "url": "https://www.kbs.edu.au/courses/master-of-information-technology/it-specialisations-system-requirements",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualAUD": 20000,
    "annualUSD": 13000,
    "annualINR": 1092000,
    "totalAUD": 40000,
    "livingCostAUD": 21000,
    "livingCostUSD": 13650,
    "livingCostINR": 1146600,
    "ieltsMin": 6,
    "toeflMin": 60,
    "pteMin": 50,
    "intakeMonths": [
      "January",
      "April",
      "July",
      "October"
    ],
    "campus": "Sydney Campus",
    "country": "Australia",
    "state": "New South Wales",
    "city": "Sydney",
    "countryCode": "AU"
  },
  {
    "id": "kaplan-4",
    "name": "MBA – Two Specialisations",
    "slug": "kaplan-two-specialisations",
    "url": "https://www.kbs.edu.au/courses/mba-master-of-business-administration/two-specialisations",
    "level": "Masters",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualAUD": 22000,
    "annualUSD": 14300,
    "annualINR": 1201200,
    "totalAUD": 44000,
    "livingCostAUD": 21000,
    "livingCostUSD": 13650,
    "livingCostINR": 1146600,
    "ieltsMin": 6,
    "toeflMin": 60,
    "pteMin": 50,
    "intakeMonths": [
      "January",
      "April",
      "July",
      "October"
    ],
    "campus": "Sydney Campus",
    "country": "Australia",
    "state": "New South Wales",
    "city": "Sydney",
    "countryCode": "AU"
  },
  {
    "id": "kaplan-5",
    "name": "Study Abroad Program",
    "slug": "kaplan-study-abroad-program",
    "url": "https://www.kbs.edu.au/courses/study-abroad-program",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "18 years",
    "durationYears": 18,
    "annualAUD": 8640,
    "annualUSD": 5616,
    "annualINR": 471744,
    "totalAUD": 155520,
    "livingCostAUD": 21000,
    "livingCostUSD": 13650,
    "livingCostINR": 1146600,
    "ieltsMin": 6,
    "toeflMin": 60,
    "pteMin": 50,
    "intakeMonths": [
      "January",
      "April",
      "July",
      "October"
    ],
    "campus": "Sydney Campus",
    "country": "Australia",
    "state": "New South Wales",
    "city": "Sydney",
    "countryCode": "AU"
  }
] as const;

export function getKaplanCoursesBySlug(slug: string) {
  return (kaplanCourses as unknown as any[]).find((c: any) => c.slug === slug) ?? null;
}
