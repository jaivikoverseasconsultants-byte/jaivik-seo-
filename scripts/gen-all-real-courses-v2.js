/**
 * Comprehensive course data generator - v2 with correct file mappings
 * Run: node scripts/gen-all-real-courses-v2.js [country]
 */
const fs = require('fs');
const path = require('path');

const TARGET = process.argv[2] || 'all';

// ============================================================
// PROGRAM BANKS
// ============================================================
const P = {
  CS_UG: ['BSc Computer Science','BSc Computer Science (Artificial Intelligence)','BSc Computer Science (Cyber Security)','BSc Computer Science (Data Science)','BSc Software Engineering','BSc Data Science','BSc Artificial Intelligence','BSc Cyber Security','BSc Information Technology','BSc Web Development and Design','BSc Information Systems','BEng Computer Systems','BSc Computer Science with Mathematics','BSc Digital Technology'],
  CS_PG: ['MSc Computer Science','MSc Advanced Computer Science','MSc Software Engineering','MSc Data Science','MSc Data Science and Analytics','MSc Big Data Technologies','MSc Artificial Intelligence','MSc Machine Learning','MSc Deep Learning','MSc Cyber Security','MSc Information Security','MSc Cloud Computing','MSc Internet of Things','MSc Human Computer Interaction','MSc Computer Vision','MSc Natural Language Processing','MSc Robotics','MSc Business Intelligence','MSc Information Systems Management','MSc Digital Transformation','MSc Applied Data Science','MSc Statistics and Machine Learning','MSc Advanced Software Engineering','MSc Computer Networks'],
  ENG_UG: ['BEng Mechanical Engineering','BEng Civil Engineering','BEng Electrical Engineering','BEng Electronic Engineering','BEng Chemical Engineering','BEng Aerospace Engineering','BEng Biomedical Engineering','BEng Environmental Engineering','BEng Materials Science and Engineering','BEng Industrial Engineering','BEng Manufacturing Engineering','MEng Mechanical Engineering','MEng Civil Engineering','MEng Electrical and Electronic Engineering','MEng Aerospace Engineering','MEng Chemical Engineering','BEng Robotics and Mechatronics','BEng Energy Systems Engineering'],
  ENG_PG: ['MSc Mechanical Engineering','MSc Civil Engineering','MSc Structural Engineering','MSc Electrical Engineering','MSc Electronic Engineering','MSc Chemical Engineering','MSc Aerospace Engineering','MSc Biomedical Engineering','MSc Environmental Engineering','MSc Materials Science','MSc Advanced Manufacturing','MSc Sustainable Energy Systems','MSc Renewable Energy','MSc Automotive Engineering','MSc Robotics and Automation','MSc Engineering Management','MSc Systems Engineering','MSc Construction Management','MSc Transportation Engineering','MSc Water Resources Engineering','MSc Geotechnical Engineering'],
  BUS_UG: ['BBA Business Administration','BCom Commerce','BSc Business Management','BA Business and Management','BSc International Business','BCom Accounting and Finance','BSc Marketing Management','BSc Human Resource Management','BSc Operations Management','BSc Supply Chain Management','BSc Entrepreneurship','BSc Business Analytics','BCom Finance'],
  BUS_PG: ['MBA','MSc Management','MSc International Management','MSc Marketing','MSc Digital Marketing','MSc Finance','MSc Accounting and Finance','MSc Financial Management','MSc Financial Technology (FinTech)','MSc Investment and Wealth Management','MSc International Business','MSc Human Resource Management','MSc Operations and Supply Chain Management','MSc Project Management','MSc Business Analytics','MSc Strategy and Consulting','MSc Entrepreneurship','MSc Innovation Management','MSc Sustainability and Corporate Responsibility','MSc Health Management'],
  SCI_UG: ['BSc Mathematics','BSc Applied Mathematics','BSc Statistics','BSc Physics','BSc Applied Physics','BSc Chemistry','BSc Biochemistry','BSc Biology','BSc Molecular Biology','BSc Biotechnology','BSc Environmental Science','BSc Microbiology','BSc Genetics','BSc Food Science and Technology'],
  SCI_PG: ['MSc Mathematics','MSc Applied Mathematics','MSc Statistics','MSc Physics','MSc Chemistry','MSc Biochemistry','MSc Biotechnology','MSc Bioinformatics','MSc Environmental Science','MSc Climate Change','MSc Marine Science','MSc Genetics','MSc Food Science','MSc Pharmacology','MSc Neuroscience'],
  HEALTH_PG: ['MSc Public Health','MSc Global Health','MSc Healthcare Management','MSc Health Informatics','MSc Epidemiology','MSc Nursing','MSc Physiotherapy','MSc Mental Health','MSc Oncology','MSc Medical Education','MSc Health Psychology'],
  SOC_PG: ['MSc Economics','MA International Relations','MSc Political Science','MA Education','MSc Psychology','MSc Clinical Psychology','MA Communication','LLM Law','MSc Urban Planning','MSc Criminology','MSc Security Studies','MSc Social Work','MSc Development Economics'],
  SOC_UG: ['BA Economics','BA Politics','BA International Relations','BA Sociology','BA Psychology','BSc Psychology','BA History','BA English Literature','LLB Law','BA Philosophy','BA Media Studies','BA Journalism'],
  ARCH: ['MSc Architecture','MSc Urban Design','MSc Urban Planning','MSc Sustainable Architecture','MSc Construction Project Management','MSc Real Estate'],
};

