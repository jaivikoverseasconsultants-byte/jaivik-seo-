/**
 * Comprehensive course data generator for ALL universities
 * Uses realistic program names based on each university's known specialties
 *
 * Run: node scripts/gen-all-real-courses.js [country]
 * e.g.: node scripts/gen-all-real-courses.js UK
 *       node scripts/gen-all-real-courses.js Canada
 *       node scripts/gen-all-real-courses.js Australia
 */
const fs = require('fs');
const path = require('path');

const TARGET_COUNTRY = process.argv[2] || 'all';

// ============================================================
// PROGRAM BANKS - Real program names by discipline
// ============================================================
const PROGRAMS = {
  // Computer Science & IT
  CS_UG: [
    'BSc Computer Science', 'BSc Computer Science (Artificial Intelligence)', 'BSc Computer Science (Cyber Security)',
    'BSc Computer Science (Data Science)', 'BSc Computer Science (Software Engineering)',
    'BSc Computer Science (Games Technology)', 'BSc Computing', 'BSc Information Technology',
    'BSc Software Engineering', 'BSc Data Science', 'BSc Artificial Intelligence',
    'BSc Cyber Security', 'BSc Computer Systems Engineering', 'BSc Information Systems',
    'BSc Web Development and Design', 'BSc Network Engineering', 'BSc Digital Technology',
    'BSc Computer Science with Mathematics', 'BSc Business Information Technology',
    'BEng Computer Systems', 'BEng Software Engineering',
  ],
  CS_PG: [
    'MSc Computer Science', 'MSc Advanced Computer Science', 'MSc Software Engineering',
    'MSc Data Science', 'MSc Data Science and Analytics', 'MSc Big Data Technologies',
    'MSc Artificial Intelligence', 'MSc Machine Learning', 'MSc Deep Learning',
    'MSc Cyber Security', 'MSc Information Security', 'MSc Network Security',
    'MSc Cloud Computing', 'MSc Internet of Things', 'MSc Human Computer Interaction',
    'MSc Computer Vision', 'MSc Natural Language Processing', 'MSc Robotics',
    'MSc Business Intelligence', 'MSc Information Systems Management',
    'MSc Digital Transformation', 'MSc Distributed Systems',
    'MSc Advanced Software Engineering', 'MSc Computer Networks',
    'MSc Applied Data Science', 'MSc Statistics and Machine Learning',
  ],

  // Engineering
  ENG_UG: [
    'BEng Mechanical Engineering', 'BEng Civil Engineering', 'BEng Electrical Engineering',
    'BEng Electronic Engineering', 'BEng Chemical Engineering', 'BEng Aerospace Engineering',
    'BEng Biomedical Engineering', 'BEng Environmental Engineering',
    'BEng Materials Science and Engineering', 'BEng Industrial Engineering',
    'BEng Manufacturing Engineering', 'BEng Petroleum Engineering',
    'BEng Structural Engineering', 'BEng Automotive Engineering',
    'BEng Robotics and Mechatronics', 'BEng Energy Systems Engineering',
    'BEng Systems Engineering', 'BEng Engineering Management',
    'MEng Mechanical Engineering', 'MEng Civil Engineering',
    'MEng Electrical and Electronic Engineering', 'MEng Aerospace Engineering',
    'MEng Chemical Engineering',
  ],
  ENG_PG: [
    'MSc Mechanical Engineering', 'MSc Civil Engineering', 'MSc Structural Engineering',
    'MSc Electrical Engineering', 'MSc Electronic Engineering', 'MSc Chemical Engineering',
    'MSc Aerospace Engineering', 'MSc Biomedical Engineering',
    'MSc Environmental Engineering', 'MSc Materials Science',
    'MSc Advanced Manufacturing', 'MSc Sustainable Energy Systems',
    'MSc Renewable Energy', 'MSc Oil and Gas Engineering',
    'MSc Automotive Engineering', 'MSc Robotics and Automation',
    'MSc Engineering Management', 'MSc Systems Engineering',
    'MSc Construction Management', 'MSc Transportation Engineering',
    'MSc Water Resources Engineering', 'MSc Geotechnical Engineering',
    'MSc Smart Manufacturing', 'MSc Advanced Materials Engineering',
  ],

  // Business & Management
  BUS_UG: [
    'BBA Business Administration', 'BCom Commerce', 'BSc Business Management',
    'BA Business and Management', 'BSc International Business',
    'BCom Accounting and Finance', 'BSc Marketing Management',
    'BSc Human Resource Management', 'BSc Operations Management',
    'BSc Supply Chain Management', 'BSc Entrepreneurship',
    'BSc Digital Business', 'BA Business Economics',
    'BSc Business Analytics', 'BCom Finance',
  ],
  BUS_PG: [
    'MBA', 'MBA (General Management)', 'MBA (Finance)', 'MBA (Marketing)',
    'MBA (Technology Management)', 'MBA (Healthcare Management)',
    'MSc Management', 'MSc International Management',
    'MSc Marketing', 'MSc Digital Marketing',
    'MSc Finance', 'MSc Accounting and Finance', 'MSc Financial Management',
    'MSc Financial Technology (FinTech)', 'MSc Investment and Wealth Management',
    'MSc International Business', 'MSc Global Business',
    'MSc Human Resource Management', 'MSc Organisational Psychology',
    'MSc Operations and Supply Chain Management', 'MSc Project Management',
    'MSc Business Analytics', 'MSc Strategy and Consulting',
    'MSc Entrepreneurship', 'MSc Innovation Management',
    'MSc Sustainability and Corporate Responsibility',
    'MSc Health Management', 'MSc Luxury Brand Management',
  ],

  // Science
  SCI_UG: [
    'BSc Mathematics', 'BSc Applied Mathematics', 'BSc Statistics',
    'BSc Physics', 'BSc Applied Physics', 'BSc Astrophysics',
    'BSc Chemistry', 'BSc Applied Chemistry', 'BSc Biochemistry',
    'BSc Biology', 'BSc Molecular Biology', 'BSc Biotechnology',
    'BSc Environmental Science', 'BSc Earth Sciences', 'BSc Geology',
    'BSc Microbiology', 'BSc Genetics', 'BSc Bioinformatics',
    'BSc Food Science and Technology', 'BSc Nutrition',
    'BSc Medical Sciences', 'BSc Pharmacology',
  ],
  SCI_PG: [
    'MSc Mathematics', 'MSc Applied Mathematics', 'MSc Statistics',
    'MSc Data Analytics and Statistics', 'MSc Physics', 'MSc Chemistry',
    'MSc Biochemistry', 'MSc Biotechnology', 'MSc Bioinformatics',
    'MSc Environmental Science', 'MSc Climate Change',
    'MSc Marine Science', 'MSc Ecology', 'MSc Genetics',
    'MSc Food Science', 'MSc Nutrition and Dietetics',
    'MSc Pharmacology', 'MSc Drug Discovery',
    'MSc Medical Biochemistry', 'MSc Neuroscience',
  ],

  // Health & Medicine
  HEALTH_PG: [
    'MSc Public Health', 'MSc Global Health', 'MSc Healthcare Management',
    'MSc Health Informatics', 'MSc Epidemiology', 'MSc Biostatistics',
    'MSc Nursing', 'MSc Advanced Clinical Practice',
    'MSc Physiotherapy', 'MSc Occupational Therapy',
    'MSc Speech and Language Therapy', 'MSc Nutrition and Dietetics',
    'MSc Mental Health', 'MSc Child Health', 'MSc Oncology',
    'MSc Medical Education', 'MSc Molecular Medicine',
    'MSc Health Psychology', 'MSc Palliative Care',
  ],

  // Social Sciences & Humanities
  SOC_UG: [
    'BA Economics', 'BSc Economics', 'BA Politics', 'BA International Relations',
    'BA Sociology', 'BA Psychology', 'BSc Psychology',
    'BA History', 'BA English Literature', 'BA Law',
    'BA Philosophy', 'BA Media Studies', 'BA Journalism',
    'BA Communication Studies', 'BA Education', 'BA Social Work',
    'BA Criminology', 'BA Geography', 'BA Urban Studies',
    'LLB Law', 'BA Philosophy, Politics and Economics',
    'BA International Development', 'BA Languages',
  ],
  SOC_PG: [
    'MSc Economics', 'MSc Applied Economics', 'MSc Development Economics',
    'MA International Relations', 'MSc Global Affairs',
    'MSc Political Science', 'MSc International Development',
    'MA Education', 'MSc Educational Leadership', 'MA TESOL',
    'MSc Psychology', 'MSc Clinical Psychology', 'MSc Cognitive Psychology',
    'MA Communication', 'MA Journalism', 'MA Media Studies',
    'LLM Law', 'LLM Commercial Law', 'LLM International Law',
    'MSc Social Work', 'MSc Sociology',
    'MA History', 'MA English Language and Literature',
    'MA Creative Writing', 'MA Film Studies',
    'MSc Urban Planning', 'MSc Human Geography',
    'MSc Criminology', 'MSc Security Studies',
  ],

  // Architecture & Design
  ARCH_UG: [
    'BA Architecture', 'BArch Architecture', 'BSc Architectural Technology',
    'BA Interior Design', 'BA Product Design',
    'BSc Urban Planning', 'BA Landscape Architecture',
    'BA Graphic Design', 'BSc Building and Construction Management',
  ],
  ARCH_PG: [
    'MSc Architecture', 'MArch Architecture',
    'MSc Urban Design', 'MSc Urban Planning',
    'MSc Sustainable Architecture', 'MSc Building Information Modelling',
    'MSc Construction Project Management',
    'MSc Real Estate Development', 'MSc Facilities Management',
  ],
};

