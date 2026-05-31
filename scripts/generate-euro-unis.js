// Generator: European + UAE university pages
// Run: node scripts/generate-euro-unis.js

const fs = require('fs');
const path = require('path');

// ── University definitions ────────────────────────────────────────────────────
const UNIVERSITIES = [
  // FRANCE
  { slug:'sorbonne-university', name:'Sorbonne University', shortName:'Sorbonne', country:'France', state:'Île-de-France', city:'Paris', qsRanking:83, currency:'EUR', annualFee:3770, livingCost:14000, ieltsMin:6.5, intakes:['September'], website:'https://www.sorbonne-universite.fr', countryCode:'FR', flag:'🇫🇷', workRights:'APS 12 months', courses:['MSc Computer Science','MSc Data Science','MSc Artificial Intelligence','MSc Mathematics','MSc Physics','MSc Chemistry','MSc Biology','MSc Economics','MA History','MA Philosophy','MA Linguistics','MSc Environmental Science','MSc Biomedical Sciences','MSc Neuroscience','BA French Literature','BA Sociology','MSc Finance','MA Political Science','MSc Public Health','MSc Materials Science'] },
  { slug:'sciences-po-paris', name:'Sciences Po Paris', shortName:'Sciences Po', country:'France', state:'Île-de-France', city:'Paris', qsRanking:240, currency:'EUR', annualFee:14000, livingCost:14000, ieltsMin:7.0, intakes:['September'], website:'https://www.sciencespo.fr', countryCode:'FR', flag:'🇫🇷', workRights:'APS 12 months', courses:['MSc International Affairs','MSc Public Policy','MSc Political Science','MSc European Affairs','MSc Urban Policy','MSc Human Rights','MSc Economics','MSc Global Energy','MA History','MSc Social Data Science','MSc Journalism','MA Sociology','MSc Finance','MSc Environmental Policy','MSc Management'] },
  { slug:'ecole-polytechnique', name:'École Polytechnique', shortName:'Polytechnique', country:'France', state:'Île-de-France', city:'Palaiseau', qsRanking:65, currency:'EUR', annualFee:15000, livingCost:13000, ieltsMin:7.0, intakes:['September'], website:'https://www.polytechnique.edu', countryCode:'FR', flag:'🇫🇷', workRights:'APS 12 months', courses:['MSc Applied Mathematics','MSc Computer Science','MSc Mechanical Engineering','MSc Physics','MSc Data Science','MSc AI & Advanced Computing','MSc Cybersecurity','MSc Materials Science','MSc Chemical Engineering','MSc Aerospace Engineering','MBA Innovation','MSc Environmental Engineering','MSc Energy Science','MSc Economics','MSc Electrical Engineering'] },
  { slug:'university-of-paris-saclay', name:'University of Paris-Saclay', shortName:'Paris-Saclay', country:'France', state:'Île-de-France', city:'Gif-sur-Yvette', qsRanking:76, currency:'EUR', annualFee:3770, livingCost:13000, ieltsMin:6.5, intakes:['September'], website:'https://www.universite-paris-saclay.fr', countryCode:'FR', flag:'🇫🇷', workRights:'APS 12 months', courses:['MSc Computer Science','MSc Mathematics','MSc Physics','MSc Chemistry','MSc Biosciences','MSc Biotechnology','MSc Data Science','MSc Environmental Science','MSc Renewable Energy','MSc Materials Science','MSc Engineering','MSc Pharmacology','MSc Astrophysics','MSc Optics','MSc Neuroscience'] },
  { slug:'insead', name:'INSEAD', shortName:'INSEAD', country:'France', state:'Île-de-France', city:'Fontainebleau', qsRanking:5, currency:'EUR', annualFee:89000, livingCost:15000, ieltsMin:7.0, intakes:['January','August'], website:'https://www.insead.edu', countryCode:'FR', flag:'🇫🇷', workRights:'APS 12 months', courses:['MBA','Executive MBA','Master in Finance','Master in Management','MSc Global Leadership','Executive Education – Leadership','Executive Education – Strategy','Executive Education – Finance','Global EMBA','PhD Business Administration'] },
  { slug:'university-of-grenoble-alpes', name:'University of Grenoble Alpes', shortName:'UGA Grenoble', country:'France', state:'Auvergne-Rhône-Alpes', city:'Grenoble', qsRanking:314, currency:'EUR', annualFee:3770, livingCost:11000, ieltsMin:6.5, intakes:['September'], website:'https://www.univ-grenoble-alpes.fr', countryCode:'FR', flag:'🇫🇷', workRights:'APS 12 months', courses:['MSc Computer Science','MSc Data Science','MSc Electrical Engineering','MSc Physics','MSc Materials Science','MSc Nanotechnology','MSc Environmental Science','MSc Energy','MSc Cybersecurity','MSc AI','MSc Mathematics','MSc Geophysics','MBA Innovation & Entrepreneurship','MA Linguistics','MSc Cognitive Science'] },
  { slug:'university-of-lyon', name:'University of Lyon', shortName:'Lyon Univ', country:'France', state:'Auvergne-Rhône-Alpes', city:'Lyon', qsRanking:350, currency:'EUR', annualFee:3770, livingCost:11500, ieltsMin:6.0, intakes:['September'], website:'https://www.universite-lyon.fr', countryCode:'FR', flag:'🇫🇷', workRights:'APS 12 months', courses:['MSc Biology','MSc Chemistry','MSc Computer Science','MSc Economics','MSc Management','MSc Psychology','MSc Sociology','MSc Mathematics','MA History','MSc Environmental Science','MSc Biosciences','MSc Public Health','MSc Physics','MSc Linguistics','MA Political Science'] },
  { slug:'university-of-bordeaux', name:'University of Bordeaux', shortName:'Bordeaux', country:'France', state:'Nouvelle-Aquitaine', city:'Bordeaux', qsRanking:356, currency:'EUR', annualFee:3770, livingCost:11000, ieltsMin:6.0, intakes:['September'], website:'https://www.u-bordeaux.fr', countryCode:'FR', flag:'🇫🇷', workRights:'APS 12 months', courses:['MSc Computer Science','MSc Biosciences','MSc Chemistry','MSc Neuroscience','MSc Economics','MSc Public Health','MSc Environmental Science','MSc Physics','MSc Mathematics','MSc Pharmacology','MSc Oenology','MSc Ecology','MA History','MSc Data Science','MSc Psychology'] },
  { slug:'essec-business-school', name:'ESSEC Business School', shortName:'ESSEC', country:'France', state:'Île-de-France', city:'Cergy', qsRanking:180, currency:'EUR', annualFee:38000, livingCost:14000, ieltsMin:6.5, intakes:['September','January'], website:'https://www.essec.edu', countryCode:'FR', flag:'🇫🇷', workRights:'APS 12 months', courses:['Master in Management','MSc Data Analytics','MSc Finance','MSc Marketing','MBA','MSc Real Estate','MSc Hospitality Management','MSc Sustainability & Social Innovation','MSc Luxury Brand Management','MSc Audit & Consulting','Executive MBA','MSc Strategy & Management','MSc Supply Chain'] },
  { slug:'emlyon-business-school', name:'EMLYON Business School', shortName:'emlyon', country:'France', state:'Auvergne-Rhône-Alpes', city:'Lyon', qsRanking:290, currency:'EUR', annualFee:22000, livingCost:11500, ieltsMin:6.5, intakes:['September'], website:'https://www.emlyon.com', countryCode:'FR', flag:'🇫🇷', workRights:'APS 12 months', courses:['MSc Management','MBA','MSc Marketing','MSc Finance','MSc Entrepreneurship','MSc Supply Chain','MSc Digital Marketing','MSc International Business','MSc Data Management','MSc Human Resources','Executive MBA','MSc Strategy'] },
  { slug:'university-of-strasbourg', name:'University of Strasbourg', shortName:'Strasbourg', country:'France', state:'Grand Est', city:'Strasbourg', qsRanking:287, currency:'EUR', annualFee:3770, livingCost:11000, ieltsMin:6.0, intakes:['September'], website:'https://www.unistra.fr', countryCode:'FR', flag:'🇫🇷', workRights:'APS 12 months', courses:['MSc Chemistry','MSc Biology','MSc Physics','MSc Computer Science','MSc Economics','MA European Studies','MA Theology','MSc Neuroscience','MSc Biomedical Sciences','MSc Materials Science','MA History','MSc Environmental Science','MSc Law (European)','MSc Pharmacology','MSc Mathematics'] },
  { slug:'university-of-montpellier', name:'University of Montpellier', shortName:'Montpellier', country:'France', state:'Occitanie', city:'Montpellier', qsRanking:601, currency:'EUR', annualFee:3770, livingCost:10500, ieltsMin:6.0, intakes:['September'], website:'https://www.umontpellier.fr', countryCode:'FR', flag:'🇫🇷', workRights:'APS 12 months', courses:['MSc Computer Science','MSc Biology','MSc Ecology','MSc Chemistry','MSc Economics','MSc Medicine','MSc Pharmacy','MSc Physics','MSc Mathematics','MSc Environmental Science','MSc Agronomy','MSc Data Science','MA Law','MSc Geography','MSc Psychology'] },
  { slug:'university-of-toulouse', name:'University of Toulouse', shortName:'Toulouse', country:'France', state:'Occitanie', city:'Toulouse', qsRanking:651, currency:'EUR', annualFee:3770, livingCost:10500, ieltsMin:6.0, intakes:['September'], website:'https://www.univ-toulouse.fr', countryCode:'FR', flag:'🇫🇷', workRights:'APS 12 months', courses:['MSc Aerospace Engineering','MSc Computer Science','MSc Data Science','MSc Mathematics','MSc Physics','MSc Chemistry','MSc Biology','MSc Economics','MSc Environmental Science','MA Social Sciences','MSc Robotics','MSc Electrical Engineering','MSc AI','MSc Materials Science','MSc Management'] },
  { slug:'aix-marseille-university', name:'Aix-Marseille University', shortName:'AMU', country:'France', state:'Provence-Alpes-Côte d\'Azur', city:'Marseille', qsRanking:431, currency:'EUR', annualFee:3770, livingCost:11500, ieltsMin:6.0, intakes:['September'], website:'https://www.univ-amu.fr', countryCode:'FR', flag:'🇫🇷', workRights:'APS 12 months', courses:['MSc Computer Science','MSc Biology','MSc Chemistry','MSc Physics','MSc Economics','MSc Law','MSc Public Health','MSc Mathematics','MSc Medicine','MSc Environmental Science','MA History','MSc Psychology','MSc Geography','MSc Management','MSc Marine Science'] },

  // NETHERLANDS (excluding TU Delft already in data)
  { slug:'university-of-amsterdam', name:'University of Amsterdam', shortName:'UvA', country:'Netherlands', state:'North Holland', city:'Amsterdam', qsRanking:53, currency:'EUR', annualFee:16200, livingCost:14000, ieltsMin:6.5, intakes:['September','February'], website:'https://www.uva.nl', countryCode:'NL', flag:'🇳🇱', workRights:'Orientation Year 12 months', courses:['MSc Computer Science','MSc Artificial Intelligence','MSc Data Science','MSc Mathematics','MSc Physics','MSc Chemistry','MSc Economics','MSc Business Administration','MSc Finance','MSc Psychology','MSc Sociology','MSc Political Science','MSc International Relations','MSc Cognitive Science','MSc Environmental Science','MSc Biosciences','MSc Communication Science','MSc Law','MSc Public Health','MSc Information Studies'] },
  { slug:'leiden-university', name:'Leiden University', shortName:'Leiden', country:'Netherlands', state:'South Holland', city:'Leiden', qsRanking:117, currency:'EUR', annualFee:16200, livingCost:14000, ieltsMin:6.5, intakes:['September','February'], website:'https://www.universiteitleiden.nl', countryCode:'NL', flag:'🇳🇱', workRights:'Orientation Year 12 months', courses:['MSc Computer Science','MSc Mathematics','MSc Physics','MSc Chemistry','MSc Biology','MSc Psychology','MSc Law','MSc Linguistics','MSc History','MSc Political Science','MSc International Studies','MSc Archaeology','MSc Biosciences','MSc Astronomy','MSc Security Studies','MSc Media Studies','MSc Philosophy','MSc Statistics','MSc Life Science','MSc Public Health'] },
  { slug:'utrecht-university', name:'Utrecht University', shortName:'UU', country:'Netherlands', state:'Utrecht', city:'Utrecht', qsRanking:93, currency:'EUR', annualFee:15300, livingCost:13500, ieltsMin:6.5, intakes:['September'], website:'https://www.uu.nl', countryCode:'NL', flag:'🇳🇱', workRights:'Orientation Year 12 months', courses:['MSc Computer Science','MSc Data Science','MSc Mathematics','MSc Physics','MSc Chemistry','MSc Biology','MSc Pharmaceutical Sciences','MSc Neuroscience','MSc Psychology','MSc Sociology','MSc Economics','MSc Law','MSc History','MSc Environmental Science','MSc Earth Sciences','MSc Urban Geography','MSc AI','MSc Business Informatics','MSc International Development','MSc Sustainability'] },
  { slug:'erasmus-university-rotterdam', name:'Erasmus University Rotterdam', shortName:'EUR', country:'Netherlands', state:'South Holland', city:'Rotterdam', qsRanking:162, currency:'EUR', annualFee:17100, livingCost:14000, ieltsMin:6.5, intakes:['September','February'], website:'https://www.eur.nl', countryCode:'NL', flag:'🇳🇱', workRights:'Orientation Year 12 months', courses:['MSc Economics','MSc Finance','MSc Business Administration','MSc Marketing','MSc Accounting & Auditing','MSc Supply Chain Management','MSc Health Economics','MSc Law','MSc Social Psychology','MSc International Management','MSc Data Science','MSc Urban Studies','MSc History','MSc Sociology','MSc Public Administration','MSc Criminology','MBA'] },
  { slug:'maastricht-university', name:'Maastricht University', shortName:'UM', country:'Netherlands', state:'Limburg', city:'Maastricht', qsRanking:261, currency:'EUR', annualFee:16300, livingCost:12000, ieltsMin:6.5, intakes:['September','February'], website:'https://www.maastrichtuniversity.nl', countryCode:'NL', flag:'🇳🇱', workRights:'Orientation Year 12 months', courses:['MSc Economics','MSc Finance','MSc Business Intelligence','MSc Globalisation & Development','MSc Health Sciences','MSc Medicine','MSc Psychology','MSc Law','MSc Computer Science','MSc Data Science','MSc Sustainability','MSc Cognitive Neuroscience','MSc European Studies','MSc International Business','MSc Public Policy'] },
  { slug:'vrije-universiteit-amsterdam', name:'Vrije Universiteit Amsterdam', shortName:'VU Amsterdam', country:'Netherlands', state:'North Holland', city:'Amsterdam', qsRanking:176, currency:'EUR', annualFee:16200, livingCost:14000, ieltsMin:6.5, intakes:['September','February'], website:'https://www.vu.nl', countryCode:'NL', flag:'🇳🇱', workRights:'Orientation Year 12 months', courses:['MSc Computer Science','MSc Mathematics','MSc Physics','MSc Chemistry','MSc Biosciences','MSc Neuroscience','MSc Psychology','MSc Economics','MSc Finance','MSc Business Administration','MSc Law','MSc Health Sciences','MSc Earth Sciences','MSc Environmental Science','MSc AI','MSc Data Science','MSc Philosophy','MSc Political Science','MSc Communication'] },
  { slug:'tu-eindhoven', name:'Eindhoven University of Technology', shortName:'TU/e', country:'Netherlands', state:'North Brabant', city:'Eindhoven', qsRanking:176, currency:'EUR', annualFee:17100, livingCost:12000, ieltsMin:6.5, intakes:['September','February'], website:'https://www.tue.nl', countryCode:'NL', flag:'🇳🇱', workRights:'Orientation Year 12 months', courses:['MSc Computer Science','MSc Electrical Engineering','MSc Mechanical Engineering','MSc Industrial Design','MSc Data Science','MSc AI','MSc Biomedical Engineering','MSc Chemical Engineering','MSc Architecture','MSc Innovation Sciences','MSc Operations Management','MSc Applied Mathematics','MSc Automotive Technology','MSc Embedded Systems','MSc Physics'] },
  { slug:'university-of-groningen', name:'University of Groningen', shortName:'RUG', country:'Netherlands', state:'Groningen', city:'Groningen', qsRanking:151, currency:'EUR', annualFee:16400, livingCost:11500, ieltsMin:6.0, intakes:['September','February'], website:'https://www.rug.nl', countryCode:'NL', flag:'🇳🇱', workRights:'Orientation Year 12 months', courses:['MSc Computer Science','MSc AI','MSc Mathematics','MSc Physics','MSc Chemistry','MSc Astronomy','MSc Biology','MSc Psychology','MSc Economics','MSc International Business','MSc Finance','MSc Law','MSc Sociology','MSc Biomedical Engineering','MSc Environmental Science','MSc Energy','MSc Neuroscience','MSc Public Administration'] },
  { slug:'radboud-university', name:'Radboud University', shortName:'RU', country:'Netherlands', state:'Gelderland', city:'Nijmegen', qsRanking:201, currency:'EUR', annualFee:16100, livingCost:12000, ieltsMin:6.0, intakes:['September','February'], website:'https://www.ru.nl', countryCode:'NL', flag:'🇳🇱', workRights:'Orientation Year 12 months', courses:['MSc Computer Science','MSc Artificial Intelligence','MSc Mathematics','MSc Physics','MSc Chemistry','MSc Biology','MSc Neuroscience','MSc Psychology','MSc Economics','MSc Law','MSc Social Sciences','MSc History','MSc Linguistics','MSc Philosophy','MSc Medicine','MSc Data Science','MSc Communication'] },
  { slug:'wageningen-university', name:'Wageningen University & Research', shortName:'WUR', country:'Netherlands', state:'Gelderland', city:'Wageningen', qsRanking:107, currency:'EUR', annualFee:16500, livingCost:12000, ieltsMin:6.5, intakes:['September'], website:'https://www.wur.nl', countryCode:'NL', flag:'🇳🇱', workRights:'Orientation Year 12 months', courses:['MSc Food Technology','MSc Biotechnology','MSc Agriculture','MSc Environmental Science','MSc Biology','MSc Forestry','MSc Data Science','MSc Animal Sciences','MSc Plant Sciences','MSc Nutrition','MSc Climate Studies','MSc Bioinformatics','MSc Organic Agriculture','MSc Water Management','MSc Landscape Architecture'] },
  { slug:'university-of-twente', name:'University of Twente', shortName:'UT', country:'Netherlands', state:'Overijssel', city:'Enschede', qsRanking:415, currency:'EUR', annualFee:16600, livingCost:11500, ieltsMin:6.0, intakes:['September','February'], website:'https://www.utwente.nl', countryCode:'NL', flag:'🇳🇱', workRights:'Orientation Year 12 months', courses:['MSc Computer Science','MSc Electrical Engineering','MSc Mechanical Engineering','MSc Chemical Engineering','MSc Business Administration','MSc Industrial Engineering','MSc AI','MSc Data Science','MSc Health Technology','MSc Nanotechnology','MSc Applied Mathematics','MSc Communication Studies','MSc Sustainable Energy','MSc Governance','MSc Civil Engineering'] },
  { slug:'tilburg-university', name:'Tilburg University', shortName:'Tilburg', country:'Netherlands', state:'North Brabant', city:'Tilburg', qsRanking:451, currency:'EUR', annualFee:15800, livingCost:12000, ieltsMin:6.5, intakes:['September','February'], website:'https://www.tilburguniversity.edu', countryCode:'NL', flag:'🇳🇱', workRights:'Orientation Year 12 months', courses:['MSc Economics','MSc Finance','MSc Business Administration','MSc Marketing','MSc Data Science','MSc Law','MSc Psychology','MSc Sociology','MSc Communication','MSc Human Resources','MSc Public Administration','MSc Cognitive Science','MSc AI','MSc Philosophy','MSc Global Management'] },
  { slug:'han-university', name:'HAN University of Applied Sciences', shortName:'HAN', country:'Netherlands', state:'Gelderland', city:'Arnhem', qsRanking:0, currency:'EUR', annualFee:9400, livingCost:12000, ieltsMin:6.0, intakes:['September','February'], website:'https://www.han.nl', countryCode:'NL', flag:'🇳🇱', workRights:'Orientation Year 12 months', courses:['BSc Computer Science','BSc Business Administration','BSc Engineering','BSc International Business','BSc Nursing','BSc Social Work','BSc Data Science','BSc Automotive Engineering','BSc Electrical Engineering','BSc Mechanical Engineering','BSc Communication','MSc Business Administration','MSc Data Driven Design','MSc Health Sciences'] },
  { slug:'amsterdam-university-of-applied-sciences', name:'Amsterdam University of Applied Sciences', shortName:'AUAS', country:'Netherlands', state:'North Holland', city:'Amsterdam', qsRanking:0, currency:'EUR', annualFee:9400, livingCost:14000, ieltsMin:6.0, intakes:['September','February'], website:'https://www.hva.nl', countryCode:'NL', flag:'🇳🇱', workRights:'Orientation Year 12 months', courses:['BSc Computer Science','BSc Business Administration','BSc Communication','BSc Media & Design','BSc Hospitality Management','BSc International Business','BSc Finance','BSc Digital Media','BSc Art & Design','BSc Fashion Management','BSc Logistics','BSc Social Work','MSc Urban Design','MSc Applied Data Science','BSc Hotel Management'] },

  // SWEDEN
  { slug:'kth-royal-institute-of-technology', name:'KTH Royal Institute of Technology', shortName:'KTH', country:'Sweden', state:'Stockholm', city:'Stockholm', qsRanking:89, currency:'SEK', annualFee:195000, livingCost:120000, ieltsMin:6.5, intakes:['August'], website:'https://www.kth.se', countryCode:'SE', flag:'🇸🇪', workRights:'6-month job-seeker', courses:['MSc Computer Science','MSc Data Science','MSc Electrical Engineering','MSc Mechanical Engineering','MSc Aerospace Engineering','MSc Environmental Engineering','MSc Industrial Engineering','MSc Materials Science','MSc AI','MSc Cybersecurity','MSc Machine Learning','MSc Nuclear Engineering','MSc Chemical Engineering','MSc Civil Engineering','MSc Biomedical Engineering','MSc Energy Systems','MSc Robotics'] },
  { slug:'lund-university', name:'Lund University', shortName:'Lund', country:'Sweden', state:'Skåne', city:'Lund', qsRanking:78, currency:'SEK', annualFee:165000, livingCost:110000, ieltsMin:6.5, intakes:['August'], website:'https://www.lu.se', countryCode:'SE', flag:'🇸🇪', workRights:'6-month job-seeker', courses:['MSc Computer Science','MSc Data Science','MSc AI','MSc Electrical Engineering','MSc Mechanical Engineering','MSc Economics','MSc Business Administration','MSc Environmental Science','MSc Law','MSc Medicine','MSc Architecture','MSc Chemistry','MSc Physics','MSc Mathematics','MSc Biosciences','MSc Psychology','MSc Social Sciences','MSc Political Science','MSc Sustainability'] },
  { slug:'uppsala-university', name:'Uppsala University', shortName:'UU', country:'Sweden', state:'Uppsala', city:'Uppsala', qsRanking:120, currency:'SEK', annualFee:145000, livingCost:105000, ieltsMin:6.5, intakes:['August'], website:'https://www.uu.se', countryCode:'SE', flag:'🇸🇪', workRights:'6-month job-seeker', courses:['MSc Computer Science','MSc Mathematics','MSc Physics','MSc Chemistry','MSc Biology','MSc Pharmacy','MSc Psychology','MSc Economics','MSc History','MSc Law','MSc Linguistics','MSc Sociology','MSc Environmental Science','MSc Bioinformatics','MSc Neuroscience','MSc Data Science','MSc Political Science'] },
  { slug:'stockholm-university', name:'Stockholm University', shortName:'SU', country:'Sweden', state:'Stockholm', city:'Stockholm', qsRanking:182, currency:'SEK', annualFee:130000, livingCost:120000, ieltsMin:6.5, intakes:['August','January'], website:'https://www.su.se', countryCode:'SE', flag:'🇸🇪', workRights:'6-month job-seeker', courses:['MSc Computer Science','MSc Data Science','MSc Mathematics','MSc Physics','MSc Chemistry','MSc Biology','MSc Psychology','MSc Economics','MSc Sociology','MSc Law','MSc History','MSc Linguistics','MSc Environmental Science','MSc Biosciences','MSc Political Science','MSc Media Studies','MSc Education'] },
  { slug:'chalmers-university', name:'Chalmers University of Technology', shortName:'Chalmers', country:'Sweden', state:'Västra Götaland', city:'Gothenburg', qsRanking:121, currency:'SEK', annualFee:185000, livingCost:115000, ieltsMin:6.5, intakes:['August'], website:'https://www.chalmers.se', countryCode:'SE', flag:'🇸🇪', workRights:'6-month job-seeker', courses:['MSc Computer Science','MSc Electrical Engineering','MSc Mechanical Engineering','MSc Chemical Engineering','MSc Architecture','MSc Biomedical Engineering','MSc Data Science','MSc AI','MSc Industrial Design','MSc Naval Architecture','MSc Materials Science','MSc Wireless Photonics','MSc Engineering Mathematics','MSc Systems Control','MSc Complex Adaptive Systems'] },
  { slug:'university-of-gothenburg', name:'University of Gothenburg', shortName:'GU', country:'Sweden', state:'Västra Götaland', city:'Gothenburg', qsRanking:271, currency:'SEK', annualFee:125000, livingCost:115000, ieltsMin:6.5, intakes:['August'], website:'https://www.gu.se', countryCode:'SE', flag:'🇸🇪', workRights:'6-month job-seeker', courses:['MSc Economics','MSc Business Administration','MSc Data Science','MSc Psychology','MSc Biology','MSc Marine Science','MSc Environmental Science','MSc Education','MSc Public Health','MSc Art History','MSc Journalism','MSc Law','MSc Sustainability','MSc Social Work','MSc Culture'] },
  { slug:'linkoping-university', name:'Linköping University', shortName:'LiU', country:'Sweden', state:'Östergötland', city:'Linköping', qsRanking:355, currency:'SEK', annualFee:135000, livingCost:100000, ieltsMin:6.5, intakes:['August'], website:'https://www.liu.se', countryCode:'SE', flag:'🇸🇪', workRights:'6-month job-seeker', courses:['MSc Computer Science','MSc AI','MSc Electrical Engineering','MSc Mechanical Engineering','MSc Industrial Engineering','MSc Biomedical Engineering','MSc Data Science','MSc Media Technology','MSc Statistics','MSc Cognitive Science','MSc Applied Physics','MSc Environmental Science','MSc Supply Chain Management'] },
  { slug:'umea-university', name:'Umeå University', shortName:'UmU', country:'Sweden', state:'Västernorrland', city:'Umeå', qsRanking:393, currency:'SEK', annualFee:125000, livingCost:95000, ieltsMin:6.0, intakes:['August'], website:'https://www.umu.se', countryCode:'SE', flag:'🇸🇪', workRights:'6-month job-seeker', courses:['MSc Computer Science','MSc Mathematics','MSc Chemistry','MSc Biology','MSc Medicine','MSc Psychology','MSc Ecology','MSc Bioinformatics','MSc Social Work','MSc Education','MSc Public Health','MSc Environmental Science','MSc Physics'] },
  { slug:'stockholm-school-of-economics', name:'Stockholm School of Economics', shortName:'SSE', country:'Sweden', state:'Stockholm', city:'Stockholm', qsRanking:256, currency:'SEK', annualFee:195000, livingCost:120000, ieltsMin:7.0, intakes:['August'], website:'https://www.hhs.se', countryCode:'SE', flag:'🇸🇪', workRights:'6-month job-seeker', courses:['MSc Economics','MSc Finance','MSc Business & Management','MSc Accounting','MSc International Business','MSc Marketing','MSc Statistics','MBA','Executive MBA','MSc Real Estate'] },
  { slug:'karolinska-institutet', name:'Karolinska Institutet', shortName:'KI', country:'Sweden', state:'Stockholm', city:'Stockholm', qsRanking:42, currency:'SEK', annualFee:190000, livingCost:120000, ieltsMin:7.0, intakes:['August'], website:'https://ki.se', countryCode:'SE', flag:'🇸🇪', workRights:'6-month job-seeker', courses:['MSc Biomedicine','MSc Global Health','MSc Nursing','MSc Public Health','MSc Biomedical Engineering','MSc Toxicology','MSc Physiotherapy','MSc Pharmacology','MSc Oncology','MSc Bioentrepreneurship','MSc Medical Radiation Sciences','PhD Medicine'] },
  { slug:'jonkoping-university', name:'Jönköping University', shortName:'JU', country:'Sweden', state:'Jönköping', city:'Jönköping', qsRanking:700, currency:'SEK', annualFee:115000, livingCost:95000, ieltsMin:6.0, intakes:['August','January'], website:'https://ju.se', countryCode:'SE', flag:'🇸🇪', workRights:'6-month job-seeker', courses:['MSc Business Administration','MSc Engineering','BSc International Business','BSc Computer Engineering','MSc Industrial Engineering','BSc Work Science','BSc Media Technology','MSc Accounting','MSc Supply Chain','BSc Social Work'] },
  { slug:'malardalen-university', name:'Mälardalen University', shortName:'MDU', country:'Sweden', state:'Västmanland', city:'Västerås', qsRanking:0, currency:'SEK', annualFee:110000, livingCost:90000, ieltsMin:6.0, intakes:['August','January'], website:'https://www.mdu.se', countryCode:'SE', flag:'🇸🇪', workRights:'6-month job-seeker', courses:['MSc Computer Science','MSc Embedded Systems','MSc Robotics','MSc AI','BSc Computer Engineering','MSc Business Administration','MSc Innovation','BSc Electrical Engineering','MSc Data Science','BSc Social Work'] },
  { slug:'mid-sweden-university', name:'Mid Sweden University', shortName:'MIUN', country:'Sweden', state:'Jämtland', city:'Sundsvall', qsRanking:0, currency:'SEK', annualFee:100000, livingCost:85000, ieltsMin:6.0, intakes:['August','January'], website:'https://www.miun.se', countryCode:'SE', flag:'🇸🇪', workRights:'6-month job-seeker', courses:['MSc Electronics Design','BSc Computer Engineering','MSc Data Science','BSc Business Administration','MSc Risk Management','BSc Media & Communication','MSc Sound and Vibration','BSc Tourism','MSc Sustainable Tourism','BSc Engineering'] },
  { slug:'halmstad-university', name:'Halmstad University', shortName:'HH', country:'Sweden', state:'Halland', city:'Halmstad', qsRanking:0, currency:'SEK', annualFee:100000, livingCost:90000, ieltsMin:6.0, intakes:['August'], website:'https://www.hh.se', countryCode:'SE', flag:'🇸🇪', workRights:'6-month job-seeker', courses:['MSc AI','MSc Data Science','BSc Computer Science','MSc Machine Learning','BSc Mechanical Engineering','BSc Business Administration','BSc Electrical Engineering','MSc Innovation & Entrepreneurship','BSc Design & Product Development'] },
  { slug:'slu-sweden', name:'Swedish University of Agricultural Sciences', shortName:'SLU', country:'Sweden', state:'Uppsala', city:'Uppsala', qsRanking:486, currency:'SEK', annualFee:150000, livingCost:105000, ieltsMin:6.5, intakes:['August'], website:'https://www.slu.se', countryCode:'SE', flag:'🇸🇪', workRights:'6-month job-seeker', courses:['MSc Environmental Science','MSc Forest Science','MSc Agriculture','MSc Soil & Water Management','MSc Landscape Architecture','MSc Animal Science','MSc Veterinary Medicine','MSc Ecology','MSc Aquatic Ecology','MSc Biotechnology','MSc Food Science'] },

  // UAE
  { slug:'university-of-sharjah', name:'University of Sharjah', shortName:'UoS', country:'UAE', state:'Sharjah', city:'Sharjah', qsRanking:601, currency:'AED', annualFee:54000, livingCost:55000, ieltsMin:6.0, intakes:['September','January'], website:'https://www.sharjah.ac.ae', countryCode:'AE', flag:'🇦🇪', workRights:'Employment visa sponsorship', courses:['BSc Computer Science','BSc Electrical Engineering','BSc Civil Engineering','BSc Mechanical Engineering','BSc Business Administration','BSc Accounting','BSc Architecture','MSc Computer Science','MBA','MSc Engineering Management','BSc Medicine','BSc Law','BSc Pharmacy','MSc Cybersecurity','BSc AI'] },
  { slug:'american-university-of-sharjah', name:'American University of Sharjah', shortName:'AUS', country:'UAE', state:'Sharjah', city:'Sharjah', qsRanking:421, currency:'AED', annualFee:72000, livingCost:55000, ieltsMin:6.5, intakes:['September','January'], website:'https://www.aus.edu', countryCode:'AE', flag:'🇦🇪', workRights:'Employment visa sponsorship', courses:['BSc Computer Science','BSc Electrical Engineering','BSc Mechanical Engineering','BSc Civil Engineering','BSc Chemical Engineering','BSc Architecture','BSc Business Administration','BSc Accounting','MBA','MSc Engineering Management','MSc Computer Engineering','BSc Interior Design','MSc Systems Engineering','MSc Finance','BSc Applied Mathematics'] },
  { slug:'khalifa-university', name:'Khalifa University', shortName:'KU', country:'UAE', state:'Abu Dhabi', city:'Abu Dhabi', qsRanking:203, currency:'AED', annualFee:58000, livingCost:60000, ieltsMin:6.5, intakes:['September','January'], website:'https://www.ku.ac.ae', countryCode:'AE', flag:'🇦🇪', workRights:'Employment visa sponsorship', courses:['MSc Computer Science','MSc Electrical Engineering','MSc Mechanical Engineering','MSc Aerospace Engineering','MSc Chemical Engineering','MSc Petroleum Engineering','MSc Robotics','MSc AI','MSc Cybersecurity','MSc Data Science','MSc Biomedical Engineering','MSc Civil Engineering','BSc Engineering','PhD Engineering','MSc Nuclear Engineering'] },
  { slug:'uae-university', name:'UAE University', shortName:'UAEU', country:'UAE', state:'Abu Dhabi', city:'Al Ain', qsRanking:401, currency:'AED', annualFee:48000, livingCost:55000, ieltsMin:6.0, intakes:['September','January'], website:'https://www.uaeu.ac.ae', countryCode:'AE', flag:'🇦🇪', workRights:'Employment visa sponsorship', courses:['BSc Computer Science','BSc Engineering','BSc Business Administration','BSc Nursing','BSc Medicine','MSc Computer Science','MBA','MSc Engineering','BSc Law','BSc Education','MSc Finance','BSc Food Science','BSc Environmental Science','MSc AI','BSc Architecture'] },
  { slug:'heriot-watt-university-dubai', name:'Heriot-Watt University Dubai', shortName:'HWU Dubai', country:'UAE', state:'Dubai', city:'Dubai', qsRanking:350, currency:'AED', annualFee:80000, livingCost:65000, ieltsMin:6.5, intakes:['September','January'], website:'https://www.hw.ac.uk/dubai', countryCode:'AE', flag:'🇦🇪', workRights:'Employment visa sponsorship', courses:['BSc Computer Science','BSc Data Science','MSc AI','MSc Data Science','MSc Cybersecurity','BSc Electrical Engineering','BSc Mechanical Engineering','BSc Business Management','MSc Finance','MBA','MSc Supply Chain Management','BSc Quantity Surveying','MSc Computer Systems','BSc Petroleum Engineering','BSc Architecture'] },
  { slug:'middlesex-university-dubai', name:'Middlesex University Dubai', shortName:'MDX Dubai', country:'UAE', state:'Dubai', city:'Dubai', qsRanking:0, currency:'AED', annualFee:65000, livingCost:65000, ieltsMin:6.0, intakes:['September','January'], website:'https://www.mdx.ac.ae', countryCode:'AE', flag:'🇦🇪', workRights:'Employment visa sponsorship', courses:['BSc Computer Science','BSc Business Administration','BSc Psychology','BSc Accounting','MSc Computer Science','MBA','MSc Finance','BSc Media & Communication','MSc Data Science','BSc Law','BSc Nursing','MSc Project Management','BSc Interior Design','MSc Cybersecurity','BSc Engineering Management'] },
  { slug:'murdoch-university-dubai', name:'Murdoch University Dubai', shortName:'Murdoch Dubai', country:'UAE', state:'Dubai', city:'Dubai', qsRanking:0, currency:'AED', annualFee:62000, livingCost:65000, ieltsMin:6.0, intakes:['September','January','April'], website:'https://www.murdochdubai.ac.ae', countryCode:'AE', flag:'🇦🇪', workRights:'Employment visa sponsorship', courses:['BSc Computer Science','BSc Business Administration','BSc Engineering','BSc Psychology','MSc Computer Science','MBA','MSc Data Science','BSc Law','BSc Media & Communication','BSc Forensic Science','MSc Engineering Management','BSc Finance','BSc Marketing','MSc Project Management'] },
  { slug:'uowd-dubai', name:'University of Wollongong in Dubai', shortName:'UOWD', country:'UAE', state:'Dubai', city:'Dubai', qsRanking:0, currency:'AED', annualFee:68000, livingCost:65000, ieltsMin:6.0, intakes:['September','January'], website:'https://www.uowdubai.ac.ae', countryCode:'AE', flag:'🇦🇪', workRights:'Employment visa sponsorship', courses:['BSc Computer Science','BSc Information Technology','BSc Engineering','BSc Business Administration','MBA','MSc Computer Science','MSc Finance','MSc Data Science','BSc Accounting','BSc Marketing','MSc Project Management','BSc Electrical Engineering','MSc Supply Chain'] },
  { slug:'rit-dubai', name:'Rochester Institute of Technology Dubai', shortName:'RIT Dubai', country:'UAE', state:'Dubai', city:'Dubai', qsRanking:0, currency:'AED', annualFee:75000, livingCost:65000, ieltsMin:6.0, intakes:['September','January'], website:'https://www.rit.edu/dubai', countryCode:'AE', flag:'🇦🇪', workRights:'Employment visa sponsorship', courses:['BSc Computer Science','BSc Electrical Engineering','BSc Mechanical Engineering','BSc Business Management','BSc Graphic Design','MSc Engineering Management','BSc Computing Security','BSc Finance','BSc Game Design','BSc Information Technology','MSc Data Science','BSc Interactive Media'] },
  { slug:'manipal-dubai', name:'Manipal Academy of Higher Education Dubai', shortName:'MAHE Dubai', country:'UAE', state:'Dubai', city:'Dubai', qsRanking:0, currency:'AED', annualFee:52000, livingCost:60000, ieltsMin:6.0, intakes:['September','January'], website:'https://manipaldubai.com', countryCode:'AE', flag:'🇦🇪', workRights:'Employment visa sponsorship', courses:['BSc Engineering','BSc Computer Science','BSc Business Administration','BSc Accounting','BDS Dentistry','BSc Medicine','BSc Nursing','BSc Architecture','MBA','MSc Computer Science','BSc Media Communication','BSc Fashion Design'] },
  { slug:'bits-pilani-dubai', name:'BITS Pilani Dubai', shortName:'BITS Dubai', country:'UAE', state:'Dubai', city:'Dubai', qsRanking:0, currency:'AED', annualFee:78000, livingCost:65000, ieltsMin:6.0, intakes:['August','January'], website:'https://www.bits-dubai.ac.ae', countryCode:'AE', flag:'🇦🇪', workRights:'Employment visa sponsorship', courses:['BSc Computer Science','BSc Electrical Engineering','BSc Mechanical Engineering','BSc Chemical Engineering','BSc Civil Engineering','BSc Mathematics','BSc Economics','BSc Electronics','MSc Engineering','MSc Data Science'] },
  { slug:'canadian-university-dubai', name:'Canadian University Dubai', shortName:'CUD', country:'UAE', state:'Dubai', city:'Dubai', qsRanking:0, currency:'AED', annualFee:48000, livingCost:65000, ieltsMin:6.0, intakes:['September','January'], website:'https://www.cud.ac.ae', countryCode:'AE', flag:'🇦🇪', workRights:'Employment visa sponsorship', courses:['BSc Computer Science','BSc Business Administration','BSc Engineering','BSc Architecture','BSc Accounting','BSc Finance','BSc Marketing','BSc Communications','MBA','MSc Computer Science','BSc Interior Design','BSc Law'] },
  { slug:'american-university-dubai', name:'American University in Dubai', shortName:'AUD', country:'UAE', state:'Dubai', city:'Dubai', qsRanking:0, currency:'AED', annualFee:72000, livingCost:65000, ieltsMin:6.5, intakes:['September','January'], website:'https://www.aud.edu', countryCode:'AE', flag:'🇦🇪', workRights:'Employment visa sponsorship', courses:['BSc Business Administration','BSc Computer Science','BSc Architecture','BSc Engineering','BSc Graphic Design','MBA','BSc Accounting','BSc Finance','BSc Marketing','MSc Computer Science','BSc Media & Communication','BSc Interior Design'] },
  { slug:'amity-university-dubai', name:'Amity University Dubai', shortName:'Amity Dubai', country:'UAE', state:'Dubai', city:'Dubai', qsRanking:0, currency:'AED', annualFee:42000, livingCost:60000, ieltsMin:6.0, intakes:['September','January'], website:'https://www.amityuniversity.ae', countryCode:'AE', flag:'🇦🇪', workRights:'Employment visa sponsorship', courses:['BSc Computer Science','BSc Business Administration','BSc Engineering','BSc Law','BSc Psychology','MBA','MSc Computer Science','BSc Journalism','BSc Commerce','BSc Design','BSc Tourism','BSc Biotechnology'] },
  { slug:'sp-jain-dubai', name:'S P Jain School of Global Management', shortName:'SP Jain Dubai', country:'UAE', state:'Dubai', city:'Dubai', qsRanking:0, currency:'AED', annualFee:120000, livingCost:65000, ieltsMin:6.5, intakes:['September','January'], website:'https://www.spjain.org', countryCode:'AE', flag:'🇦🇪', workRights:'Employment visa sponsorship', courses:['BBA Global Management','MBA','Executive MBA','Global MBA','Master in Global Business'] },

  // DENMARK
  { slug:'technical-university-of-denmark', name:'Technical University of Denmark', shortName:'DTU', country:'Denmark', state:'Capital Region', city:'Kongens Lyngby', qsRanking:177, currency:'DKK', annualFee:0, livingCost:110000, ieltsMin:6.5, intakes:['September'], website:'https://www.dtu.dk', countryCode:'DK', flag:'🇩🇰', workRights:'6-month job-seeker', courses:['MSc Computer Science','MSc Data Science','MSc Electrical Engineering','MSc Mechanical Engineering','MSc Chemical Engineering','MSc Environmental Engineering','MSc Mathematical Modelling','MSc AI','MSc Biomedical Engineering','MSc Civil Engineering','MSc Food Technology','MSc Aerospace Engineering','MSc Physics','MSc Biotechnology','MSc Energy'] },
  { slug:'university-of-copenhagen', name:'University of Copenhagen', shortName:'UCPH', country:'Denmark', state:'Capital Region', city:'Copenhagen', qsRanking:97, currency:'DKK', annualFee:0, livingCost:110000, ieltsMin:6.5, intakes:['September'], website:'https://www.ku.dk', countryCode:'DK', flag:'🇩🇰', workRights:'6-month job-seeker', courses:['MSc Computer Science','MSc Mathematics','MSc Physics','MSc Chemistry','MSc Biology','MSc Medicine','MSc Pharmacy','MSc Psychology','MSc Economics','MSc Law','MSc Political Science','MSc Sociology','MSc Environmental Science','MSc Biosciences','MSc Data Science','MSc Public Health','MSc Neuroscience'] },
  { slug:'aarhus-university', name:'Aarhus University', shortName:'AU', country:'Denmark', state:'Central Denmark', city:'Aarhus', qsRanking:165, currency:'DKK', annualFee:0, livingCost:100000, ieltsMin:6.5, intakes:['September'], website:'https://www.au.dk', countryCode:'DK', flag:'🇩🇰', workRights:'6-month job-seeker', courses:['MSc Computer Science','MSc AI','MSc Mathematics','MSc Physics','MSc Chemistry','MSc Biology','MSc Economics','MSc Business Administration','MSc Psychology','MSc Law','MSc History','MSc Environmental Science','MSc Molecular Biology','MSc Nanoscience','MSc Data Science'] },
  { slug:'copenhagen-business-school', name:'Copenhagen Business School', shortName:'CBS', country:'Denmark', state:'Capital Region', city:'Copenhagen', qsRanking:190, currency:'DKK', annualFee:0, livingCost:110000, ieltsMin:6.5, intakes:['September','February'], website:'https://www.cbs.dk', countryCode:'DK', flag:'🇩🇰', workRights:'6-month job-seeker', courses:['MSc Finance','MSc Economics','MSc Business Administration','MSc Marketing','MSc International Business','MSc Accounting','MSc Supply Chain Management','MSc Data Science in Business','MBA','MSc IT Management','MSc Strategy & Organisation','MSc Human Resource Management','MSc Sustainability'] },
  { slug:'aalborg-university', name:'Aalborg University', shortName:'AAU', country:'Denmark', state:'North Denmark', city:'Aalborg', qsRanking:351, currency:'DKK', annualFee:0, livingCost:90000, ieltsMin:6.0, intakes:['September','February'], website:'https://www.aau.dk', countryCode:'DK', flag:'🇩🇰', workRights:'6-month job-seeker', courses:['MSc Computer Science','MSc Electronic Engineering','MSc IT and Cognition','MSc Architecture','MSc Civil Engineering','MSc Structural & Civil Engineering','MSc Surveying','MSc Software Engineering','MSc Techno-anthropology','MSc Sustainable Energy','MSc Water & Environment','MSc AI','MSc Data Science'] },
  { slug:'university-of-southern-denmark', name:'University of Southern Denmark', shortName:'SDU', country:'Denmark', state:'Southern Denmark', city:'Odense', qsRanking:501, currency:'DKK', annualFee:0, livingCost:90000, ieltsMin:6.0, intakes:['September','February'], website:'https://www.sdu.dk', countryCode:'DK', flag:'🇩🇰', workRights:'6-month job-seeker', courses:['MSc Computer Science','MSc Data Science','MSc AI','MSc Mathematics','MSc Physics','MSc Biology','MSc Biochemistry','MSc Medicine','MSc Pharmacy','MSc Public Health','MSc Economics','MSc Business Administration','MSc Sociology','MSc Law'] },
  { slug:'it-university-of-copenhagen', name:'IT University of Copenhagen', shortName:'ITU', country:'Denmark', state:'Capital Region', city:'Copenhagen', qsRanking:0, currency:'DKK', annualFee:0, livingCost:110000, ieltsMin:6.5, intakes:['September'], website:'https://www.itu.dk', countryCode:'DK', flag:'🇩🇰', workRights:'6-month job-seeker', courses:['MSc Computer Science','MSc Software Design','MSc Data Science','MSc AI','MSc Digital Innovation & Management','MSc Games','MSc IT Product Design','BSc Digital Media & Design','MSc IT & Cognition','BSc Data Science'] },
  { slug:'roskilde-university', name:'Roskilde University', shortName:'RUC', country:'Denmark', state:'Zealand', city:'Roskilde', qsRanking:0, currency:'DKK', annualFee:0, livingCost:100000, ieltsMin:6.0, intakes:['September'], website:'https://www.ruc.dk', countryCode:'DK', flag:'🇩🇰', workRights:'6-month job-seeker', courses:['MSc International Development Studies','MSc Environmental Studies','MSc Computer Science','MSc Psychology','MSc Sociology','MSc Political Science','MSc Business Studies','MSc Humanities','MSc Data Science','MSc Global Studies','BSc Social Entrepreneurship'] },
  { slug:'via-university-college', name:'VIA University College', shortName:'VIA UC', country:'Denmark', state:'Central Denmark', city:'Horsens', qsRanking:0, currency:'DKK', annualFee:60000, livingCost:90000, ieltsMin:6.0, intakes:['September','February'], website:'https://en.via.dk', countryCode:'DK', flag:'🇩🇰', workRights:'6-month job-seeker', courses:['BSc Nursing','BSc Social Work','BSc Architecture','BSc Computer Science','BSc Bioanalysis','BSc Occupational Therapy','BSc Physiotherapy','BSc Midwifery','BSc Teacher Education','BSc Product Development'] },
  { slug:'ucn-university-college', name:'UCN University College', shortName:'UCN', country:'Denmark', state:'North Denmark', city:'Aalborg', qsRanking:0, currency:'DKK', annualFee:60000, livingCost:90000, ieltsMin:6.0, intakes:['September','February'], website:'https://www.ucn.dk', countryCode:'DK', flag:'🇩🇰', workRights:'6-month job-seeker', courses:['BSc Nursing','BSc Social Work','BSc Marketing Management','BSc IT Technology','BSc Financial Controller','BSc Logistics','BSc Education','BSc Social Education'] },
  { slug:'business-academy-aarhus', name:'Business Academy Aarhus', shortName:'BAAA', country:'Denmark', state:'Central Denmark', city:'Aarhus', qsRanking:0, currency:'DKK', annualFee:60000, livingCost:100000, ieltsMin:6.0, intakes:['September','February'], website:'https://www.baaa.dk', countryCode:'DK', flag:'🇩🇰', workRights:'6-month job-seeker', courses:['BSc Business Administration','BSc Marketing Management','BSc Financial Controller','BSc IT Technology','BSc Logistics Management','BSc International Sales & Marketing','BSc Multimedia Design'] },
  { slug:'iba-kolding', name:'IBA International Business Academy', shortName:'IBA', country:'Denmark', state:'Southern Denmark', city:'Kolding', qsRanking:0, currency:'DKK', annualFee:58000, livingCost:88000, ieltsMin:6.0, intakes:['September','February'], website:'https://www.iba.dk', countryCode:'DK', flag:'🇩🇰', workRights:'6-month job-seeker', courses:['BSc International Business','BSc Marketing Management','BSc Digital Marketing','BSc Innovation Management','BSc Financial Management','BSc Logistics Management'] },
  { slug:'zealand-business-technology', name:'Zealand Institute of Business and Technology', shortName:'ZIBAT', country:'Denmark', state:'Zealand', city:'Roskilde', qsRanking:0, currency:'DKK', annualFee:58000, livingCost:95000, ieltsMin:6.0, intakes:['September','February'], website:'https://www.zealand.dk', countryCode:'DK', flag:'🇩🇰', workRights:'6-month job-seeker', courses:['BSc Business Administration','BSc IT Technology','BSc Financial Controller','BSc Marketing Management','BSc Logistics','BSc Software Development'] },
  { slug:'ea-business-academy', name:'Copenhagen Business Academy', shortName:'Cphbusiness', country:'Denmark', state:'Capital Region', city:'Copenhagen', qsRanking:0, currency:'DKK', annualFee:60000, livingCost:110000, ieltsMin:6.0, intakes:['September','February'], website:'https://www.cphbusiness.dk', countryCode:'DK', flag:'🇩🇰', workRights:'6-month job-seeker', courses:['BSc Financial Management','BSc Marketing Management','BSc IT Technology','BSc Logistics','BSc International Sales','BSc Multimedia Design','BSc Financial Controller'] },
  { slug:'dania-academy', name:'Dania Academy', shortName:'Dania', country:'Denmark', state:'Central Denmark', city:'Silkeborg', qsRanking:0, currency:'DKK', annualFee:55000, livingCost:88000, ieltsMin:6.0, intakes:['September','February'], website:'https://www.dania.dk', countryCode:'DK', flag:'🇩🇰', workRights:'6-month job-seeker', courses:['BSc Business Administration','BSc Marketing Management','BSc Sports Management','BSc Music Management','BSc Financial Controller','BSc International Marketing'] },

  // ITALY
  { slug:'politecnico-di-milano', name:'Politecnico di Milano', shortName:'PoliMi', country:'Italy', state:'Lombardy', city:'Milan', qsRanking:139, currency:'EUR', annualFee:12000, livingCost:13000, ieltsMin:6.5, intakes:['September','April'], website:'https://www.polimi.it', countryCode:'IT', flag:'🇮🇹', workRights:'Job-seeker 12 months', courses:['MSc Computer Science','MSc Data Science','MSc AI','MSc Electrical Engineering','MSc Mechanical Engineering','MSc Aerospace Engineering','MSc Civil Engineering','MSc Architecture','MSc Design','MSc Management Engineering','MSc Chemical Engineering','MSc Energy Engineering','MSc Materials Engineering','MSc Biomedical Engineering','MSc Urban Planning','MSc Fashion Systems'] },
  { slug:'politecnico-di-torino', name:'Politecnico di Torino', shortName:'PoliTo', country:'Italy', state:'Piedmont', city:'Turin', qsRanking:357, currency:'EUR', annualFee:9500, livingCost:11000, ieltsMin:6.5, intakes:['September','March'], website:'https://www.polito.it', countryCode:'IT', flag:'🇮🇹', workRights:'Job-seeker 12 months', courses:['MSc Computer Science','MSc Data Science','MSc Electrical Engineering','MSc Mechanical Engineering','MSc Aerospace Engineering','MSc Civil Engineering','MSc Architecture','MSc AI','MSc Automotive Engineering','MSc Chemical Engineering','MSc Materials Engineering','MSc Communications Engineering','MSc Mechatronics','MSc Physics','MSc Nanotechnologies'] },
  { slug:'university-of-bologna', name:'University of Bologna', shortName:'UniBO', country:'Italy', state:'Emilia-Romagna', city:'Bologna', qsRanking:154, currency:'EUR', annualFee:8000, livingCost:11500, ieltsMin:6.0, intakes:['September'], website:'https://www.unibo.it', countryCode:'IT', flag:'🇮🇹', workRights:'Job-seeker 12 months', courses:['MSc Computer Science','MSc AI','MSc Data Science','MSc Mathematics','MSc Physics','MSc Chemistry','MSc Biology','MSc Economics','MSc Law','MSc Engineering','MSc Business Administration','MSc Psychology','MSc Environmental Science','MSc Pharmacy','MSc International Relations','MSc Sociology','MSc Astrophysics'] },
  { slug:'sapienza-university-rome', name:'Sapienza University of Rome', shortName:'Sapienza', country:'Italy', state:'Lazio', city:'Rome', qsRanking:171, currency:'EUR', annualFee:3000, livingCost:12000, ieltsMin:6.0, intakes:['September'], website:'https://www.uniroma1.it', countryCode:'IT', flag:'🇮🇹', workRights:'Job-seeker 12 months', courses:['MSc Computer Science','MSc AI','MSc Mathematics','MSc Physics','MSc Chemistry','MSc Biology','MSc Architecture','MSc Economics','MSc Law','MSc Engineering','MSc Data Science','MSc Astronomy','MSc Cultural Heritage','MSc Sociology','MSc International Relations'] },
  { slug:'bocconi-university', name:'Bocconi University', shortName:'Bocconi', country:'Italy', state:'Lombardy', city:'Milan', qsRanking:171, currency:'EUR', annualFee:14800, livingCost:13000, ieltsMin:7.0, intakes:['September'], website:'https://www.unibocconi.eu', countryCode:'IT', flag:'🇮🇹', workRights:'Job-seeker 12 months', courses:['MSc Finance','MSc Economics','MSc Management','MSc Marketing','MSc Data Science','MSc Accounting','MSc Law','MBA','MSc International Management','MSc Business Analytics','MSc Real Estate','MSc Government','MSc Fashion & Luxury Management','MSc Political Economy'] },
  { slug:'university-of-milan', name:'University of Milan', shortName:'UniMi', country:'Italy', state:'Lombardy', city:'Milan', qsRanking:221, currency:'EUR', annualFee:4500, livingCost:13000, ieltsMin:6.0, intakes:['September'], website:'https://www.unimi.it', countryCode:'IT', flag:'🇮🇹', workRights:'Job-seeker 12 months', courses:['MSc Computer Science','MSc Mathematics','MSc Physics','MSc Chemistry','MSc Biology','MSc Pharmacy','MSc Economics','MSc Law','MSc History','MSc Psychology','MSc Environmental Science','MSc Biosciences','MSc Veterinary','MSc Nutrition','MSc International Relations'] },
  { slug:'university-of-padua', name:'University of Padua', shortName:'UniPD', country:'Italy', state:'Veneto', city:'Padua', qsRanking:241, currency:'EUR', annualFee:3500, livingCost:11000, ieltsMin:6.0, intakes:['September'], website:'https://www.unipd.it', countryCode:'IT', flag:'🇮🇹', workRights:'Job-seeker 12 months', courses:['MSc Computer Science','MSc Mathematics','MSc Physics','MSc Chemistry','MSc Biology','MSc Psychology','MSc Economics','MSc Law','MSc Geology','MSc Environmental Science','MSc Industrial Engineering','MSc Biomedical Sciences','MSc Astronomy','MSc Veterinary','MSc Agriculture'] },
  { slug:'university-of-naples', name:'University of Naples Federico II', shortName:'UniNA', country:'Italy', state:'Campania', city:'Naples', qsRanking:331, currency:'EUR', annualFee:3000, livingCost:10000, ieltsMin:6.0, intakes:['September'], website:'https://www.unina.it', countryCode:'IT', flag:'🇮🇹', workRights:'Job-seeker 12 months', courses:['MSc Computer Science','MSc Engineering','MSc Architecture','MSc Economics','MSc Law','MSc Medicine','MSc Biology','MSc Chemistry','MSc Physics','MSc Mathematics','MSc Environmental Science','MSc Agriculture','MSc Veterinary','MSc Political Science','MSc Social Sciences'] },
  { slug:'ca-foscari-university-venice', name:'Ca\' Foscari University of Venice', shortName:'UniVe', country:'Italy', state:'Veneto', city:'Venice', qsRanking:441, currency:'EUR', annualFee:3500, livingCost:13000, ieltsMin:6.0, intakes:['September'], website:'https://www.unive.it', countryCode:'IT', flag:'🇮🇹', workRights:'Job-seeker 12 months', courses:['MSc Economics','MSc Finance','MSc Business Administration','MSc Computer Science','MSc Data Analytics','MSc Environmental Science','MSc History','MSc Linguistics','MSc Philosophy','MSc Molecular Biomedicine','MSc Chinese Studies','MSc Japanese Studies','MSc International Management','MSc Digital Humanities'] },
  { slug:'university-of-florence', name:'University of Florence', shortName:'UniFi', country:'Italy', state:'Tuscany', city:'Florence', qsRanking:411, currency:'EUR', annualFee:3500, livingCost:12000, ieltsMin:6.0, intakes:['September'], website:'https://www.unifi.it', countryCode:'IT', flag:'🇮🇹', workRights:'Job-seeker 12 months', courses:['MSc Architecture','MSc Economics','MSc Engineering','MSc Computer Science','MSc Law','MSc Medicine','MSc History of Art','MSc Agriculture','MSc Biology','MSc Chemistry','MSc Physics','MSc Psychology','MSc Environmental Science','MSc Fashion Design','MSc Restoration'] },
  { slug:'university-of-trento', name:'University of Trento', shortName:'UniTrento', country:'Italy', state:'Trentino', city:'Trento', qsRanking:471, currency:'EUR', annualFee:4000, livingCost:10500, ieltsMin:6.0, intakes:['September'], website:'https://www.unitn.it', countryCode:'IT', flag:'🇮🇹', workRights:'Job-seeker 12 months', courses:['MSc Computer Science','MSc AI','MSc Data Science','MSc Mathematics','MSc Physics','MSc Economics','MSc Law','MSc Sociology','MSc Psychology','MSc Environmental Studies','MSc International Studies','MSc Cognitive Science'] },
  { slug:'luiss-university', name:'LUISS University', shortName:'LUISS', country:'Italy', state:'Lazio', city:'Rome', qsRanking:701, currency:'EUR', annualFee:18000, livingCost:12000, ieltsMin:6.5, intakes:['September'], website:'https://www.luiss.eu', countryCode:'IT', flag:'🇮🇹', workRights:'Job-seeker 12 months', courses:['MSc Economics','MSc Finance','MSc Management','MSc Law','MSc Political Science','MSc Marketing','MSc Accounting','MSc Business Administration','MBA','MSc International Relations','MSc Corporate Governance','MSc Data Science'] },
  { slug:'university-of-pisa', name:'University of Pisa', shortName:'UniPi', country:'Italy', state:'Tuscany', city:'Pisa', qsRanking:423, currency:'EUR', annualFee:3500, livingCost:11000, ieltsMin:6.0, intakes:['September'], website:'https://www.unipi.it', countryCode:'IT', flag:'🇮🇹', workRights:'Job-seeker 12 months', courses:['MSc Computer Science','MSc Mathematics','MSc Physics','MSc Astronomy','MSc Chemistry','MSc Biology','MSc Economics','MSc Engineering','MSc Law','MSc Medicine','MSc Pharmacy','MSc Informatics','MSc Data Science','MSc AI'] },
  { slug:'university-of-turin', name:'University of Turin', shortName:'UniTo', country:'Italy', state:'Piedmont', city:'Turin', qsRanking:411, currency:'EUR', annualFee:3500, livingCost:11000, ieltsMin:6.0, intakes:['September'], website:'https://www.unito.it', countryCode:'IT', flag:'🇮🇹', workRights:'Job-seeker 12 months', courses:['MSc Computer Science','MSc Mathematics','MSc Physics','MSc Chemistry','MSc Biology','MSc Economics','MSc Law','MSc Psychology','MSc Pharmacy','MSc Agriculture','MSc Veterinary','MSc Environmental Science','MSc Biomedical Sciences','MSc Data Science'] },
  { slug:'universita-cattolica', name:'Università Cattolica del Sacro Cuore', shortName:'Cattolica', country:'Italy', state:'Lombardy', city:'Milan', qsRanking:0, currency:'EUR', annualFee:10000, livingCost:13000, ieltsMin:6.0, intakes:['September'], website:'https://www.unicatt.it', countryCode:'IT', flag:'🇮🇹', workRights:'Job-seeker 12 months', courses:['MSc Economics','MSc Finance','MSc Business Administration','MSc Law','MSc Psychology','MSc Sociology','MSc Communication','MSc Agriculture','MSc Medicine','MSc Nutrition','MSc International Relations','MBA'] },

  // SPAIN
  { slug:'university-of-barcelona', name:'University of Barcelona', shortName:'UB', country:'Spain', state:'Catalonia', city:'Barcelona', qsRanking:164, currency:'EUR', annualFee:3500, livingCost:12000, ieltsMin:6.0, intakes:['September','February'], website:'https://www.ub.edu', countryCode:'ES', flag:'🇪🇸', workRights:'Job-seeker 12 months', courses:['MSc Computer Science','MSc Mathematics','MSc Physics','MSc Chemistry','MSc Biology','MSc Biomedicine','MSc Psychology','MSc Economics','MSc Law','MSc History','MSc Linguistics','MSc Environmental Science','MSc Pharmacy','MSc Data Science','MSc Sociology','MSc Political Science','MSc Cognitive Science','MSc AI','MSc Finance'] },
  { slug:'autonomous-university-of-barcelona', name:'Autonomous University of Barcelona', shortName:'UAB', country:'Spain', state:'Catalonia', city:'Barcelona', qsRanking:185, currency:'EUR', annualFee:3200, livingCost:12000, ieltsMin:6.0, intakes:['September','February'], website:'https://www.uab.cat', countryCode:'ES', flag:'🇪🇸', workRights:'Job-seeker 12 months', courses:['MSc Computer Science','MSc Data Science','MSc AI','MSc Mathematics','MSc Physics','MSc Biology','MSc Economics','MSc Law','MSc Psychology','MSc Sociology','MSc Environmental Science','MSc Biosciences','MSc Biochemistry','MSc History','MSc Political Science','MSc International Relations','MSc Computational Biology'] },
  { slug:'ie-university', name:'IE University', shortName:'IE', country:'Spain', state:'Community of Madrid', city:'Madrid', qsRanking:181, currency:'EUR', annualFee:28000, livingCost:13000, ieltsMin:7.0, intakes:['September','January'], website:'https://www.ie.edu', countryCode:'ES', flag:'🇪🇸', workRights:'Job-seeker 12 months', courses:['MBA','MSc Finance','MSc Marketing','MSc Business Analytics','MSc Management','MSc International Relations','MSc Architecture','MSc Law','MSc Data Science','MSc AI','MSc Real Estate','MSc Human Resources','Executive MBA','MSc Cybersecurity','MSc Design Thinking'] },
  { slug:'iese-business-school', name:'IESE Business School', shortName:'IESE', country:'Spain', state:'Catalonia', city:'Barcelona', qsRanking:0, currency:'EUR', annualFee:95000, livingCost:13000, ieltsMin:7.0, intakes:['September','January'], website:'https://www.iese.edu', countryCode:'ES', flag:'🇪🇸', workRights:'Job-seeker 12 months', courses:['MBA','Executive MBA','Advanced Management Program','Global CEO Program','Finance for Senior Executives','MSc Finance','Entrepreneurship Program'] },
  { slug:'carlos-iii-university-madrid', name:'Carlos III University of Madrid', shortName:'UC3M', country:'Spain', state:'Community of Madrid', city:'Madrid', qsRanking:251, currency:'EUR', annualFee:6800, livingCost:13000, ieltsMin:6.5, intakes:['September','January'], website:'https://www.uc3m.es', countryCode:'ES', flag:'🇪🇸', workRights:'Job-seeker 12 months', courses:['MSc Computer Science','MSc Data Science','MSc AI','MSc Electrical Engineering','MSc Economics','MSc Business Administration','MSc Finance','MSc Statistics','MSc Cybersecurity','MSc Mechanical Engineering','MSc Industrial Engineering','MSc Law','MSc Political Science','MSc International Relations'] },
  { slug:'complutense-university-madrid', name:'Complutense University of Madrid', shortName:'UCM', country:'Spain', state:'Community of Madrid', city:'Madrid', qsRanking:269, currency:'EUR', annualFee:3200, livingCost:13000, ieltsMin:6.0, intakes:['September'], website:'https://www.ucm.es', countryCode:'ES', flag:'🇪🇸', workRights:'Job-seeker 12 months', courses:['MSc Computer Science','MSc Mathematics','MSc Physics','MSc Chemistry','MSc Biology','MSc Economics','MSc Law','MSc Medicine','MSc Psychology','MSc History','MSc Pharmacy','MSc Sociology','MSc Political Science','MSc Environmental Science','MSc Information Science'] },
  { slug:'pompeu-fabra-university', name:'Pompeu Fabra University', shortName:'UPF', country:'Spain', state:'Catalonia', city:'Barcelona', qsRanking:271, currency:'EUR', annualFee:6500, livingCost:12000, ieltsMin:6.5, intakes:['September'], website:'https://www.upf.edu', countryCode:'ES', flag:'🇪🇸', workRights:'Job-seeker 12 months', courses:['MSc Data Science','MSc Computer Science','MSc AI','MSc Economics','MSc Finance','MSc Law','MSc Communication','MSc Cognitive Systems','MSc Political Science','MSc Biomedicine','MSc Bioinformatics','MSc Public Policy'] },
  { slug:'autonomous-university-of-madrid', name:'Autonomous University of Madrid', shortName:'UAM', country:'Spain', state:'Community of Madrid', city:'Madrid', qsRanking:258, currency:'EUR', annualFee:3200, livingCost:13000, ieltsMin:6.0, intakes:['September'], website:'https://www.uam.es', countryCode:'ES', flag:'🇪🇸', workRights:'Job-seeker 12 months', courses:['MSc Computer Science','MSc Mathematics','MSc Physics','MSc Chemistry','MSc Biology','MSc Economics','MSc Law','MSc Psychology','MSc History','MSc Environmental Science','MSc Sociology','MSc Political Science','MSc Biomedical Sciences','MSc Pharmacy'] },
  { slug:'esade-business-school', name:'ESADE Business School', shortName:'ESADE', country:'Spain', state:'Catalonia', city:'Barcelona', qsRanking:190, currency:'EUR', annualFee:48000, livingCost:13000, ieltsMin:7.0, intakes:['September'], website:'https://www.esade.edu', countryCode:'ES', flag:'🇪🇸', workRights:'Job-seeker 12 months', courses:['MBA','MSc Finance','MSc Marketing','MSc Business Analytics','MSc Management','MSc International Management','Executive MBA','MSc Law & Business','Global Master in Management'] },
  { slug:'university-of-navarra', name:'University of Navarra', shortName:'UNAV', country:'Spain', state:'Navarre', city:'Pamplona', qsRanking:451, currency:'EUR', annualFee:12000, livingCost:10000, ieltsMin:6.5, intakes:['September'], website:'https://www.unav.edu', countryCode:'ES', flag:'🇪🇸', workRights:'Job-seeker 12 months', courses:['MSc Economics','MSc Finance','MSc Law','MSc Medicine','MSc Architecture','MSc Communication','MSc Business Administration','MSc Biomedical Research','MSc Nursing','MSc Philosophy','MSc History','MSc Political Science'] },
  { slug:'university-of-valencia', name:'University of Valencia', shortName:'UV', country:'Spain', state:'Valencia', city:'Valencia', qsRanking:425, currency:'EUR', annualFee:3200, livingCost:11000, ieltsMin:6.0, intakes:['September'], website:'https://www.uv.es', countryCode:'ES', flag:'🇪🇸', workRights:'Job-seeker 12 months', courses:['MSc Computer Science','MSc Mathematics','MSc Physics','MSc Chemistry','MSc Biology','MSc Economics','MSc Law','MSc Psychology','MSc History','MSc Environmental Science','MSc Pharmacy','MSc Education','MSc Data Science'] },
  { slug:'eae-business-school', name:'EAE Business School', shortName:'EAE', country:'Spain', state:'Catalonia', city:'Barcelona', qsRanking:0, currency:'EUR', annualFee:18000, livingCost:12000, ieltsMin:6.0, intakes:['September','January'], website:'https://www.eae.es', countryCode:'ES', flag:'🇪🇸', workRights:'Job-seeker 12 months', courses:['MBA','MSc Marketing','MSc Finance','MSc Business Analytics','MSc Supply Chain Management','MSc Digital Marketing','MSc Human Resources','MSc Project Management','Executive MBA'] },
  { slug:'university-of-salamanca', name:'University of Salamanca', shortName:'USAL', country:'Spain', state:'Castile and León', city:'Salamanca', qsRanking:651, currency:'EUR', annualFee:2500, livingCost:9000, ieltsMin:6.0, intakes:['September'], website:'https://www.usal.es', countryCode:'ES', flag:'🇪🇸', workRights:'Job-seeker 12 months', courses:['MSc Spanish Philology','MSc History','MSc Law','MSc Economics','MSc Biology','MSc Chemistry','MSc Education','MSc Psychology','MSc Computer Science','MSc Environmental Science','MSc Political Science','MA Linguistics'] },
  { slug:'university-of-granada', name:'University of Granada', shortName:'UGR', country:'Spain', state:'Andalusia', city:'Granada', qsRanking:451, currency:'EUR', annualFee:2500, livingCost:9500, ieltsMin:6.0, intakes:['September'], website:'https://www.ugr.es', countryCode:'ES', flag:'🇪🇸', workRights:'Job-seeker 12 months', courses:['MSc Computer Science','MSc AI','MSc Data Science','MSc Mathematics','MSc Physics','MSc Chemistry','MSc Biology','MSc Economics','MSc Law','MSc Psychology','MSc Environmental Science','MSc Translation','MSc Arabic Studies','MSc Neuroscience'] },
  { slug:'university-of-seville', name:'University of Seville', shortName:'US', country:'Spain', state:'Andalusia', city:'Seville', qsRanking:551, currency:'EUR', annualFee:2500, livingCost:10000, ieltsMin:6.0, intakes:['September'], website:'https://www.us.es', countryCode:'ES', flag:'🇪🇸', workRights:'Job-seeker 12 months', courses:['MSc Computer Science','MSc Engineering','MSc Architecture','MSc Economics','MSc Law','MSc Medicine','MSc Biology','MSc Chemistry','MSc Physics','MSc Mathematics','MSc History','MSc Psychology','MSc Environmental Science'] },
];