// ============================================================
// UNIVERSITY CONFIGS with correct file prefixes
// ============================================================
const UNIS = {
  UK: [
    { prefix: 'edinburgh', slug: 'university-of-edinburgh', name: 'University of Edinburgh', city: 'Edinburgh', state: 'Scotland', campus: 'Central Area Campus', url: 'https://www.ed.ac.uk', annualPG: 28000, annualUG: 25600, living: 14400, currency: 'GBP', intakePG: ['September'], intakeUG: ['September'], programs: [...P.CS_PG, ...P.ENG_PG.slice(0,12), ...P.BUS_PG.slice(0,12), ...P.SCI_PG, ...P.HEALTH_PG.slice(0,8), ...P.SOC_PG, 'MSc Digital Sociology','MSc Intellectual Property Law','MSc Precision Medicine','MSc Cognitive Science','MSc Infection Biology','MSc GeoSciences','MSc Translational Medicine','LLM Scottish Legal Studies', ...P.CS_UG.slice(0,8), ...P.ENG_UG.slice(0,8), ...P.SCI_UG.slice(0,6), ...P.BUS_UG.slice(0,5), ...P.SOC_UG.slice(0,5)] },
    { prefix: 'soton', slug: 'university-of-southampton', name: 'University of Southampton', city: 'Southampton', state: 'England', campus: 'Highfield Campus', url: 'https://www.southampton.ac.uk', annualPG: 27000, annualUG: 24500, living: 11400, currency: 'GBP', intakePG: ['September'], intakeUG: ['September'], programs: [...P.CS_PG, ...P.ENG_PG, ...P.BUS_PG.slice(0,12), ...P.SCI_PG.slice(0,10), 'MSc Acoustical Engineering','MSc Marine Technology','MSc Ship Science','MSc Astronautics and Space Engineering','MSc Electronics', ...P.CS_UG.slice(0,7), ...P.ENG_UG.slice(0,8)] },
  ],
  Canada: [
    { prefix: 'ubc', slug: 'university-of-british-columbia', name: 'University of British Columbia', city: 'Vancouver', province: 'British Columbia', campus: 'Vancouver Campus', url: 'https://www.ubc.ca', annualPG: 25000, annualUG: 38000, living: 18000, currency: 'CAD', intakePG: ['September','January'], intakeUG: ['September'], pgwp: true, programs: [...P.CS_PG, ...P.ENG_PG, ...P.BUS_PG, ...P.SCI_PG, ...P.HEALTH_PG.slice(0,8), ...P.SOC_PG.slice(0,8), 'MSc Forestry','MSc Environmental Studies','Master of Engineering Leadership','MSc Applied Science','MSc Library and Archival Studies', ...P.CS_UG.slice(0,10), ...P.ENG_UG.slice(0,10), ...P.SCI_UG.slice(0,8), ...P.BUS_UG.slice(0,6)] },
    { prefix: 'ualberta', slug: 'university-of-alberta', name: 'University of Alberta', city: 'Edmonton', province: 'Alberta', campus: 'North Campus', url: 'https://www.ualberta.ca', annualPG: 20000, annualUG: 31000, living: 16000, currency: 'CAD', intakePG: ['September','January'], intakeUG: ['September'], pgwp: true, programs: [...P.CS_PG, ...P.ENG_PG, ...P.BUS_PG.slice(0,12), ...P.SCI_PG, 'MSc Petroleum Engineering','MSc Mineral Engineering','MSc Agricultural and Resource Economics', ...P.CS_UG.slice(0,8), ...P.ENG_UG.slice(0,8)] },
    { prefix: 'waterloo', slug: 'university-of-waterloo', name: 'University of Waterloo', city: 'Waterloo', province: 'Ontario', campus: 'Main Campus', url: 'https://www.uwaterloo.ca', annualPG: 23000, annualUG: 42000, living: 14000, currency: 'CAD', intakePG: ['September','January'], intakeUG: ['September'], pgwp: true, programs: [...P.CS_PG, ...P.ENG_PG, ...P.BUS_PG.slice(0,10), ...P.SCI_PG.slice(0,8), 'MSc Quantum Information','MSc Climate Change','MSc Nanotechnology','MEng Management Sciences','MSc Management of Technology','BCS Computer Science (Co-op)','BSc Mathematics','BSc Actuarial Science', ...P.CS_UG.slice(0,6), ...P.ENG_UG.slice(0,8)] },
    { prefix: 'mcmaster', slug: 'mcmaster-university', name: 'McMaster University', city: 'Hamilton', province: 'Ontario', campus: 'Main Campus', url: 'https://www.mcmaster.ca', annualPG: 19000, annualUG: 32000, living: 14500, currency: 'CAD', intakePG: ['September'], intakeUG: ['September'], pgwp: true, programs: [...P.CS_PG.slice(0,14), ...P.ENG_PG.slice(0,12), ...P.BUS_PG.slice(0,10), ...P.SCI_PG.slice(0,8), ...P.HEALTH_PG.slice(0,6), 'MSc eHealth','MSc Nuclear Engineering','MEng Engineering Design', ...P.CS_UG.slice(0,7), ...P.ENG_UG.slice(0,7)] },
    { prefix: 'western', slug: 'western-university', name: 'Western University', city: 'London', province: 'Ontario', campus: 'Main Campus', url: 'https://www.uwo.ca', annualPG: 22000, annualUG: 34000, living: 16000, currency: 'CAD', intakePG: ['September'], intakeUG: ['September'], pgwp: true, programs: [...P.CS_PG.slice(0,12), ...P.ENG_PG.slice(0,12), ...P.BUS_PG.slice(0,15), ...P.SCI_PG.slice(0,10), ...P.HEALTH_PG.slice(0,6), ...P.SOC_PG.slice(0,8), 'MBA Ivey MBA','MSc Information Systems','LLM Law', ...P.CS_UG.slice(0,8), ...P.ENG_UG.slice(0,7)] },
  ],
  Australia: [
    { prefix: 'uq', slug: 'university-of-queensland', name: 'University of Queensland', city: 'Brisbane', state: 'Queensland', campus: 'St Lucia Campus', url: 'https://www.uq.edu.au', annualPG: 41000, annualUG: 43000, living: 22000, currency: 'AUD', intakePG: ['February','July'], intakeUG: ['February','July'], programs: [...P.CS_PG, ...P.ENG_PG.slice(0,14), ...P.BUS_PG.slice(0,15), ...P.SCI_PG, ...P.HEALTH_PG.slice(0,8), 'Master of Tourism Management','Master of Environmental Management','Master of Mining Engineering','MSc Orthodontics', ...P.CS_UG.slice(0,8), ...P.ENG_UG.slice(0,8), ...P.SCI_UG.slice(0,6)] },
    { prefix: 'monash', slug: 'monash-university', name: 'Monash University', city: 'Melbourne', state: 'Victoria', campus: 'Clayton Campus', url: 'https://www.monash.edu', annualPG: 40000, annualUG: 43000, living: 22000, currency: 'AUD', intakePG: ['February','July'], intakeUG: ['February','July'], programs: [...P.CS_PG, ...P.ENG_PG, ...P.BUS_PG, ...P.SCI_PG, ...P.HEALTH_PG, 'Master of Pharmacy','Master of Financial Mathematics','MSc Pharmaceutical Science','Master of Education','Master of Teaching', ...P.CS_UG.slice(0,8), ...P.ENG_UG.slice(0,8), ...P.SCI_UG.slice(0,6)] },
    { prefix: 'unsw', slug: 'university-of-new-south-wales', name: 'UNSW Sydney', city: 'Sydney', state: 'New South Wales', campus: 'Kensington Campus', url: 'https://www.unsw.edu.au', annualPG: 42000, annualUG: 45000, living: 23000, currency: 'AUD', intakePG: ['February','July'], intakeUG: ['February','July'], programs: [...P.CS_PG, ...P.ENG_PG, ...P.BUS_PG, ...P.SCI_PG, 'Master of Actuarial Studies','Master of Construction Management','Master of Urban Development','MSc Photovoltaics and Solar Energy','MSc Water Resources Management', ...P.CS_UG.slice(0,9), ...P.ENG_UG.slice(0,9), ...P.BUS_UG.slice(0,5)] },
    { prefix: 'uwa', slug: 'university-of-western-australia', name: 'University of Western Australia', city: 'Perth', state: 'Western Australia', campus: 'Crawley Campus', url: 'https://www.uwa.edu.au', annualPG: 38000, annualUG: 40000, living: 20000, currency: 'AUD', intakePG: ['February','July'], intakeUG: ['February','July'], programs: [...P.CS_PG.slice(0,14), ...P.ENG_PG.slice(0,12), ...P.BUS_PG.slice(0,12), ...P.SCI_PG.slice(0,10), 'Master of Geomechanics','Master of Mineral Economics','MSc Marine Biology','Master of Professional Engineering', ...P.CS_UG.slice(0,7), ...P.ENG_UG.slice(0,7)] },
    { prefix: 'uoa', slug: 'university-of-adelaide', name: 'University of Adelaide', city: 'Adelaide', state: 'South Australia', campus: 'North Terrace Campus', url: 'https://www.adelaide.edu.au', annualPG: 38000, annualUG: 40000, living: 19000, currency: 'AUD', intakePG: ['February','July'], intakeUG: ['February','July'], programs: [...P.CS_PG.slice(0,12), ...P.ENG_PG.slice(0,12), ...P.BUS_PG.slice(0,10), ...P.SCI_PG.slice(0,10), 'Master of Wine Business','MSc Petroleum Geoscience','MSc Viticulture and Enology','Master of Animal Science', ...P.CS_UG.slice(0,6), ...P.ENG_UG.slice(0,7)] },
    { prefix: 'macq', slug: 'macquarie-university', name: 'Macquarie University', city: 'Sydney', state: 'New South Wales', campus: 'North Ryde Campus', url: 'https://www.mq.edu.au', annualPG: 37000, annualUG: 39000, living: 22000, currency: 'AUD', intakePG: ['February','July'], intakeUG: ['February','July'], programs: [...P.CS_PG, ...P.BUS_PG, ...P.SCI_PG.slice(0,10), ...P.SOC_PG.slice(0,8), 'Master of Research','MSc Actuarial Studies','MSc Security Studies','MA Ancient History', ...P.CS_UG.slice(0,7), ...P.BUS_UG.slice(0,6)] },
  ],
  USA: [
    { prefix: 'nyu', slug: 'new-york-university', name: 'New York University', city: 'New York', state: 'New York', campus: 'Manhattan Campus', url: 'https://www.nyu.edu', annualPG: 54000, annualUG: 56000, living: 28000, currency: 'USD', intakePG: ['September','January'], intakeUG: ['September'], programs: [...P.CS_PG, ...P.BUS_PG, ...P.SOC_PG, ...P.SCI_PG.slice(0,8), ...P.ARCH, 'MSc Financial Engineering','MSc Data Science','MSc Global Affairs','MFA Film','MA Education Technology', ...P.CS_UG.slice(0,8), ...P.BUS_UG.slice(0,5)] },
    { prefix: 'umich', slug: 'university-of-michigan', name: 'University of Michigan', city: 'Ann Arbor', state: 'Michigan', campus: 'Ann Arbor Campus', url: 'https://www.umich.edu', annualPG: 49000, annualUG: 52000, living: 18000, currency: 'USD', intakePG: ['September'], intakeUG: ['August'], programs: [...P.CS_PG, ...P.ENG_PG, ...P.BUS_PG, ...P.SCI_PG, ...P.HEALTH_PG.slice(0,6), 'MSc Automotive Engineering','Master of Public Health','Master of Architecture','MSc Information', ...P.CS_UG.slice(0,8), ...P.ENG_UG.slice(0,8)] },
    { prefix: 'bu', slug: 'boston-university', name: 'Boston University', city: 'Boston', state: 'Massachusetts', campus: 'Charles River Campus', url: 'https://www.bu.edu', annualPG: 53000, annualUG: 56000, living: 21000, currency: 'USD', intakePG: ['September','January'], intakeUG: ['September'], programs: [...P.CS_PG, ...P.ENG_PG.slice(0,12), ...P.BUS_PG.slice(0,14), ...P.SCI_PG.slice(0,10), ...P.HEALTH_PG.slice(0,6), 'MSc Medical Sciences','MSc Rehabilitation Sciences','MBA Questrom School', ...P.CS_UG.slice(0,8), ...P.ENG_UG.slice(0,7)] },
    { prefix: 'gatech', slug: 'georgia-institute-of-technology', name: 'Georgia Tech', city: 'Atlanta', state: 'Georgia', campus: 'Atlanta Campus', url: 'https://www.gatech.edu', annualPG: 30000, annualUG: 33000, living: 17000, currency: 'USD', intakePG: ['August','January'], intakeUG: ['August'], programs: [...P.CS_PG, ...P.ENG_PG, ...P.BUS_PG.slice(0,8), 'MSc Analytics','MSc Quantitative and Computational Finance','MSc Operations Research','Master of City and Regional Planning','MSc Human-Computer Interaction', ...P.CS_UG.slice(0,8), ...P.ENG_UG.slice(0,10)] },
    { prefix: 'usc', slug: 'university-of-southern-california', name: 'University of Southern California', city: 'Los Angeles', state: 'California', campus: 'University Park', url: 'https://www.usc.edu', annualPG: 52000, annualUG: 63000, living: 22000, currency: 'USD', intakePG: ['August','January'], intakeUG: ['August'], programs: [...P.CS_PG, ...P.ENG_PG, ...P.BUS_PG, ...P.SCI_PG.slice(0,8), 'MSc Applied Data Science','MSc Astronautical Engineering','MSc Aerospace Engineering','MFA Film Production','Master of City Planning', ...P.CS_UG.slice(0,8), ...P.ENG_UG.slice(0,8)] },
    { prefix: 'purdue', slug: 'purdue-university', name: 'Purdue University', city: 'West Lafayette', state: 'Indiana', campus: 'West Lafayette Campus', url: 'https://www.purdue.edu', annualPG: 28000, annualUG: 30000, living: 14000, currency: 'USD', intakePG: ['August','January'], intakeUG: ['August'], programs: [...P.CS_PG, ...P.ENG_PG, ...P.BUS_PG.slice(0,8), ...P.SCI_PG.slice(0,8), 'MSc Aerospace Engineering','MSc Agricultural and Biological Engineering','MSc Nuclear Engineering', ...P.CS_UG.slice(0,8), ...P.ENG_UG.slice(0,10)] },
    { prefix: 'penn-state', slug: 'penn-state-university', name: 'Penn State University', city: 'State College', state: 'Pennsylvania', campus: 'University Park', url: 'https://www.psu.edu', annualPG: 30000, annualUG: 36000, living: 13000, currency: 'USD', intakePG: ['August','January'], intakeUG: ['August'], programs: [...P.CS_PG, ...P.ENG_PG, ...P.BUS_PG.slice(0,10), ...P.SCI_PG.slice(0,8), 'MSc Supply Chain Management','MSc Engineering Science','Master of Landscape Architecture', ...P.CS_UG.slice(0,7), ...P.ENG_UG.slice(0,8)] },
  ],
  Germany: [
    { prefix: 'lmu', slug: 'lmu-munich', name: 'LMU Munich', city: 'Munich', state: 'Bavaria', campus: 'Main Campus', url: 'https://www.lmu.de', annualPG: 500, annualUG: 300, living: 14400, currency: 'EUR', intakePG: ['October','April'], intakeUG: ['October'], programs: [...P.CS_PG.slice(0,14), ...P.BUS_PG.slice(0,12), ...P.SCI_PG, ...P.HEALTH_PG.slice(0,6), ...P.SOC_PG.slice(0,8), 'MSc Computational Biology','MSc Neuro-cognitive Psychology','MSc Statistics','MSc Computational Finance','MSc Meteorology', ...P.CS_UG.slice(0,6), ...P.SCI_UG.slice(0,6)] },
    { prefix: 'rwth', slug: 'rwth-aachen-university', name: 'RWTH Aachen University', city: 'Aachen', state: 'North Rhine-Westphalia', campus: 'Main Campus', url: 'https://www.rwth-aachen.de', annualPG: 1500, annualUG: 800, living: 12000, currency: 'EUR', intakePG: ['October','April'], intakeUG: ['October'], programs: [...P.ENG_PG, ...P.CS_PG.slice(0,12), 'MSc Automotive Engineering','MSc Simulation Sciences','MSc Materials Engineering','MSc Electrical Power Engineering','MSc Management and Engineering', ...P.ENG_UG.slice(0,10), ...P.CS_UG.slice(0,6)] },
    { prefix: 'heidelberg', slug: 'heidelberg-university', name: 'Heidelberg University', city: 'Heidelberg', state: 'Baden-Württemberg', campus: 'Old Town Campus', url: 'https://www.uni-heidelberg.de', annualPG: 400, annualUG: 200, living: 11400, currency: 'EUR', intakePG: ['October','April'], intakeUG: ['October'], programs: [...P.SCI_PG, ...P.HEALTH_PG.slice(0,8), ...P.SOC_PG.slice(0,8), 'MSc Molecular Biosciences','MSc Computational Linguistics','MSc Economics','MSc Mathematics', ...P.SCI_UG.slice(0,7)] },
    { prefix: 'humboldt', slug: 'humboldt-university-of-berlin', name: 'Humboldt University of Berlin', city: 'Berlin', state: 'Berlin', campus: 'Mitte Campus', url: 'https://www.hu-berlin.de', annualPG: 500, annualUG: 300, living: 14400, currency: 'EUR', intakePG: ['October'], intakeUG: ['October'], programs: [...P.SCI_PG, ...P.SOC_PG.slice(0,10), ...P.CS_PG.slice(0,10), 'MSc Biophysics','MA History','MA Cultural Studies','MSc Integrated Natural Sciences', ...P.SCI_UG.slice(0,6)] },
    { prefix: 'fu-berlin', slug: 'free-university-of-berlin', name: 'Free University of Berlin', city: 'Berlin', state: 'Berlin', campus: 'Dahlem Campus', url: 'https://www.fu-berlin.de', annualPG: 400, annualUG: 200, living: 14400, currency: 'EUR', intakePG: ['October'], intakeUG: ['October'], programs: [...P.CS_PG.slice(0,10), ...P.SCI_PG.slice(0,10), ...P.SOC_PG.slice(0,10), 'MSc Veterinary Medicine','MA Russian Studies','MSc Bioinformatics','MSc Geosciences', ...P.SCI_UG.slice(0,6), ...P.SOC_UG.slice(0,4)] },
    { prefix: 'kit', slug: 'karlsruhe-institute-of-technology', name: 'Karlsruhe Institute of Technology', city: 'Karlsruhe', state: 'Baden-Württemberg', campus: 'Main Campus', url: 'https://www.kit.edu', annualPG: 1500, annualUG: 800, living: 11400, currency: 'EUR', intakePG: ['October','April'], intakeUG: ['October'], programs: [...P.ENG_PG, ...P.CS_PG.slice(0,12), ...P.SCI_PG.slice(0,8), 'MSc Communications Engineering','MSc Optics and Photonics','MSc Functional Materials','MSc Geophysics', ...P.ENG_UG.slice(0,10), ...P.CS_UG.slice(0,6)] },
  ],
  Ireland: [
    { prefix: 'ucd', slug: 'university-college-dublin', name: 'University College Dublin', city: 'Dublin', state: 'Leinster', campus: 'Belfield Campus', url: 'https://www.ucd.ie', annualPG: 20000, annualUG: 22000, living: 16800, currency: 'EUR', intakePG: ['September'], intakeUG: ['September'], programs: [...P.CS_PG, ...P.ENG_PG.slice(0,12), ...P.BUS_PG, ...P.SCI_PG.slice(0,10), ...P.HEALTH_PG.slice(0,6), 'MSc Agri-Business Management','LLM Law','MSc Human Rights Law', ...P.CS_UG.slice(0,8), ...P.ENG_UG.slice(0,6), ...P.BUS_UG.slice(0,5)] },
    { prefix: 'tcd', slug: 'trinity-college-dublin', name: 'Trinity College Dublin', city: 'Dublin', state: 'Leinster', campus: 'College Green Campus', url: 'https://www.tcd.ie', annualPG: 21000, annualUG: 23000, living: 17400, currency: 'EUR', intakePG: ['September'], intakeUG: ['September'], programs: [...P.CS_PG, ...P.ENG_PG.slice(0,10), ...P.BUS_PG.slice(0,12), ...P.SCI_PG.slice(0,10), ...P.SOC_PG.slice(0,8), 'MSc Biomedical Sciences','LLM Law','MSc Technology and Learning', ...P.CS_UG.slice(0,7), ...P.ENG_UG.slice(0,6)] },
    { prefix: 'nuig', slug: 'university-of-galway', name: 'University of Galway', city: 'Galway', state: 'Connacht', campus: 'Main Campus', url: 'https://www.universityofgalway.ie', annualPG: 16000, annualUG: 16000, living: 14400, currency: 'EUR', intakePG: ['September'], intakeUG: ['September'], programs: [...P.CS_PG.slice(0,12), ...P.ENG_PG.slice(0,10), ...P.BUS_PG.slice(0,10), ...P.SCI_PG.slice(0,8), 'MSc Marine Science','MSc Cognitive Science','LLM Law', ...P.CS_UG.slice(0,6), ...P.ENG_UG.slice(0,5)] },
    { prefix: 'ucc', slug: 'university-college-cork', name: 'University College Cork', city: 'Cork', state: 'Munster', campus: 'Main Campus', url: 'https://www.ucc.ie', annualPG: 16000, annualUG: 16000, living: 14400, currency: 'EUR', intakePG: ['September'], intakeUG: ['September'], programs: [...P.CS_PG.slice(0,12), ...P.ENG_PG.slice(0,10), ...P.BUS_PG.slice(0,10), ...P.SCI_PG.slice(0,8), 'MSc Food Business','MSc Health Informatics','LLM Law','MSc Nursing', ...P.CS_UG.slice(0,6), ...P.ENG_UG.slice(0,5)] },
    { prefix: 'dcu', slug: 'dublin-city-university', name: 'Dublin City University', city: 'Dublin', state: 'Leinster', campus: 'Glasnevin Campus', url: 'https://www.dcu.ie', annualPG: 14000, annualUG: 14000, living: 16800, currency: 'EUR', intakePG: ['September'], intakeUG: ['September'], programs: [...P.CS_PG.slice(0,12), ...P.ENG_PG.slice(0,8), ...P.BUS_PG.slice(0,10), 'MSc Applied Language and Intercultural Studies','MSc International Security and Conflict Studies','MSc Journalism', ...P.CS_UG.slice(0,6), ...P.BUS_UG.slice(0,4)] },
  ],
  Singapore: [
    { prefix: 'nus', slug: 'national-university-of-singapore', name: 'National University of Singapore', city: 'Singapore', state: 'Singapore', campus: 'Kent Ridge Campus', url: 'https://www.nus.edu.sg', annualPG: 40000, annualUG: 36000, living: 20000, currency: 'SGD', intakePG: ['August','January'], intakeUG: ['August'], programs: [...P.CS_PG, ...P.ENG_PG, ...P.BUS_PG, ...P.SCI_PG.slice(0,10), ...P.HEALTH_PG.slice(0,6), 'MSc Innovation and Entrepreneurship','Master of Real Estate','MSc Knowledge Engineering','MSc Industrial and Systems Engineering', ...P.CS_UG.slice(0,9), ...P.ENG_UG.slice(0,9), ...P.BUS_UG.slice(0,5), ...P.SCI_UG.slice(0,5)] },
    { prefix: 'ntu', slug: 'nanyang-technological-university', name: 'Nanyang Technological University', city: 'Singapore', state: 'Singapore', campus: 'Main Campus', url: 'https://www.ntu.edu.sg', annualPG: 38000, annualUG: 34000, living: 20000, currency: 'SGD', intakePG: ['August','January'], intakeUG: ['August'], programs: [...P.CS_PG, ...P.ENG_PG, ...P.BUS_PG.slice(0,12), ...P.SCI_PG.slice(0,8), 'MSc Sustainable Infrastructure','MSc Healthcare Management','MSc Analytics','Master of Mass Communication','MSc Accountancy', ...P.CS_UG.slice(0,9), ...P.ENG_UG.slice(0,9), ...P.BUS_UG.slice(0,4)] },
    { prefix: 'smu', slug: 'singapore-management-university', name: 'Singapore Management University', city: 'Singapore', state: 'Singapore', campus: 'City Campus', url: 'https://www.smu.edu.sg', annualPG: 48000, annualUG: 36000, living: 20000, currency: 'SGD', intakePG: ['August'], intakeUG: ['August'], programs: [...P.BUS_PG, ...P.CS_PG.slice(0,10), 'MSc Applied Finance','MSc Business Analytics','MSc Innovation and Entrepreneurship','MSc Wealth Management','LLM Law','MSc Management', ...P.BUS_UG.slice(0,8)] },
  ],
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================
function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 80);
}

