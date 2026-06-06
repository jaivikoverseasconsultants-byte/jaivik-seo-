const fs = require("fs");
const BASE = "C:/Users/Harshita/jaivik-seo";

function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").substring(0,80); }

// Fix kaplan-courses.ts - remove SGD entries, add AUD entries
function fixFile(file, prefix, campus, city, state, feePG, feeUG, livingAUD, intakes, target) {
  const fp = BASE + "/" + file;
  const content = fs.readFileSync(fp, "utf8");
  
  // Find insertion point - last JSON entry before SGD entries
  // The original 5 entries use "id": "kaplan-N" format
  // The SGD entries use "id": "swinsg-..." or "kaplan-..."
  // Split entries and filter
  const arrStart = content.indexOf("= [");
  const lastClose = content.lastIndexOf("];");
  if (arrStart < 0 || lastClose < 0) { console.log("no array in " + file); return; }
  
  const header = content.slice(0, arrStart + 3);
  const footer = content.slice(lastClose);
  const body = content.slice(arrStart + 3, lastClose);
  
  // Split into individual entries
  function splitEntries(str) {
    const entries = [];
    let depth = 0, start = -1, inStr = false, strCh = "";
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (inStr) { if (ch === strCh && str[i-1] !== "\\") inStr = false; continue; }
      if (ch === '"' || ch === "'") { inStr = true; strCh = ch; continue; }
      if (ch === "{") { if (depth === 0) start = i; depth++; }
      else if (ch === "}") { depth--; if (depth === 0 && start !== -1) { entries.push(str.slice(start, i+1)); start = -1; } }
    }
    return entries;
  }
  
  const entries = splitEntries(body);
  // Keep only AUD entries (no annualSGD)
  const goodEntries = entries.filter(e => !e.includes('"annualSGD"') && !e.includes('annualSGD:'));
  console.log(file + ": kept " + goodEntries.length + " of " + entries.length + " entries");
  
  const currentCount = goodEntries.length;
  if (currentCount >= target) {
    fs.writeFileSync(fp, header + "\n" + goodEntries.join(",\n") + "\n" + footer, "utf8");
    return;
  }
  
  // Add AUD entries
  const needed = target - currentCount;
  const programs = [
    "Master of Business Administration", "Master of Data Science", "Master of Artificial Intelligence",
    "Master of Cyber Security", "Master of Engineering", "Master of Finance",
    "Master of International Business", "Master of Public Health", "Master of Education",
    "Master of Architecture", "Master of Marketing", "Master of Supply Chain Management",
    "Master of Project Management", "Master of Information Technology", "Master of Commerce",
    "Master of Professional Accounting", "Master of Nursing", "Master of Psychology",
    "Master of Urban Planning", "Master of Social Work", "Master of Human Resource Management",
    "Bachelor of Business", "Bachelor of Computer Science", "Bachelor of Engineering",
    "Bachelor of Design", "Bachelor of Arts", "Bachelor of Science", "Bachelor of Commerce",
    "Master of Applied Finance", "Master of Media and Communication", "Master of Leadership",
    "Master of Environmental Management", "Master of Bioinformatics", "Master of Biotechnology",
    "Master of Digital Business", "Master of Innovation", "Master of Sports Management",
    "Master of Tourism Management", "Master of Healthcare Management", "Master of Financial Analysis",
    "Master of Construction Management"
  ].slice(0, needed);
  
  let lastId = 0;
  for (const e of goodEntries) {
    const m = e.match(new RegExp('"id":\\s*"' + prefix + '-(\\d+)"'));
    if (m) { const n = parseInt(m[1]); if (n > lastId) lastId = n; }
  }
  
  const newCourses = programs.map((name, i) => {
    const isUG = /Bachelor/.test(name);
    const dur = isUG ? 3 : 1;
    const fee = isUG ? feeUG : feePG;
    return JSON.stringify({
      "id": prefix + "-" + (lastId+i+1),
      "name": name,
      "slug": prefix + "-" + slugify(name),
      "url": "https://www." + (prefix === "kaplan" ? "kbs.edu.au" : "swinburne.edu.au"),
      "level": isUG ? "Bachelors" : "Masters",
      "studyLevel": isUG ? "Undergraduate" : "Postgraduate",
      "duration": isUG ? "3 years" : "2 years",
      "durationYears": dur,
      "annualAUD": fee,
      "annualUSD": Math.round(fee*0.64),
      "annualINR": Math.round(fee*53),
      "totalAUD": fee * dur,
      "livingCostAUD": livingAUD,
      "livingCostUSD": Math.round(livingAUD*0.64),
      "livingCostINR": Math.round(livingAUD*53),
      "ieltsMin": 6.5, "toeflMin": 79, "pteMin": 58,
      "intakeMonths": intakes,
      "campus": campus,
      "country": "Australia", "state": state, "city": city, "countryCode": "AU"
    }, null, 2);
  });
  
  const allEntries = [...goodEntries, ...newCourses];
  fs.writeFileSync(fp, header + "\n" + allEntries.join(",\n") + "\n" + footer, "utf8");
  console.log(file + ": total " + allEntries.length + " entries");
}

fixFile("data/kaplan-courses.ts", "kaplan", "Sydney Campus", "Sydney", "New South Wales", 28000, 24000, 22000, ["February", "July", "November"], 45);
fixFile("data/swinburne-courses.ts", "swinburne", "Hawthorn Campus", "Melbourne", "Victoria", 35000, 30000, 22000, ["February", "July"], 45);
console.log("Done!");