// ── Currency helpers ───────────────────────────────────────────────────────────
function getCurrencySymbol(currency) {
  switch(currency) {
    case 'EUR': return '€';
    case 'SEK': return 'SEK ';
    case 'AED': return 'AED ';
    case 'DKK': return 'DKK ';
    default: return '€';
  }
}

function toUSD(amount, currency) {
  switch(currency) {
    case 'EUR': return Math.round(amount * 1.07);
    case 'SEK': return Math.round(amount * 0.092);
    case 'AED': return Math.round(amount * 0.272);
    case 'DKK': return Math.round(amount * 0.143);
    default: return amount;
  }
}

function toINR(amount, currency) {
  switch(currency) {
    case 'EUR': return Math.round(amount * 88);
    case 'SEK': return Math.round(amount * 7.8);
    case 'AED': return Math.round(amount * 22.7);
    case 'DKK': return Math.round(amount * 11.8);
    default: return Math.round(amount * 88);
  }
}

function getCountryLabel(country, currency) {
  const map = {
    'France': 'france', 'Netherlands': 'netherlands', 'Sweden': 'sweden',
    'UAE': 'uae', 'Denmark': 'denmark', 'Italy': 'italy', 'Spain': 'spain'
  };
  return map[country] || country.toLowerCase();
}

