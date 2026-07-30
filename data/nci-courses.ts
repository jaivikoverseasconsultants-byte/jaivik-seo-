// Wave 2 integration — National College of Ireland (1 courses)
// Source: data/wave2-crawl/national-college-of-ireland-courses.ts, manually reviewed and cleaned 2026-07-29 before
// integration (junk/duplicate/news-page rows dropped, implausible fee/duration values
// nulled — see DATA-AUDIT.md "Wave 2" section for the specific per-file findings).
// Fees/IELTS are 0 where not confidently extracted — do not treat 0 as a real value.

export interface NciCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualUSD: number; annualINR: number;
  ieltsMin: number; toeflMin: number; campus: string; intakeMonths: string[];
  country: string; state: string; city: string; countryCode: string;
}

export const nciCourses: NciCourse[] = [
  {
    "id": "nci-1",
    "name": "MBA at NCI",
    "slug": "national-college-of-ireland-mba-at-nci",
    "url": "https://www.ncirl.ie/Study/MBA-at-NCI",
    "level": "MBA",
    "studyLevel": "Postgraduate",
    "duration": "Not specified",
    "durationYears": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "Dublin Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "Ireland",
    "state": "",
    "city": "Dublin",
    "countryCode": "IE"
  }
];

export function getNciCourseBySlug(slug: string) {
  return nciCourses.find(c => c.slug === slug) ?? null;
}
