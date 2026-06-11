// Final targeted crawl — KCL (try API/different page) + McGill (A-Z) + Monash handbook list
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const outDir = path.join(__dirname, 'crawl-output');
async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function dismissCookies(page) {
  try {
    await page.evaluate(() => {
      for (const el of document.querySelectorAll('button,a')) {
        const t = (el.textContent||'').trim().toLowerCase();
        if (['accept all','accept cookies','accept','ok'].includes(t)) { el.click(); return; }
      }
    });
  } catch(_) {}
  for (const sel of ['#onetrust-accept-btn-handler','.cc-accept','button[id*="accept"]']) {
    try { const b=await page.$(sel); if(b){await b.click();break;} } catch(_) {}
  }
  await wait(1000);
}

async function main() {
  const browser = await puppeteer.launch({headless:true,args:['--no-sandbox','--disable-setuid-sandbox']});

  // ── KCL ──────────────────────────────────────────────────────────────────
  {
    console.log('\n=== KCL ===');
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // KCL has a course finder that loads via XHR — intercept and check
    let xhrData = null;
    page.on('response', async resp => {
      const url = resp.url();
      if (url.includes('api') && url.includes('course') || url.includes('search') && resp.headers()['content-type']?.includes('json')) {
        try { xhrData = await resp.json(); } catch(_) {}
      }
    });

    await page.goto('https://www.kcl.ac.uk/study/postgraduate-taught', {waitUntil:'networkidle2',timeout:35000});
    await dismissCookies(page);
    await wait(8000);

    // Try scrolling to trigger more loads
    await page.evaluate(() => { window.scrollTo(0, document.body.scrollHeight/2); });
    await wait(3000);
    await page.evaluate(() => { window.scrollTo(0, document.body.scrollHeight); });
    await wait(3000);

    const data = await page.evaluate(() => {
      const degreePat = /\b(MSc|MA\b|MBA|MPhil|MEng|MRes|LLM|MFA|MPH|MPA|MArch|MEd)\b/;
      const courses=[], seen=new Set();
      const root = document.querySelector('main,#main,[role="main"]')||document.body;

      // After JS loads, try all anchor tags with degree suffix
      root.querySelectorAll('a').forEach(a=>{
        const name=(a.textContent||'').trim().replace(/\s+/g,' ');
        if(name.length>8&&name.length<150&&degreePat.test(name)&&!seen.has(name.toLowerCase())){
          seen.add(name.toLowerCase()); courses.push({name,url:a.href||''});
        }
      });

      // Also try h3 links
      root.querySelectorAll('h3 a, h4 a, [class*="course"] a, [class*="programme"] a').forEach(a=>{
        const name=(a.textContent||'').trim().replace(/\s+/g,' ');
        if(name.length>8&&!seen.has(name.toLowerCase())){
          seen.add(name.toLowerCase()); courses.push({name,url:a.href||''});
        }
      });

      const headings=[];
      root.querySelectorAll('h1,h2,h3').forEach(h=>{
        const t=(h.textContent||'').trim().replace(/\s+/g,' ');
        if(t.length>3&&headings.length<8) headings.push(`${h.tagName}: ${t.substring(0,90)}`);
      });

      // Dump all text content for inspection
      const allLinks=[];
      root.querySelectorAll('a').forEach(a=>{
        const n=(a.textContent||'').trim().replace(/\s+/g,' ');
        if(n.length>5&&n.length<100&&allLinks.length<30)
          allLinks.push(`${n.substring(0,55)} → ${(a.href||'').substring(0,60)}`);
      });

      return {courses:courses.slice(0,400),headings,allLinks};
    });

    console.log('Hits:', data.courses.length);
    data.headings.slice(0,4).forEach(h=>console.log(' ',h));
    if (data.courses.length>0) data.courses.slice(0,8).forEach((c,i)=>console.log(` ${i+1}. ${c.name}`));
    else { console.log('All links:'); data.allLinks.slice(0,12).forEach(l=>console.log(' ',l)); }

    if (data.courses.length>=5) {
      fs.writeFileSync(path.join(outDir,'kings-college-london.json'),
        JSON.stringify({slug:'kings-college-london',url:'https://www.kcl.ac.uk/study/postgraduate-taught',courses:data.courses,headings:data.headings,crawledAt:new Date().toISOString()},null,2));
    }
    await page.close();
  }

  // ── McGill A-Z ────────────────────────────────────────────────────────────
  {
    console.log('\n=== McGill ===');
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // McGill grad programs has an A-Z list hidden behind JS — try direct calendar URL
    const urls = [
      'https://www.mcgill.ca/gradapplicants/programs/az',
      'https://www.mcgill.ca/gradapplicants/programs/list/az',
      'https://www.mcgill.ca/gradapplicants/programs',
    ];

    let best={courses:[],headings:[],diagLinks:[]}, bestUrl=urls[0];
    for (const url of urls) {
      console.log('  Trying:', url);
      try {
        await page.goto(url,{waitUntil:'networkidle2',timeout:30000});
        await dismissCookies(page);
        await wait(5000);

        const d = await page.evaluate(()=>{
          const courses=[],seen=new Set();
          const root=document.querySelector('main,#main,[role="main"]')||document.body;

          // Try table rows, list items with degree patterns
          root.querySelectorAll('td a, li a, dt a, .program-title a, h3 a, h4 a').forEach(a=>{
            const name=(a.textContent||'').trim().replace(/\s+/g,' ');
            if(name.length>5&&name.length<120&&!seen.has(name.toLowerCase())){
              seen.add(name.toLowerCase()); courses.push({name,url:a.href||''});
            }
          });

          // Degree suffix fallback
          if(courses.length<10){
            const degreePat=/\b(MSc|MA\b|MBA|MPhil|MEng|MRes|LLM|MPH|MPA|MArch|MEd)\b/;
            root.querySelectorAll('a').forEach(a=>{
              const name=(a.textContent||'').trim().replace(/\s+/g,' ');
              if(name.length>8&&name.length<150&&degreePat.test(name)&&!seen.has(name.toLowerCase())){
                seen.add(name.toLowerCase()); courses.push({name,url:a.href||''});
              }
            });
          }

          const headings=[];
          root.querySelectorAll('h1,h2,h3').forEach(h=>{
            const t=(h.textContent||'').trim().replace(/\s+/g,' ');
            if(t.length>3&&headings.length<8) headings.push(`${h.tagName}: ${t.substring(0,90)}`);
          });

          const diagLinks=[];
          if(courses.length<10){
            root.querySelectorAll('a').forEach(a=>{
              const n=(a.textContent||'').trim().replace(/\s+/g,' ');
              if(n.length>5&&diagLinks.length<20)
                diagLinks.push(`${n.substring(0,55)} → ${(a.href||'').substring(0,60)}`);
            });
          }

          return {courses:courses.slice(0,400),headings,diagLinks};
        });

        console.log('  Hits:', d.courses.length);
        d.headings.slice(0,3).forEach(h=>console.log('   ',h));
        if(d.courses.length<5) d.diagLinks.slice(0,6).forEach(l=>console.log('  DIAG:',l));

        if(d.courses.length>best.courses.length){best=d;bestUrl=url;}
        if(best.courses.length>=10) break;
      } catch(e){console.log('  Error:',e.message.substring(0,60));}
    }

    console.log('Final:', best.courses.length, 'courses from', bestUrl);
    best.courses.slice(0,8).forEach((c,i)=>console.log(` ${i+1}. ${c.name}`));

    if(best.courses.length>=5){
      fs.writeFileSync(path.join(outDir,'mcgill-university.json'),
        JSON.stringify({slug:'mcgill-university',url:bestUrl,courses:best.courses,headings:best.headings,crawledAt:new Date().toISOString()},null,2));
    }
    await page.close();
  }

  // ── Monash handbook course list ───────────────────────────────────────────
  {
    console.log('\n=== Monash (handbook) ===');
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // The handbook A-Z course list
    const url = 'https://handbook.monash.edu/current/courses?types=postgraduate';
    console.log('  Trying:', url);
    await page.goto(url,{waitUntil:'networkidle2',timeout:35000});
    await dismissCookies(page);
    await wait(8000);

    const data = await page.evaluate(()=>{
      const courses=[],seen=new Set();
      const root=document.querySelector('main,#main,[role="main"]')||document.body;

      root.querySelectorAll('a[href*="/courses/"]').forEach(a=>{
        const name=(a.textContent||'').trim().replace(/\s+/g,' ');
        if(name.length>5&&name.length<120&&!seen.has(name.toLowerCase())){
          seen.add(name.toLowerCase()); courses.push({name,url:a.href||''});
        }
      });

      // h3/h4 fallback
      if(courses.length<5){
        root.querySelectorAll('h3,h4,li a,.course-title').forEach(el=>{
          const name=(el.textContent||'').trim().replace(/\s+/g,' ');
          if(name.length>5&&name.length<120&&!seen.has(name.toLowerCase())){
            seen.add(name.toLowerCase());
            const link=el.tagName==='A'?el:el.querySelector('a')||(el.closest('li')&&el.closest('li').querySelector('a'));
            courses.push({name,url:link?link.href:''});
          }
        });
      }

      const headings=[];
      root.querySelectorAll('h1,h2,h3').forEach(h=>{
        const t=(h.textContent||'').trim().replace(/\s+/g,' ');
        if(t.length>3&&headings.length<8) headings.push(`${h.tagName}: ${t.substring(0,90)}`);
      });

      const diagLinks=[];
      if(courses.length<5){
        root.querySelectorAll('a').forEach(a=>{
          const n=(a.textContent||'').trim().replace(/\s+/g,' ');
          if(n.length>5&&diagLinks.length<15) diagLinks.push(`${n.substring(0,55)} → ${(a.href||'').substring(0,60)}`);
        });
      }
      return {courses:courses.slice(0,400),headings,diagLinks};
    });

    console.log('Hits:', data.courses.length);
    data.headings.slice(0,3).forEach(h=>console.log(' ',h));
    data.courses.slice(0,8).forEach((c,i)=>console.log(` ${i+1}. ${c.name}`));
    if(data.courses.length<5) data.diagLinks.slice(0,8).forEach(l=>console.log(' DIAG:',l));

    if(data.courses.length>=5){
      fs.writeFileSync(path.join(outDir,'monash-university.json'),
        JSON.stringify({slug:'monash-university',url,courses:data.courses,headings:data.headings,crawledAt:new Date().toISOString()},null,2));
    }
    await page.close();
  }

  await browser.close();
}

main().catch(console.error);
