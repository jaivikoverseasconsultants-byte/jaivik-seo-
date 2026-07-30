// Wave 2 integration — Dublin Business School (41 courses)
// Source: data/wave2-crawl/dublin-business-school-courses.ts, manually reviewed and cleaned 2026-07-29 before
// integration (junk/duplicate/news-page rows dropped, implausible fee/duration values
// nulled — see DATA-AUDIT.md "Wave 2" section for the specific per-file findings).
// Fees/IELTS are 0 where not confidently extracted — do not treat 0 as a real value.

export interface DbsCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualUSD: number; annualINR: number;
  ieltsMin: number; toeflMin: number; campus: string; intakeMonths: string[];
  country: string; state: string; city: string; countryCode: string;
}

export const dbsCourses: DbsCourse[] = [
  {
    "id": "dbs-1",
    "name": "BA (Hons) Accounting & Finance – Full-time",
    "slug": "dublin-business-school-ba-hons-accounting-finance-full-time",
    "url": "https://www.dbs.ie/course/full-time-undergraduate/full-time-undergraduate-ba-(hons)-accounting-finance",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
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
  },
  {
    "id": "dbs-2",
    "name": "BA (Hons) in Business",
    "slug": "dublin-business-school-ba-hons-in-business",
    "url": "https://www.dbs.ie/course/full-time-undergraduate/full-time-undergraduate-ba-(hons)-business-studies",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 6,
    "toeflMin": 0,
    "campus": "Dublin Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "Ireland",
    "state": "",
    "city": "Dublin",
    "countryCode": "IE"
  },
  {
    "id": "dbs-3",
    "name": "Bachelor of Laws (Hons) LL. B - Full-time",
    "slug": "dublin-business-school-bachelor-of-laws-hons-ll-b-full-time",
    "url": "https://www.dbs.ie/course/full-time-undergraduate/full-time-undergraduate-ll-ba-(hons)-in-law",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
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
  },
  {
    "id": "dbs-4",
    "name": "BA (Hons) Social Science - Full-time",
    "slug": "dublin-business-school-ba-hons-social-science-full-time",
    "url": "https://www.dbs.ie/course/full-time-undergraduate/full-time-undergraduate-ba-(hons)-social-science",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
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
  },
  {
    "id": "dbs-5",
    "name": "BA (Hons) Psychology (PSI accredited) – Full-time",
    "slug": "dublin-business-school-ba-hons-psychology-psi-accredited-full-time",
    "url": "https://www.dbs.ie/course/full-time-undergraduate/full-time-undergraduate-ba-(hons)-in-psychology",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
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
  },
  {
    "id": "dbs-6",
    "name": "BA in Film & Creative Media",
    "slug": "dublin-business-school-ba-in-film-creative-media",
    "url": "https://www.dbs.ie/course/full-time-undergraduate/full-time-undergraduate-ba-film-and-creative-media",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
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
  },
  {
    "id": "dbs-7",
    "name": "BA (Hons) Film & Creative Media",
    "slug": "dublin-business-school-ba-hons-film-creative-media",
    "url": "https://www.dbs.ie/course/full-time-undergraduate/full-time-undergraduate-ba-(hons)-film-and-creative-media",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "1 year",
    "durationYears": 1,
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
  },
  {
    "id": "dbs-8",
    "name": "Bachelor of Business - Full-time",
    "slug": "dublin-business-school-bachelor-of-business-full-time",
    "url": "https://www.dbs.ie/course/full-time-undergraduate/full-time-undergraduate-bachelor-of-business",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
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
  },
  {
    "id": "dbs-9",
    "name": "Bachelor of Business in Accounting - Full-time",
    "slug": "dublin-business-school-bachelor-of-business-in-accounting-full-time",
    "url": "https://www.dbs.ie/course/full-time-undergraduate/full-time-undergraduate-bachelor-of-business-in-accounting",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "2 years",
    "durationYears": 2,
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
  },
  {
    "id": "dbs-10",
    "name": "Bachelor of Business in Marketing - Full-time",
    "slug": "dublin-business-school-bachelor-of-business-in-marketing-full-time",
    "url": "https://www.dbs.ie/course/full-time-undergraduate/full-time-undergraduate-bachelor-of-business-in-marketing",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "1 year",
    "durationYears": 1,
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
  },
  {
    "id": "dbs-11",
    "name": "BA (Hons) in Marketing (Events)",
    "slug": "dublin-business-school-ba-hons-in-marketing-events",
    "url": "https://www.dbs.ie/course/full-time-undergraduate/full-time-undergraduate-ba-(hons)-marketing",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "1 year",
    "durationYears": 1,
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
  },
  {
    "id": "dbs-12",
    "name": "BA (Hons) Business Management (Marketing)",
    "slug": "dublin-business-school-ba-hons-business-management-marketing",
    "url": "https://www.dbs.ie/course/full-time-undergraduate/full-time-undergraduate-ba-(hons)-business-management-(marketing)",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "1 year",
    "durationYears": 1,
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
  },
  {
    "id": "dbs-13",
    "name": "BA (Hons) in Business (Information Systems)",
    "slug": "dublin-business-school-ba-hons-in-business-information-systems",
    "url": "https://www.dbs.ie/course/full-time-undergraduate/full-time-undergraduate-ba-(hons)-business-in-information-systems",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 6,
    "toeflMin": 0,
    "campus": "Dublin Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "Ireland",
    "state": "",
    "city": "Dublin",
    "countryCode": "IE"
  },
  {
    "id": "dbs-14",
    "name": "BSc (Hons) Computing",
    "slug": "dublin-business-school-bsc-hons-computing",
    "url": "https://www.dbs.ie/course/full-time-undergraduate/bsc-(hons)-in-computing",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "4 years",
    "durationYears": 4,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 6,
    "toeflMin": 0,
    "campus": "Dublin Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "Ireland",
    "state": "",
    "city": "Dublin",
    "countryCode": "IE"
  },
  {
    "id": "dbs-15",
    "name": "BA (Hons) Accounting and Finance - Part-time",
    "slug": "dublin-business-school-ba-hons-accounting-and-finance-part-time",
    "url": "https://www.dbs.ie/course/evening-degree/part-time-ba-(hons)-evening-degree-in-arts-dublin-business-school/ba-(hons)-degree-accounting-finance-part-time-dbs-ie",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "4 years",
    "durationYears": 4,
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
  },
  {
    "id": "dbs-16",
    "name": "BA (Hons) Business",
    "slug": "dublin-business-school-ba-hons-business",
    "url": "https://www.dbs.ie/course/evening-degree/ba-(hons)-business-part-time-dbs",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 6,
    "toeflMin": 0,
    "campus": "Dublin Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "Ireland",
    "state": "",
    "city": "Dublin",
    "countryCode": "IE"
  },
  {
    "id": "dbs-17",
    "name": "Master of Arts (MA) Addiction Studies",
    "slug": "dublin-business-school-master-of-arts-ma-addiction-studies",
    "url": "https://www.dbs.ie/course/postgraduate/master-of-arts-(ma)-in-addiction-studies",
    "level": "Master",
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
  },
  {
    "id": "dbs-18",
    "name": "Master of Arts (MA) Psychotherapy",
    "slug": "dublin-business-school-master-of-arts-ma-psychotherapy",
    "url": "https://www.dbs.ie/course/postgraduate/master-of-arts-(ma)-in-psychotherapy",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "3 years",
    "durationYears": 3,
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
  },
  {
    "id": "dbs-19",
    "name": "MBA - Master of Business Administration",
    "slug": "dublin-business-school-mba-master-of-business-administration",
    "url": "https://www.dbs.ie/course/postgraduate/master-of-business-administration-(mba)",
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
  },
  {
    "id": "dbs-20",
    "name": "Master of Science (MSc) Marketing",
    "slug": "dublin-business-school-master-of-science-msc-marketing",
    "url": "https://www.dbs.ie/course/postgraduate/master-of-science-(msc)-marketing",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "3 years",
    "durationYears": 3,
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
  },
  {
    "id": "dbs-21",
    "name": "Master of Science (MSc) International Accounting & Finance",
    "slug": "dublin-business-school-master-of-science-msc-international-accounting-finance",
    "url": "https://www.dbs.ie/course/postgraduate/master-of-science-(msc)-international-accounting-finance",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "5 years",
    "durationYears": 5,
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
  },
  {
    "id": "dbs-22",
    "name": "Master of Science (MSc) Management Practice",
    "slug": "dublin-business-school-master-of-science-msc-management-practice",
    "url": "https://www.dbs.ie/course/postgraduate/postgraduate-master-of-science-(msc)-in-management-practice",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "3 years",
    "durationYears": 3,
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
  },
  {
    "id": "dbs-23",
    "name": "Master of Science (MSc) Information & Library Management (LAI accredited)",
    "slug": "dublin-business-school-master-of-science-msc-information-library-management-lai-accredited",
    "url": "https://www.dbs.ie/course/postgraduate/msc-information-library-management",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
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
  },
  {
    "id": "dbs-24",
    "name": "Master of Science (MSc) Information Systems with Computing",
    "slug": "dublin-business-school-master-of-science-msc-information-systems-with-computing",
    "url": "https://www.dbs.ie/course/postgraduate/postgraduate-master-of-science-(msc)-computing-and-information-systems",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "4 years",
    "durationYears": 4,
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
  },
  {
    "id": "dbs-25",
    "name": "Master of Science (MSc) Applied Psychology (Health and Wellbeing)",
    "slug": "dublin-business-school-master-of-science-msc-applied-psychology-health-and-wellbeing",
    "url": "https://www.dbs.ie/course/postgraduate/postgraduate---master-of-science-(msc)-in-applied-psychology-health-and-wellbeing",
    "level": "Master",
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
  },
  {
    "id": "dbs-26",
    "name": "Master of Science (MSc) in Financial Technology",
    "slug": "dublin-business-school-master-of-science-msc-in-financial-technology",
    "url": "https://www.dbs.ie/course/postgraduate/master-of-science-(msc)-in-financial-technology",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
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
  },
  {
    "id": "dbs-27",
    "name": "Master of Science (MSc) in Digital Marketing and Analytics",
    "slug": "dublin-business-school-master-of-science-msc-in-digital-marketing-and-analytics",
    "url": "https://www.dbs.ie/course/postgraduate/master-of-science-(msc)-digital-marketing",
    "level": "Master",
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
  },
  {
    "id": "dbs-28",
    "name": "Master of Science (MSc) in Data Analytics",
    "slug": "dublin-business-school-master-of-science-msc-in-data-analytics",
    "url": "https://www.dbs.ie/course/postgraduate/master-of-science-(msc)-in-data-analytics",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "5 years",
    "durationYears": 5,
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
  },
  {
    "id": "dbs-29",
    "name": "BA (Hons) Audio Production & Music Project Management",
    "slug": "dublin-business-school-ba-hons-audio-production-music-project-management",
    "url": "https://www.dbs.ie/course/full-time-undergraduate/full-time-undergraduate---ba-(hons)-audio-production-and-music-project-management",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
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
  },
  {
    "id": "dbs-30",
    "name": "Master of Science (MSc) in Business Analytics",
    "slug": "dublin-business-school-master-of-science-msc-in-business-analytics",
    "url": "https://www.dbs.ie/course/postgraduate/master-of-science-(msc)-in-business-analytics",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
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
  },
  {
    "id": "dbs-31",
    "name": "Master of Science (MSc.) in Cybersecurity",
    "slug": "dublin-business-school-master-of-science-msc-in-cybersecurity",
    "url": "https://www.dbs.ie/course/postgraduate/master-of-science-(msc.)-in-cybersecurity",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "4 years",
    "durationYears": 4,
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
  },
  {
    "id": "dbs-32",
    "name": "Master of Science (MSc.) in Artificial Intelligence",
    "slug": "dublin-business-school-master-of-science-msc-in-artificial-intelligence",
    "url": "https://www.dbs.ie/course/postgraduate/master-of-science-(msc.)-in-artificial-intelligence",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "4 years",
    "durationYears": 4,
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
  },
  {
    "id": "dbs-33",
    "name": "Master of Science (MSc.) in Financial Analytics",
    "slug": "dublin-business-school-master-of-science-msc-in-financial-analytics",
    "url": "https://www.dbs.ie/course/postgraduate/master-of-science-(msc.)-in-financial-analytics",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "3 years",
    "durationYears": 3,
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
  },
  {
    "id": "dbs-34",
    "name": "MBA - Master of Business Administration",
    "slug": "dublin-business-school-mba-master-of-business-administration-34",
    "url": "https://www.dbs.ie/course/postgraduate/master-of-business-administration-(mba)-project-management-full-time",
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
  },
  {
    "id": "dbs-35",
    "name": "Master of Science (MSc.) in Human Resource Management",
    "slug": "dublin-business-school-master-of-science-msc-in-human-resource-management",
    "url": "https://www.dbs.ie/course/postgraduate/master-of-science-(msc.)-in-human-resource-management",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "5 years",
    "durationYears": 5,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 6.5,
    "toeflMin": 0,
    "campus": "Dublin Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "Ireland",
    "state": "",
    "city": "Dublin",
    "countryCode": "IE"
  },
  {
    "id": "dbs-36",
    "name": "Master of Science (MSc) in Health Psychology",
    "slug": "dublin-business-school-master-of-science-msc-in-health-psychology",
    "url": "https://www.dbs.ie/course/postgraduate/master-of-science-in-health-psychology",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
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
  },
  {
    "id": "dbs-37",
    "name": "Master of Science (MSc.) in Supply Chain Management",
    "slug": "dublin-business-school-master-of-science-msc-in-supply-chain-management",
    "url": "https://www.dbs.ie/course/postgraduate/master-of-science-(msc)-in-supply-chain-management",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
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
  },
  {
    "id": "dbs-38",
    "name": "Master of Arts (MA) in Film and Creative Media",
    "slug": "dublin-business-school-master-of-arts-ma-in-film-and-creative-media",
    "url": "https://www.dbs.ie/course/postgraduate/master-of-arts-in-film-and-creative-media",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
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
  },
  {
    "id": "dbs-39",
    "name": "Master of Science (MSc) in Trading and Investing",
    "slug": "dublin-business-school-master-of-science-msc-in-trading-and-investing",
    "url": "https://www.dbs.ie/course/postgraduate/master-of-science-(msc)-in-trading-and-investing",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
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
  },
  {
    "id": "dbs-40",
    "name": "BA (Hons) in Sustainability Management – Full-time",
    "slug": "dublin-business-school-ba-hons-in-sustainability-management-full-time",
    "url": "https://www.dbs.ie/course/full-time-undergraduate/ba-(hons)-in-sustainability-management-full-time",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
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
  },
  {
    "id": "dbs-41",
    "name": "BA (Hons) in Sustainability Management – Part-time",
    "slug": "dublin-business-school-ba-hons-in-sustainability-management-part-time",
    "url": "https://www.dbs.ie/course/evening-degree/ba-(hons)-in-sustainability-management-part-time",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
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

export function getDbsCourseBySlug(slug: string) {
  return dbsCourses.find(c => c.slug === slug) ?? null;
}
