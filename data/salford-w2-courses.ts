// Wave 2 integration — University of Salford (7 courses)
// Source: data/wave2-crawl/university-of-salford-courses.ts, manually reviewed and cleaned 2026-07-29 before
// integration (junk/duplicate/news-page rows dropped, implausible fee/duration values
// nulled — see DATA-AUDIT.md "Wave 2" section for the specific per-file findings).
// Fees/IELTS are 0 where not confidently extracted — do not treat 0 as a real value.

export interface SalfordW2Course {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualUSD: number; annualINR: number;
  ieltsMin: number; toeflMin: number; campus: string; intakeMonths: string[];
  country: string; state: string; city: string; countryCode: string;
}

export const salfordW2Courses: SalfordW2Course[] = [
  {
    "id": "salford-w2-1",
    "name": "BA Technical Theatre (Production and Design)",
    "slug": "university-of-salford-ba-technical-theatre-production-and-design",
    "url": "https://www.salford.ac.uk/environmental-sustainability/education-for-sustainable-development/ba-technical-theatre-production-and-design",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "Not specified",
    "durationYears": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "Salford Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Salford",
    "countryCode": "GB"
  },
  {
    "id": "salford-w2-2",
    "name": "BA (Hons) English Multidiscipline - English Language and English Literature route",
    "slug": "university-of-salford-ba-hons-english-multidiscipline-english-language-and-english-literature-route",
    "url": "https://www.salford.ac.uk/salford-school-of-arts-media-and-creative-technology/ba-hons-english-multidiscipline-english-language-and-english-literature-route",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "Not specified",
    "durationYears": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "Salford Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Salford",
    "countryCode": "GB"
  },
  {
    "id": "salford-w2-3",
    "name": "BA (Hons) English Multidiscipline - English Language and Creative Writing Route",
    "slug": "university-of-salford-ba-hons-english-multidiscipline-english-language-and-creative-writing-route",
    "url": "https://www.salford.ac.uk/salford-school-of-arts-media-and-creative-technology/ba-hons-english-multidiscipline-english-language-and-creative-writing-route",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "Not specified",
    "durationYears": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "Salford Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Salford",
    "countryCode": "GB"
  },
  {
    "id": "salford-w2-4",
    "name": "BA (Hons) English Multidiscipline - English Language and Drama Route",
    "slug": "university-of-salford-ba-hons-english-multidiscipline-english-language-and-drama-route",
    "url": "https://www.salford.ac.uk/salford-school-of-arts-media-and-creative-technology/ba-hons-english-multidiscipline-english-language-and-drama-route",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "Not specified",
    "durationYears": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "Salford Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Salford",
    "countryCode": "GB"
  },
  {
    "id": "salford-w2-5",
    "name": "BA (Hons) English Multidiscipline - English Literature and Creative Writing route",
    "slug": "university-of-salford-ba-hons-english-multidiscipline-english-literature-and-creative-writing-route",
    "url": "https://www.salford.ac.uk/salford-school-of-arts-media-and-creative-technology/ba-hons-english-multidiscipline-english-literature-and-creative-writing-route",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "Not specified",
    "durationYears": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "Salford Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Salford",
    "countryCode": "GB"
  },
  {
    "id": "salford-w2-6",
    "name": "BA (Hons) English Multidiscipline - English Literature and Drama Route",
    "slug": "university-of-salford-ba-hons-english-multidiscipline-english-literature-and-drama-route",
    "url": "https://www.salford.ac.uk/salford-school-of-arts-media-and-creative-technology/ba-hons-english-multidiscipline-english-literature-and-drama-route",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "Not specified",
    "durationYears": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "Salford Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Salford",
    "countryCode": "GB"
  },
  {
    "id": "salford-w2-7",
    "name": "BA (Hons) English Multidiscipline - Drama and Creative Writing route",
    "slug": "university-of-salford-ba-hons-english-multidiscipline-drama-and-creative-writing-route",
    "url": "https://www.salford.ac.uk/salford-school-of-arts-media-and-creative-technology/ba-hons-english-multidiscipline-drama-and-creative-writing-route",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "Not specified",
    "durationYears": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "Salford Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Salford",
    "countryCode": "GB"
  }
];

export function getSalfordW2CourseBySlug(slug: string) {
  return salfordW2Courses.find(c => c.slug === slug) ?? null;
}