function getCountryCode2(country) {
  const map = { 'France':'FR','Netherlands':'NL','Sweden':'SE','UAE':'AE','Denmark':'DK','Italy':'IT','Spain':'ES' };
  return map[country] || 'EU';
}

function isFreeUni(u) {
  // DTU, UCPH, AU, CBS, AAU, SDU, ITU are free for EU/EEA but not for non-EU
  // We'll show actual fees for non-EU students
  return false;
}

function getActualFee(u) {
  // For free universities in Denmark (DTU etc.), use typical non-EU fee
  if (u.annualFee === 0) return 95000; // 95,000 DKK ~ $13,600 USD for non-EU students
  return u.annualFee;
}

// ── Generate course data file ──────────────────────────────────────────────────
function generateCourseData(u) {
  const prefix = u.slug.replace(/-/g, '').substring(0, 8);
  const sym = getCurrencySymbol(u.currency);
  const fee = getActualFee(u);
  const feeUSD = toUSD(fee, u.currency);
  const feeINR = toINR(fee, u.currency);
  const livingCostUSD = toUSD(u.livingCost, u.currency);
  const livingCostINR = toINR(u.livingCost, u.currency);

  const varName = u.slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) + 'Courses';
  const typeName = u.slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('') + 'Course';

  const courseLines = u.courses.map((name, i) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const isUG = name.startsWith('B') || name.startsWith('BA') || name.startsWith('BDS') || name.startsWith('BBA');
    const isMaster = !isUG;
    const dur = isUG ? (u.country === 'UK' ? '3 years' : '4 years') : '1 year';
    const durYr = isUG ? (u.country === 'UK' ? 3 : 4) : 1;
    const totalFee = fee * durYr;
    const level = isUG ? 'Bachelor' : name.startsWith('MBA') || name.startsWith('Executive MBA') ? 'Master' : name.startsWith('PhD') || name.startsWith('Doctor') ? 'PhD' : 'Master';

    return `  {
    id: '${prefix}-c${String(i+1).padStart(3,'0')}', name: '${name.replace(/'/g, "\\'")}', slug: '${slug}', url: '${u.website}',
    level: '${level}', studyLevel: '${level}', duration: '${dur}', durationYears: ${durYr},
    annual${u.currency}: ${fee}, annualUSD: ${feeUSD}, annualINR: ${feeINR}, total${u.currency}: ${totalFee},
    livingCost${u.currency}: ${u.livingCost}, livingCostUSD: ${livingCostUSD}, livingCostINR: ${livingCostINR},
    ieltsMin: ${u.ieltsMin}, toeflMin: 90, pteMin: 65,
    intakeMonths: ${JSON.stringify(u.intakes)}, campus: '${u.city}',
    country: '${u.country === 'UAE' ? 'United Arab Emirates' : u.country}', state: '${u.state}', city: '${u.city}', countryCode: '${u.countryCode}',
  }`;
  });

  return `// Auto-generated — do not edit manually
// University: ${u.name}

export interface ${typeName} {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annual${u.currency}: number; annualUSD: number; annualINR: number; total${u.currency}: number;
  livingCost${u.currency}: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
}

export const ${varName}: ${typeName}[] = [
${courseLines.join(',\n')}
];

export function get${typeName.replace('Course','')}CourseBySlug(slug: string) {
  return ${varName}.find(c => c.slug === slug);
}
`;
}