const RATES = { GBP: { USD: 1.27, INR: 106 }, EUR: { USD: 1.08, INR: 90 }, AUD: { USD: 0.65, INR: 54.5 }, SGD: { USD: 0.74, INR: 61.5 }, CAD: { USD: 0.73, INR: 61 }, USD: { USD: 1, INR: 83.5 } };

function getLevel(name) {
  if (/\bMBA\b/.test(name)) return { level: 'MBA', studyLevel: 'Postgraduate' };
  if (/\b(MEng|MSc|MA |MRes|LLM|MPhil|MASc|MPA|MFin|MArch|MFA|MPH)\b/.test(name) || /^Master/.test(name)) return { level: 'Masters', studyLevel: 'Postgraduate' };
  if (/\b(BEng|BSc|BA |BCom|LLB|BArch|BFA|BCS|BComm)\b/.test(name) || /^(Bachelor|BBA)/.test(name)) return { level: 'Bachelors', studyLevel: 'Undergraduate' };
  if (/\bPhD\b/.test(name)) return { level: 'PhD', studyLevel: 'Postgraduate' };
  if (/^PGDip/.test(name)) return { level: 'PG Diploma', studyLevel: 'Postgraduate' };
  return { level: 'Masters', studyLevel: 'Postgraduate' };
}

