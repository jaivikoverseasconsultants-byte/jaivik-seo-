// Wave 2 integration — Goldsmiths, University of London (33 courses)
// Source: data/wave2-crawl/goldsmiths-university-london-courses.ts, manually reviewed and cleaned 2026-07-29 before
// integration (junk/duplicate/news-page rows dropped, implausible fee/duration values
// nulled — see DATA-AUDIT.md "Wave 2" section for the specific per-file findings).
// Fees/IELTS are 0 where not confidently extracted — do not treat 0 as a real value.

export interface GoldsmithsCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualUSD: number; annualINR: number;
  ieltsMin: number; toeflMin: number; campus: string; intakeMonths: string[];
  country: string; state: string; city: string; countryCode: string;
}

export const goldsmithsCourses: GoldsmithsCourse[] = [
  {
    "id": "goldsmiths-1",
    "name": "BA (Hons) Anthropology",
    "slug": "goldsmiths-university-london-ba-hons-anthropology",
    "url": "https://www.gold.ac.uk/ug/ba-anthropology/",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-2",
    "name": "BA (Hons) Social Science, Community Development & Youth Work",
    "slug": "goldsmiths-university-london-ba-hons-social-science-community-development-amp-youth-work",
    "url": "https://www.gold.ac.uk/ug/ba-community-youth-work/",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-3",
    "name": "MA/MFA Filmmaking (Sound)",
    "slug": "goldsmiths-university-london-mamfa-filmmaking-sound",
    "url": "https://www.gold.ac.uk/pg/ma-filmmaking-sound-recording-design/",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 7,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-4",
    "name": "BSc (Hons) Digital Arts Computing",
    "slug": "goldsmiths-university-london-bsc-hons-digital-arts-computing",
    "url": "https://www.gold.ac.uk/ug/bsc-digital-arts-computing/",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-5",
    "name": "BA (Hons) Sociology",
    "slug": "goldsmiths-university-london-ba-hons-sociology",
    "url": "https://www.gold.ac.uk/ug/ba-sociology/",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-6",
    "name": "MA/MFA Scriptwriting",
    "slug": "goldsmiths-university-london-mamfa-scriptwriting",
    "url": "https://www.gold.ac.uk/pg/ma-script-writing/",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "Not specified",
    "durationYears": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-7",
    "name": "BA (Hons) Media & Communications",
    "slug": "goldsmiths-university-london-ba-hons-media-amp-communications",
    "url": "https://www.gold.ac.uk/ug/ba-media-communications/",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-8",
    "name": "BA (Hons) English",
    "slug": "goldsmiths-university-london-ba-hons-english",
    "url": "https://www.gold.ac.uk/ug/ba-english/",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-9",
    "name": "BA (Hons) Arts Management",
    "slug": "goldsmiths-university-london-ba-hons-arts-management",
    "url": "https://www.gold.ac.uk/ug/ba-arts-management/",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-10",
    "name": "MA/MFA Filmmaking (Cinematography)",
    "slug": "goldsmiths-university-london-mamfa-filmmaking-cinematography",
    "url": "https://www.gold.ac.uk/pg/ma-filmmaking-cinematography/",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 7,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-11",
    "name": "BA (Hons) Journalism",
    "slug": "goldsmiths-university-london-ba-hons-journalism",
    "url": "https://www.gold.ac.uk/ug/ba-journalism/",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-12",
    "name": "BA (Hons) History of Art",
    "slug": "goldsmiths-university-london-ba-hons-history-of-art",
    "url": "https://www.gold.ac.uk/ug/ba-history-of-art/",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-13",
    "name": "MA/MFA Filmmaking (Directing)",
    "slug": "goldsmiths-university-london-mamfa-filmmaking-directing",
    "url": "https://www.gold.ac.uk/pg/ma-filmmaking-directing-fiction/",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 7,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-14",
    "name": "MA/MFA Filmmaking (Editing)",
    "slug": "goldsmiths-university-london-mamfa-filmmaking-editing",
    "url": "https://www.gold.ac.uk/pg/ma-filmmaking-editing/",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 7,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-15",
    "name": "BA (Hons) History with Politics",
    "slug": "goldsmiths-university-london-ba-hons-history-with-politics",
    "url": "https://www.gold.ac.uk/ug/ba-history-politics/",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-16",
    "name": "MSc Music, Mind & Brain",
    "slug": "goldsmiths-university-london-msc-music-mind-amp-brain",
    "url": "https://www.gold.ac.uk/pg/msc-music-mind-brain/",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-17",
    "name": "BA (Hons) English with Creative Writing",
    "slug": "goldsmiths-university-london-ba-hons-english-with-creative-writing",
    "url": "https://www.gold.ac.uk/ug/ba-english-creative-writing/",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-18",
    "name": "BA (Hons) Fine Art (Extension Degree)",
    "slug": "goldsmiths-university-london-ba-hons-fine-art-extension-degree",
    "url": "https://www.gold.ac.uk/ug/ba-fine-art-extension/",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 6.5,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-19",
    "name": "BSc (Hons) Psychology",
    "slug": "goldsmiths-university-london-bsc-hons-psychology",
    "url": "https://www.gold.ac.uk/ug/bsc-psychology/",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-20",
    "name": "BA (Hons) Economics",
    "slug": "goldsmiths-university-london-ba-hons-economics",
    "url": "https://www.gold.ac.uk/ug/ba-economics/",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-21",
    "name": "BA (Hons) Politics, Philosophy & Economics",
    "slug": "goldsmiths-university-london-ba-hons-politics-philosophy-amp-economics",
    "url": "https://www.gold.ac.uk/ug/ba-politics-philosophy-economics/",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-22",
    "name": "BA (Hons) Design",
    "slug": "goldsmiths-university-london-ba-hons-design",
    "url": "https://www.gold.ac.uk/ug/ba-design/",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-23",
    "name": "BA (Hons) Sociology with Criminology",
    "slug": "goldsmiths-university-london-ba-hons-sociology-with-criminology",
    "url": "https://www.gold.ac.uk/ug/ba-sociology-criminology/",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-24",
    "name": "BSc (Hons) Psychology with Forensic Psychology",
    "slug": "goldsmiths-university-london-bsc-hons-psychology-with-forensic-psychology",
    "url": "https://www.gold.ac.uk/ug/bsc-psychology-forensic-psychology/",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-25",
    "name": "BSc (Hons) Psychology with Cognitive Neuroscience",
    "slug": "goldsmiths-university-london-bsc-hons-psychology-with-cognitive-neuroscience",
    "url": "https://www.gold.ac.uk/ug/bsc-psychology-cognitive-neuroscience/",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-26",
    "name": "BA (Hons) Politics & International Relations",
    "slug": "goldsmiths-university-london-ba-hons-politics-amp-international-relations",
    "url": "https://www.gold.ac.uk/ug/ba-politics-international-relations/",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-27",
    "name": "BSc (Hons) Psychology with Clinical Psychology",
    "slug": "goldsmiths-university-london-bsc-hons-psychology-with-clinical-psychology",
    "url": "https://www.gold.ac.uk/ug/bsc-clinical-psychology/",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-28",
    "name": "BMus (Hons) Music",
    "slug": "goldsmiths-university-london-bmus-hons-music",
    "url": "https://www.gold.ac.uk/ug/bmus-music/",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-29",
    "name": "BA (Hons) History",
    "slug": "goldsmiths-university-london-ba-hons-history",
    "url": "https://www.gold.ac.uk/ug/ba-history/",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-30",
    "name": "BSc (Hons) Computer Science",
    "slug": "goldsmiths-university-london-bsc-hons-computer-science",
    "url": "https://www.gold.ac.uk/ug/bsc-computer-science/",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-31",
    "name": "MA/MFA Filmmaking (Producing)",
    "slug": "goldsmiths-university-london-mamfa-filmmaking-producing",
    "url": "https://www.gold.ac.uk/pg/ma-filmmaking-producing/",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 7,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-32",
    "name": "MSc Foundations in Clinical Psychology & Health Services",
    "slug": "goldsmiths-university-london-msc-foundations-in-clinical-psychology-amp-health-services",
    "url": "https://www.gold.ac.uk/pg/msc-clinical-psychology-health-services/",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "goldsmiths-33",
    "name": "BSc (Hons) Creative Computing",
    "slug": "goldsmiths-university-london-bsc-hons-creative-computing",
    "url": "https://www.gold.ac.uk/ug/bsc-creative-computing/",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  }
];

export function getGoldsmithsCourseBySlug(slug: string) {
  return goldsmithsCourses.find(c => c.slug === slug) ?? null;
}