// ── Generate courses listing page ─────────────────────────────────────────────
function generateCoursesPage(u) {
  const varName = u.slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) + 'Courses';
  const typeName = u.slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('') + 'Course';
  const dataFile = u.slug + '-courses';
  const sym = getCurrencySymbol(u.currency);
  const countryLabel = getCountryLabel(u.country, u.currency);
  const fee = getActualFee(u);
  const feeUSD = toUSD(fee, u.currency);
  const qs = u.qsRanking > 0 ? `#${u.qsRanking} QS World Ranking` : 'Top University';
  const feeDisplay = u.annualFee === 0
    ? `Non-EU: ~DKK ${(95000/1000).toFixed(0)}K/yr`
    : `${sym}${fee.toLocaleString()}/yr`;

  return `import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { ${varName} } from '@/data/${dataFile}';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: '${u.name} Courses 2026 – Programs, Fees & IELTS for Indian Students',
  description: '${u.courses.length} programs at ${u.name} for international students. ${feeDisplay}. IELTS ${u.ieltsMin}+. ${u.intakes.join(' & ')} intakes. Free admission guidance from Jaivik Overseas.',
  path: '/universities/${u.slug}/courses',
  keywords: ['${u.shortName} courses', '${u.name} international', 'study in ${u.country}', '${u.country} university'],
});

const levelOrder = ['Bachelor','Master','PhD','Executive','Postgraduate'];

function groupByLevel(courses: any[]) {
  const groups: Record<string, any[]> = {};
  courses.forEach((c: any) => {
    const lv = c.level;
    if (!groups[lv]) groups[lv] = [];
    groups[lv].push(c);
  });
  return groups;
}

export default function CoursesPage() {
  const courses = ${varName} as any[];
  const groups = groupByLevel(courses);
  const totalCourses = courses.length;
  const avgFee = Math.round(courses.reduce((s: number, c: any) => s + c.annual${u.currency}, 0) / totalCourses);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: '${u.name}',
    sameAs: '${u.website}',
    address: { '@type': 'PostalAddress', addressLocality: '${u.city}', addressRegion: '${u.state}', addressCountry: '${u.countryCode}' },
  };

  return (
    <>
      <JsonLd data={schema} />
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/country/${countryLabel}" className="hover:text-white">${u.country}</Link> /
            <span className="text-white">${u.shortName}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                ${u.flag} ${u.city}, ${u.country} · ${qs}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">${u.name} — International Courses</h1>
              <p className="text-blue-200 text-lg mb-5">
                {totalCourses} programs · Avg ${sym}{Math.round(avgFee / 1000)}K ${u.currency}/yr · IELTS ${u.ieltsMin}+ · ${u.intakes.join(' & ')} intakes
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Courses', value: totalCourses },
                  { label: 'QS Ranking', value: '${qs}' },
                  { label: 'Avg Fee', value: \`${sym}\${Math.round(avgFee / 1000)}K\` },
                  { label: 'Campus', value: '${u.city}' },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source="${u.slug}-courses" defaultCountry="${u.country}" compact />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-10">
          {Object.entries(groups)
            .sort(([a], [b]) => levelOrder.indexOf(a) - levelOrder.indexOf(b))
            .map(([level, lvCourses]) => (
            <div key={level}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                {level} Programs
                <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full font-normal">{(lvCourses as any[]).length}</span>
              </h2>
              <div className="space-y-3">
                {(lvCourses as any[]).sort((a: any, b: any) => a.name.localeCompare(b.name)).map((c: any) => (
                  <Link key={c.slug} href={\`/universities/${u.slug}/courses/\${c.slug}\`}
                    className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all flex items-center justify-between group">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-brand-700 text-sm leading-snug">{c.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{c.duration} · {c.intakeMonths.join(' & ')} · {c.campus}</p>
                    </div>
                    <div className="ml-4 text-right flex-shrink-0">
                      <p className="text-sm font-bold text-brand-700">${sym}{c.annual${u.currency}.toLocaleString()}/yr</p>
                      <p className="text-xs text-gray-500">IELTS {c.ieltsMin}+</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="sticky top-20 space-y-5">
            <LeadForm source="${u.slug}-sidebar" defaultCountry="${u.country}" />
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Facts — ${u.shortName}</h3>
              {[
                ['Location', '${u.city}, ${u.country}'],
                ['IELTS Min', '${u.ieltsMin} overall'],
                ['Intakes', '${u.intakes.join(' & ')}'],
                ['Work Rights', '${u.workRights}'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-xs">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-semibold text-gray-900">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
`;
}