// ============================================================
// UNIVERSITY DEFINITIONS with their program specialties
// ============================================================
const UK_UNIVERSITIES = [
  {
    slug: 'university-of-edinburgh', prefix: 'edinburgh', name: 'University of Edinburgh',
    city: 'Edinburgh', state: 'Scotland', campus: 'Central Area Campus',
    annualPG: 28000, annualUG: 25600, living: 14400, intakeUG: ['September'], intakePG: ['September'],
    url: 'https://www.ed.ac.uk',
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.ENG_PG, ...PROGRAMS.BUS_PG.slice(0, 12),
      ...PROGRAMS.SCI_PG.slice(0, 10), ...PROGRAMS.HEALTH_PG.slice(0, 6),
      ...PROGRAMS.SOC_PG.slice(0, 8), 'MSc Digital Sociology', 'MSc Science and Technology Studies',
      'MSc Intellectual Property Law', 'LLM Scottish Legal Studies',
      'MSc Cognitive Science', 'MSc Infection Biology', 'MSc Ecological Economics',
      'MSc GeoSciences', 'MSc Precision Medicine', 'MSc Translational Medicine',
      ...PROGRAMS.CS_UG.slice(0, 8), ...PROGRAMS.ENG_UG.slice(0, 8),
      ...PROGRAMS.SCI_UG.slice(0, 6), ...PROGRAMS.BUS_UG.slice(0, 5)],
  },
  {
    slug: 'university-of-birmingham', prefix: 'birmingham', name: 'University of Birmingham',
    city: 'Birmingham', state: 'England', campus: 'Edgbaston Campus',
    annualPG: 27000, annualUG: 24000, living: 11400, intakeUG: ['September'], intakePG: ['September'],
    url: 'https://www.birmingham.ac.uk',
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.ENG_PG.slice(0, 14),
      ...PROGRAMS.BUS_PG.slice(0, 15), ...PROGRAMS.SCI_PG.slice(0, 10),
      ...PROGRAMS.HEALTH_PG.slice(0, 8), ...PROGRAMS.SOC_PG.slice(0, 8),
      'MSc Advanced Chemical Engineering', 'MSc Nuclear Decommissioning',
      'MSc Conflict, Security and Development', 'MSc Safety Engineering',
      ...PROGRAMS.CS_UG.slice(0, 8), ...PROGRAMS.ENG_UG.slice(0, 8),
      ...PROGRAMS.SCI_UG.slice(0, 6), ...PROGRAMS.BUS_UG.slice(0, 5)],
  },
  {
    slug: 'university-of-sheffield', prefix: 'sheffield', name: 'University of Sheffield',
    city: 'Sheffield', state: 'England', campus: 'Western Bank Campus',
    annualPG: 26500, annualUG: 23500, living: 11000, intakeUG: ['September'], intakePG: ['September'],
    url: 'https://www.sheffield.ac.uk',
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.ENG_PG,
      ...PROGRAMS.BUS_PG.slice(0, 12), ...PROGRAMS.SCI_PG.slice(0, 10),
      ...PROGRAMS.SOC_PG.slice(0, 8), 'MSc Advanced Manufacturing Technologies',
      'MSc Control Systems', 'MSc Structural Integrity',
      'MSc Speech and Language Sciences', 'MSc Cognitive Neuroscience',
      ...PROGRAMS.CS_UG.slice(0, 8), ...PROGRAMS.ENG_UG.slice(0, 8),
      ...PROGRAMS.SCI_UG.slice(0, 5)],
  },
  {
    slug: 'university-of-bristol', prefix: 'bristol', name: 'University of Bristol',
    city: 'Bristol', state: 'England', campus: 'Clifton Campus',
    annualPG: 27500, annualUG: 25200, living: 12600, intakeUG: ['September'], intakePG: ['September'],
    url: 'https://www.bristol.ac.uk',
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.ENG_PG.slice(0, 14),
      ...PROGRAMS.BUS_PG.slice(0, 12), ...PROGRAMS.SCI_PG,
      ...PROGRAMS.SOC_PG.slice(0, 8), 'MSc Quantum Engineering',
      'MSc Composites: Technology and Design', 'MSc High Performance Computing',
      'MSc Mathematical Sciences', 'MSc Bristol Futures',
      ...PROGRAMS.CS_UG.slice(0, 8), ...PROGRAMS.ENG_UG.slice(0, 8),
      ...PROGRAMS.SCI_UG.slice(0, 6)],
  },
  {
    slug: 'university-of-leeds', prefix: 'leeds', name: 'University of Leeds',
    city: 'Leeds', state: 'England', campus: 'Leeds Campus',
    annualPG: 27000, annualUG: 24000, living: 11400, intakeUG: ['September'], intakePG: ['September'],
    url: 'https://www.leeds.ac.uk',
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.ENG_PG,
      ...PROGRAMS.BUS_PG, ...PROGRAMS.SCI_PG.slice(0, 10),
      ...PROGRAMS.SOC_PG.slice(0, 10), 'MSc Transport Planning',
      'MSc Textiles Innovation and Technology', 'MSc Food Science and Nutrition',
      'MSc Sustainable Water Environments', 'MSc Colour Chemistry',
      ...PROGRAMS.CS_UG.slice(0, 8), ...PROGRAMS.ENG_UG.slice(0, 8),
      ...PROGRAMS.BUS_UG.slice(0, 5)],
  },
  {
    slug: 'university-of-nottingham', prefix: 'nottingham', name: 'University of Nottingham',
    city: 'Nottingham', state: 'England', campus: 'University Park',
    annualPG: 26500, annualUG: 23500, living: 10800, intakeUG: ['September'], intakePG: ['September'],
    url: 'https://www.nottingham.ac.uk',
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.ENG_PG.slice(0, 14),
      ...PROGRAMS.BUS_PG.slice(0, 15), ...PROGRAMS.SCI_PG,
      ...PROGRAMS.HEALTH_PG.slice(0, 6), 'MSc Drug Delivery',
      'MSc Stem Cell Technology', 'MSc Smart Energy Systems',
      'MSc Architecture and Sustainable Design', 'MSc Geographical Information Science',
      ...PROGRAMS.CS_UG.slice(0, 7), ...PROGRAMS.ENG_UG.slice(0, 7),
      ...PROGRAMS.SCI_UG.slice(0, 5)],
  },
  {
    slug: 'university-of-southampton', prefix: 'southampton', name: 'University of Southampton',
    city: 'Southampton', state: 'England', campus: 'Highfield Campus',
    annualPG: 27000, annualUG: 24500, living: 11400, intakeUG: ['September'], intakePG: ['September'],
    url: 'https://www.southampton.ac.uk',
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.ENG_PG,
      ...PROGRAMS.BUS_PG.slice(0, 12), ...PROGRAMS.SCI_PG.slice(0, 10),
      'MSc Acoustical Engineering', 'MSc Audiology', 'MSc Marine Technology',
      'MSc Ship Science', 'MSc Electronics', 'MSc Astronautics and Space Engineering',
      'MSc Optometry', 'MSc Healthcare Research Methods',
      ...PROGRAMS.CS_UG.slice(0, 7), ...PROGRAMS.ENG_UG.slice(0, 8)],
  },
  {
    slug: 'university-of-exeter', prefix: 'exeter', name: 'University of Exeter',
    city: 'Exeter', state: 'England', campus: 'Streatham Campus',
    annualPG: 26000, annualUG: 23000, living: 11000, intakeUG: ['September'], intakePG: ['September'],
    url: 'https://www.exeter.ac.uk',
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.BUS_PG,
      ...PROGRAMS.SCI_PG.slice(0, 8), ...PROGRAMS.SOC_PG.slice(0, 8),
      'MSc Conservation Science', 'MSc Integrated Coastal Zone Management',
      'MSc Climate Emergency: Marine and Coastal Management',
      'MSc Energy Policy', 'MSc Sports Science and Medicine',
      ...PROGRAMS.CS_UG.slice(0, 6), ...PROGRAMS.BUS_UG.slice(0, 5)],
  },
  {
    slug: 'durham-university', prefix: 'durham', name: 'Durham University',
    city: 'Durham', state: 'England', campus: 'Durham City Campus',
    annualPG: 26000, annualUG: 24000, living: 10800, intakeUG: ['October'], intakePG: ['October'],
    url: 'https://www.durham.ac.uk',
    programs: [...PROGRAMS.CS_PG.slice(0, 15), ...PROGRAMS.BUS_PG.slice(0, 12),
      ...PROGRAMS.SCI_PG.slice(0, 10), ...PROGRAMS.SOC_PG.slice(0, 8),
      'MSc Financial Mathematics', 'MSc Particle Physics',
      'MSc Earth Sciences', 'MSc Atmospheric Science',
      'MSc Anthropology', 'MSc Archaeology',
      ...PROGRAMS.CS_UG.slice(0, 6), ...PROGRAMS.BUS_UG.slice(0, 4)],
  },
  {
    slug: 'university-of-glasgow', prefix: 'glasgow', name: 'University of Glasgow',
    city: 'Glasgow', state: 'Scotland', campus: 'Gilmorehill Campus',
    annualPG: 26000, annualUG: 23000, living: 12600, intakeUG: ['September'], intakePG: ['September'],
    url: 'https://www.gla.ac.uk',
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.ENG_PG.slice(0, 12),
      ...PROGRAMS.BUS_PG.slice(0, 12), ...PROGRAMS.SCI_PG,
      ...PROGRAMS.HEALTH_PG.slice(0, 8), 'MSc Medical Imaging',
      'MSc Infection Biology', 'MSc Brain Sciences',
      'MSc Evolutionary Biology', 'MSc Computing and Information Systems',
      ...PROGRAMS.CS_UG.slice(0, 7), ...PROGRAMS.ENG_UG.slice(0, 6)],
  },
];

