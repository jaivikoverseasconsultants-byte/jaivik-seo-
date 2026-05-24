/**
 * Configuration for all 13 Australian universities to scrape.
 * Each entry defines how to find course pages and default data.
 */

module.exports = [
  {
    id: 'cdu',
    name: 'Charles Darwin University',
    shortName: 'CDU',
    slug: 'charles-darwin-university',
    website: 'https://www.cdu.edu.au',
    sitemaps: ['https://www.cdu.edu.au/sitemap.xml'],
    // Direct course listing fallback URLs to try
    listingUrls: [
      'https://www.cdu.edu.au/study/international/courses',
      'https://www.cdu.edu.au/study/courses',
      'https://www.cdu.edu.au/courses',
    ],
    isCourseUrl: (pathname) => {
      const p = pathname.replace(/\/$/, '').split('/').filter(Boolean);
      return (p[0] === 'study' || p[0] === 'courses') && p.length >= 2 && p.length <= 3
        && !/(search|find|browse|filter|international$|postgraduate$|undergraduate$|student|apply|fees|scholarships|contact|about|future|current|research|news|event|faculty|staff)/i.test(p[p.length-1]);
    },
    city: 'Darwin', state: 'Northern Territory', countryCode: 'AU',
    ieltsDefault: 6.0, toeflDefault: 60, pteDefault: 50,
    intakes: ['February', 'July'],
    campus: 'Darwin Campus',
    qsRanking: null, theRanking: 801,
    fees: { phd: 24000, masters: 27000, gradDip: 20000, gradCert: 12000, bachelor: 24000, diploma: 18000, default: 25000 },
    livingCostAUD: 20000,
    establishedYear: 1974,
    sameAs: 'https://www.cdu.edu.au',
  },
  {
    id: 'swinburne',
    name: 'Swinburne University of Technology',
    shortName: 'Swinburne',
    slug: 'swinburne-university',
    website: 'https://www.swinburne.edu.au',
    sitemaps: ['https://www.swinburne.edu.au/sitemap.xml', 'https://www.swinburne.edu.au/sitemap_index.xml'],
    listingUrls: [
      'https://www.swinburne.edu.au/study/find-a-course/',
      'https://www.swinburne.edu.au/courses/international-students/',
    ],
    isCourseUrl: (pathname) => {
      const p = pathname.replace(/\/$/, '').split('/').filter(Boolean);
      // Swinburne: /study/courses/[course-name] or /courses/[slug]
      return (
        (p[0] === 'study' && p[1] === 'courses' && p.length === 3) ||
        (p[0] === 'courses' && p.length === 2)
      ) && !/(search|find|browse|filter|international$|postgrad|undergrad|apply|fees|scholarships|contact|about|future|current|research|news|event|faculty)/i.test(p[p.length-1]);
    },
    city: 'Melbourne', state: 'Victoria', countryCode: 'AU',
    ieltsDefault: 6.5, toeflDefault: 79, pteDefault: 58,
    intakes: ['February', 'July'],
    campus: 'Hawthorn Campus',
    qsRanking: 397, theRanking: 401,
    fees: { phd: 28800, masters: 35000, gradDip: 24000, gradCert: 16000, bachelor: 33000, diploma: 22000, default: 32000 },
    livingCostAUD: 22000,
    establishedYear: 1908,
    sameAs: 'https://www.swinburne.edu.au',
  },
  {
    id: 'kaplan',
    name: 'Kaplan Business School',
    shortName: 'Kaplan',
    slug: 'kaplan-business-school',
    website: 'https://www.kbs.edu.au',
    sitemaps: ['https://www.kbs.edu.au/sitemap.xml'],
    listingUrls: [
      'https://www.kbs.edu.au/courses/',
      'https://www.kbs.edu.au/study/',
    ],
    isCourseUrl: (pathname) => {
      const p = pathname.replace(/\/$/, '').split('/').filter(Boolean);
      return (p[0] === 'courses' || p[0] === 'study') && p.length >= 2
        && !/(search|browse|international$|apply|fees|scholarships|contact|about|news|event)/i.test(p[p.length-1]);
    },
    city: 'Sydney', state: 'New South Wales', countryCode: 'AU',
    ieltsDefault: 6.0, toeflDefault: 60, pteDefault: 50,
    intakes: ['January', 'April', 'July', 'October'],
    campus: 'Sydney Campus',
    qsRanking: null, theRanking: null,
    fees: { phd: 0, masters: 22000, gradDip: 18000, gradCert: 12000, bachelor: 20000, diploma: 15000, default: 20000 },
    livingCostAUD: 22000,
    establishedYear: 2000,
    sameAs: 'https://www.kbs.edu.au',
  },
  {
    id: 'notredame',
    name: 'University of Notre Dame Australia',
    shortName: 'Notre Dame',
    slug: 'notre-dame-australia',
    website: 'https://www.notredame.edu.au',
    sitemaps: ['https://www.notredame.edu.au/sitemap.xml'],
    listingUrls: [
      'https://www.notredame.edu.au/study/courses',
      'https://www.notredame.edu.au/courses',
    ],
    isCourseUrl: (pathname) => {
      const p = pathname.replace(/\/$/, '').split('/').filter(Boolean);
      return (p[0] === 'study' || p[0] === 'courses') && p.length >= 2
        && !/(search|browse|international$|apply|fees|scholarships|contact|about|news|event|faculty)/i.test(p[p.length-1]);
    },
    city: 'Sydney', state: 'New South Wales', countryCode: 'AU',
    ieltsDefault: 6.5, toeflDefault: 79, pteDefault: 58,
    intakes: ['February', 'July'],
    campus: 'Broadway Campus',
    qsRanking: null, theRanking: null,
    fees: { phd: 24000, masters: 30000, gradDip: 22000, gradCert: 14000, bachelor: 28000, diploma: 20000, default: 27000 },
    livingCostAUD: 22000,
    establishedYear: 1992,
    sameAs: 'https://www.notredame.edu.au',
  },
  {
    id: 'vu-sydney',
    name: 'Victoria University Sydney',
    shortName: 'VU Sydney',
    slug: 'victoria-university-sydney',
    website: 'https://www.vu.edu.au',
    sitemaps: ['https://www.vu.edu.au/sitemap.xml'],
    listingUrls: [
      'https://www.vu.edu.au/vu-sydney/courses',
      'https://www.vu.edu.au/courses/find-a-course',
      'https://www.vu.edu.au/study-at-vu/find-a-course',
    ],
    isCourseUrl: (pathname) => {
      const p = pathname.replace(/\/$/, '').split('/').filter(Boolean);
      return (p[0] === 'courses' && p.length === 2) ||
        (p[0] === 'study-at-vu' && p[1] === 'find-a-course' && p.length === 3)
        && !/(search|browse|international$|apply|fees|scholarships|contact|about|news|event)/i.test(p[p.length-1]);
    },
    city: 'Sydney', state: 'New South Wales', countryCode: 'AU',
    ieltsDefault: 6.0, toeflDefault: 60, pteDefault: 50,
    intakes: ['February', 'July'],
    campus: 'Sydney Campus',
    qsRanking: 601, theRanking: 601,
    fees: { phd: 24000, masters: 30000, gradDip: 22000, gradCert: 14000, bachelor: 28000, diploma: 20000, default: 27000 },
    livingCostAUD: 22000,
    establishedYear: 1990,
    sameAs: 'https://www.vu.edu.au',
  },
  {
    id: 'cqu',
    name: 'CQUniversity Australia',
    shortName: 'CQUniversity',
    slug: 'cquniversity',
    website: 'https://www.cqu.edu.au',
    sitemaps: ['https://www.cqu.edu.au/sitemap.xml'],
    listingUrls: [
      'https://www.cqu.edu.au/courses/find-a-course',
      'https://www.cqu.edu.au/international/courses',
    ],
    isCourseUrl: (pathname) => {
      const p = pathname.replace(/\/$/, '').split('/').filter(Boolean);
      return (
        (p[0] === 'courses' && (p[1] === 'undergraduate' || p[1] === 'postgraduate' || p[1] === 'international' || p[1] === 'higher-education') && p.length === 3) ||
        (p[0] === 'courses' && p.length === 2)
      ) && !/(search|browse|apply|fees|scholarships|contact|about|news|event)/i.test(p[p.length-1]);
    },
    city: 'Rockhampton', state: 'Queensland', countryCode: 'AU',
    ieltsDefault: 6.0, toeflDefault: 60, pteDefault: 50,
    intakes: ['February', 'July'],
    campus: 'Multiple Campuses',
    qsRanking: null, theRanking: null,
    fees: { phd: 24000, masters: 28000, gradDip: 20000, gradCert: 13000, bachelor: 25000, diploma: 18000, default: 25000 },
    livingCostAUD: 19000,
    establishedYear: 1967,
    sameAs: 'https://www.cqu.edu.au',
  },
  {
    id: 'jcu-brisbane',
    name: 'James Cook University Brisbane',
    shortName: 'JCU Brisbane',
    slug: 'jcu-brisbane',
    website: 'https://www.jcu.edu.au',
    sitemaps: ['https://www.jcu.edu.au/sitemap.xml'],
    listingUrls: [
      'https://www.jcu.edu.au/brisbane',
      'https://www.jcu.edu.au/courses/international',
      'https://www.jcu.edu.au/courses',
    ],
    isCourseUrl: (pathname) => {
      const p = pathname.replace(/\/$/, '').split('/').filter(Boolean);
      return (p[0] === 'courses' && p.length === 2) ||
        (p[0] === 'courses' && p.length === 3 && !/(search|browse|apply|fees|scholarships|contact|about|news)/i.test(p[2]))
        && !/(search|browse|apply|fees|scholarships|contact|about|news|event)/i.test(p[p.length-1]);
    },
    city: 'Brisbane', state: 'Queensland', countryCode: 'AU',
    ieltsDefault: 6.0, toeflDefault: 60, pteDefault: 50,
    intakes: ['February', 'July'],
    campus: 'Brisbane Campus',
    qsRanking: 401, theRanking: 401,
    fees: { phd: 26000, masters: 33000, gradDip: 24000, gradCert: 15000, bachelor: 30000, diploma: 22000, default: 30000 },
    livingCostAUD: 21000,
    establishedYear: 1970,
    sameAs: 'https://www.jcu.edu.au',
  },
  {
    id: 'murdoch',
    name: 'Murdoch University',
    shortName: 'Murdoch',
    slug: 'murdoch-university',
    website: 'https://www.murdoch.edu.au',
    sitemaps: ['https://www.murdoch.edu.au/sitemap.xml'],
    listingUrls: [
      'https://www.murdoch.edu.au/study/courses',
      'https://www.murdoch.edu.au/courses',
      'https://www.murdoch.edu.au/international/courses',
    ],
    isCourseUrl: (pathname) => {
      const p = pathname.replace(/\/$/, '').split('/').filter(Boolean);
      return (p[0] === 'study' && p[1] === 'courses' && p.length === 3) ||
        (p[0] === 'courses' && p.length === 2)
        && !/(search|browse|apply|fees|scholarships|contact|about|news|event)/i.test(p[p.length-1]);
    },
    city: 'Perth', state: 'Western Australia', countryCode: 'AU',
    ieltsDefault: 6.0, toeflDefault: 60, pteDefault: 50,
    intakes: ['February', 'July'],
    campus: 'Murdoch Campus',
    qsRanking: 601, theRanking: 601,
    fees: { phd: 26000, masters: 32000, gradDip: 22000, gradCert: 14000, bachelor: 30000, diploma: 22000, default: 30000 },
    livingCostAUD: 20000,
    establishedYear: 1975,
    sameAs: 'https://www.murdoch.edu.au',
  },
  {
    id: 'flinders',
    name: 'Flinders University',
    shortName: 'Flinders',
    slug: 'flinders-university',
    website: 'https://www.flinders.edu.au',
    sitemaps: ['https://www.flinders.edu.au/sitemap.xml'],
    listingUrls: [
      'https://www.flinders.edu.au/study/courses',
      'https://www.flinders.edu.au/international/courses',
    ],
    isCourseUrl: (pathname) => {
      const p = pathname.replace(/\/$/, '').split('/').filter(Boolean);
      return (p[0] === 'study' && p[1] === 'courses' && p.length === 3) ||
        (p[0] === 'courses' && p.length === 2)
        && !/(search|browse|apply|fees|scholarships|contact|about|news|event)/i.test(p[p.length-1]);
    },
    city: 'Adelaide', state: 'South Australia', countryCode: 'AU',
    ieltsDefault: 6.0, toeflDefault: 72, pteDefault: 50,
    intakes: ['February', 'July'],
    campus: 'Bedford Park Campus',
    qsRanking: 397, theRanking: 401,
    fees: { phd: 26000, masters: 33000, gradDip: 24000, gradCert: 15000, bachelor: 31000, diploma: 22000, default: 30000 },
    livingCostAUD: 19000,
    establishedYear: 1966,
    sameAs: 'https://www.flinders.edu.au',
  },
  {
    id: 'utas',
    name: 'University of Tasmania',
    shortName: 'UTAS',
    slug: 'university-of-tasmania',
    website: 'https://www.utas.edu.au',
    sitemaps: ['https://www.utas.edu.au/sitemap.xml'],
    listingUrls: [
      'https://www.utas.edu.au/courses',
      'https://www.utas.edu.au/international/courses',
    ],
    isCourseUrl: (pathname) => {
      const p = pathname.replace(/\/$/, '').split('/').filter(Boolean);
      return (p[0] === 'courses' && p.length === 2) ||
        (p[0] === 'courses' && p.length === 3 && !/(search|browse|apply|fees)/i.test(p[2]))
        && !/(search|browse|apply|fees|scholarships|contact|about|news|event)/i.test(p[p.length-1]);
    },
    city: 'Hobart', state: 'Tasmania', countryCode: 'AU',
    ieltsDefault: 6.0, toeflDefault: 60, pteDefault: 50,
    intakes: ['February', 'July'],
    campus: 'Sandy Bay Campus',
    qsRanking: 401, theRanking: 401,
    fees: { phd: 25000, masters: 30000, gradDip: 22000, gradCert: 14000, bachelor: 28000, diploma: 20000, default: 28000 },
    livingCostAUD: 18000,
    establishedYear: 1890,
    sameAs: 'https://www.utas.edu.au',
  },
  {
    id: 'griffith',
    name: 'Griffith University',
    shortName: 'Griffith',
    slug: 'griffith-university',
    website: 'https://www.griffith.edu.au',
    sitemaps: ['https://www.griffith.edu.au/sitemap.xml'],
    listingUrls: [
      'https://www.griffith.edu.au/study/courses',
      'https://www.griffith.edu.au/international/courses',
    ],
    isCourseUrl: (pathname) => {
      const p = pathname.replace(/\/$/, '').split('/').filter(Boolean);
      return (p[0] === 'study' && p[1] === 'courses' && p.length === 3) ||
        (p[0] === 'courses' && p.length === 2)
        && !/(search|browse|apply|fees|scholarships|contact|about|news|event)/i.test(p[p.length-1]);
    },
    city: 'Brisbane', state: 'Queensland', countryCode: 'AU',
    ieltsDefault: 6.0, toeflDefault: 79, pteDefault: 58,
    intakes: ['February', 'July'],
    campus: 'Nathan Campus',
    qsRanking: 320, theRanking: 351,
    fees: { phd: 27500, masters: 34000, gradDip: 24000, gradCert: 15000, bachelor: 31000, diploma: 22000, default: 31000 },
    livingCostAUD: 21000,
    establishedYear: 1975,
    sameAs: 'https://www.griffith.edu.au',
  },
  {
    id: 'latrobe',
    name: 'La Trobe University',
    shortName: 'La Trobe',
    slug: 'la-trobe-university',
    website: 'https://www.latrobe.edu.au',
    sitemaps: ['https://www.latrobe.edu.au/sitemap.xml'],
    listingUrls: [
      'https://www.latrobe.edu.au/courses',
      'https://www.latrobe.edu.au/study/find-a-course',
      'https://www.latrobe.edu.au/international/study',
    ],
    isCourseUrl: (pathname) => {
      const p = pathname.replace(/\/$/, '').split('/').filter(Boolean);
      return (p[0] === 'courses' && p.length === 2) ||
        (p[0] === 'study' && p[1] === 'find-a-course' && p.length === 3)
        && !/(search|browse|apply|fees|scholarships|contact|about|news|event)/i.test(p[p.length-1]);
    },
    city: 'Melbourne', state: 'Victoria', countryCode: 'AU',
    ieltsDefault: 6.0, toeflDefault: 60, pteDefault: 50,
    intakes: ['February', 'July'],
    campus: 'Bundoora Campus',
    qsRanking: 397, theRanking: 401,
    fees: { phd: 27000, masters: 34000, gradDip: 24000, gradCert: 15000, bachelor: 32000, diploma: 22000, default: 31000 },
    livingCostAUD: 22000,
    establishedYear: 1964,
    sameAs: 'https://www.latrobe.edu.au',
  },
  {
    id: 'deakin',
    name: 'Deakin University',
    shortName: 'Deakin',
    slug: 'deakin-university',
    website: 'https://www.deakin.edu.au',
    sitemaps: ['https://www.deakin.edu.au/sitemap.xml'],
    listingUrls: [
      'https://www.deakin.edu.au/courses',
      'https://www.deakin.edu.au/study/find-a-course',
      'https://www.deakin.edu.au/international/study',
    ],
    isCourseUrl: (pathname) => {
      const p = pathname.replace(/\/$/, '').split('/').filter(Boolean);
      return (p[0] === 'courses' && p.length === 2) ||
        (p[0] === 'study' && p.length >= 2 && p.some(x => x.includes('bachelor') || x.includes('master') || x.includes('diploma')))
        && !/(search|browse|apply|fees|scholarships|contact|about|news|event)/i.test(p[p.length-1]);
    },
    city: 'Melbourne', state: 'Victoria', countryCode: 'AU',
    ieltsDefault: 6.0, toeflDefault: 60, pteDefault: 50,
    intakes: ['February', 'July', 'November'],
    campus: 'Burwood Campus',
    qsRanking: 266, theRanking: 301,
    fees: { phd: 28800, masters: 36000, gradDip: 26000, gradCert: 16000, bachelor: 34000, diploma: 24000, default: 33000 },
    livingCostAUD: 22000,
    establishedYear: 1974,
    sameAs: 'https://www.deakin.edu.au',
  },
];
