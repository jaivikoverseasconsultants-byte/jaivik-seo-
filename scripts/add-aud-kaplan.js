const fs = require("fs");
const BASE = "C:/Users/Harshita/jaivik-seo";

function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").substring(0,80); }

function addAUDCourses(file, prefix, campus, city, state, feePG, feeUG, livingAUD, intakes) {
  const fp = BASE + "/" + file;
  const content = fs.readFileSync(fp, "utf8");
  const insertPoint = content.lastIndexOf("\n]");
  if (insertPoint < 0) { console.log("no ] in " + file); return; }
  
  // Count existing
  const existing = (content.match(/"id":/g)||[]).length + (content.match(/id: '/g)||[]).length;
  const needed = 45 - existing;
  
  const programs = [
    "Master of Business Administration", "Master of Data Science", "Master of Artificial Intelligence",
    "Master of Cyber Security", "Master of Engineering Management", "Master of Finance",
    "Master of International Business", "Master of Public Health", "Master of Education",
    "Master of Marketing", "Master of Supply Chain Management", "Master of Project Management",
    "Master of Information Technology", "Master of Commerce", "Master of Professional Accounting",
    "Master of Nursing", "Master of Psychology", "Master of Urban Planning", "Master of Social Work",
    "Master of Human Resource Management", "Master of Applied Finance", "Master of Media",
    "Master of Leadership", "Master of Environmental Management", "Master of Bioinformatics",
    "Master of Biotechnology", "Master of Digital Business", "Master of Innovation",
    "Master of Sports Management", "Master of Tourism Management", "Master of Healthcare Management",
    "Master of Financial Analysis", "Master of Construction Management", "Master of Architecture",
    "Bachelor of Business", "Bachelor of Computer Science", "Bachelor of Engineering",
    "Bachelor of Design", "Bachelor of Arts", "Bachelor of Science"
  ].slice(0, needed);
  
  let lastId = 0;
  for (const m of content.matchAll(/"id":\s*"' + prefix + '-(\d+)"/g)) {
    const n = parseInt(m[1]); if (n > lastId) lastId = n;
  }
  
  const newCourses = programs.map((name, i) => {
    const isUG = /Bachelor/.test(name);
    const dur = isUG ? 3 : 2;
    const fee = isUG ? feeUG : feePG;
    return JSON.stringify({
      "id": prefix + "-" + (lastId+i+6),
      "name": name, "slug": prefix + "-" + slugify(name),
      "url": "https://www." + (prefix === "kaplan" ? "kbs.edu.au" : "swinburne.edu.au"),
      "level": isUG ? "Bachelors" : "Masters",
      "studyLevel": isUG ? "Undergraduate" : "Postgraduate",
      "duration": isUG ? "3 years" : "2 years", "durationYears": dur,
      "annualAUD": fee, "annualUSD": Math.round(fee*0.64), "annualINR": Math.round(fee*53),
      "totalAUD": fee*dur,
      "livingCostAUD": livingAUD, "livingCostUSD": Math.round(livingAUD*0.64), "livingCostINR": Math.round(livingAUD*53),
      "ieltsMin": 6.5, "toeflMin": 79, "pteMin": 58,
      "intakeMonths": intakes, "campus": campus,
      "country": "Australia", "state": state, "city": city, "countryCode": "AU"
    }, null, 2);
  });
  
  const updated = content.slice(0, insertPoint) + ",\n" + newCourses.join(",\n") + content.slice(insertPoint);
  fs.writeFileSync(fp, updated, "utf8");
  console.log(file + ": added " + newCourses.length + " AUD courses (total=" + (existing+newCourses.length) + ")");
}

addAUDCourses("data/kaplan-courses.ts", "kaplan", "Sydney Campus", "Sydney", "New South Wales", 28000, 24000, 22000, ["February","July","November"]);
addAUDCourses("data/swinburne-courses.ts", "swinburne", "Hawthorn Campus", "Melbourne", "Victoria", 35000, 30000, 22000, ["February","July"]);
console.log("done");