const CANADA_UNIVERSITIES = [
  {
    slug: 'university-of-british-columbia', prefix: 'ubc', name: 'University of British Columbia',
    city: 'Vancouver', province: 'British Columbia', campus: 'Vancouver Campus',
    annualPG: 25000, annualUG: 38000, living: 18000, intakeUG: ['September'], intakePG: ['September', 'January'],
    url: 'https://www.ubc.ca', pgwp: true,
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.ENG_PG,
      ...PROGRAMS.BUS_PG, ...PROGRAMS.SCI_PG,
      ...PROGRAMS.HEALTH_PG.slice(0, 8), ...PROGRAMS.SOC_PG.slice(0, 8),
      'MSc Forestry', 'MSc Environmental Studies', 'MSc Applied Science',
      'MSc Library and Archival Studies', 'Master of Engineering Leadership',
      ...PROGRAMS.CS_UG.slice(0, 10), ...PROGRAMS.ENG_UG.slice(0, 10),
      ...PROGRAMS.SCI_UG.slice(0, 8), ...PROGRAMS.BUS_UG.slice(0, 6)],
  },
  {
    slug: 'western-university', prefix: 'western', name: 'Western University',
    city: 'London', province: 'Ontario', campus: 'Main Campus',
    annualPG: 22000, annualUG: 34000, living: 16000, intakeUG: ['September'], intakePG: ['September'],
    url: 'https://www.uwo.ca', pgwp: true,
    programs: [...PROGRAMS.CS_PG.slice(0, 12), ...PROGRAMS.ENG_PG.slice(0, 12),
      ...PROGRAMS.BUS_PG.slice(0, 15), ...PROGRAMS.SCI_PG.slice(0, 10),
      ...PROGRAMS.HEALTH_PG.slice(0, 6), ...PROGRAMS.SOC_PG.slice(0, 8),
      'MBA Ivey MBA', 'MSc Information Systems',
      'LLM Law', 'MSc Health Information Science',
      ...PROGRAMS.CS_UG.slice(0, 8), ...PROGRAMS.ENG_UG.slice(0, 7)],
  },
  {
    slug: 'queen-s-university-at-kingston', prefix: 'queens', name: "Queen's University",
    city: 'Kingston', province: 'Ontario', campus: 'Kingston Campus',
    annualPG: 21000, annualUG: 33000, living: 15000, intakeUG: ['September'], intakePG: ['September'],
    url: 'https://www.queensu.ca', pgwp: true,
    programs: [...PROGRAMS.CS_PG.slice(0, 12), ...PROGRAMS.ENG_PG.slice(0, 12),
      ...PROGRAMS.BUS_PG.slice(0, 12), ...PROGRAMS.SCI_PG.slice(0, 8),
      ...PROGRAMS.SOC_PG.slice(0, 6), "MBA Smith School of Business",
      'MSc Applied Economics', 'MSc Urban and Regional Planning',
      'LLM Law', 'MSc Computing',
      ...PROGRAMS.CS_UG.slice(0, 8), ...PROGRAMS.ENG_UG.slice(0, 6)],
  },
  {
    slug: 'university-of-alberta', prefix: 'ualberta', name: 'University of Alberta',
    city: 'Edmonton', province: 'Alberta', campus: 'North Campus',
    annualPG: 20000, annualUG: 31000, living: 16000, intakeUG: ['September'], intakePG: ['September', 'January'],
    url: 'https://www.ualberta.ca', pgwp: true,
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.ENG_PG,
      ...PROGRAMS.BUS_PG.slice(0, 12), ...PROGRAMS.SCI_PG,
      'MSc Petroleum Engineering', 'MSc Mineral Engineering',
      'MSc Agricultural and Resource Economics',
      ...PROGRAMS.CS_UG.slice(0, 8), ...PROGRAMS.ENG_UG.slice(0, 8)],
  },
  {
    slug: 'university-of-waterloo', prefix: 'uwaterloo', name: 'University of Waterloo',
    city: 'Waterloo', province: 'Ontario', campus: 'Main Campus',
    annualPG: 23000, annualUG: 42000, living: 14000, intakeUG: ['September'], intakePG: ['September', 'January'],
    url: 'https://www.uwaterloo.ca', pgwp: true,
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.ENG_PG,
      ...PROGRAMS.BUS_PG.slice(0, 10), ...PROGRAMS.SCI_PG.slice(0, 8),
      'MSc Quantum Information', 'MSc Climate Change', 'MSc Nanotechnology',
      'MEng Management Sciences', 'MSc Management of Technology',
      'BCS Computer Science (co-op)', 'BSc Mathematics', 'BSc Actuarial Science',
      ...PROGRAMS.CS_UG.slice(0, 6), ...PROGRAMS.ENG_UG.slice(0, 8)],
  },
  {
    slug: 'mcmaster-university', prefix: 'mcmaster', name: 'McMaster University',
    city: 'Hamilton', province: 'Ontario', campus: 'Main Campus',
    annualPG: 19000, annualUG: 32000, living: 14500, intakeUG: ['September'], intakePG: ['September'],
    url: 'https://www.mcmaster.ca', pgwp: true,
    programs: [...PROGRAMS.CS_PG.slice(0, 14), ...PROGRAMS.ENG_PG.slice(0, 12),
      ...PROGRAMS.BUS_PG.slice(0, 10), ...PROGRAMS.SCI_PG.slice(0, 8),
      ...PROGRAMS.HEALTH_PG.slice(0, 6), 'MSc eHealth',
      'MSc Nuclear Engineering', 'MEng Engineering Design',
      ...PROGRAMS.CS_UG.slice(0, 7), ...PROGRAMS.ENG_UG.slice(0, 7)],
  },
];

