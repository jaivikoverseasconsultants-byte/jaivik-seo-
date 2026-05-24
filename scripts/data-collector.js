/**
 * JOC University Data Collector Server
 * Run: node scripts/data-collector.js
 * Then click the bookmarklet on any university/KC portal page.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3456;
const OUTPUT_FILE = path.join(__dirname, '../data/universities-scraped.json');

// ── Collector UI script served to the browser ─────────────────────────────────
const COLLECTOR_SCRIPT = `
(function() {
  // Toggle: clicking bookmarklet again removes the panel
  if (document.getElementById('joc-collector-panel')) {
    document.getElementById('joc-collector-panel').remove();
    return;
  }

  // ── KC Portal label-based extractor ──────────────────────────────────────────
  // Walks the DOM to find a label text, then returns the adjacent value.
  // Works on dynamically rendered pages because the DOM is already populated.
  function findByLabel(label) {
    var result = '';

    // Walk every text node looking for an exact label match
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    while (walker.nextNode()) {
      var node = walker.currentNode;
      if (node.textContent.trim().toLowerCase() !== label.toLowerCase()) continue;

      var parent = node.parentElement;
      if (!parent) continue;

      // Strategy 1: next sibling of the label element
      var sib = parent.nextElementSibling;
      if (sib && sib.textContent.trim() && sib.textContent.trim().toLowerCase() !== label.toLowerCase()) {
        result = sib.textContent.trim();
        break;
      }

      // Strategy 2: next sibling of grandparent
      var gp = parent.parentElement;
      if (gp) {
        sib = gp.nextElementSibling;
        if (sib && sib.textContent.trim()) { result = sib.textContent.trim(); break; }

        // Strategy 3: look in grandparent's children list for value after label child
        var children = Array.prototype.slice.call(gp.children);
        for (var i = 0; i < children.length - 1; i++) {
          if (children[i].contains(parent)) {
            var candidate = children[i + 1].textContent.trim();
            if (candidate && candidate.toLowerCase() !== label.toLowerCase()) {
              result = candidate; break;
            }
          }
        }
        if (result) break;

        // Strategy 4: find value inside nearest row/item container
        var container = gp.closest('[class*="row"],[class*="item"],[class*="field"],[class*="detail"],[class*="info"],li,tr,dl');
        if (container) {
          var valueEl = container.querySelector('[class*="value"],[class*="data"],dd,td:last-child');
          if (valueEl && valueEl.textContent.trim().toLowerCase() !== label.toLowerCase()) {
            result = valueEl.textContent.trim(); break;
          }
        }
      }
    }

    // Fallback: scan body lines for "Label" on one line, value on the next
    if (!result) {
      var lines = document.body.innerText.split('\\n');
      for (var li = 0; li < lines.length - 1; li++) {
        if (lines[li].trim().toLowerCase() === label.toLowerCase() && lines[li + 1].trim()) {
          result = lines[li + 1].trim(); break;
        }
      }
    }
    // Fallback 2: "Label: Value" on same line
    if (!result) {
      var colon = document.body.innerText.match(label + '\\s*:\\s*([^\\n]+)');
      if (colon) result = colon[1].trim();
    }

    return result;
  }

  // Find a hyperlink associated with a label
  function findLinkByLabel(label) {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    while (walker.nextNode()) {
      var node = walker.currentNode;
      if (node.textContent.trim().toLowerCase() !== label.toLowerCase()) continue;
      var parent = node.parentElement;
      if (!parent) continue;
      // Check next sibling for anchor
      var sib = parent.nextElementSibling;
      if (sib) {
        var a = sib.tagName === 'A' ? sib : sib.querySelector('a[href]');
        if (a) return a.href;
        if (sib.textContent.trim()) return sib.textContent.trim();
      }
      // Check container for any anchor
      var container = parent.closest('[class*="row"],[class*="item"],[class*="field"],li,tr');
      if (container) {
        var anchors = container.querySelectorAll('a[href]');
        for (var i = 0; i < anchors.length; i++) {
          if (!anchors[i].textContent.toLowerCase().includes(label.toLowerCase())) return anchors[i].href;
        }
      }
    }
    return '';
  }

  // Extract QS ranking number from badge or text
  function findQsRanking() {
    var selectors = [
      '[class*="qs-rank"]','[class*="qsrank"]','[class*="qs_rank"]',
      '[class*="world-rank"]','[class*="ranking-badge"]','[class*="rank-number"]',
      '[class*="ranking"] strong','[class*="ranking"] span'
    ];
    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i]);
      if (el) { var m = el.textContent.match(/\\d+/); if (m) return m[0]; }
    }
    var bodyText = document.body.innerText.slice(0, 5000);
    var m2 = bodyText.match(/QS\\s+(?:World\\s+)?(?:University\\s+)?Rank(?:ing)?[:\\s#]*(\\d+)/i)
           || bodyText.match(/#(\\d+)\\s*(?:QS|World University)/i)
           || bodyText.match(/Ranked\\s+#?(\\d+).*QS/i);
    return m2 ? m2[1] : '';
  }

  // University name: left-panel h2, strong, JSON-LD, title
  function findUniversityName() {
    var selectors = [
      '[class*="university"] h2','[class*="institution"] h2',
      '[class*="college"] h2','[class*="uni-name"]',
      '[class*="university-name"]','[class*="school-name"]',
      '[class*="left-panel"] h2','[class*="sidebar"] h2',
      '[class*="provider"] h2','[class*="provider"] strong',
      'aside h2','aside strong'
    ];
    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i]);
      if (el && el.textContent.trim()) return el.textContent.trim();
    }
    // Scan all h2/h3 for one containing university keywords
    var hdrs = document.querySelectorAll('h2,h3');
    for (var h = 0; h < hdrs.length; h++) {
      var ht = hdrs[h].textContent.trim();
      if (/university|college|institute|school of/i.test(ht) && ht.length < 120) return ht;
    }
    // JSON-LD
    var scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (var j = 0; j < scripts.length; j++) {
      try {
        var d = JSON.parse(scripts[j].textContent);
        var obj = Array.isArray(d) ? d[0] : d;
        if (/(College|University|Education)/i.test(obj['@type'] || '') && obj.name) return obj.name;
      } catch(e) {}
    }
    // Title fallback
    var parts = document.title.split(/[|\\-–]/);
    return parts.length > 1 ? parts[parts.length - 1].trim() : parts[0].trim();
  }

  function isGreeting(t) {
    return /^(hello|hi|dear|welcome|greetings)/i.test(t) || /\b(mr\.|mrs\.|ms\.|miss)\b/i.test(t);
  }

  // Course name: main h2 near "Program Details", or first degree-like h1/h2
  function findCourseName() {
    // Look for h2 that follows a "Program Details" heading
    var headings = document.querySelectorAll('h1,h2,h3');
    var foundProgram = false;
    for (var i = 0; i < headings.length; i++) {
      var t = headings[i].textContent.trim();
      if (/program\\s+details|programme\\s+details|course\\s+details/i.test(t)) { foundProgram = true; continue; }
      if (foundProgram && t.length > 3 && t.length < 150 && !isGreeting(t)) return t;
    }
    // First h1/h2 that looks like a degree
    for (var k = 0; k < headings.length; k++) {
      var ht = headings[k].textContent.trim();
      if (!isGreeting(ht) && /master|bachelor|phd|doctorate|mba|\\bms\\b|\\bma\\b|\\bbsc\\b|diploma|engineer|science|arts|law|medicine|nursing|commerce|management/i.test(ht) && ht.length < 150) {
        return ht;
      }
    }
    // Selectors
    var selectors = ['[class*="program-title"]','[class*="programme-title"]','[class*="course-title"]'];
    for (var s = 0; s < selectors.length; s++) {
      var el = document.querySelector(selectors[s]);
      if (el && el.textContent.trim()) return el.textContent.trim();
    }
    return '';
  }

  // Country normalisation map
  function normaliseCountry(raw) {
    if (!raw) return '';
    var map = {
      'united states':'USA','us':'USA','usa':'USA',
      'united kingdom':'UK','uk':'UK','england':'UK','britain':'UK','gb':'UK',
      'canada':'Canada','au':'Australia','australia':'Australia',
      'de':'Germany','germany':'Germany','ireland':'Ireland',
      'sg':'Singapore','singapore':'Singapore',
      'new zealand':'New Zealand','nz':'New Zealand',
      'france':'France','netherlands':'Netherlands','sweden':'Sweden',
      'italy':'Italy','spain':'Spain','uae':'UAE','dubai':'UAE',
    };
    return map[raw.trim().toLowerCase()] || raw.trim();
  }

  // ── Run extraction ────────────────────────────────────────────────────────────
  var data = {
    name:         findUniversityName(),
    shortName:    '',
    country:      normaliseCountry(findByLabel('Country')),
    city:         findByLabel('State/City') || findByLabel('City') || findByLabel('Location'),
    courseName:   findCourseName(),
    duration:     findByLabel('Duration') || findByLabel('Course Duration'),
    tuitionFees:  findByLabel('Yearly Tuition Fee') || findByLabel('Annual Tuition Fee') || findByLabel('Tuition Fee') || findByLabel('Tuition'),
    appFee:       findByLabel('Application Fee'),
    ieltsMin:     findByLabel('IELTS Overall') || findByLabel('IELTS'),
    pteMin:       findByLabel('PTE Overall') || findByLabel('PTE'),
    toeflMin:     findByLabel('TOEFL iBT Overall') || findByLabel('TOEFL iBT') || findByLabel('TOEFL'),
    intakeMonths: findByLabel('Intakes') || findByLabel('Intake') || findByLabel('Start Dates'),
    deadline:     findByLabel('Application Deadline') || findByLabel('Deadline'),
    programUrl:   findLinkByLabel('Program Url') || findLinkByLabel('Program URL') || findLinkByLabel('Apply') || '',
    qsRanking:    findQsRanking(),
    entryReq:     findByLabel('Entry Requirements') || findByLabel('Academic Requirements') || '',
    sourceUrl:    window.location.href,
  };

  // ── Inject panel ──────────────────────────────────────────────────────────────
  function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  var panel = document.createElement('div');
  panel.id = 'joc-collector-panel';

  var css = \`
    #joc-collector-panel * { box-sizing:border-box; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif !important; }
    #joc-inner {
      position:fixed; top:0; right:0; width:450px; height:100vh;
      background:#fff; box-shadow:-4px 0 32px rgba(0,0,0,.22);
      z-index:2147483647; display:flex; flex-direction:column; overflow:hidden;
    }
    #joc-hdr {
      background:#1e3a5f; color:#fff; padding:11px 16px;
      display:flex; justify-content:space-between; align-items:center; flex-shrink:0;
    }
    #joc-hdr h2 { margin:0; font-size:14px; font-weight:700; }
    #joc-hdr small { font-size:10px; color:#93c5fd; display:block; margin-top:1px; }
    #joc-hdr button { background:none; border:none; color:#fff; font-size:18px; cursor:pointer; padding:3px 8px; border-radius:4px; line-height:1; }
    #joc-hdr button:hover { background:rgba(255,255,255,.18); }
    #joc-scroll { flex:1; overflow-y:auto; padding:12px 16px; }
    .joc-section { font-size:10px; font-weight:800; color:#1e3a5f; letter-spacing:.8px;
      text-transform:uppercase; border-bottom:2px solid #e0e7ff; padding-bottom:4px;
      margin:14px 0 8px; }
    .joc-field { margin-bottom:9px; }
    .joc-field label { display:block; font-size:10.5px; font-weight:700; color:#374151;
      margin-bottom:2px; text-transform:uppercase; letter-spacing:.3px; }
    .joc-field input, .joc-field textarea {
      width:100%; border:1.5px solid #d1d5db; border-radius:7px;
      padding:6px 10px; font-size:12px; color:#111; outline:none; background:#f9fafb;
      transition:border-color .12s;
    }
    .joc-field input:focus, .joc-field textarea:focus { border-color:#1e3a5f; background:#fff; }
    .joc-field textarea { min-height:52px; resize:vertical; }
    .joc-row2 { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
    .joc-row3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px; }
    .extracted { border-color:#86efac !important; background:#f0fdf4 !important; }
    #joc-foot { padding:11px 16px; border-top:1px solid #e5e7eb; display:flex; gap:8px; flex-shrink:0; }
    #joc-save { flex:1; background:#1e3a5f; color:#fff; border:none; border-radius:9px;
      padding:10px; font-size:13px; font-weight:700; cursor:pointer; }
    #joc-save:hover { background:#163060; }
    #joc-save:disabled { opacity:.55; cursor:not-allowed; }
    #joc-cancel { background:#f3f4f6; border:1px solid #e5e7eb; border-radius:9px;
      padding:10px 14px; font-size:13px; cursor:pointer; color:#374151; }
    #joc-status { font-size:10.5px; color:#6b7280; padding:5px 0; }
    #joc-toast {
      position:fixed; bottom:20px; right:20px; z-index:2147483648;
      padding:11px 18px; border-radius:10px; font-size:13px; font-weight:600;
      color:#fff; box-shadow:0 4px 20px rgba(0,0,0,.22); display:none; max-width:340px;
    }
  \`;

  panel.innerHTML = '<style>' + css + \`</style>
  <div id="joc-inner">
    <div id="joc-hdr">
      <div>
        <h2>📊 JOC Data Collector</h2>
        <small id="joc-hostname">\${window.location.hostname}</small>
      </div>
      <button id="joc-x">✕</button>
    </div>
    <div id="joc-scroll">

      <div id="joc-status"></div>

      <!-- SOURCE URL -->
      <div class="joc-section">🔗 Source</div>
      <div class="joc-field">
        <label>Page URL</label>
        <input id="jf-url" value="\${esc(data.sourceUrl)}" />
      </div>

      <!-- UNIVERSITY -->
      <div class="joc-section">🏫 University Info</div>
      <div class="joc-field">
        <label>University Name *</label>
        <input id="jf-name" value="\${esc(data.name)}" placeholder="e.g. University of Toronto" class="\${data.name?'extracted':''}" />
      </div>
      <div class="joc-row2">
        <div class="joc-field">
          <label>Short Name</label>
          <input id="jf-short" value="\${esc(data.shortName)}" placeholder="e.g. UofT" />
        </div>
        <div class="joc-field">
          <label>QS Ranking</label>
          <input id="jf-qs" value="\${esc(data.qsRanking)}" placeholder="e.g. 34" class="\${data.qsRanking?'extracted':''}" />
        </div>
      </div>
      <div class="joc-row2">
        <div class="joc-field">
          <label>Country *</label>
          <input id="jf-country" value="\${esc(data.country)}" placeholder="Canada" list="joc-countries" class="\${data.country?'extracted':''}" />
          <datalist id="joc-countries">
            <option>USA</option><option>UK</option><option>Canada</option><option>Australia</option>
            <option>Germany</option><option>Ireland</option><option>Singapore</option><option>New Zealand</option>
          </datalist>
        </div>
        <div class="joc-field">
          <label>City</label>
          <input id="jf-city" value="\${esc(data.city)}" placeholder="Toronto" class="\${data.city?'extracted':''}" />
        </div>
      </div>

      <!-- PROGRAM -->
      <div class="joc-section">📚 Program Details</div>
      <div class="joc-field">
        <label>Course Name</label>
        <input id="jf-course" value="\${esc(data.courseName)}" placeholder="MS Computer Science" class="\${data.courseName?'extracted':''}" />
      </div>
      <div class="joc-row2">
        <div class="joc-field">
          <label>Duration</label>
          <input id="jf-duration" value="\${esc(data.duration)}" placeholder="2 years" class="\${data.duration?'extracted':''}" />
        </div>
        <div class="joc-field">
          <label>Intake Months</label>
          <input id="jf-intake" value="\${esc(data.intakeMonths)}" placeholder="Sep, Jan" class="\${data.intakeMonths?'extracted':''}" />
        </div>
      </div>
      <div class="joc-field">
        <label>Program URL</label>
        <input id="jf-progurl" value="\${esc(data.programUrl)}" placeholder="https://..." class="\${data.programUrl?'extracted':''}" />
      </div>

      <!-- FEES -->
      <div class="joc-section">💰 Fees & Requirements</div>
      <div class="joc-row2">
        <div class="joc-field">
          <label>Yearly Tuition Fee</label>
          <input id="jf-fees" value="\${esc(data.tuitionFees)}" placeholder="$25,000" class="\${data.tuitionFees?'extracted':''}" />
        </div>
        <div class="joc-field">
          <label>Application Fee</label>
          <input id="jf-appfee" value="\${esc(data.appFee)}" placeholder="$75" class="\${data.appFee?'extracted':''}" />
        </div>
      </div>
      <div class="joc-row3">
        <div class="joc-field">
          <label>IELTS Overall</label>
          <input id="jf-ielts" value="\${esc(data.ieltsMin)}" placeholder="6.5" class="\${data.ieltsMin?'extracted':''}" />
        </div>
        <div class="joc-field">
          <label>PTE Overall</label>
          <input id="jf-pte" value="\${esc(data.pteMin)}" placeholder="58" class="\${data.pteMin?'extracted':''}" />
        </div>
        <div class="joc-field">
          <label>TOEFL iBT</label>
          <input id="jf-toefl" value="\${esc(data.toeflMin)}" placeholder="90" class="\${data.toeflMin?'extracted':''}" />
        </div>
      </div>
      <div class="joc-field">
        <label>Application Deadline</label>
        <input id="jf-deadline" value="\${esc(data.deadline)}" placeholder="January 15, 2025" class="\${data.deadline?'extracted':''}" />
      </div>
      <div class="joc-field">
        <label>Entry Requirements</label>
        <textarea id="jf-entry" class="\${data.entryReq?'extracted':''}">\${esc(data.entryReq)}</textarea>
      </div>

    </div><!-- /scroll -->

    <div id="joc-foot">
      <button id="joc-save">💾 Save to JSON</button>
      <button id="joc-cancel">Cancel</button>
    </div>
  </div>
  <div id="joc-toast"></div>\`;

  document.body.appendChild(panel);

  // Count extracted (green) fields
  var extracted = panel.querySelectorAll('.extracted').length;
  var statusEl = document.getElementById('joc-status');

  // Check server
  fetch('http://localhost:3456/status')
    .then(function(r) { return r.json(); })
    .then(function(d) {
      statusEl.innerHTML = '✅ Server connected &nbsp;·&nbsp; <strong>' + d.total + '</strong> saved &nbsp;·&nbsp; <span style="color:#16a34a">' + extracted + ' fields auto-extracted</span>';
    })
    .catch(function() {
      statusEl.innerHTML = '<span style="color:#dc2626">⚠️ Server offline — run: <strong>node scripts/data-collector.js</strong></span>';
    });

  function val(id) { return (document.getElementById(id) || {}).value.trim() || ''; }

  function toast(msg, color) {
    var t = document.getElementById('joc-toast');
    t.textContent = msg;
    t.style.background = color || '#16a34a';
    t.style.display = 'block';
    setTimeout(function() { t.style.display = 'none'; }, 3500);
  }

  document.getElementById('joc-x').onclick = function() { panel.remove(); };
  document.getElementById('joc-cancel').onclick = function() { panel.remove(); };

  document.getElementById('joc-save').onclick = function() {
    var name = val('jf-name');
    var country = val('jf-country');
    if (!name) { toast('❌ University name is required', '#dc2626'); return; }
    if (!country) { toast('❌ Country is required', '#dc2626'); return; }

    var slug = name.toLowerCase().replace(/[^a-z0-9\\s-]/g,'').replace(/\\s+/g,'-').replace(/-+/g,'-');

    var payload = {
      id: 'u_' + Date.now(),
      name: name,
      shortName: val('jf-short') || name.split(' ').filter(function(w){return w.length>2;}).map(function(w){return w[0];}).join(''),
      slug: slug,
      country: country,
      city: val('jf-city'),
      qsRanking: val('jf-qs') ? parseInt(val('jf-qs'), 10) : null,
      courseName: val('jf-course'),
      duration: val('jf-duration'),
      tuitionFees: val('jf-fees'),
      applicationFee: val('jf-appfee'),
      ieltsMin: val('jf-ielts') ? parseFloat(val('jf-ielts')) : null,
      pteMin: val('jf-pte') ? parseFloat(val('jf-pte')) : null,
      toeflMin: val('jf-toefl') ? parseFloat(val('jf-toefl')) : null,
      intakeMonths: val('jf-intake').split(/[,;]/).map(function(m){return m.trim();}).filter(Boolean),
      applicationDeadline: val('jf-deadline'),
      programUrl: val('jf-progurl'),
      entryRequirements: val('jf-entry'),
      sourceUrl: val('jf-url'),
      scrapedAt: new Date().toISOString(),
    };

    var btn = document.getElementById('joc-save');
    btn.textContent = 'Saving…';
    btn.disabled = true;

    fetch('http://localhost:3456/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    .then(function(r) { return r.json(); })
    .then(function(d) {
      if (d.success) {
        toast('✅ ' + (d.action === 'updated' ? 'Updated' : 'Saved') + ': ' + name + ' (' + country + ') · ' + d.total + ' total');
        setTimeout(function() { panel.remove(); }, 1600);
      } else {
        toast('❌ ' + (d.error || 'Save failed'), '#dc2626');
        btn.textContent = '💾 Save to JSON'; btn.disabled = false;
      }
    })
    .catch(function() {
      toast('❌ Cannot reach server. Is it running?', '#dc2626');
      btn.textContent = '💾 Save to JSON'; btn.disabled = false;
    });
  };
})();
`;

// ── HTTP Server ───────────────────────────────────────────────────────────────

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // GET /collector.js
  if (req.method === 'GET' && parsed.pathname === '/collector.js') {
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end(COLLECTOR_SCRIPT);
    return;
  }

  // GET /status
  if (req.method === 'GET' && parsed.pathname === '/status') {
    let total = 0;
    if (fs.existsSync(OUTPUT_FILE)) {
      try { total = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8')).length; } catch (_) {}
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, total, file: OUTPUT_FILE }));
    return;
  }

  // POST /save
  if (req.method === 'POST' && parsed.pathname === '/save') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const entry = JSON.parse(body);
        let existing = [];
        if (fs.existsSync(OUTPUT_FILE)) {
          existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
        }
        const idx = existing.findIndex(e => e.name === entry.name && e.country === entry.country);
        let action = 'added';
        if (idx >= 0) { existing[idx] = { ...existing[idx], ...entry }; action = 'updated'; }
        else { existing.push(entry); }
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(existing, null, 2), 'utf8');
        const total = existing.length;
        console.log(`[${new Date().toLocaleTimeString()}] ${action === 'added' ? '✅ Added' : '🔄 Updated'}: ${entry.name} (${entry.country}) · total: ${total}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, total, action }));
      } catch (err) {
        console.error('Save error:', err.message);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // GET / → dashboard
  if (req.method === 'GET' && parsed.pathname === '/') {
    let entries = [];
    if (fs.existsSync(OUTPUT_FILE)) {
      try { entries = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8')); } catch (_) {}
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html><html><head><title>JOC Data Collector</title>
<style>
  body{font-family:system-ui;max-width:1100px;margin:40px auto;padding:0 20px;color:#111;}
  h1{color:#1e3a5f;}
  table{width:100%;border-collapse:collapse;font-size:12px;margin-top:16px;}
  th{background:#1e3a5f;color:#fff;padding:8px 10px;text-align:left;font-size:11px;}
  td{padding:7px 10px;border-bottom:1px solid #e5e7eb;vertical-align:top;}
  tr:hover td{background:#f9fafb;}
  .badge{background:#dbeafe;color:#1e40af;padding:2px 7px;border-radius:99px;font-size:10px;font-weight:600;}
  .green{color:#16a34a;font-weight:600;}
  a{color:#1e3a5f;}
</style></head><body>
<h1>📊 JOC University Data Collector</h1>
<p>Server on port ${PORT} · <strong>${entries.length}</strong> universities in <code>${OUTPUT_FILE}</code></p>
<table>
  <tr><th>#</th><th>University</th><th>Country</th><th>Course</th><th>QS</th><th>IELTS</th><th>Fees</th><th>Intake</th><th>Saved</th></tr>
  ${entries.map((e, i) => `<tr>
    <td>${i + 1}</td>
    <td><strong>${e.name || '—'}</strong><br><span style="color:#6b7280;font-size:10px">${e.city || ''}</span></td>
    <td><span class="badge">${e.country || '—'}</span></td>
    <td style="max-width:160px;font-size:11px">${e.courseName || '—'}</td>
    <td>${e.qsRanking ? '#' + e.qsRanking : '—'}</td>
    <td class="green">${e.ieltsMin || '—'}</td>
    <td style="font-size:11px">${e.tuitionFees || '—'}</td>
    <td style="font-size:11px">${Array.isArray(e.intakeMonths) ? e.intakeMonths.join(', ') : (e.intakeMonths || '—')}</td>
    <td style="font-size:10px;color:#6b7280">${e.scrapedAt ? new Date(e.scrapedAt).toLocaleDateString() : '—'}</td>
  </tr>`).join('')}
</table>
${entries.length === 0 ? '<p style="color:#6b7280;margin-top:20px">No entries yet. Click the bookmarklet on a university page to start.</p>' : ''}
</body></html>`);
    return;
  }

  res.writeHead(404); res.end('Not found');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log('╔═══════════════════════════════════════════════╗');
  console.log('║      JOC University Data Collector Ready       ║');
  console.log('╠═══════════════════════════════════════════════╣');
  console.log(`║  Server:    http://localhost:${PORT}              ║`);
  console.log(`║  Data:      data/universities-scraped.json      ║`);
  console.log(`║  Dashboard: http://localhost:${PORT}/             ║`);
  console.log('╚═══════════════════════════════════════════════╝');
  console.log('');
  console.log('Waiting for data from bookmarklet...');
  console.log('(Ctrl+C to stop)\n');
  if (!fs.existsSync(OUTPUT_FILE)) {
    fs.writeFileSync(OUTPUT_FILE, '[]', 'utf8');
    console.log(`Created: ${OUTPUT_FILE}`);
  }
});

server.on('error', err => {
  if (err.code === 'EADDRINUSE') console.error(`\n❌ Port ${PORT} already in use.\n`);
  else console.error('Server error:', err.message);
  process.exit(1);
});