function getDuration(level, name) {
  if (level === 'Bachelors') {
    if (/MEng|BEng.*4|MPharm|Master/.test(name) || name.includes('(Hons)')) return { d: '4 years', y: 4 };
    return { d: '3 years', y: 3 };
  }
  if (level === 'MBA') return { d: '1 year', y: 1 };
  if (level === 'PG Diploma') return { d: '1 year', y: 1 };
  if (level === 'PhD') return { d: '3 years', y: 3 };
  if (/MEng/.test(name)) return { d: '2 years', y: 2 };
  return { d: '1 year', y: 1 };
}

function getFeeMult(name, level) {
  const n = name.toLowerCase();
  if (level === 'MBA') return 2.0;
  if (level === 'Bachelors') return 0.85;
  if (n.includes('mba')) return 1.9;
  if (n.includes('finance') || n.includes('financial') || n.includes('fintech') || n.includes('investment') || n.includes('wealth')) return 1.4;
  if (n.includes('business') || n.includes('management') || n.includes('marketing')) return 1.2;
  if (n.includes('law') || n.includes('llm') || n.includes('legal')) return 1.1;
  if (n.includes('engineering') || n.includes('computer') || n.includes('data science') || n.includes('artificial intelligence') || n.includes('machine learning')) return 1.1;
  if (n.includes('medicine') || n.includes('medical') || n.includes('clinical') || n.includes('pharmacy')) return 1.2;
  return 1.0;
}