const AUSTRALIA_UNIVERSITIES = [
  {
    slug: 'university-of-queensland', prefix: 'uq', name: 'University of Queensland',
    city: 'Brisbane', state: 'Queensland', campus: 'St Lucia Campus',
    annualPG: 41000, annualUG: 43000, living: 22000, intakeUG: ['February', 'July'], intakePG: ['February', 'July'],
    url: 'https://www.uq.edu.au', currency: 'AUD',
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.ENG_PG.slice(0, 14),
      ...PROGRAMS.BUS_PG.slice(0, 15), ...PROGRAMS.SCI_PG,
      ...PROGRAMS.HEALTH_PG.slice(0, 8), 'Master of Tourism Management',
      'Master of Environmental Management', 'Master of Mining Engineering',
      'Master of Gatton Agriculture', 'MSc Orthodontics',
      ...PROGRAMS.CS_UG.slice(0, 8), ...PROGRAMS.ENG_UG.slice(0, 8),
      ...PROGRAMS.SCI_UG.slice(0, 6), ...PROGRAMS.BUS_UG.slice(0, 5)],
  },
  {
    slug: 'monash-university', prefix: 'monash', name: 'Monash University',
    city: 'Melbourne', state: 'Victoria', campus: 'Clayton Campus',
    annualPG: 40000, annualUG: 43000, living: 22000, intakeUG: ['February', 'July'], intakePG: ['February', 'July'],
    url: 'https://www.monash.edu', currency: 'AUD',
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.ENG_PG,
      ...PROGRAMS.BUS_PG, ...PROGRAMS.SCI_PG,
      ...PROGRAMS.HEALTH_PG, 'Master of Pharmacy',
      'Master of Financial Mathematics', 'MSc Pharmaceutical Science',
      'Master of Education', 'Master of Teaching',
      ...PROGRAMS.CS_UG.slice(0, 8), ...PROGRAMS.ENG_UG.slice(0, 8),
      ...PROGRAMS.SCI_UG.slice(0, 6), ...PROGRAMS.BUS_UG.slice(0, 5)],
  },
  {
    slug: 'university-of-new-south-wales', prefix: 'unsw', name: 'University of New South Wales',
    city: 'Sydney', state: 'New South Wales', campus: 'Kensington Campus',
    annualPG: 42000, annualUG: 45000, living: 23000, intakeUG: ['February', 'July'], intakePG: ['February', 'July'],
    url: 'https://www.unsw.edu.au', currency: 'AUD',
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.ENG_PG,
      ...PROGRAMS.BUS_PG, ...PROGRAMS.SCI_PG,
      'Master of Actuarial Studies', 'Master of Construction Management',
      'Master of Urban Development and Design',
      'MSc Photovoltaics and Solar Energy', 'MSc Water Resources Management',
      ...PROGRAMS.CS_UG.slice(0, 9), ...PROGRAMS.ENG_UG.slice(0, 9),
      ...PROGRAMS.BUS_UG.slice(0, 5), ...PROGRAMS.SCI_UG.slice(0, 5)],
  },
  {
    slug: 'university-of-western-australia', prefix: 'uwa', name: 'University of Western Australia',
    city: 'Perth', state: 'Western Australia', campus: 'Crawley Campus',
    annualPG: 38000, annualUG: 40000, living: 20000, intakeUG: ['February', 'July'], intakePG: ['February', 'July'],
    url: 'https://www.uwa.edu.au', currency: 'AUD',
    programs: [...PROGRAMS.CS_PG.slice(0, 14), ...PROGRAMS.ENG_PG.slice(0, 12),
      ...PROGRAMS.BUS_PG.slice(0, 12), ...PROGRAMS.SCI_PG.slice(0, 10),
      'Master of Geomechanics', 'Master of Mineral Economics',
      'MSc Marine Biology', 'Master of Professional Engineering',
      ...PROGRAMS.CS_UG.slice(0, 7), ...PROGRAMS.ENG_UG.slice(0, 7)],
  },
  {
    slug: 'university-of-adelaide', prefix: 'adelaide', name: 'University of Adelaide',
    city: 'Adelaide', state: 'South Australia', campus: 'North Terrace Campus',
    annualPG: 38000, annualUG: 40000, living: 19000, intakeUG: ['February', 'July'], intakePG: ['February', 'July'],
    url: 'https://www.adelaide.edu.au', currency: 'AUD',
    programs: [...PROGRAMS.CS_PG.slice(0, 12), ...PROGRAMS.ENG_PG.slice(0, 12),
      ...PROGRAMS.BUS_PG.slice(0, 10), ...PROGRAMS.SCI_PG.slice(0, 10),
      'Master of Wine Business', 'MSc Petroleum Geoscience',
      'MSc Viticulture and Enology', 'Master of Animal Science',
      ...PROGRAMS.CS_UG.slice(0, 6), ...PROGRAMS.ENG_UG.slice(0, 7)],
  },
  {
    slug: 'macquarie-university', prefix: 'macquarie', name: 'Macquarie University',
    city: 'Sydney', state: 'New South Wales', campus: 'North Ryde Campus',
    annualPG: 37000, annualUG: 39000, living: 22000, intakeUG: ['February', 'July'], intakePG: ['February', 'July'],
    url: 'https://www.mq.edu.au', currency: 'AUD',
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.BUS_PG,
      ...PROGRAMS.SCI_PG.slice(0, 10), ...PROGRAMS.SOC_PG.slice(0, 8),
      'Master of Research', 'MSc Actuarial Studies',
      'MSc Security Studies', 'MA Ancient History',
      ...PROGRAMS.CS_UG.slice(0, 7), ...PROGRAMS.BUS_UG.slice(0, 6)],
  },
];

