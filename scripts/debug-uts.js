const axios = require('axios');
const cheerio = require('cheerio');

const ax = axios.create({
  timeout: 20000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0',
    'Accept': 'text/html,*/*',
  },
});

// Test actual degree pages
const testUrls = [
  'https://www.uts.edu.au/courses/master-of-engineering',
  'https://www.uts.edu.au/courses/master-of-information-technology',
  'https://www.uts.edu.au/courses/bachelor-of-engineering-honours-software',
  'https://www.uts.edu.au/courses/master-of-business-analytics',
];

(async () => {
  for (const url of testUrls) {
    try {
      const r = await ax.get(url);
      const $ = cheerio.load(r.data);
      const text = r.data;

      console.log('\n=== ' + url.split('/').pop() + ' ===');
      console.log('Size:', r.data.length);
      console.log('h1 text:', $('h1').text().replace(/\s+/g,' ').trim().slice(0, 120));
      console.log('All h2:', $('h2').map(function() { return $(this).text().replace(/\s+/g,' ').trim(); }).get().filter(Boolean).join(' | ').slice(0, 200));

      // Fee patterns
      const feeMatches = [...text.matchAll(/\$\s*[\d,]+/g)].map(m => m[0]).slice(0, 5);
      console.log('Fees found:', feeMatches.join(', ') || 'none');

      // IELTS patterns
      const ieltsMatch = text.match(/IELTS[^<\n]{0,120}/i);
      console.log('IELTS:', ieltsMatch ? ieltsMatch[0].slice(0, 100) : 'none');

      // Duration
      const durMatch = text.match(/(\d+(?:\.\d+)?\s*(?:year|semester)[s\s][^<\n]{0,30})/i);
      console.log('Duration:', durMatch ? durMatch[0].slice(0, 60) : 'none');

      // Intake
      const intakeMatch = text.match(/(february|july|semester\s*[12]|intake[^<\n]{0,100})/i);
      console.log('Intake:', intakeMatch ? intakeMatch[0].slice(0, 80) : 'none');

      // Print a key snippet of the HTML (around fees section)
      const feeIdx = text.toLowerCase().indexOf('tuition');
      if (feeIdx > -1) {
        console.log('Tuition snippet:', text.slice(Math.max(0, feeIdx-50), feeIdx+300).replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim().slice(0, 300));
      } else {
        console.log('No "tuition" text found');
        // Find first mention of annual or fee
        const feeIdx2 = text.toLowerCase().indexOf('annual fee');
        if (feeIdx2 > -1) console.log('Annual fee snippet:', text.slice(feeIdx2, feeIdx2+200).replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim());
      }

    } catch(e) { console.log(url, 'ERROR:', e.response?.status || e.message); }
    await new Promise(r => setTimeout(r, 800));
  }
})().catch(e => console.error(e.message));