// ── Generate course detail page ────────────────────────────────────────────────
function generateCourseDetailPage(u) {
  const varName = u.slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) + 'Courses';
  const typeName = u.slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('') + 'Course';
  const dataFile = u.slug + '-courses';
  const getFnName = 'get' + u.slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('') + 'CourseBySlug';
  const sym = getCurrencySymbol(u.currency);
  const feeINRFmt = `(course.annualINR / 100000).toFixed(1)`;

  return `import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ${varName}, ${getFnName} } from '@/data/${dataFile}';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

export function generateStaticParams() {
  return ${varName}.map(c => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const course = ${getFnName}(slug);
  if (!course) return {};
  return buildMetadata({
    title: \`\${course.name} at ${u.name} 2026 – Fees, IELTS & Requirements\`,
    description: \`\${course.name} at ${u.name}: \${course.duration}, ${sym}\${course.annual${u.currency}.toLocaleString()}/${u.currency}/yr. IELTS \${course.ieltsMin}+. Intake: \${course.intakeMonths.join(' & ')}. Free guidance from Jaivik Overseas.\`,
    path: \`/universities/${u.slug}/courses/\${slug}\`,
    keywords: [course.name, '${u.name}', 'study in ${u.country}', course.level],
  });
}

export default async function CourseDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const course = ${getFnName}(slug);
  if (!course) notFound();

  const feeINRLakh = (course.annualINR / 100000).toFixed(1);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    provider: { '@type': 'CollegeOrUniversity', name: '${u.name}', sameAs: '${u.website}' },
    courseMode: 'full-time',
    educationalLevel: course.studyLevel,
    timeRequired: \`P\${course.durationYears}Y\`,
  };

  return (
    <>
      <JsonLd data={schema} />
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4 flex-wrap">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities/${u.slug}/courses" className="hover:text-white">${u.shortName}</Link> /
            <span className="text-white">{course.name}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                ${u.flag} ${u.name} · ${u.city}, ${u.country}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.name}</h1>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                {[
                  { label: 'Annual Fee', value: \`${sym}\${course.annual${u.currency}.toLocaleString()}\` },
                  { label: 'Fee (INR)', value: \`₹\${feeINRLakh}L/yr\` },
                  { label: 'Duration', value: course.duration },
                  { label: 'IELTS Min', value: \`\${course.ieltsMin}+\` },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source="${u.slug}-\${slug}" defaultCountry="${u.country}" compact />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Course Overview</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['University', '${u.name}'],
                ['Level', course.level],
                ['Duration', course.duration],
                ['Campus', course.campus],
                ['Country', '${u.country}'],
                ['Intake', course.intakeMonths.join(' & ')],
                ['IELTS Minimum', \`\${course.ieltsMin} overall\`],
                ['TOEFL Minimum', \`\${course.toeflMin}+\`],
                ['Annual Fee (${u.currency})', \`${sym}\${course.annual${u.currency}.toLocaleString()}\`],
                ['Annual Fee (USD)', \`$\${course.annualUSD.toLocaleString()}\`],
                ['Annual Fee (INR)', \`₹\${(course.annualINR/100000).toFixed(1)}L\`],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col">
                  <span className="text-xs text-gray-500">{k}</span>
                  <span className="font-semibold text-gray-900 mt-0.5">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-brand-50 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 mb-3">Need Help Applying?</h2>
            <p className="text-sm text-gray-600 mb-4">Our counsellors have guided 500+ Indian students to {course.level} programs in ${u.country}. Free 30-min session.</p>
            <Link href="/book-counselling" className="btn-gold inline-block">Book Free Counselling →</Link>
          </div>
        </div>

        <div>
          <div className="sticky top-20">
            <LeadForm source="${u.slug}-detail-sidebar" defaultCountry="${u.country}" />
          </div>
        </div>
      </div>
    </>
  );
}
`;
}

