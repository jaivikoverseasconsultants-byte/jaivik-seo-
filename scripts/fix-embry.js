const fs = require("fs");
const fp = "C:/Users/Harshita/jaivik-seo/data/embry-courses.ts";
const content = fs.readFileSync(fp, "utf8");
const arrStart = content.indexOf("= [");
const lastClose = content.lastIndexOf("];");
const header = content.slice(0, arrStart + 3);
const footer = content.slice(lastClose);
const body = content.slice(arrStart + 3, lastClose);
const lines = body.split("\n");
const cleanedLines = [];
let inBad = false, depth = 0;
for (const line of lines) {
  depth += (line.match(/\{/g)||[]).length - (line.match(/\}/g)||[]).length;
  if (line.includes('"totalUSD"') && depth > 0) inBad = true;
  if (!inBad) cleanedLines.push(line);
  if (depth === 0) inBad = false;
}
const after = cleanedLines.join("\n").includes('"totalUSD"');
console.log("embry totalUSD removed, still has:", after);
fs.writeFileSync(fp, header + cleanedLines.join("\n") + footer, "utf8");
console.log("done");