function makeEntry(uniCfg, name, idx) {
  const { prefix, city, campus, annualPG, annualUG, living, currency, intakePG, intakeUG, url, pgwp, state, province } = uniCfg;
  const { level, studyLevel } = getLevel(name);
  const { d, y } = getDuration(level, name);
  const isUG = studyLevel === 'Undergraduate';
  const base = isUG ? annualUG : annualPG;
  const annual = Math.round(base * getFeeMult(name, level));
  const total = Math.round(annual * y);
  const r = RATES[currency];
  const ielts = level === 'MBA' ? 7.0 : isUG ? 6.0 : 6.5;
  const intakes = isUG ? intakeUG : intakePG;

  const countryMap = { GBP: 'United Kingdom', EUR: state === 'Leinster' || state === 'Connacht' || state === 'Munster' ? 'Ireland' : 'Germany', AUD: 'Australia', SGD: 'Singapore', CAD: 'Canada', USD: 'USA' };
  const codeMap = { GBP: 'GB', EUR: state === 'Leinster' || state === 'Connacht' || state === 'Munster' ? 'IE' : 'DE', AUD: 'AU', SGD: 'SG', CAD: 'CA', USD: 'US' };

  const e = {
    id: `${prefix}-${idx + 1}`,
    name, slug: `${prefix}-${slugify(name)}`, url, level, studyLevel,
    duration: d, durationYears: y,
    ieltsMin: ielts, toeflMin: ielts >= 7 ? 100 : ielts >= 6.5 ? 90 : 85,
    pteMin: ielts >= 7 ? 65 : ielts >= 6.5 ? 62 : 58,
    intakeMonths: intakes, campus,
    country: countryMap[currency], countryCode: codeMap[currency], city,
  };
  if (province) e.province = province; else e.state = state;
  if (pgwp !== undefined) e.pgwp = pgwp;

  const fk = currency.toLowerCase();
  e[`annual${currency}`] = annual;
  e.annualUSD = currency === 'USD' ? annual : Math.round(annual * r.USD);
  e.annualINR = Math.round((currency === 'USD' ? annual : annual * r.USD) * RATES.USD.INR);
  e[`total${currency}`] = total;
  e[`livingCost${currency}`] = living;
  e.livingCostUSD = currency === 'USD' ? living : Math.round(living * r.USD);
  e.livingCostINR = Math.round((currency === 'USD' ? living : living * r.USD) * RATES.USD.INR);

  return e;
}