// ── Main: generate all files ───────────────────────────────────────────────────
const ROOT = path.join(__dirname, '..');

let filesCreated = 0;

for (const u of UNIVERSITIES) {
  // 1. Course data file
  const dataPath = path.join(ROOT, 'data', `${u.slug}-courses.ts`);
  fs.writeFileSync(dataPath, generateCourseData(u), 'utf8');
  filesCreated++;

  // 2. Courses listing page
  const pageDir = path.join(ROOT, 'app', 'universities', u.slug, 'courses');
  fs.mkdirSync(pageDir, { recursive: true });
  fs.writeFileSync(path.join(pageDir, 'page.tsx'), generateCoursesPage(u), 'utf8');
  filesCreated++;

  // 3. Course detail page
  const detailDir = path.join(ROOT, 'app', 'universities', u.slug, 'courses', '[slug]');
  fs.mkdirSync(detailDir, { recursive: true });
  fs.writeFileSync(path.join(detailDir, 'page.tsx'), generateCourseDetailPage(u), 'utf8');
  filesCreated++;

  console.log(`✓ ${u.name} (${u.country})`);
}

console.log(`\n✅ Done! Created ${filesCreated} files for ${UNIVERSITIES.length} universities.`);
console.log('\nNext: update data/universities.ts with these new university entries.');