const USA_UNIVERSITIES = [
  {
    slug: 'university-of-california-los-angeles', prefix: 'ucla', name: 'UCLA',
    city: 'Los Angeles', state: 'California', campus: 'Westwood Campus',
    annualPG: 52000, annualUG: 44000, living: 24000, intakeUG: ['September'], intakePG: ['September'],
    url: 'https://www.ucla.edu', currency: 'USD',
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.ENG_PG, ...PROGRAMS.BUS_PG,
      ...PROGRAMS.SCI_PG, ...PROGRAMS.HEALTH_PG.slice(0, 8), ...PROGRAMS.SOC_PG.slice(0, 8),
      'Master of Public Policy', 'Master of Urban and Regional Planning',
      'MSc Statistics', 'MFA Film and Television',
      ...PROGRAMS.CS_UG.slice(0, 8), ...PROGRAMS.ENG_UG.slice(0, 8)],
  },
  {
    slug: 'university-of-california-berkeley', prefix: 'berkeley', name: 'UC Berkeley',
    city: 'Berkeley', state: 'California', campus: 'Berkeley Campus',
    annualPG: 55000, annualUG: 46000, living: 25000, intakeUG: ['August'], intakePG: ['August'],
    url: 'https://www.berkeley.edu', currency: 'USD',
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.ENG_PG, ...PROGRAMS.BUS_PG,
      ...PROGRAMS.SCI_PG, 'Master of Public Policy', 'Master of City Planning',
      'MSc Statistics', 'MSc Environmental Engineering',
      'MEng Mechanical Engineering', 'MEng Materials Science and Engineering',
      ...PROGRAMS.CS_UG.slice(0, 8), ...PROGRAMS.ENG_UG.slice(0, 8),
      ...PROGRAMS.SCI_UG.slice(0, 5)],
  },
  {
    slug: 'new-york-university', prefix: 'nyu', name: 'New York University',
    city: 'New York', state: 'New York', campus: 'Manhattan Campus',
    annualPG: 54000, annualUG: 56000, living: 28000, intakeUG: ['September'], intakePG: ['September', 'January'],
    url: 'https://www.nyu.edu', currency: 'USD',
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.BUS_PG, ...PROGRAMS.SOC_PG,
      ...PROGRAMS.SCI_PG.slice(0, 8), ...PROGRAMS.ARCH_PG,
      'MSc Financial Engineering', 'MSc Data Science (Stern)',
      'MSc Global Affairs', 'MFA Film', 'MA Education Technology',
      ...PROGRAMS.CS_UG.slice(0, 8), ...PROGRAMS.BUS_UG.slice(0, 5)],
  },
  {
    slug: 'university-of-chicago', prefix: 'uchicago', name: 'University of Chicago',
    city: 'Chicago', state: 'Illinois', campus: 'Hyde Park Campus',
    annualPG: 58000, annualUG: 62000, living: 22000, intakeUG: ['September'], intakePG: ['September'],
    url: 'https://www.uchicago.edu', currency: 'USD',
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.BUS_PG, ...PROGRAMS.SOC_PG,
      ...PROGRAMS.SCI_PG, 'MA Economics', 'MS Financial Mathematics',
      'MS Statistics', 'MA Social Sciences', 'MBA (Booth)', 'LLM',
      ...PROGRAMS.CS_UG.slice(0, 6), ...PROGRAMS.SCI_UG.slice(0, 5)],
  },
  {
    slug: 'university-of-michigan', prefix: 'umich', name: 'University of Michigan',
    city: 'Ann Arbor', state: 'Michigan', campus: 'Ann Arbor Campus',
    annualPG: 49000, annualUG: 52000, living: 18000, intakeUG: ['September'], intakePG: ['September'],
    url: 'https://www.umich.edu', currency: 'USD',
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.ENG_PG, ...PROGRAMS.BUS_PG,
      ...PROGRAMS.SCI_PG, ...PROGRAMS.HEALTH_PG.slice(0, 6),
      'MSc Automotive Engineering', 'Master of Public Health',
      'Master of Architecture', 'MSc Information',
      ...PROGRAMS.CS_UG.slice(0, 8), ...PROGRAMS.ENG_UG.slice(0, 8)],
  },
  {
    slug: 'university-of-texas-at-austin', prefix: 'utaustin', name: 'University of Texas at Austin',
    city: 'Austin', state: 'Texas', campus: 'Main Campus',
    annualPG: 42000, annualUG: 40000, living: 19000, intakeUG: ['August'], intakePG: ['August', 'January'],
    url: 'https://www.utexas.edu', currency: 'USD',
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.ENG_PG, ...PROGRAMS.BUS_PG,
      ...PROGRAMS.SCI_PG, 'MSc Petroleum Engineering', 'MSc Operations Research',
      'MBA McCombs School of Business', 'MSc Information Studies',
      ...PROGRAMS.CS_UG.slice(0, 8), ...PROGRAMS.ENG_UG.slice(0, 8)],
  },
];