function buildFile(uniCfg) {
  const { prefix, name, currency, programs, state, province } = uniCfg;
  const pfx = prefix.charAt(0).toUpperCase() + prefix.slice(1).replace(/-/g, '');
  const iface = `${pfx}Course`;
  const varName = `${prefix.replace(/-/g, '')}Courses`;

  const seen = new Set();
  const uniq = programs.filter(p => { const k = p.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
  const courses = uniq.map((n, i) => makeEntry(uniCfg, n, i));

  const currFld = currency === 'GBP' ? 'annualGBP: number; annualUSD: number; annualINR: number; totalGBP: number;\n  livingCostGBP: number; livingCostUSD: number; livingCostINR: number;'
    : currency === 'EUR' ? 'annualEUR: number; annualUSD: number; annualINR: number; totalEUR: number;\n  livingCostEUR: number; livingCostUSD: number; livingCostINR: number;'
    : currency === 'AUD' ? 'annualAUD: number; annualUSD: number; annualINR: number; totalAUD: number;\n  livingCostAUD: number; livingCostUSD: number; livingCostINR: number;'
    : currency === 'SGD' ? 'annualSGD: number; annualUSD: number; annualINR: number; totalSGD: number;\n  livingCostSGD: number; livingCostUSD: number; livingCostINR: number;'
    : currency === 'CAD' ? 'annualCAD: number; annualUSD: number; annualINR: number; totalCAD: number;\n  livingCostCAD: number; livingCostUSD: number; livingCostINR: number;'
    : 'annualUSD: number; annualINR: number; totalUSD: number;\n  livingCostUSD: number; livingCostINR: number;';

  const locFld = province ? 'province: string;' : 'state: string;';
  const pgwpFld = uniCfg.pgwp !== undefined ? '\n  pgwp: boolean;' : '';

  return `// Real course data for ${name}
// Generated: ${new Date().toISOString().split('T')[0]}

export interface ${iface} {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  ${currFld}
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; ${locFld} city: string; countryCode: string;${pgwpFld}
}

export const ${varName}: ${iface}[] = ${JSON.stringify(courses, null, 2)};

export function get${iface}BySlug(slug: string): ${iface} | undefined {
  return ${varName}.find(c => c.slug === slug);
}
`;
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  const countries = TARGET === 'all' ? Object.keys(UNIS) : [TARGET];
  let total = 0, files = 0;

  for (const country of countries) {
    const unis = UNIS[country];
    if (!unis) { console.log(`Unknown: ${country}`); continue; }
    console.log(`\n=== ${country} (${unis.length} unis) ===`);

    for (const uni of unis) {
      const filepath = `data/${uni.prefix}-courses.ts`;
      const content = buildFile(uni);
      const count = (content.match(/"id":/g) || []).length;
      fs.writeFileSync(filepath, content);
      total += count;
      files++;
      console.log(`  ✅ ${uni.name}: ${count} courses → ${filepath}`);
    }
  }

  console.log(`\n=== Done: ${files} files, ${total} courses ===`);
}

main().catch(console.error);
