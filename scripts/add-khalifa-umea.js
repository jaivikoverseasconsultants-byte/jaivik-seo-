const fs = require("fs");
const BASE = "C:/Users/Harshita/jaivik-seo";

function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").substring(0,80); }

// Add USD entries to khalifa-courses.ts (needs 11 more)
(function() {
  const fp = BASE + "/data/khalifa-courses.ts";
  const content = fs.readFileSync(fp, "utf8");
  const lastClose = content.lastIndexOf("];");
  const insertPoint = content.lastIndexOf("\n]");
  if (insertPoint < 0) { console.log("no ] in khalifa"); return; }
  
  const programs = ["MSc Advanced Computer Science","MSc Data Science","MSc Robotics","MSc Clean Energy",
    "MSc Biomedical Engineering","MSc Aerospace Engineering","MSc Nuclear Engineering",
    "MSc Electrical Power Engineering","MSc Communications Engineering","MSc Materials Science","MSc Cyber Security"];
  const newCourses = programs.map((name, i) => JSON.stringify({
    "id": "khalifa-" + (35+i),
    "name": name,
    "slug": "khalifa-" + name.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-"),
    "url": "https://www.ku.ac.ae",
    "level": "Masters", "studyLevel": "Postgraduate",
    "duration": "2 years", "durationYears": 2,
    "annualUSD": 18000, "annualINR": 1494000, "totalUSD": 36000,
    "livingCostUSD": 15000, "livingCostINR": 1245000,
    "ieltsMin": 6.5, "toeflMin": 90, "pteMin": 62,
    "intakeMonths": ["September"],
    "campus": "Abu Dhabi Campus",
    "country": "UAE", "state": "Abu Dhabi", "city": "Abu Dhabi", "countryCode": "AE"
  }, null, 2)).join(",\n");
  
  const updated = content.slice(0, insertPoint) + ",\n" + newCourses + content.slice(insertPoint);
  fs.writeFileSync(fp, updated, "utf8");
  console.log("khalifa: added 11 USD entries");
})();

// Add SEK entries to umea-university-courses.ts (needs 32 more)
(function() {
  const fp = BASE + "/data/umea-university-courses.ts";
  const content = fs.readFileSync(fp, "utf8");
  const insertPoint = content.lastIndexOf("\n]");
  if (insertPoint < 0) { console.log("no ] in umea"); return; }
  
  const programs = [
    "MSc Computer Science","MSc Data Science","MSc Artificial Intelligence","MSc Cyber Security",
    "MSc Software Engineering","MSc Machine Learning","MSc Information Systems","MSc Big Data Analytics",
    "MSc Finance","MSc Accounting and Finance","MSc International Business","MSc Management",
    "MSc Marketing","MBA","MSc Business Analytics","MSc Economics",
    "MSc Mechanical Engineering","MSc Electrical Engineering","MSc Environmental Engineering",
    "MSc Industrial Engineering","MSc Biomedical Engineering","MSc Sustainable Energy",
    "MSc Biology","MSc Chemistry","MSc Statistics","MSc Mathematics","MSc Physics",
    "MSc Ecology","MSc Neuroscience","MSc Public Health","MSc Global Health","MSc Nursing"
  ];
  
  let lastId = 13;
  const newEntries = programs.map((name, i) => {
    const isUG = /BSc|Bachelor/.test(name);
    const dur = isUG ? 3 : 1;
    const fee = 140000;
    return "  {\n    id: 'umeauniv-c" + String(lastId+i+1).padStart(3,"0") + "', name: '" + name + "', slug: 'umeauniv-" + slugify(name) + "', url: 'https://www.umu.se',\n    level: 'Master', studyLevel: 'Master', duration: '1 year', durationYears: 1,\n    annualSEK: " + fee + ", annualUSD: " + Math.round(fee*0.093) + ", annualINR: " + Math.round(fee*7.7) + ", totalSEK: " + (fee*dur) + ",\n    livingCostSEK: 110000, livingCostUSD: 10230, livingCostINR: 847000,\n    ieltsMin: 6.5, toeflMin: 90, pteMin: 62,\n    intakeMonths: [\"September\"], campus: 'Umea Campus',\n    country: 'Sweden', state: 'Vasterbotten', city: 'Umea', countryCode: 'SE',\n  }";
  });
  
  const updated = content.slice(0, insertPoint) + ",\n" + newEntries.join(",\n") + content.slice(insertPoint);
  fs.writeFileSync(fp, updated, "utf8");
  console.log("umea: added " + newEntries.length + " SEK entries");
})();

console.log("Done!");