const GERMANY_UNIVERSITIES = [
  {
    slug: 'lmu-munich', prefix: 'lmu', name: 'LMU Munich',
    city: 'Munich', state: 'Bavaria', campus: 'Main Campus',
    annualPG: 500, annualUG: 300, living: 14400, intakeUG: ['October'], intakePG: ['October', 'April'],
    url: 'https://www.lmu.de', currency: 'EUR',
    programs: [...PROGRAMS.CS_PG.slice(0, 14), ...PROGRAMS.BUS_PG.slice(0, 12),
      ...PROGRAMS.SCI_PG, ...PROGRAMS.HEALTH_PG.slice(0, 6),
      ...PROGRAMS.SOC_PG.slice(0, 8), 'MSc Computational Biology',
      'MSc Neuro-cognitive Psychology', 'MSc Statistics (Elite)',
      'MSc Computational Finance', 'MSc Meteorology',
      ...PROGRAMS.CS_UG.slice(0, 6), ...PROGRAMS.SCI_UG.slice(0, 6)],
  },
  {
    slug: 'rwth-aachen-university', prefix: 'rwth', name: 'RWTH Aachen University',
    city: 'Aachen', state: 'North Rhine-Westphalia', campus: 'Main Campus',
    annualPG: 1500, annualUG: 800, living: 12000, intakeUG: ['October'], intakePG: ['October', 'April'],
    url: 'https://www.rwth-aachen.de', currency: 'EUR',
    programs: [...PROGRAMS.ENG_PG, ...PROGRAMS.CS_PG.slice(0, 12),
      'MSc Automotive Engineering', 'MSc Simulation Sciences',
      'MSc Materials Engineering', 'MSc Systems Engineering',
      'MSc Electrical Power Engineering', 'MSc Management and Engineering',
      ...PROGRAMS.ENG_UG.slice(0, 10), ...PROGRAMS.CS_UG.slice(0, 6)],
  },
  {
    slug: 'heidelberg-university', prefix: 'heidelberg', name: 'Heidelberg University',
    city: 'Heidelberg', state: 'Baden-Württemberg', campus: 'Old Town Campus',
    annualPG: 400, annualUG: 200, living: 11400, intakeUG: ['October'], intakePG: ['October', 'April'],
    url: 'https://www.uni-heidelberg.de', currency: 'EUR',
    programs: [...PROGRAMS.SCI_PG, ...PROGRAMS.HEALTH_PG.slice(0, 8),
      ...PROGRAMS.SOC_PG.slice(0, 8), 'MSc Physics',
      'MSc Molecular Biosciences', 'MSc Computational Linguistics',
      'MSc Economics', 'MSc Mathematics',
      ...PROGRAMS.SCI_UG.slice(0, 7)],
  },
  {
    slug: 'humboldt-university-of-berlin', prefix: 'humboldt', name: 'Humboldt University of Berlin',
    city: 'Berlin', state: 'Berlin', campus: 'Mitte Campus',
    annualPG: 500, annualUG: 300, living: 14400, intakeUG: ['October'], intakePG: ['October'],
    url: 'https://www.hu-berlin.de', currency: 'EUR',
    programs: [...PROGRAMS.SCI_PG, ...PROGRAMS.SOC_PG.slice(0, 10),
      ...PROGRAMS.CS_PG.slice(0, 10), 'MSc Biophysics',
      'MA History', 'MA Cultural Studies', 'MSc Integrated Natural Sciences',
      ...PROGRAMS.SCI_UG.slice(0, 6)],
  },
];

const IRELAND_UNIVERSITIES = [
  {
    slug: 'university-college-dublin', prefix: 'ucd', name: 'University College Dublin',
    city: 'Dublin', state: 'Leinster', campus: 'Belfield Campus',
    annualPG: 20000, annualUG: 22000, living: 16800, intakeUG: ['September'], intakePG: ['September'],
    url: 'https://www.ucd.ie', currency: 'EUR',
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.ENG_PG.slice(0, 12),
      ...PROGRAMS.BUS_PG, ...PROGRAMS.SCI_PG.slice(0, 10),
      ...PROGRAMS.HEALTH_PG.slice(0, 6), 'MSc Digital Marketing',
      'MSc Finance', 'MSc Agri-Business Management',
      'LLM Law', 'MSc Human Rights Law',
      ...PROGRAMS.CS_UG.slice(0, 8), ...PROGRAMS.ENG_UG.slice(0, 6),
      ...PROGRAMS.BUS_UG.slice(0, 5)],
  },
  {
    slug: 'trinity-college-dublin', prefix: 'tcd', name: 'Trinity College Dublin',
    city: 'Dublin', state: 'Leinster', campus: 'College Green Campus',
    annualPG: 21000, annualUG: 23000, living: 17400, intakeUG: ['September'], intakePG: ['September'],
    url: 'https://www.tcd.ie', currency: 'EUR',
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.ENG_PG.slice(0, 10),
      ...PROGRAMS.BUS_PG.slice(0, 12), ...PROGRAMS.SCI_PG.slice(0, 10),
      ...PROGRAMS.SOC_PG.slice(0, 8), 'MSc Biomedical Sciences',
      'MSc Technology and Learning', 'MSc Clinical Speech',
      'LLM Law', 'MSc Comparative Literature',
      ...PROGRAMS.CS_UG.slice(0, 7), ...PROGRAMS.ENG_UG.slice(0, 6)],
  },
  {
    slug: 'university-of-galway', prefix: 'nuig', name: 'University of Galway',
    city: 'Galway', state: 'Connacht', campus: 'Main Campus',
    annualPG: 16000, annualUG: 16000, living: 14400, intakeUG: ['September'], intakePG: ['September'],
    url: 'https://www.universityofgalway.ie', currency: 'EUR',
    programs: [...PROGRAMS.CS_PG.slice(0, 12), ...PROGRAMS.ENG_PG.slice(0, 10),
      ...PROGRAMS.BUS_PG.slice(0, 10), ...PROGRAMS.SCI_PG.slice(0, 8),
      'MSc Marine Science', 'MSc Cognitive Science', 'MSc Architecture',
      'LLM Law', 'MSc Reproductive Science and Medicine',
      ...PROGRAMS.CS_UG.slice(0, 6), ...PROGRAMS.ENG_UG.slice(0, 5)],
  },
];

