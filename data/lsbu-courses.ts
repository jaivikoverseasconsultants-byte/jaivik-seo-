// Real PG course data — lsbuCourses
export interface LsbuCourse {
  id: string; name: string; slug: string; url: string; officialUrlKind?: 'course' | 'course-listing'; withdrawn?: boolean; alternatives?: { name: string; slug: string }[];
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualGBP: number; annualUSD: number; annualINR: number; totalGBP: number;
  livingCostGBP: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
}

export const lsbuCourses: LsbuCourse[] = [
  {
    "id": "lsbu-pg-1",
    "name": "PgDip Addiction Psychology Counselling Pgdip",
    "slug": "lsbu-addiction-psychology-counselling-pgdip-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Postgraduate",
    "studyLevel": "PgDip",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 7,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "PgDip Adult Nursing Pre Registration",
        "slug": "lsbu-adult-nursing-pre-registration-pgdip"
      },
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "PGCE Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-pgcert"
      }
    ]
  },
  {
    "id": "lsbu-pg-2",
    "name": "PgDip Adult Nursing Pre Registration",
    "slug": "lsbu-adult-nursing-pre-registration-pgdip",
    "url": "https://www.lsbu.ac.uk/study/course-finder/adult-nursing-pre-registration-pgdip",
    "level": "Postgraduate",
    "studyLevel": "PgDip",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 15500,
    "annualUSD": 19685,
    "annualINR": 1658500,
    "totalGBP": 15500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 7,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-3",
    "name": "PgDip Advanced Clinical Practice Pgdip",
    "slug": "lsbu-advanced-clinical-practice-pgdip-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Postgraduate",
    "studyLevel": "PgDip",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 15500,
    "annualUSD": 19685,
    "annualINR": 1658500,
    "totalGBP": 15500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 7,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "PgDip Adult Nursing Pre Registration",
        "slug": "lsbu-adult-nursing-pre-registration-pgdip"
      },
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "PGCE Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-pgcert"
      }
    ]
  },
  {
    "id": "lsbu-pg-4",
    "name": "MSc Advanced Paediatric",
    "slug": "lsbu-advanced-paediatric-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder/advanced-paediatric-msc",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-5",
    "name": "PGCE Advanced Paediatric",
    "slug": "lsbu-advanced-paediatric-pgcert",
    "url": "https://www.lsbu.ac.uk/study/course-finder/advanced-paediatric-pgcert",
    "level": "Postgraduate",
    "studyLevel": "PGCE",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-6",
    "name": "PgDip Advanced Paediatric",
    "slug": "lsbu-advanced-paediatric-pgdip",
    "url": "https://www.lsbu.ac.uk/study/course-finder/advanced-paediatric-pgdip",
    "level": "Postgraduate",
    "studyLevel": "PgDip",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-7",
    "name": "MRes Applied Science",
    "slug": "lsbu-applied-science-mres",
    "url": "https://www.lsbu.ac.uk/study/course-finder/applied-science-mres",
    "level": "PhD",
    "studyLevel": "MRes",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-8",
    "name": "MArch Architecture",
    "slug": "lsbu-architecture-march",
    "url": "https://www.lsbu.ac.uk/study/course-finder/architecture-march",
    "level": "Masters",
    "studyLevel": "MArch",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 16500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-9",
    "name": "MSc Architecture",
    "slug": "lsbu-architecture-msc",
    "url": "https://www.lsbu.ac.uk/our-colleges/architecture-and-planning/study/subjects/architecture/",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 16500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-10",
    "name": "MRes Arts & Creative Industries",
    "slug": "lsbu-arts-and-creative-industries-mres",
    "url": "https://www.lsbu.ac.uk/study/postgraduate/masters-courses/arts-and-creative-industries/",
    "level": "PhD",
    "studyLevel": "MRes",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-11",
    "name": "PhD Arts & Creative Industries",
    "slug": "lsbu-arts-and-creative-industries-phd",
    "url": "https://www.lsbu.ac.uk/study/course-finder/arts-and-creative-industries-phd",
    "level": "PhD",
    "studyLevel": "PhD",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 14000,
    "annualUSD": 17780,
    "annualINR": 1498000,
    "totalGBP": 42000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-12",
    "name": "PGCE Autism",
    "slug": "lsbu-autism-pgcert",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Postgraduate",
    "studyLevel": "PGCE",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "PgDip Adult Nursing Pre Registration",
        "slug": "lsbu-adult-nursing-pre-registration-pgdip"
      },
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "PGCE Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-pgcert"
      }
    ]
  },
  {
    "id": "lsbu-pg-13",
    "name": "MSc Biochemical Engineering",
    "slug": "lsbu-biochemical-engineering-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 16500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-14",
    "name": "PhD Biochemistry",
    "slug": "lsbu-biochemistry-phd",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "PhD",
    "studyLevel": "PhD",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 14000,
    "annualUSD": 17780,
    "annualINR": 1498000,
    "totalGBP": 42000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "PgDip Adult Nursing Pre Registration",
        "slug": "lsbu-adult-nursing-pre-registration-pgdip"
      },
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "PGCE Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-pgcert"
      }
    ]
  },
  {
    "id": "lsbu-pg-15",
    "name": "MSc Biomedical Engineering",
    "slug": "lsbu-biomedical-engineering-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 16500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-16",
    "name": "MSc Biomedical Science",
    "slug": "lsbu-biomedical-science-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder/biomedical-science-msc",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-17",
    "name": "MSc Building Services Engineering",
    "slug": "lsbu-building-services-engineering-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder/building-services-engineering-msc",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 16500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-18",
    "name": "PhD Built Environment",
    "slug": "lsbu-built-environment-phd",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "PhD",
    "studyLevel": "PhD",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 14000,
    "annualUSD": 17780,
    "annualINR": 1498000,
    "totalGBP": 42000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "PgDip Adult Nursing Pre Registration",
        "slug": "lsbu-adult-nursing-pre-registration-pgdip"
      },
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "PGCE Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-pgcert"
      }
    ]
  },
  {
    "id": "lsbu-pg-19",
    "name": "MBA Business Administration",
    "slug": "lsbu-business-administration-mba",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MBA",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 17500,
    "annualUSD": 22225,
    "annualINR": 1872500,
    "totalGBP": 17500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "PgDip Adult Nursing Pre Registration",
        "slug": "lsbu-adult-nursing-pre-registration-pgdip"
      },
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "PGCE Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-pgcert"
      }
    ]
  },
  {
    "id": "lsbu-pg-20",
    "name": "PhD Business",
    "slug": "lsbu-business-phd",
    "url": "https://www.lsbu.ac.uk/our-colleges/arts-and-social-sciences/business/",
    "level": "PhD",
    "studyLevel": "PhD",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 14000,
    "annualUSD": 17780,
    "annualINR": 1498000,
    "totalGBP": 42000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-21",
    "name": "MSc Chemical Engineering",
    "slug": "lsbu-chemical-engineering-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 16500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-22",
    "name": "PGCE Child Protection",
    "slug": "lsbu-child-protection-pgcert",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Postgraduate",
    "studyLevel": "PGCE",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "PgDip Adult Nursing Pre Registration",
        "slug": "lsbu-adult-nursing-pre-registration-pgdip"
      },
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "PGCE Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-pgcert"
      }
    ]
  },
  {
    "id": "lsbu-pg-23",
    "name": "MSc Civil Engineering",
    "slug": "lsbu-civil-engineering-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder/civil-engineering-msc",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 16500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-24",
    "name": "MSc Clinical Immunology",
    "slug": "lsbu-clinical-immunology-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 15500,
    "annualUSD": 19685,
    "annualINR": 1658500,
    "totalGBP": 15500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 7,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-25",
    "name": "MSc Clinical Microbiology",
    "slug": "lsbu-clinical-microbiology-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 15500,
    "annualUSD": 19685,
    "annualINR": 1658500,
    "totalGBP": 15500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 7,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-26",
    "name": "PhD Clinical Psychology",
    "slug": "lsbu-clinical-psychology-phd",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "PhD",
    "studyLevel": "PhD",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 15500,
    "annualUSD": 19685,
    "annualINR": 1658500,
    "totalGBP": 46500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 7,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "PgDip Adult Nursing Pre Registration",
        "slug": "lsbu-adult-nursing-pre-registration-pgdip"
      },
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "PGCE Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-pgcert"
      }
    ]
  },
  {
    "id": "lsbu-pg-27",
    "name": "MSc Computer Science",
    "slug": "lsbu-computer-science-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-28",
    "name": "MSc Construction Management",
    "slug": "lsbu-construction-management-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 16500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-29",
    "name": "MSc Construction Project Management",
    "slug": "lsbu-construction-project-management-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder/construction-project-management-msc",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 16500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-30",
    "name": "MA Counselling & Psychotherapy",
    "slug": "lsbu-counselling-and-psychotherapy-ma",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MA",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "PgDip Adult Nursing Pre Registration",
        "slug": "lsbu-adult-nursing-pre-registration-pgdip"
      },
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "PGCE Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-pgcert"
      }
    ]
  },
  {
    "id": "lsbu-pg-31",
    "name": "MA Creative Media & Digital Culture",
    "slug": "lsbu-creative-media-and-digital-culture-ma",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MA",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "PgDip Adult Nursing Pre Registration",
        "slug": "lsbu-adult-nursing-pre-registration-pgdip"
      },
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "PGCE Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-pgcert"
      }
    ]
  },
  {
    "id": "lsbu-pg-32",
    "name": "MSc Criminology",
    "slug": "lsbu-criminology-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-33",
    "name": "PgDip Critical Care",
    "slug": "lsbu-critical-care-pgdip",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Postgraduate",
    "studyLevel": "PgDip",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "PgDip Adult Nursing Pre Registration",
        "slug": "lsbu-adult-nursing-pre-registration-pgdip"
      },
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "PGCE Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-pgcert"
      }
    ]
  },
  {
    "id": "lsbu-pg-34",
    "name": "MSc Cybersecurity",
    "slug": "lsbu-cybersecurity-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-35",
    "name": "MSc Data Science",
    "slug": "lsbu-data-science-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder/data-science-msc",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-36",
    "name": "PGCE Dementia Studies",
    "slug": "lsbu-dementia-studies-pgcert",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Postgraduate",
    "studyLevel": "PGCE",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "PgDip Adult Nursing Pre Registration",
        "slug": "lsbu-adult-nursing-pre-registration-pgdip"
      },
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "PGCE Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-pgcert"
      }
    ]
  },
  {
    "id": "lsbu-pg-37",
    "name": "MSc Disaster Management",
    "slug": "lsbu-disaster-management-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-38",
    "name": "MA Education",
    "slug": "lsbu-education-ma",
    "url": "https://www.lsbu.ac.uk/our-colleges/law-and-education/study/subjects/education/",
    "level": "Masters",
    "studyLevel": "MA",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-39",
    "name": "MSc Electrical Engineering",
    "slug": "lsbu-electrical-engineering-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 16500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-40",
    "name": "MSc Electrical Power Systems",
    "slug": "lsbu-electrical-power-systems-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-41",
    "name": "MSc Electrical & Electronic Engineering",
    "slug": "lsbu-electrical-and-electronic-engineering-msc",
    "url": "https://www.lsbu.ac.uk/our-colleges/engineering-and-design/study/subjects/electrical-and-electronic-engineering/",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 16500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-42",
    "name": "MSc Energy Management",
    "slug": "lsbu-energy-management-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-43",
    "name": "MSc Engineering Management",
    "slug": "lsbu-engineering-management-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 16500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-44",
    "name": "MSc Environmental Management",
    "slug": "lsbu-environmental-management-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-45",
    "name": "MA Fashion Brand Management",
    "slug": "lsbu-fashion-brand-management-ma",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MA",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "PgDip Adult Nursing Pre Registration",
        "slug": "lsbu-adult-nursing-pre-registration-pgdip"
      },
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "PGCE Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-pgcert"
      }
    ]
  },
  {
    "id": "lsbu-pg-46",
    "name": "MA Film Studies",
    "slug": "lsbu-film-studies-ma",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MA",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "PgDip Adult Nursing Pre Registration",
        "slug": "lsbu-adult-nursing-pre-registration-pgdip"
      },
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "PGCE Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-pgcert"
      }
    ]
  },
  {
    "id": "lsbu-pg-47",
    "name": "MSc Finance",
    "slug": "lsbu-finance-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-48",
    "name": "MSc Financial Mathematics",
    "slug": "lsbu-financial-mathematics-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-49",
    "name": "MSc Food Science",
    "slug": "lsbu-food-science-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-50",
    "name": "MSc Forensic Science",
    "slug": "lsbu-forensic-science-msc",
    "url": "https://www.lsbu.ac.uk/study/study-at-lsbu/subjects/forensic-science/",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-51",
    "name": "MSc Global Health",
    "slug": "lsbu-global-health-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-52",
    "name": "MA Graphic Design",
    "slug": "lsbu-graphic-design-ma",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MA",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "PgDip Adult Nursing Pre Registration",
        "slug": "lsbu-adult-nursing-pre-registration-pgdip"
      },
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "PGCE Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-pgcert"
      }
    ]
  },
  {
    "id": "lsbu-pg-53",
    "name": "MSc Health Psychology",
    "slug": "lsbu-health-psychology-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 7,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-54",
    "name": "MSc Health & Social Care Management",
    "slug": "lsbu-health-and-social-care-management-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-55",
    "name": "MSc Healthcare Leadership",
    "slug": "lsbu-healthcare-leadership-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-56",
    "name": "MA Human Resource Management",
    "slug": "lsbu-human-resource-management-ma",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MA",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "PgDip Adult Nursing Pre Registration",
        "slug": "lsbu-adult-nursing-pre-registration-pgdip"
      },
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "PGCE Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-pgcert"
      }
    ]
  },
  {
    "id": "lsbu-pg-57",
    "name": "LLM Human Rights & International Law",
    "slug": "lsbu-human-rights-and-international-law-llm",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "LLM",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 16500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "PgDip Adult Nursing Pre Registration",
        "slug": "lsbu-adult-nursing-pre-registration-pgdip"
      },
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "PGCE Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-pgcert"
      }
    ]
  },
  {
    "id": "lsbu-pg-58",
    "name": "MSc Industrial Pharmaceutical Sciences",
    "slug": "lsbu-industrial-pharmaceutical-sciences-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-59",
    "name": "MSc Information Security",
    "slug": "lsbu-information-security-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-60",
    "name": "MSc Innovation & Entrepreneurship",
    "slug": "lsbu-innovation-and-entrepreneurship-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-61",
    "name": "MA Interior Architecture",
    "slug": "lsbu-interior-architecture-ma",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MA",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 16500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "PgDip Adult Nursing Pre Registration",
        "slug": "lsbu-adult-nursing-pre-registration-pgdip"
      },
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "PGCE Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-pgcert"
      }
    ]
  },
  {
    "id": "lsbu-pg-62",
    "name": "MSc International Business",
    "slug": "lsbu-international-business-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-63",
    "name": "MSc International Development",
    "slug": "lsbu-international-development-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-64",
    "name": "LLM International Law",
    "slug": "lsbu-international-law-llm",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "LLM",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 16500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "PgDip Adult Nursing Pre Registration",
        "slug": "lsbu-adult-nursing-pre-registration-pgdip"
      },
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "PGCE Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-pgcert"
      }
    ]
  },
  {
    "id": "lsbu-pg-65",
    "name": "MSc International Relations",
    "slug": "lsbu-international-relations-msc",
    "url": "https://www.lsbu.ac.uk/student-life/applicant-hub/international-relations/",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-66",
    "name": "LLM Law",
    "slug": "lsbu-law-llm",
    "url": "https://www.lsbu.ac.uk/our-colleges/law-and-education/study/subjects/law/",
    "level": "Masters",
    "studyLevel": "LLM",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 16500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-67",
    "name": "MSc Logistics & Supply Chain Management",
    "slug": "lsbu-logistics-and-supply-chain-management-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-68",
    "name": "MSc Management",
    "slug": "lsbu-management-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-69",
    "name": "MSc Marketing",
    "slug": "lsbu-marketing-msc",
    "url": "https://www.lsbu.ac.uk/study/study-at-lsbu/subjects/marketing/",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-70",
    "name": "MSc Masters In Public Administration",
    "slug": "lsbu-masters-in-public-administration-mpa",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-71",
    "name": "MSc Mechanical Engineering",
    "slug": "lsbu-mechanical-engineering-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder/mechanical-engineering-msc",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 16500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-72",
    "name": "MSc Mechatronics",
    "slug": "lsbu-mechatronics-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-73",
    "name": "MSc Medical Imaging",
    "slug": "lsbu-medical-imaging-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-74",
    "name": "MSc Mental Health",
    "slug": "lsbu-mental-health-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-75",
    "name": "MSc Midwifery",
    "slug": "lsbu-midwifery-msc",
    "url": "https://www.lsbu.ac.uk/study/study-at-lsbu/subjects/nursing-and-midwifery/midwifery/",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 15500,
    "annualUSD": 19685,
    "annualINR": 1658500,
    "totalGBP": 15500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-76",
    "name": "MA Music Industry Management",
    "slug": "lsbu-music-industry-management-ma",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MA",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "PgDip Adult Nursing Pre Registration",
        "slug": "lsbu-adult-nursing-pre-registration-pgdip"
      },
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "PGCE Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-pgcert"
      }
    ]
  },
  {
    "id": "lsbu-pg-77",
    "name": "MSc Network Engineering",
    "slug": "lsbu-network-engineering-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 16500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-78",
    "name": "PhD Nursing",
    "slug": "lsbu-nursing-phd",
    "url": "https://www.lsbu.ac.uk/study/course-finder/nursing-phd",
    "level": "PhD",
    "studyLevel": "PhD",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 15500,
    "annualUSD": 19685,
    "annualINR": 1658500,
    "totalGBP": 46500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 7,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-79",
    "name": "MSc Occupational Therapy",
    "slug": "lsbu-occupational-therapy-msc",
    "url": "https://www.lsbu.ac.uk/study/study-at-lsbu/subjects/allied-health/occupational-therapy/",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 15500,
    "annualUSD": 19685,
    "annualINR": 1658500,
    "totalGBP": 15500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 7,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-80",
    "name": "MSc Osteopathy",
    "slug": "lsbu-osteopathy-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-81",
    "name": "PgDip Paediatric Nursing",
    "slug": "lsbu-paediatric-nursing-pgdip",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Postgraduate",
    "studyLevel": "PgDip",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 15500,
    "annualUSD": 19685,
    "annualINR": 1658500,
    "totalGBP": 15500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 7,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "PgDip Adult Nursing Pre Registration",
        "slug": "lsbu-adult-nursing-pre-registration-pgdip"
      },
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "PGCE Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-pgcert"
      }
    ]
  },
  {
    "id": "lsbu-pg-82",
    "name": "MSc Pharmacy Practice",
    "slug": "lsbu-pharmacy-practice-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 15500,
    "annualUSD": 19685,
    "annualINR": 1658500,
    "totalGBP": 15500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 7,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-83",
    "name": "MSc Physiotherapy",
    "slug": "lsbu-physiotherapy-msc",
    "url": "https://www.lsbu.ac.uk/study/study-at-lsbu/subjects/allied-health/physiotherapy/",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 15500,
    "annualUSD": 19685,
    "annualINR": 1658500,
    "totalGBP": 15500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 7,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-84",
    "name": "MSc Project Management",
    "slug": "lsbu-project-management-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-85",
    "name": "MSc Property Development",
    "slug": "lsbu-property-development-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-86",
    "name": "MSc Public Health",
    "slug": "lsbu-public-health-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-87",
    "name": "MSc Quantity Surveying",
    "slug": "lsbu-quantity-surveying-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder/quantity-surveying-msc",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-88",
    "name": "MSc Robotics",
    "slug": "lsbu-robotics-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-89",
    "name": "MSc Safety Engineering & Management",
    "slug": "lsbu-safety-engineering-and-management-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 16500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-90",
    "name": "MA Social Work",
    "slug": "lsbu-social-work-ma",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MA",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "PgDip Adult Nursing Pre Registration",
        "slug": "lsbu-adult-nursing-pre-registration-pgdip"
      },
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "PGCE Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-pgcert"
      }
    ]
  },
  {
    "id": "lsbu-pg-91",
    "name": "MSc Software Engineering",
    "slug": "lsbu-software-engineering-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 16500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-92",
    "name": "MSc Sport & Exercise Medicine",
    "slug": "lsbu-sport-and-exercise-medicine-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 7,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-93",
    "name": "MSc Sport Management",
    "slug": "lsbu-sport-management-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-94",
    "name": "MSc Structural Engineering",
    "slug": "lsbu-structural-engineering-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder/structural-engineering-msc",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 16500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "lsbu-pg-95",
    "name": "MSc Sustainable Energy Engineering",
    "slug": "lsbu-sustainable-energy-engineering-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 16500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-96",
    "name": "MSc Technology Management",
    "slug": "lsbu-technology-management-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-97",
    "name": "MSc Telecommunications Engineering",
    "slug": "lsbu-telecommunications-engineering-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 16500,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-98",
    "name": "MSc Tourism Management",
    "slug": "lsbu-tourism-management-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-99",
    "name": "MSc Urban Planning & Development",
    "slug": "lsbu-urban-planning-and-development-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  },
  {
    "id": "lsbu-pg-100",
    "name": "MSc Web Development",
    "slug": "lsbu-web-development-msc",
    "url": "https://www.lsbu.ac.uk/study/course-finder",
    "level": "Masters",
    "studyLevel": "MSc",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 18000,
    "livingCostUSD": 22860,
    "livingCostINR": 1926000,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Southwark Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Advanced Paediatric",
        "slug": "lsbu-advanced-paediatric-msc"
      },
      {
        "name": "MSc Biomedical Science",
        "slug": "lsbu-biomedical-science-msc"
      },
      {
        "name": "MSc Building Services Engineering",
        "slug": "lsbu-building-services-engineering-msc"
      }
    ]
  }
];

export function getLsbuCourseBySlug(slug: string): LsbuCourse | undefined {
  return lsbuCourses.find(c => c.slug === slug);
}
