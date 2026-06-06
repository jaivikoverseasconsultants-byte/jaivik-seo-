const fs = require("fs");
const BASE = "C:/Users/Harshita/jaivik-seo";

function fix(file, badField) {
  const fp = BASE + "/" + file;
  if (!fs.existsSync(fp)) { console.log("SKIP: " + file); return; }
  const content = fs.readFileSync(fp, "utf8");
  
  const arrStart = content.indexOf("= [");
  const lastClose = content.lastIndexOf("];");
  if (arrStart === -1 || lastClose === -1) { console.log("No array: " + file); return; }
  
  const header = content.slice(0, arrStart + 3);
  const footer = content.slice(lastClose);
  const body = content.slice(arrStart + 3, lastClose);
  
  // Find entries with bad field and remove them
  // Split body into lines and rebuild without bad objects
  const lines = body.split("\n");
  const cleanedLines = [];
  let inBadEntry = false;
  let depth = 0;
  
  for (const line of lines) {
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    
    if (depth === 0 && line.includes("{")) {
      // Check if this looks like the start of a bad entry - peek ahead by buffering
      inBadEntry = false;
    }
    
    depth += openBraces - closeBraces;
    
    if (line.includes(badField) && depth > 0) {
      inBadEntry = true;
    }
    
    if (!inBadEntry) {
      cleanedLines.push(line);
    }
    
    if (depth === 0) {
      inBadEntry = false;
    }
  }
  
  const before = (body.match(new RegExp(badField.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
  const cleaned = cleanedLines.join("\n");
  const after = (cleaned.match(new RegExp(badField.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
  console.log(file + ": " + badField + " occurrences " + before + " -> " + after);
  
  fs.writeFileSync(fp, header + cleaned + footer, "utf8");
}

fix("data/dtu-courses.ts", "annualDKK");
fix("data/technical-university-of-denmark-courses.ts", "annualDKK");
fix("data/khalifa-courses.ts", '"annualAED"');
fix("data/khalifa-university-courses.ts", '"annualAED"');
fix("data/uae-university-courses.ts", '"annualAED"');
fix("data/umea-university-courses.ts", "annualEUR");
console.log("done");