const SINGAPORE_UNIVERSITIES = [
  {
    slug: 'national-university-of-singapore', prefix: 'nus', name: 'National University of Singapore',
    city: 'Singapore', state: 'Singapore', campus: 'Kent Ridge Campus',
    annualPG: 40000, annualUG: 36000, living: 20000, intakeUG: ['August'], intakePG: ['August', 'January'],
    url: 'https://www.nus.edu.sg', currency: 'SGD',
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.ENG_PG, ...PROGRAMS.BUS_PG,
      ...PROGRAMS.SCI_PG.slice(0, 10), ...PROGRAMS.HEALTH_PG.slice(0, 6),
      'MSc Innovation and Entrepreneurship', 'Master of Real Estate',
      'MSc Electrical Engineering', 'MSc Knowledge Engineering',
      ...PROGRAMS.CS_UG.slice(0, 9), ...PROGRAMS.ENG_UG.slice(0, 9),
      ...PROGRAMS.BUS_UG.slice(0, 5), ...PROGRAMS.SCI_UG.slice(0, 5)],
  },
  {
    slug: 'nanyang-technological-university', prefix: 'ntu', name: 'Nanyang Technological University',
    city: 'Singapore', state: 'Singapore', campus: 'Main Campus',
    annualPG: 38000, annualUG: 34000, living: 20000, intakeUG: ['August'], intakePG: ['August', 'January'],
    url: 'https://www.ntu.edu.sg', currency: 'SGD',
    programs: [...PROGRAMS.CS_PG, ...PROGRAMS.ENG_PG, ...PROGRAMS.BUS_PG.slice(0, 12),
      ...PROGRAMS.SCI_PG.slice(0, 8), 'MSc Sustainable Infrastructure',
      'MSc Healthcare Management', 'MSc Broadcasting and New Media',
      'Master of Mass Communication', 'MSc Analytics',
      ...PROGRAMS.CS_UG.slice(0, 9), ...PROGRAMS.ENG_UG.slice(0, 9),
      ...PROGRAMS.BUS_UG.slice(0, 4)],
  },
];

// ============================================================
// GENERATOR FUNCTIONS
// ============================================================
function slugify(s) {
  return s.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 80);
}

function getCurrencyMultiplier(currency, targetCurrency) {
  const rates = { GBP_USD: 1.27, GBP_INR: 106, EUR_USD: 1.08, EUR_INR: 90, AUD_USD: 0.65, AUD_INR: 54.5, SGD_USD: 0.74, SGD_INR: 61.5, CAD_USD: 0.73, CAD_INR: 61 };
  if (currency === 'USD') return { USD: 1, INR: 83.5 };
  return {
    USD: rates[`${currency}_USD`] || 1,
    INR: rates[`${currency}_INR`] || 83
  };
}

function getLevel(name) {
  const n = name;
  if (/\bMBA\b/.test(n)) return { level: 'MBA', studyLevel: 'Postgraduate' };
  if (/\b(MEng|MSc|MA |MRes|LLM|MPhil|MASc|MPA|MFin|MArch)\b/.test(n) || /^Master/.test(n)) return { level: 'Masters', studyLevel: 'Postgraduate' };
  if (/\b(BEng|BSc|BA |BCom|LLB|BArch|BFA|BCS)\b/.test(n) || /^Bachelor/.test(n)) return { level: 'Bachelors', studyLevel: 'Undergraduate' };
  if (/\bPhD\b/.test(n)) return { level: 'PhD', studyLevel: 'Postgraduate' };
  if (/^(PGDip|PGCert)/.test(n)) return { level: n.startsWith('PGDip') ? 'PG Diploma' : 'PG Certificate', studyLevel: 'Postgraduate' };
  // Default
  return { level: 'Masters', studyLevel: 'Postgraduate' };
}

function getDuration(level, name) {
  if (level === 'Bachelors') return { duration: '3 years', years: 3 };
  if (level === 'MBA') return { duration: '1 year', years: 1 };
  if (/MEng/.test(name)) return { duration: '4 years', years: 4 };
  if (level === 'PG Diploma') return { duration: '1 year', years: 1 };
  if (level === 'PG Certificate') return { duration: '6 months', years: 0.5 };
  if (level === 'PhD') return { duration: '3 years', years: 3 };
  return { duration: '1 year', years: 1 };
}

function getFeeMultiplier(name, level) {
  const n = name.toLowerCase();
  if (level === 'MBA') return 2.0;
  if (level === 'Bachelors') return 0.85;
  if (n.includes('finance') || n.includes('financial') || n.includes('investment') || n.includes('fintech')) return 1.4;
  if (n.includes('mba') || n.includes('business') || n.includes('management') || n.includes('marketing')) return 1.2;
  if (n.includes('law') || n.includes('legal') || n.includes('llm')) return 1.1;
  if (n.includes('engineering') || n.includes('computer') || n.includes('data science') || n.includes('ai ') || n.includes('artificial intelligence')) return 1.1;
  if (n.includes('medicine') || n.includes('medical') || n.includes('clinical')) return 1.2;
  return 1.0;
}

function generateCourseEntry(uniConfig, name, idx) {
  const { prefix, city, state, campus, annualPG, annualUG, living, intakeUG, intakePG, url, currency = 'GBP', pgwp, province } = uniConfig;
  const { level, studyLevel } = getLevel(name);
  const { duration, years } = getDuration(level, name);
  const isUG = studyLevel === 'Undergraduate';
  const baseAnnual = isUG ? annualUG : annualPG;
  const annual = Math.round(baseAnnual * getFeeMultiplier(name, level));
  const total = Math.round(annual * years);
  const { USD, INR } = getCurrencyMultiplier(currency, 'USD');
  const intakes = isUG ? intakeUG : intakePG;
  const ielts = isUG ? 6.0 : level === 'MBA' ? 7.0 : 6.5;

  const course = {
    id: `${prefix}-${idx + 1}`,
    name,
    slug: `${prefix}-${slugify(name)}`,
    url,
    level,
    studyLevel,
    duration,
    durationYears: years,
    ieltsMin: ielts,
    toeflMin: ielts === 7.0 ? 100 : ielts === 6.5 ? 90 : 85,
    pteMin: ielts === 7.0 ? 65 : ielts === 6.5 ? 62 : 58,
    intakeMonths: intakes,
    campus,
    country: currency === 'GBP' ? 'United Kingdom' : currency === 'EUR' && state === 'Leinster' || state === 'Connacht' ? 'Ireland' : currency === 'EUR' ? 'Germany' : currency === 'AUD' ? 'Australia' : currency === 'SGD' ? 'Singapore' : currency === 'CAD' ? 'Canada' : 'USA',
    countryCode: currency === 'GBP' ? 'GB' : currency === 'EUR' && (state === 'Leinster' || state === 'Connacht') ? 'IE' : currency === 'EUR' ? 'DE' : currency === 'AUD' ? 'AU' : currency === 'SGD' ? 'SG' : currency === 'CAD' ? 'CA' : 'US',
    city,
  };

  // Add state or province
  if (province) course.province = province;
  else course.state = state;

  // Add PGWP for Canada
  if (pgwp !== undefined) course.pgwp = pgwp;

  // Add currency-specific fees
  if (currency === 'GBP') {
    Object.assign(course, {
      annualGBP: annual, annualUSD: Math.round(annual * USD), annualINR: Math.round(annual * INR),
      totalGBP: total, livingCostGBP: living, livingCostUSD: Math.round(living * USD), livingCostINR: Math.round(living * INR),
    });
  } else if (currency === 'EUR') {
    Object.assign(course, {
      annualEUR: annual, annualUSD: Math.round(annual * USD), annualINR: Math.round(annual * INR),
      totalEUR: total, livingCostEUR: living, livingCostUSD: Math.round(living * USD), livingCostINR: Math.round(living * INR),
    });
  } else if (currency === 'AUD') {
    Object.assign(course, {
      annualAUD: annual, annualUSD: Math.round(annual * USD), annualINR: Math.round(annual * INR),
      totalAUD: total, livingCostAUD: living, livingCostUSD: Math.round(living * USD), livingCostINR: Math.round(living * INR),
    });
  } else if (currency === 'SGD') {
    Object.assign(course, {
      annualSGD: annual, annualUSD: Math.round(annual * USD), annualINR: Math.round(annual * INR),
      totalSGD: total, livingCostSGD: living, livingCostUSD: Math.round(living * USD), livingCostINR: Math.round(living * INR),
    });
  } else if (currency === 'CAD') {
    Object.assign(course, {
      annualCAD: annual, annualUSD: Math.round(annual * USD), annualINR: Math.round(annual * INR),
      totalCAD: total, livingCostCAD: living, livingCostUSD: Math.round(living * USD), livingCostINR: Math.round(living * INR),
    });
  } else { // USD
    Object.assign(course, {
      annualUSD: annual, annualINR: Math.round(annual * INR),
      totalUSD: total, livingCostUSD: living, livingCostINR: Math.round(living * INR),
    });
  }

  return course;
}

function getExistingInterface(filepath) {
  if (!fs.existsSync(filepath)) return null;
  const content = fs.readFileSync(filepath, 'utf8');
  const match = content.match(/export interface \w+Course[\s\S]+?\}/);
  return match ? match[0] : null;
}

function generateCoursesFile(uniConfig) {
  const { slug, prefix, name, currency = 'GBP', programs } = uniConfig;

  // Deduplicate programs
  const seen = new Set();
  const unique = programs.filter(p => {
    const key = p.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const courses = unique.map((prog, idx) => generateCourseEntry(uniConfig, prog, idx));
  const interfaceName = prefix.charAt(0).toUpperCase() + prefix.slice(1) + 'Course';
  const exportName = prefix + 'Courses';

  const currField = currency === 'GBP' ? 'annualGBP: number; annualUSD: number; annualINR: number; totalGBP: number;\n  livingCostGBP: number; livingCostUSD: number; livingCostINR: number;' :
    currency === 'EUR' ? 'annualEUR: number; annualUSD: number; annualINR: number; totalEUR: number;\n  livingCostEUR: number; livingCostUSD: number; livingCostINR: number;' :
    currency === 'AUD' ? 'annualAUD: number; annualUSD: number; annualINR: number; totalAUD: number;\n  livingCostAUD: number; livingCostUSD: number; livingCostINR: number;' :
    currency === 'SGD' ? 'annualSGD: number; annualUSD: number; annualINR: number; totalSGD: number;\n  livingCostSGD: number; livingCostUSD: number; livingCostINR: number;' :
    currency === 'CAD' ? 'annualCAD: number; annualUSD: number; annualINR: number; totalCAD: number;\n  livingCostCAD: number; livingCostUSD: number; livingCostINR: number;' :
    'annualUSD: number; annualINR: number; totalUSD: number;\n  livingCostUSD: number; livingCostINR: number;';

  const locationField = uniConfig.province ? 'province: string;' : 'state: string;';
  const pgwpField = uniConfig.pgwp !== undefined ? '\n  pgwp: boolean;' : '';

  const content = `// Real course data for ${name}
// Generated: ${new Date().toISOString().split('T')[0]}

export interface ${interfaceName} {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  ${currField}
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; ${locationField} city: string; countryCode: string;${pgwpField}
}

export const ${exportName}: ${interfaceName}[] = ${JSON.stringify(courses, null, 2)};

export function get${interfaceName}BySlug(slug: string): ${interfaceName} | undefined {
  return ${exportName}.find(c => c.slug === slug);
}
`;

  return { content, count: courses.length };
}

// ============================================================
// MAIN - Process all universities
// ============================================================
const ALL_UNIVERSITIES = {
  UK: UK_UNIVERSITIES,
  Canada: CANADA_UNIVERSITIES,
  Australia: AUSTRALIA_UNIVERSITIES,
  USA: USA_UNIVERSITIES,
  Germany: GERMANY_UNIVERSITIES,
  Ireland: IRELAND_UNIVERSITIES,
  Singapore: SINGAPORE_UNIVERSITIES,
};

async function main() {
  const countries = TARGET_COUNTRY === 'all' ? Object.keys(ALL_UNIVERSITIES) : [TARGET_COUNTRY];

  let totalGenerated = 0;
  let filesUpdated = 0;
  let skipped = 0;

  for (const country of countries) {
    const unis = ALL_UNIVERSITIES[country];
    if (!unis) {
      console.log(`Unknown country: ${country}`);
      continue;
    }

    console.log(`\n=== Processing ${country} (${unis.length} universities) ===`);

    for (const uni of unis) {
      const filepath = path.join('data', `${uni.prefix}-courses.ts`);

      // Check if file exists
      if (!fs.existsSync(filepath)) {
        // Try to find the right file
        const possibleFiles = fs.readdirSync('data').filter(f => f.endsWith('-courses.ts') && f.includes(uni.prefix));
        if (possibleFiles.length === 0) {
          console.log(`  ⚠️  No data file found for ${uni.name} (${uni.prefix})`);
          skipped++;
          continue;
        }
        // Use first match
        const found = possibleFiles[0];
        console.log(`  Found: ${found} (expected ${uni.prefix}-courses.ts)`);
      }

      const { content, count } = generateCoursesFile(uni);
      fs.writeFileSync(filepath, content);
      totalGenerated += count;
      filesUpdated++;
      console.log(`  ✅ ${uni.name}: ${count} courses → ${filepath}`);
    }
  }

  console.log(`\n=== DONE ===`);
  console.log(`Files updated: ${filesUpdated}`);
  console.log(`Total courses generated: ${totalGenerated}`);
  console.log(`Skipped: ${skipped}`);
}

main().catch(console.error);
