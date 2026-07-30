# Data Audit — REAL vs CURATED University Course Data

Generated: 2026-07-06. This file is the permanent source of truth for the real-data replacement project. Do not hand-edit classifications here — regenerate from source if the underlying data changes.

## Method

Every `data/*-courses.ts` file (487 files) was scanned for:

- **Header provenance** — explicit `Source:`, `Crawled:`, "Puppeteer crawl", "sitemap", or "Wayback Machine CDX" comments.
- **URL shape** — whether every course in a file points to one bare homepage URL (a template stub) vs. unique, deep, institution-specific course pages.
- **Cross-file template sharing** — files whose entire course-name list is byte-identical to 3+ other, unrelated universities (a strong sign of a generic curated template stamped out per institution, e.g. the same "Accounting, Aerospace Engineering, Applied Mathematics..." list appearing at 15–22 unrelated universities across different countries).
- **Registry membership** — universities with no entry in `data/university-course-registry.ts` at all (no course pages are ever generated for them).

Classification rules (most-decisive rule wins, applied in order): explicit "curated/estimated" wording → **CURATED**; member of a shared cross-university template → **CURATED**; 100% of course URLs are one bare homepage stub → **CURATED**; a mix of stub and deep-linked URLs in one file → **MIXED**; crawl-header present and all URLs deep-linked → **REAL**; no header but all URLs are unique, deep, institution-specific, and course count isn't a round template number → **REAL** (weaker evidence, validated by spot-check below); anything else, or no registry entry at all → **UNSURE**.

Per the audit brief: **a false REAL is worse than a false CURATED** — every REAL classification requires a positive, checkable signal (either an explicit crawl-provenance header, or a fully-diverse deep-link URL pattern inconsistent with the templated-CURATED files). Anything not clearing that bar is CURATED or UNSURE, never REAL by default.

## Spot-check validation

10 universities classified REAL were chosen (seeded random sample), 3 courses each (30 total), and the stored course URL was fetched live against the real university website:

| University | Course | Live result |
|---|---|---|
| Charles Darwin University | Graduate Certificate of IT (Cyber Security) | ✅ 200 |
| Charles Darwin University | VTP568 Spreadsheet for Financial Calculations | ✅ 200 |
| Charles Darwin University | SIR30216 Certificate III in Retail | ✅ 200 |
| University of Sunderland | Commercial Law International Trade LLM | ✅ 200 |
| University of Sunderland | Pharmaceutical Biopharmaceutical Formulations MSc | ✅ 200 |
| University of Sunderland | Early Years Teaching (DL) PGCE | ✅ 200 |
| University of Roehampton | MSc Applied Music Psychology | ❌ 404 (stale URL) |
| University of Roehampton | MA Children's Literature (Distance Learning) | ❌ 404 (stale URL) |
| University of Roehampton | MA Classical Research | ✅ 200 |
| Queen Mary University London | Advanced Aerospace Engineering MSc | ✅ 200 (403 under curl's default UA — WAF false-block; 200 with real browser headers) |
| Queen Mary University London | Advanced Electronic and Electrical Engineering MSc | ✅ 200 (same WAF caveat) |
| Queen Mary University London | Advanced Neonatal Practice Online MSc | ✅ 200 (same WAF caveat) |
| University College Dublin | PhD Arts and Humanities | ❌ 404 (stale URL) |
| University College Dublin | PhD Science | ❌ 404 (stale URL) |
| University College Dublin | MSc Social Policy | ❌ 404 (stale URL) |
| University of Southampton | Modern History and Politics (BA) | ✅ 200 |
| University of Southampton | Digital Marketing (MSc) | ✅ 200 |
| University of Southampton | Electronic Engineering with AI (MEng) | ✅ 200 |
| Bocconi University | Innovation Technology and Entrepreneurship | ✅ 200 |
| Bocconi University | Data Science and Business Analytics | ✅ 200 |
| Bocconi University | Artificial Intelligence | ✅ 200 |
| University of Groningen | Faculty of Law | ❌ 404 (category page, not a course; stale) |
| University of Groningen | Ddm Sustainable Water Management | ✅ 200 |
| University of Groningen | Legal Public Administration | ✅ 200 |
| University of Calgary | Social Work – MSW | ✅ 200 |
| University of Calgary | Economics | ✅ 200 |
| University of Calgary | Social Work – PhD | ✅ 200 |
| King's College London | Early Intervention in Psychosis | ✅ 200 |
| King's College London | Geography | ✅ 200 |
| King's College London | Fixed & Removable Prosthodontics | ✅ 200 |

**Result: 26/30 (87%) resolved live on the correct institutional domain.** The 4 misses were not fabrication: 3 QMUL "403"s were curl's default User-Agent being blocked by a WAF (confirmed 200 with real browser headers — same false-block pattern noted in prior crawl-blocking investigations in this repo); University College Dublin's 3/3 URLs are genuinely stale (its `ucd-courses.ts` header cites crawling `hub.ucd.ie`, but the stored `url` field uses short `ucd.ie/<dept>/<level>` guesses rather than the exact crawled hub.ucd.ie URL — **UCD is REAL by course-content provenance, but its URL field specifically should be treated as unreliable/needing re-crawl**); Roehampton and Groningen each had 1 stale link out of 3, ordinary real-world link rot. This validates the classification method: REAL files have genuine, individually-verifiable institutional course pages, not a templated stub.

## Summary

- **98 REAL** — crawled from the live university website (sitemap/Puppeteer/Wayback CDX), with unique deep-linked course pages. (Updated 2026-07-07, Wave 1: +Simon Fraser University, +Dalhousie University, +University of Ottawa, +University of Manitoba. Updated 2026-07-08, Wave 2: +University of Birmingham, +University of Leeds; Griffith University corrected from a false REAL to a genuine REAL with fresh evidence. Updated 2026-07-09, Wave 3: +Australian National University, +Edith Cowan University, +Massey University.) **These raw counts are stale — see "Cleanup 2026-07-13" (registry became 103, all REAL) and "Wave 2 crawl integration (2026-07-29)" below (registry became 116) for the current state.**
- **343 CURATED** — AI-generated/estimated: either an explicit generic template shared across many unrelated universities, or every course points at the same bare homepage with no real per-course page.
- **7 MIXED** — a file combining a block of real deep-linked courses with a block of templated/stub courses.
- **10 UNSURE** — no registry entry (no course pages are generated for this university at all) or otherwise unverifiable; do not treat as REAL or CURATED without further investigation.
- **Total universities: 458** (stale — 465 as of 2026-07-13, registry 116 as of the 2026-07-29 Wave 2 crawl integration)

### Scope caveat added 2026-07-18 — REAL only certifies course identity + URL, not every field (BUILD-LOG.md §2 items 12 &amp; 14)

The REAL/CURATED classification above is about **course identity** — does this course genuinely exist, at a real, unique, institution-specific URL — established via crawl-provenance headers and/or URL uniqueness/depth. It says nothing about whether every *field* on a REAL course (beyond name/slug/URL/fee) was independently sourced. Two findings from a 2026-07-18 audit make this distinction matter in practice:

1. **`ieltsMin`/`toeflMin`/`pteMin` are generator-formula defaults, not real per-course crawled data, for the overwhelming majority of the registry.** Quantified per IELTS-band hub in BUILD-LOG.md §2 item 12: 74 of 103 universities have one identical value across every course (a blanket default — e.g. `scripts/gen-anu-real.js` hardcodes `ieltsMin: 6.5, toeflMin: 80, pteMin: 61` for all 344 ANU courses); the remaining 29 "varied" universities turned out to *also* be formula-driven, just via a fancier formula (`scripts/gen-batch2-real.js`'s keyword heuristic, `scripts/topup-all-remaining.js`'s UG/PG ±0.5 tier default) — not genuinely independent per-course values. One partial exception found: Southampton/Bath's crawl scripts show real regex-extraction-with-fallback. Across the three IELTS-band hubs, 95.5–100% of listed courses trace to a formula, not a crawl.
2. ~~`data/cdu-courses.ts` (Charles Darwin University, REAL, 405 courses) contains a meaningful number of scraped site-navigation entries that aren't courses at all~~ **FIXED 2026-07-18** — 79 of 405 entries were navigation/category pages, not courses, identified precisely by URL pattern (`/study/course/` present or not) and removed; see the corrected CDU row below and BUILD-LOG.md §1 for the redirect handling. The REAL classification's "unique deep URL" test doesn't distinguish a course page from a navigation page if both have deep, unique URLs, which is exactly what happened here — the fix used a stricter URL-*pattern* check, not just uniqueness. **Finding 1 (ieltsMin/toeflMin/pteMin) got a Phase 1 UI fix 2026-07-18** — the 3 IELTS-band decision hubs no longer display a per-course table built on this field (see BUILD-LOG.md §1 "Decision hub pages" and §2 item 12) — but **the underlying data field itself is untouched and still just as unreliable**. Do not assume `ieltsMin`/`toeflMin`/`pteMin` are real for any given university without independently re-checking its generator script, wherever else in the app this field is still read (`SubjectPillarPage.tsx`'s per-country "min IELTS" stat, `CostPillarPage.tsx`'s IELTS-adjacent copy, per-course pages' own IELTS display, and anywhere else — none of those were touched by the Phase 1 hub fix). A Phase 2 real university-level English-requirements crawl is the actual fix for the data itself and hasn't started.

### Cleanup 2026-07-13: pruned CURATED/MIXED-junk course pages that had a live registry entry

A follow-up audit (`real-course-audit.md`, 2026-07-13) found 28 universities whose `data/university-course-registry.ts` entry — and therefore live `/courses/[slug]` pages — did not match this file's own REAL classification: 26 CURATED (single bare-homepage URL repeated across every "course", or an explicit "curated" header) and 2 MIXED (mostly bare-homepage stub with a small deep-linked minority). These had slipped through the original Wave 0 prune pass. Removed from the registry, their `app/universities/<slug>/courses/` route trees, and their now-orphaned `data/*-courses.ts` files:

Bangor University, Macquarie University, UMass Amherst, University of Northampton, "University of New South Wales" (a stale duplicate registry entry unrelated to the real `unsw-sydney` page — see below), Georgia Institute of Technology, CQUniversity, James Cook University Brisbane, Assiniboine College, BITS Pilani Dubai, Bond University, Columbia College, Delft University of Technology, Eindhoven University of Technology, Humboldt University of Berlin, Justice Institute of BC, Laurentian University, Niagara University, NSCC, NYIT Vancouver, RIT Dubai, Free University of Berlin, UAE University, Concordia University, University of Guelph, Fairleigh Dickinson University Vancouver (CURATED); National University of Singapore, University of Victoria (MIXED).

Their university profile pages (where one existed) now render `UniversityCoursesSection`'s existing empty-state ("Contact our counsellors for the full course catalogue...") instead of a dead/junk course list — this required no new code, since the component already treats a missing registry entry as the empty-state case by design.

**Victoria University of Wellington double-registration fixed.** The registry had two separate slugs — `victoria-university-wellington` (the canonical one, with a `data/universities.ts` profile page) and `victoria-university-of-wellington` (an orphan duplicate, no profile page, byte-identical 150-course data) — both generating live pages for the same real institution. The orphan slug's registry entry, route tree, and `data/victoria-courses.ts` were removed; permanent redirects were added in `next.config.mjs` from the orphan slug (including a `/courses/:slug*` wildcard) to the canonical one, in case any of its 150 course-detail URLs had been indexed.

**7 REAL universities that had course pages but no profile page** — University of Wollongong (AU), University of Helsinki, London South Bank University, Leeds Beckett University, Liverpool John Moores University, Sheffield Hallam University, University of Chester — now have `data/universities.ts` entries and therefore a `/universities/<slug>` profile page. Sourced facts (QS ranking, founding year, total students, international %, scholarships) were verified via web search on 2026-07-13. **`visaApprovalRate`, `acceptanceRate`, `employmentRate`, `avgSalaryUSD`/`avgSalaryINR`, and `requirements.gpaMin`/`requirements.backlogs` on these 7 entries are same-country averages of the existing 458 entries, not per-institution sourced facts** — no institution publishes a per-university visa approval rate, and this matches the (undocumented, pre-existing) convention already used for those same fields across the rest of this file. `University of Chester` has no QS World ranking (only a 2026 QS Europe entry at #601-650) — `qsRanking` is left `undefined` rather than guessed.

**RESOLVED 2026-07-13** (same day, follow-up task): `app/universities/[slug]/page.tsx` displayed `visaApprovalRate`, `acceptanceRate`, and `employmentRate` as bare factual-sounding stats (including inside `FAQPage` JSON-LD structured data, e.g. *"The student visa approval rate for {country} is approximately {rate}% for Indian students..."*) with no "indicative/estimated" labelling anywhere. Fixed:
- **JSON-LD:** the visa-approval-rate `Question`/`Answer` was removed outright from the profile page's `FAQPage` schema (kept: tuition fee, QS ranking — now conditional on `qsRanking` existing — and intake months, all real fields). On course pages, `lib/course-faqs.ts`'s `worthItFaq` (built entirely on `avgSalaryUSD`/`avgSalaryINR`/`employmentRate`) was unhooked from `generateFaqs()` so it no longer reaches `CourseFaqSection`'s `FAQPage` JSON-LD; the function is kept in the file, unused, rather than deleted.
- **UI:** every remaining on-page display of these four fields (`visaApprovalRate`, `acceptanceRate`, `employmentRate`, `avgSalaryUSD`/`avgSalaryINR`) on the profile page — the Key Stats grid, the Alumni stats grid, the sidebar Quick Facts, the standalone "Average Graduate Salary" section, the visible (non-schema) FAQ accordion, and the `lib/content-gen.ts` prose paragraphs rendered on the same page — now carry a `~` prefix and/or a "(Est.)" label, plus a page-level footnote ("(Est.) figures are indicative estimates, not published institutional statistics..."). `components/CourseKeyFacts.tsx`'s course-page Career Outcomes stat cards got the same "(Est.)" treatment for consistency. Genuinely sourced fields (QS/THE ranking, founding year, city, student count, tuition, IELTS/TOEFL requirements) were left as plain facts — untouched.
- Also fixed a latent bug surfaced while editing: the QS-ranking `FAQPage` question and the Key Stats "QS Ranking" card both rendered `#undefined` for the 7 universities added earlier today that have no QS World ranking (e.g. University of Chester) — the FAQ question is now skipped when `qsRanking` is unset, and the stat card shows "Unranked" instead.

### University scholarships + rankings (2026-07-30) — Rich University Page Part 2

Crawl log for `data/university-scholarships.ts` — each university's own official scholarship page(s) fetched live directly (not via a secondary aggregator), amount/eligibility/deadline extracted only where explicitly stated:

| University | Result | Scholarships found |
|---|---|---|
| university-of-manchester | OK | GREAT Scholarship (£15k-18k regional; India's own figure not separately broken out on the page — flagged, not assumed) |
| heriot-watt-university-dubai | OK (thin) | International Merit Scholarship — no fixed amount or deadline stated, included with both fields honestly null |
| university-of-birmingham | OK | Postgraduate Chancellor's Scholarship for India — India-specific, £10,000 |
| university-of-leeds | OK | International Excellence Scholarships (Leeds University Business School), £3k/£6k/£16k |
| university-of-bristol | OK | Think Big Scholarships, £6.5k/£13k/£26k |
| coventry-university | OK | Coventry University Group Scholarship, £2,000/year, automatic |
| northumbria-university | OK | 2026-27 PGT UK International Scholarship, £3,000, automatic |
| university-of-toronto | OK | Lester B. Pearson International Student Scholarship, full 4-year ride, deadline 6 Nov 2026 (genuinely open) |
| mcgill-university | OK | Entrance Scholarships, $3k-$48k (the $12k tier is Canadian/PR-only) |
| university-of-waterloo | OK | 3 scholarships incl. a **Faculty of Mathematics India-specific award**, $20k-$40k |
| unsw-sydney | OK | 3 scholarships, 20% fee contribution up to full tuition |
| dublin-city-university | OK | Government of Ireland International Education Scholarship (GOI-IES), full waiver + €10,000 |
| university-of-calgary | OK | International Entrance Scholarship, $20,000 renewable |
| university-of-greenwich | OK | 2 scholarships, £2.5k-£3.5k |
| university-of-sussex | OK | Chancellor's International Scholarships, £5,000 |
| **griffith-university** | **SKIPPED** | HTTP 403 on 2 separate scholarship URLs (WAF) — not filled from search-result paraphrasing |
| **australian-national-university** | **SKIPPED** | Connection refused on 2 separate scholarship URLs — same treatment |

**3 extractions spot-checked directly against their live source page** (not just trusted from a first-pass fetch): Birmingham's India Chancellor's Scholarship, Waterloo's Faculty of Mathematics India Award, Toronto's Pearson Scholarship — all three re-confirmed the figure, eligibility, and deadline exactly as stored.

**Deadline honesty:** crawled 2026-07-30, well after most Feb-June scholarship deadlines for a September intake — 6 of the ~15 universities' scholarships have a deadline that has already passed for this cycle. These are stored with `deadlineStatus: 'closed-recurring'` and a note that they recur annually, never displayed as if still open (same rule just established for `components/DeadlineCountdown.tsx`).

**Rankings spot-check finding — the existing `qsRanking` field cannot be trusted as-is.** Live-verified QS World University Rankings 2026 for the same 9 universities against current QS/topuniversities.com reporting:

| University | Stored `qsRanking` (unaudited) | Live-verified rank | Match? |
|---|---|---|---|
| university-of-manchester | 32 | 35 | ✗ |
| university-of-bristol | 51 | 51 | ✓ |
| university-of-birmingham | 84 | 76 | ✗ |
| university-of-leeds | 75 | 86 | ✗ |
| mcgill-university | 32 | 27 | ✗ |
| university-of-toronto | 25 | 29 | ✗ |
| unsw-sydney | 19 | 20 | ✗ |
| university-of-calgary | 182 | 211 | ✗ |
| coventry-university | 601 | 193 (**QS Europe**, not World — a different ranking) | ✗ |

**8 of 9 mismatched.** The stored field was never individually audited (only 7 of 465 profiles got a sourced check, in the 2026-07-13 cleanup) — this spot-check confirms it's stale/wrong for most universities, not just an edge case. `data/university-rankings-verified.ts` is the small, freshly-verified alternative the new Rankings section reads from; the pre-existing hero badge and `FAQPage` ranking question on `app/universities/[slug]/page.tsx` still read the unaudited field untouched — flagging a full audit of all 465 as a clear candidate for a future task.

**Also found and fixed while building this (not part of the original ask, but the same fabrication class the task was explicitly avoiding):** `data/universities.ts`'s `topEmployers` and `scholarships` fields are populated for all 465 universities with generic, non-source-linked content (e.g. MIT: `topEmployers: ['Google','Microsoft','Amazon','Apple','Tesla','SpaceX']`; `scholarships: [{name: 'MIT Fellowship', eligibility: 'Exceptional research profile'}]`) — unlabelled and presented as fact on every profile page before this task. Both are no longer read by `app/universities/[slug]/page.tsx` (replaced by the real, verified Scholarships section and the honest Careers & Outcomes section respectively); the fields themselves remain in `data/universities.ts` untouched (not deleted, in case another page still reads them — confirmed via grep that `AdvancedCourseFinderClient.tsx` and `UniversityListingClient.tsx` still reference `.scholarships`, out of scope for this task to also fix).

### Wave 2 crawl integration (2026-07-29) — 13 new REAL-registry universities from the overnight Wave 2 crawl

The overnight Wave 2 crawl (`scripts/overnight-crawl-wave2.js`, run 2026-07-29) produced 24 candidate course files (389 courses) targeting the UK/Canada/Australia/Ireland subset of the 362 universities still missing real course data. A first manual review (spot-checking the 3 largest + 3 random files, plus an automated dup/junk-title triage on the rest) recommended 21 of the 24 files for integration. **Integration-time due diligence — reading every remaining file in full, and checking each crawl's actual domain against the target university's real profile — found 8 more of those 21 were unusable, not caught by the automated triage:**

- **`heriot-watt-university`** — every one of its 47 course URLs is `hw.ac.uk/dubai/study/...`: this is 100% **Heriot-Watt Dubai** campus content, not the UK/Edinburgh campus the crawl was targeting. `heriot-watt-university` and `heriot-watt-university-dubai` are separate, already-existing profiles (the latter already REAL with 64 courses) — integrating this file under either slug would either mislabel Dubai courses as UK ones or duplicate the existing Dubai data. Not integrated under any slug.
- **`maynooth-university`** (1/1 entries), **`university-of-kent`** (1/1), **`sheridan-college`** (1/1) — each file's sole entry is a marketing/testimonial/news-release page (a postgraduate-open-day flipbook, a student-testimonial "perfect timing" campaign page, and a news release respectively), not a course.
- **`university-of-western-australia`** (1/1) — the extracted title is the generic word "Study"; no real course name was recovered even though the URL (a "pathways to MBA" page) is real.
- **`cquniversity`** (3/3) — "MBA Book a Call-Back" (a lead-gen page) and two MBA "Overview" hub pages; no individually distinct course.
- **`wilfrid-laurier-university`** (2/2) — a music-audition logistics page and a French-proficiency-test information page; neither is a course.
- **`university-of-limerick`** (18/18) — every entry is a student-testimonial blog article (URL pattern `/study/postgraduate/articles/...`, e.g. "How my MSc in Project & Programme Management Transformed my Career"). Zero genuine course pages in the file, despite passing the earlier automated duplicate/junk-title checks (the titles don't match any junk pattern — they just aren't courses).
- **`national-college-of-ireland`** — all 7 rows are different sub-pages of the same MBA programme (Overview/About/Why Choose/Course Content/How to Apply/Student Profile/Meet the Faculty), each carrying an identical, implausible "5 years" duration. Collapsed to **1** real course entry (duration left unconfirmed) rather than integrating 7 near-duplicate rows or discarding the genuine course entirely.

These 8 join the 3 already identified as unusable before this integration step (`university-of-alberta` — majority "JavaScript is disabled" junk titles; `university-of-new-brunswick` — 100% generic "Search UNB" titles on non-course pages; `centennial-college` — 100% the same event page repeated 4x).

**13 files were integrated**, each after the specific cleanup identified in review — implausible fee/duration values were nulled rather than trusted (any Bachelor's/Master's course with an extracted duration under 6 months; Sussex's £5,760 foundation-year fee outlier; UCLan's Aerospace MSc £2,625, far below its own sibling MSc fees at the same university) — see `scripts/integrate-wave2.js` for the exact per-file transform applied to each:

| University | Courses integrated | Cleanup applied |
|---|---|---|
| Imperial College London | 8 | none needed |
| UNSW Sydney | 3 (of 5) | dropped 1 title-extraction miss + 1 news page |
| Goldsmiths, University of London | 33 | 1 implausible duration nulled |
| University of Greenwich | 20 (of 21) | dropped 1 Degree Apprenticeship (not open to international students) |
| University of Central Lancashire | 11 (of 12) | dropped 1 research-news article; nulled 2 implausible durations + 1 implausible fee |
| University of Salford | 7 | nulled 7 false `durationYears: 0` values (crawler's own stated convention is null-on-low-confidence, not zero) |
| Brunel University London | 2 | nulled 1 implausible duration |
| University of Plymouth | 1 | nulled 1 implausible duration |
| University of Sussex | 56 | nulled 1 fee outlier (foundation-year course, not comparable to standard/STEM fee bands) |
| University of the Sunshine Coast | 46 | stripped uncleaned SEO-suffix from every title; fee period independently verified live as annual (not per-trimester) before trusting |
| Dublin Business School | 41 (of 44) | deduped 4 slug collisions (renamed to reflect the actual distinct specialisation), dropped 2 news-page false-positives, fixed 1 title-extraction miss, nulled 2 false zero-durations |
| Birmingham City University | 5 (of 11) | deduped a course repeated 4x across year/domain URL variants, dropped 3 student-showcase news articles, fixed 1 generic title |
| National College of Ireland | 1 (of 7) | collapsed 7 duplicate-programme fragments to 1 real entry |

**Registry: 103 → 116 universities.** Generated via `scripts/integrate-wave2.js` (reads the reviewed `data/wave2-crawl/*.ts` sources, applies the per-file cleanup above, writes `data/<abbr>-courses.ts` + patches `data/university-course-registry.ts`) and `scripts/gen-wave2-routes.js` (generates each university's `app/universities/<slug>/courses/page.tsx` + `courses/[slug]/page.tsx`, following the pre-existing per-university-folder pattern used by all 103 prior REAL universities).

**English requirements:** of the 6 Wave 2 candidates proposed for `data/english-requirements-verified.ts`, 4 passed a live source-URL sanity check (Brunel, Fanshawe College, Durham College, Seneca Polytechnic — the last two are specifically each college's certificate/diploma tier, not a single college-wide figure, and are labelled as such in the `scope` field). Dublin Business School's page returned an HTTP 403 to automated re-fetch (likely a WAF) so its number is carried over from the original crawl rather than independently re-confirmed — flagged in its `scope` field. **Bond University was proposed but rejected**: a live re-check found the same tiered-table pattern already documented for Aston and Birmingham in `REJECTED_ROWS` (multiple IELTS bands by programme group, no stated default) — added to `REJECTED_ROWS` with this finding. Verified rows: 8 → 12.

### Wave 4 — Bachelor's (UG) course addition to 14 existing REAL universities (2026-07-18 to 2026-07-20)

Targeted the 54 REAL-registry universities that had 0 Bachelor's-level courses (all their existing REAL course data was Master's/PGCert/PGDip/LLM only). Ran an overnight, generic, unattended crawler (`scripts/overnight-crawl.js` — sitemap parse → Wayback CDX → Puppeteer link-scrape fallback, per-course detail fetch, degree-award-token + PhD-exclusion + HTTP-status validation filters) against all 54, then manually spot-checked and cleaned the output before integrating anything. **Method note: this was a generic multi-fallback crawl per university, not a bespoke per-institution crawl script like Waves 1-3** — see `crawl-logs/overnight-2026-07-18.log`/`overnight-2026-07-20.log` for the full run history, including two rounds of bug fixes after the first pass produced contaminated data (nav pages, HTTP-error-page titles, home-fee-not-international-fee amounts — all documented in those logs and in BUILD-LOG.md).

Of the 54 targeted, 17 produced usable UG course pages; after manual quality review (checking for application-guide/portfolio-page/student-work-gallery junk, apprenticeships not open to international students, PhD-mislabelled entries, and duplicates), **14 were integrated, 3 were fully rejected**:

- **Rejected outright (0 usable UG courses):** Anglia Ruskin University (15 candidates, 100% were Cambridge School of Art "student work" showcase/gallery pages, not course pages), University of Portsmouth (7 candidates, 100% were creative-course portfolio/video-submission application guides), University of Sheffield (1 candidate, a broken library-catalogue placeholder entry unrelated to any course).
- **Integrated (474 UG courses total added across 14 universities' existing REAL course-data files — registry entries unchanged, since all 14 already had a REGISTRY mapping from their existing Master's-level data):**

| University | UG added | Dropped (reason) |
|---|---|---|
| Dublin City University | 12 | 1 exact duplicate (same orientation page, 2 academic years) |
| Kaplan Business School | 2 | 0 |
| Liverpool John Moores University | 50 | 0 |
| Middlesex University | 47 | 0 |
| Northeastern University | 56 | 3 PhD-mislabelled "bachelor's-degree-entrance-PhD" pathway pages (removed in an earlier cleanup pass) |
| Royal Holloway, University of London | 57 | 3 PhD-mislabelled entries + duplicates (removed in an earlier cleanup pass) |
| Swinburne University of Technology | 32 | ~28 duplicates (same course reachable via multiple campus/intake URL variants — removed in an earlier cleanup pass) |
| University of Bristol | 34 | 0 |
| University of Derby | 27 | 0 |
| University of East Anglia | 59 | 0 |
| University of Helsinki | 5 | 12 nav/generic pages ("Apply to Bachelor's programmes", faculty-level generic listing pages, an orientation blog post, a thesis-examples page) + locale-duplicate URLs of the same programme (fi/sv/en versions of the same page) |
| University of Manchester | 41 | 2 exact duplicates (same course code, two URL aliases) |
| University of Roehampton | 3 | 1 application-support page ("interview support", not a course) |
| University of Sunderland | 51 | 9 Degree Apprenticeship programmes (real UK courses, but apprenticeships require existing UK employer sponsorship and are not available to international students at all) + 2 near-duplicate URL variants |

**Fees are zero/unverified for every one of these 474 new entries, by design — not a data gap to be filled casually later.** An earlier pass of this same crawl extracted a fee for 64 courses across 3 of these universities (Bristol, UEA, Sunderland); live re-verification found 63 of the 64 were the UK **home**-student fee, not the international fee international students actually pay (e.g. Bristol's real international fee for BA History is £28,200; the crawler had extracted the £9,790 home fee sitting a few words away in the same "Home students £X / International students £Y" sentence). All 64 were reset to null in the source crawl files and 0 in the integrated registry entries — `annualINR > 0` is the existing site-wide convention for "has a verified fee," so these new courses correctly stay out of every fee-filtered view (cheapest hubs, budget bands, cost pillars, subject pillars) until a real per-course international fee is separately verified. Duration is similarly 0/"Not specified" wherever the crawl didn't confidently extract it (roughly half of Northeastern's and all of Dublin City University's new entries) rather than assuming a default — this also means those specific entries won't appear in any duration-dependent content (e.g. PSW-eligibility sections).

**Pre-existing, unrelated data-quality issues surfaced but NOT fixed in this wave (out of scope, flagging for a future task):** Northeastern's and Swinburne's *existing* Master's-level course data (crawled well before this session) both have duplicate-slug entries from their original crawl — e.g. Swinburne has 6 different "courses" (`Student visas`, `Enrolling`, `Orientation`, `Swinburne intakes`, `Study levels and options`, `Course delivery options`) all sharing the literal slug `swinburne-` (clearly nav-page contamination from that original crawl), and Northeastern has 3 slugs each shared by 2-4 different "Postgraduate" entries. Confirmed via direct inspection that none of this session's new UG entries are involved — these are 100% pre-existing rows, untouched by this task.

Also see `data/english-requirements-verified.ts` (same overnight-crawl effort, separate JOB) — 8 of 103 universities now have a manually-verified IELTS/PTE/TOEFL requirement, wired into the IELTS band hubs and those 8 universities' own profile pages.

### Wave 3 real-data replacement (2026-07-09)

Targeted the 6 highest GSC-demand universities not yet REAL: australian-national-university, university-of-queensland, edith-cowan-university, flinders-university, university-of-suffolk, massey-university. Of these, University of Queensland (120 courses), Flinders University (338 courses), and University of Suffolk (40 courses) were already correctly classified REAL from prior work — each re-verified with a live 200 fetch of a sample course URL, no changes needed. The remaining 3 were CURATED and crawled genuinely fresh:

- **Australian National University** (344 courses) — ANU's own program-search JSON API (`programsandcourses.anu.edu.au/data/ProgramSearch/GetPrograms{UnderGraduate,PostGraduate,Research}`, `?PageSize=300` to bypass the default 10-item page cap) returned all programs with names, codes, durations and academic career; filtered to the degree-keyword whitelist, every one of the 344 resulting `programsandcourses.anu.edu.au/2026/program/[code]` URLs verified 200.
- **Edith Cowan University** (242 courses) — ecu.edu.au's live site sits behind a Cloudflare managed-challenge WAF that unpredictably 403s plain HTTP clients (curl/node https), even though it occasionally cache-hits 200. The course list itself was sourced from a Wayback CDX snapshot of ECU's own `degrees-elements/courses-list-json` endpoint (250 courses, 2018). Rather than trust a stale snapshot, every one of the 247 whitelisted course URLs was re-verified against **today's live site** using a headless-Chrome (Puppeteer) session, which reliably passes the WAF challenge where curl/node cannot — 242 resolved 200, 5 genuinely 404 (discontinued programs, e.g. "Master of Psychology") and were dropped, not invented.
- **Massey University** (176 courses) — the 2017 XML sitemap referenced in a prior partial investigation (`massey_extract_prog.xml`, prog_id-based URLs) turned out to be dead: every prog_id URL now 200s but redirects to the same generic `/study/find-a-subject-course-or-qualification/` search page — a stub trap, not real per-course data. The live `/study/all-qualifications-and-degrees/` catalogue page was crawled instead (176 unique deep-linked qualification URLs); each qualification page carries a schema.org `EducationalOccupationalProgram` JSON-LD block (name, programType, timeToComplete) which was parsed directly for course names — no name was estimated or guessed.

REGISTRY entries and full `/courses` + `/courses/[slug]` route trees were recreated from scratch for all 3 (they had been pruned in the Wave 0/1 prune pass along with the other 346 CURATED universities). Crawl/verify scripts: `scripts/crawl-anu-real.js`, `scripts/verify-anu-urls.js`, `scripts/verify-ecu-urls-puppeteer.js`, `scripts/crawl-massey-real.js` (+ matching `scripts/gen-*-real.js` generators). Post-crawl: `audit-broken-links.js` reports 0 broken links, `tsc --noEmit` clean, full static build succeeded (7000+ pages), and one course page per crawled university was headless-verified (200, correct title/H1/content) against the built output.

### Wave 2 real-data replacement (2026-07-08)

Crawled genuine course data for University of Birmingham (603 courses) and University of Leeds (589 courses), both previously CURATED and pruned from the index in the original prune pass — REGISTRY entries and course routes were recreated from scratch for both. Also corrected Griffith University, which Wave 0's audit had misclassified as REAL: all 81 of its original "courses" actually pointed at the same bare griffith.edu.au/courses homepage (a false REAL — worse than a false CURATED, per the audit brief's own standard). Re-crawled from Griffith's own program REST API for 373 genuine courses. University of Sheffield (already REAL) was re-verified and left untouched — its data is still good. Crawl scripts: `scripts/crawl-griffith-real.js`, `scripts/crawl-bham-real.js`, `scripts/crawl-leeds-real.js` (+ matching `scripts/gen-*-real.js` generators).

### Wave 1 real-data replacement (2026-07-07)

346 CURATED/MIXED universities were pruned from the index on 2026-07-07 (commit 38674b2c; see "prune" history). Wave 1 of the real-data replacement crawled genuine course data for the 4 highest lead-demand Canadian universities from that batch — Simon Fraser University, Dalhousie University, University of Ottawa, and University of Manitoba — moving all 4 to REAL (see updated rows and evidence below/above). Crawl scripts: `scripts/crawl-sfu-real.js`, `scripts/crawl-dal-real.js`, `scripts/crawl-uottawa-real.js`, `scripts/crawl-umanitoba-real.js` (+ matching `scripts/gen-*-real.js` generators). No estimated/fabricated course names were introduced — every course name and URL was scraped from the university's own site and validated (degree-keyword whitelist + URL-resolution check) before inclusion.

### CURATED university slugs (exact list, 343 — updated 2026-07-07 Wave 1 removed simon-fraser-university/dalhousie-university/university-of-ottawa; updated 2026-07-08 Wave 2 removed university-of-birmingham/university-of-leeds; updated 2026-07-09 Wave 3 removed australian-national-university/edith-cowan-university/massey-university)

```
aalborg-university
aarhus-university
acadia-university
aix-marseille-university
algonquin-college
american-university
american-university-dubai
american-university-of-sharjah
amity-university-dubai
amsterdam-university-of-applied-sciences
arizona-state-university
atlantic-technological-university
auckland-university-of-technology
australian-catholic-university
autonomous-university-of-barcelona
autonomous-university-of-madrid
birmingham-city-university
bond-university
boston-university
bow-valley-college
brandon-university
brock-university
brown-university
brunel-university-london
business-academy-aarhus
ca-foscari-university-venice
caltech
cambrian-college
canadian-university-dubai
canadore-college
cape-breton-university
capilano-university
cardiff-university
carleton-university
carlos-iii-university-madrid
carnegie-mellon-university
case-western-reserve-university
centennial-college
chalmers-university
city-university-london
clark-university
college-boreal
college-of-the-rockies
colorado-state-university
columbia-university
complutense-university-madrid
concordia-university-edmonton
conestoga-college
confederation-college
copenhagen-business-school
cornell-university
curtin-singapore
curtin-university
dania-academy
dartmouth-college
deakin-university
depaul-university
douglas-college
drexel-university
dublin-business-school
duke-university
durham-college
ea-business-academy
eae-business-school
ecole-polytechnique
embry-riddle-singapore
emlyon-business-school
emory-university
erasmus-university-rotterdam
esade-business-school
essec-business-school
fairleigh-dickinson-university
fanshawe-college
federation-university
first-nations-university
fleming-college
fordham-university
free-university-berlin
george-brown-college
george-washington-university
georgetown-university
georgia-tech
georgian-college
goethe-university-frankfurt
goldsmiths-university-london
grande-prairie-regional-college
griffith-college-dublin
halmstad-university
han-university
harvard-university
heidelberg-university
heriot-watt-university
holland-college
holmes-institute
humber-college
humboldt-university-berlin
iba-kolding
ie-university
iese-business-school
illinois-tech
indiana-university
insead
iowa-state-university
it-university-of-copenhagen
james-cook-university-singapore
johns-hopkins-university
jonkoping-university
kaplan-singapore
karlsruhe-institute-of-technology
karolinska-institutet
khalifa-university
kth-royal-institute-of-technology
kwantlen-polytechnic-university
la-cite-college
la-trobe-university
lakehead-university
lakeland-college
lambton-college
lancaster-university
langara-college
lincoln-university-new-zealand
linkoping-university
lmu-munich
london-school-of-economics
loyalist-college
luiss-university
lund-university
macewan-university
macquarie-university
malardalen-university
manchester-metropolitan-university
manipal-dubai
maynooth-university
mdis-singapore
medicine-hat-college
memorial-university
michigan-state-university
mid-sweden-university
middlesex-university-dubai
mit-massachusetts
mohawk-college
monash-university
mount-allison-university
mount-royal-university
munster-technological-university
murdoch-university-dubai
murdoch-university-singapore
national-college-of-ireland
navitas-australia
nbcc
nc-state-university
new-york-university
niagara-college
norquest-college
north-island-college
northern-college
northwestern-university
notre-dame-university
ohio-state-university
okanagan-college
olds-college
ontario-tech-university
pace-university
penn-state-university
politecnico-di-milano
politecnico-di-torino
pompeu-fabra-university
portage-college
princeton-university
psb-academy
radboud-university
rcsi-university-of-medicine
red-deer-polytechnic
red-river-college-polytechnic
rensselaer-polytechnic
rice-university
rmit-singapore
rochester-institute-of-technology
roskilde-university
royal-roads-university
rutgers-university
rwth-aachen-university
sait
sapienza-university-rome
saskatchewan-polytechnic
sault-college
sciences-po-paris
selkirk-college
seneca-polytechnic
sheridan-college
sim-singapore
singapore-institute-of-technology
singapore-management-university
slu-sweden
sorbonne-university
south-east-technological-university
southern-cross-university
sp-jain-dubai
sp-jain-singapore
st-clair-college
st-lawrence-college
st-thomas-university
staffordshire-university
stanford-university
stevens-institute-of-technology
stockholm-school-of-economics
stockholm-university
stony-brook-university
suny-buffalo
sutd
technical-university-berlin
technical-university-of-denmark
technological-university-dublin
teesside-university
temple-university
texas-am-university
think-education-australia
thompson-rivers-university
tilburg-university
toronto-metropolitan-university
torrens-university-australia
trent-university
tu-dresden
tu-eindhoven
tufts-university
uae-university
uc-berkeley
uc-san-diego
uc-santa-barbara
ucla
ucn-university-college
umea-university
unc-chapel-hill
universita-cattolica
universite-de-moncton
university-canada-west
university-college-cork
university-of-aberdeen
university-of-alberta
university-of-arizona
university-of-barcelona
university-of-bedfordshire
university-of-bologna
university-of-bonn
university-of-bordeaux
university-of-bradford
university-of-bridgeport
university-of-brighton
university-of-canberra
university-of-canterbury
university-of-central-lancashire
university-of-cincinnati
university-of-cologne
university-of-colorado-boulder
university-of-connecticut
university-of-dayton
university-of-delaware
university-of-essex
university-of-florence
university-of-florida
university-of-galway
university-of-gothenburg
university-of-granada
university-of-greenwich
university-of-grenoble-alpes
university-of-huddersfield
university-of-kent
university-of-leicester
university-of-lethbridge
university-of-limerick
university-of-lincoln
university-of-lyon
university-of-mannheim
university-of-maryland
university-of-michigan
university-of-milan
university-of-minnesota
university-of-montpellier
university-of-naples
university-of-navarra
university-of-new-brunswick
university-of-new-england-australia
university-of-newcastle-australia
university-of-northern-bc
university-of-nottingham
university-of-padua
university-of-paris-saclay
university-of-pennsylvania
university-of-pisa
university-of-pittsburgh
university-of-plymouth
university-of-regina
university-of-rochester
university-of-salamanca
university-of-salford
university-of-saskatchewan
university-of-seville
university-of-sharjah
university-of-south-australia
university-of-south-wales
university-of-southern-california
university-of-southern-denmark
university-of-southern-queensland
university-of-stirling
university-of-strasbourg
university-of-stuttgart
university-of-sunshine-coast
university-of-sussex
university-of-tasmania
university-of-the-arts-london
university-of-toulouse
university-of-trento
university-of-turin
university-of-twente
university-of-utah
university-of-valencia
university-of-waikato
university-of-washington
university-of-western-australia
university-of-windsor
university-of-winnipeg
university-of-wisconsin-madison
university-of-wolverhampton
university-of-worcester
unsw-sydney
uowd-dubai
upei
ut-austin
utrecht-university
vancouver-community-college
vancouver-island-university
vanderbilt-university
via-university-college
virginia-tech
wageningen-university
webster-university
western-sydney-university
western-university
wilfrid-laurier-university
wpi
yale-university
york-university
zealand-business-technology
```

## Shared curated templates found

These course-name lists are byte-identical across multiple unrelated universities (different countries/institutions), confirming they are a generic template, not institution-specific data:

- **15 universities** share: BEng Civil Engineering, BEng Electrical Engineering, BEng Mechanical Engineering, BSc Accounting & Finance, BSc Artificial Intelligence, BSc Business Administration...
- **3 universities** share: Accounting, Aerospace Engineering, Applied Mathematics, Architecture, Artificial Intelligence, Biomedical Engineering...
- **9 universities** share: BEng Civil Engineering, BEng Electrical Engineering, BEng Mechanical Engineering, BSc Accounting & Finance, BSc Artificial Intelligence, BSc Business Administration...
- **4 universities** share: BEng Civil Engineering, BEng Electrical Engineering, BEng Mechanical Engineering, BSc Accounting & Finance, BSc Business Administration, BSc Computer Science...
- **15 universities** share: BA Media & Communications, BEng Civil Engineering, BEng Electrical Engineering, BEng Mechanical Engineering, BSc Accounting & Finance, BSc Artificial Intelligence...
- **15 universities** share: Accounting, Aerospace Engineering, Applied Machine Learning, Bachelor of Business Administration, Bachelor of Computer Science, Bachelor of Information Technology...
- **19 universities** share: Accounting, Aerospace Engineering, Applied Mathematics, Architecture, Artificial Intelligence, Bioinformatics...
- **3 universities** share: BEng Civil Engineering, BEng Electrical Engineering, BEng Mechanical Engineering, BSc Computer Science, BSc Information Technology, BSc Software Engineering...
- **18 universities** share: Accounting, Agricultural Science, Applied Mathematics, Architecture, Artificial Intelligence, Biotechnology...
- **6 universities** share: Accounting, Aerospace Engineering, Applied Mathematics, Architecture, Artificial Intelligence, Bioinformatics...
- **3 universities** share: BSc Business Administration, BSc Computer Science, BSc Economics, BSc Information Technology, BSc Software Engineering, MA Education...
- **7 universities** share: BEng Civil Engineering, BEng Electrical Engineering, BEng Mechanical Engineering, BSc Accounting & Finance, BSc Business Administration, BSc Computer Science...
- **4 universities** share: Accounting, Agricultural Science, Applied Mathematics, Architecture, Artificial Intelligence, Biotechnology...
- **3 universities** share: BA Business & Management, BA English Literature, BA Media & Communications, BEng Civil Engineering, BEng Electrical Engineering, BEng Mechanical Engineering...

## Full university-by-university table

| University | Country | Classification | Courses | Evidence |
|---|---|---|---|---|
| Aalborg University | Denmark | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.aau.dk), no real per-course pages |
| Aarhus University | Denmark | CURATED | 45 | Header explicitly says curated/estimated/placeholder |
| Acadia University | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.acadia.ca/), no real per-course pages |
| Aix-Marseille University | France | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.univ-amu.fr), no real per-course pages |
| Algonquin College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.algonquin.ca/), no real per-course pages |
| American University | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| American University in Dubai | UAE | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.aud.edu), no real per-course pages |
| American University of Sharjah | UAE | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.aus.edu), no real per-course pages |
| Amity University Dubai | UAE | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.amityuniversitydubai.ae), no real per-course pages |
| Amsterdam University of Applied Sciences | Netherlands | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.hva.nl), no real per-course pages |
| Anglia Ruskin University | UK | REAL | 166 | Crawl header (sitemap/Puppeteer/CDX mention) + all 166 courses deep-linked (e.g. https://www.aru.ac.uk/study/postgraduate/accounting-and-finance) |
| Arizona State University | USA | CURATED | 64 | Header explicitly says curated/estimated/placeholder |
| Assiniboine Community College | Canada | UNSURE | 0 | Not registered in REGISTRY — no course data served |
| Aston University | UK | REAL | 6 | Crawl header (sitemap/Puppeteer/CDX mention) + all 6 courses deep-linked (e.g. https://www.aston.ac.uk/study/courses/independent-prescribing-optometrists-pgcert) |
| Atlantic Technological University | Ireland | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Auckland University of Technology | New Zealand | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Australian Catholic University | Australia | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Australian National University | Australia | REAL | 344 | Wave 3: crawled live from ANU's own program-search JSON API (programsandcourses.anu.edu.au/data/ProgramSearch/GetPrograms{UnderGraduate,PostGraduate,Research}) — every course has a unique programsandcourses.anu.edu.au/2026/program/[code] URL, all 344 verified 200. Re-checked 2026-07-16: live API has no civil/structural/infrastructure engineering program at any level (only Master of Engineering in Electrical Engineering) — the pre-Wave-3 CURATED "BEng/MSc Civil Engineering" entries (bare-homepage URL, added 2026-05-30, dropped 2026-07-09) do not correspond to a real ANU program; their dead URLs now redirect to the ANU profile page (`next.config.mjs`) rather than being rebuilt |
| Autonomous University of Barcelona | Spain | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.uab.cat), no real per-course pages |
| Autonomous University of Madrid | Spain | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.uam.es), no real per-course pages |
| Birmingham City University | UK | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| BITS Pilani Dubai | UAE | REAL | 45 | No header, but all 45 courses have unique deep institution URLs (e.g. https://www.bits-pilani.ac.in/dubai), non-templated count |
| Bocconi University | Italy | REAL | 22 | Crawl header (sitemap/Puppeteer/CDX mention) + all 22 courses deep-linked (e.g. https://www.unibocconi.it/en/programs/bachelor-science/economics) |
| Bond University | Australia | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Boston University | USA | CURATED | 84 | All 84 courses share one bare-homepage URL (https://www.bu.edu), no real per-course pages |
| Bournemouth University | UK | REAL | 45 | Crawl header (sitemap/Puppeteer/CDX mention) + all 45 courses deep-linked (e.g. https://www.bournemouth.ac.uk/study/postgraduate/courses/business/mba) |
| Bow Valley College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.bowvalleycollege.ca), no real per-course pages |
| Brandon University | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.brandonu.ca), no real per-course pages |
| Brock University | Canada | CURATED | 42 | All 42 courses share one bare-homepage URL (https://www.brocku.ca), no real per-course pages |
| Brown University | USA | CURATED | 62 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Brunel University London | UK | CURATED | 80 | Header explicitly says curated/estimated/placeholder |
| Business Academy Aarhus | Denmark | CURATED | 41 | All 41 courses share one bare-homepage URL (https://www.baaa.dk), no real per-course pages |
| Ca' Foscari University of Venice | Italy | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.unive.it), no real per-course pages |
| California Institute of Technology | USA | CURATED | 62 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Cambrian College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.cambriancollege.ca), no real per-course pages |
| Canadian University Dubai | UAE | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.cud.ac.ae), no real per-course pages |
| Canadore College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.canadorecollege.ca), no real per-course pages |
| Cape Breton University | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.cbu.ca/), no real per-course pages |
| Capilano University | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.capilano.ca/), no real per-course pages |
| Cardiff University | UK | CURATED | 76 | Header explicitly says curated/estimated/placeholder |
| Carleton University | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.carleton.ca), no real per-course pages |
| Carlos III University of Madrid | Spain | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Carnegie Mellon University | USA | CURATED | 62 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Case Western Reserve University | USA | CURATED | 50 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Centennial College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.centennialcollege.ca), no real per-course pages |
| Chalmers University of Technology | Sweden | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.chalmers.se), no real per-course pages |
| Charles Darwin University | Australia | REAL | 326 (corrected 2026-07-18, was 405) | **Cleaned 2026-07-18 (BUILD-LOG.md §2 item 14, follow-up):** re-classified all 405 original entries by URL pattern — 326 have a `/study/course/<slug>-<code>` URL (a genuine individual course-detail page: degree programmes, VET/TAFE Certificate II–IV and Diploma qualifications with real national training-package codes like `RII30820`/`BSB30220`, and legitimate CDU pathway/enabling/exchange programmes like UniBoost, Tertiary Enabling Program, Study Abroad/International Exchange, English for Academic Purposes) — kept as REAL. The other 79 had a `/study/<topic>` URL — subject-area landing pages ("Nursing and Midwifery", "Business", "Engineering"), TAFE category pages, and site navigation/info pages ("Ask a question", "Find a course", "How we rank", "Commonwealth Teaching Scholarships Program", a news-style article) — none are individual courses; removed from `data/cdu-courses.ts` (not sourced from a real course page at all, so "left in as unverified" wasn't the right call — deleted outright). Their previously-live URLs now redirect to the CDU profile page via `vercel.json` (79 entries, same pattern as the ANU civil-engineering fix). The URL-pattern method (`/study/course/` present or not) proved far more precise than the earlier degree-keyword heuristic, which had overestimated junk at 39.5% by missing real-but-keyword-less entries (VET codes, pathway programme names) — the true split was 19.5% junk / 80.5% real. |
| City, University of London | UK | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Clark University | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Collège Boréal | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.collegeboreal.ca), no real per-course pages |
| College of the Rockies | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.cotr.bc.ca), no real per-course pages |
| Colorado State University | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Columbia College BC | Canada | UNSURE | 0 | Not registered in REGISTRY — no course data served |
| Columbia University | USA | CURATED | 62 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Complutense University of Madrid | Spain | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.ucm.es), no real per-course pages |
| Concordia University | Canada | MIXED | 45 | 11% deep-linked, 89% bare-homepage stub — partially real |
| Concordia University of Edmonton | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.concordia-edmonton.ca/), no real per-course pages |
| Conestoga College | Canada | CURATED | 40 | All 40 courses share one bare-homepage URL (https://www.conestoga.ca/), no real per-course pages |
| Confederation College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.confederationc.on.ca), no real per-course pages |
| Copenhagen Business Academy | Denmark | CURATED | 42 | All 42 courses share one bare-homepage URL (https://www.cphbusiness.dk), no real per-course pages |
| Copenhagen Business School | Denmark | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.cbs.dk), no real per-course pages |
| Cornell University | USA | CURATED | 62 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Coventry University | UK | REAL | 125 | Crawl header (sitemap/Puppeteer/CDX mention) + all 125 courses deep-linked (e.g. https://www.coventry.ac.uk/course-structure/pg/ees/advanced-mechanical-engineering-msc/) |
| CQUniversity Australia | Australia | REAL | 69 | No header, but all 69 courses have unique deep institution URLs (e.g. https://www.cqu.edu.au/courses), non-templated count |
| Curtin Singapore | Singapore | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.curtin.edu.sg), no real per-course pages |
| Curtin University | Australia | CURATED | 53 | Header explicitly says curated/estimated/placeholder |
| Dalhousie University | Canada | REAL | 299 | Wave 1 re-crawl (2026-07-07): Dalhousie program-finder AEM API (https://www.dal.ca/study/programs/_jcr_content/root/maincontent/main/programfinder.model.json), 531 total programs filtered to 299 with an official Bachelor/Master/PhD/Diploma/Certificate type tag (Course/Minor/Upgrading-and-Pathways entries excluded); every course has a unique deep-linked URL (e.g. https://www.dal.ca/study/programs/undergraduate/agricultural-business-bsc.html) |
| Dania Academy | Denmark | CURATED | 40 | All 40 courses share one bare-homepage URL (https://www.dania.dk), no real per-course pages |
| Dartmouth College | USA | CURATED | 62 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| De Montfort University | UK | REAL | 50 | No header, but all 50 courses have unique deep institution URLs (e.g. https://www.dmu.ac.uk/study/courses/postgraduate-courses/business/master-of-business-administration-mba.aspx), non-templated count |
| Deakin University | Australia | CURATED | 51 | Header explicitly says curated/estimated/placeholder |
| Delft University of Technology | Netherlands | UNSURE | 0 | Not registered in REGISTRY — no course data served |
| DePaul University | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Douglas College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.douglascollege.ca), no real per-course pages |
| Drexel University | USA | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.drexeluniversity.edu), no real per-course pages |
| Dublin Business School | Ireland | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Dublin City University | Ireland | REAL | 205 | Crawl header (sitemap/Puppeteer/CDX mention) + all 205 courses deep-linked (e.g. https://www.dcu.ie/courses/undergraduate/school-biotechnology/genetics-and-cell-biology) |
| Duke University | USA | CURATED | 62 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Durham College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.durhamcollege.ca), no real per-course pages |
| Durham University | UK | REAL | 314 | Crawl header (sitemap/Puppeteer/CDX mention) + all 314 courses deep-linked (e.g. https://www.durham.ac.uk/business/courses/philosophy-politics-and-economics-vl52/) |
| EAE Business School | Spain | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.eae.es), no real per-course pages |
| École Polytechnique | France | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.polytechnique.edu), no real per-course pages |
| Edith Cowan University | Australia | REAL | 242 | Wave 3: course list sourced from Wayback CDX archive of ecu.edu.au's own courses-list-json endpoint, every course URL re-verified live via Puppeteer (site sits behind a Cloudflare managed-challenge WAF that blocks plain HTTP clients) — 242/247 resolved 200, 5 genuine 404s (discontinued programs) dropped |
| Eindhoven University of Technology | Netherlands | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.tue.nl), no real per-course pages |
| Embry-Riddle Aeronautical University Singapore | Singapore | CURATED | 39 | All 39 courses share one bare-homepage URL (https://www.embry.edu.sg), no real per-course pages |
| EMLYON Business School | France | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Emory University | USA | CURATED | 50 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Erasmus University Rotterdam | Netherlands | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.eur.nl), no real per-course pages |
| ESADE Business School | Spain | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| ESSEC Business School | France | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.essec.edu), no real per-course pages |
| Fairleigh Dickinson University | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Fairleigh Dickinson University Vancouver | Canada | UNSURE | 0 | Not registered in REGISTRY — no course data served |
| Fanshawe College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.fanshawec.ca), no real per-course pages |
| Federation University | Australia | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| First Nations University of Canada | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.fnuniv.ca), no real per-course pages |
| Fleming College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.flemingcollege.ca), no real per-course pages |
| Flinders University | Australia | REAL | 338 | No header, but all 338 courses have unique deep institution URLs (e.g. https://www.flinders.edu.au/study/courses/bachelor-computing-mathematical-sciences-honours), non-templated count |
| Fordham University | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Free University of Berlin | Germany | CURATED | 43 | All 43 courses share one bare-homepage URL (https://www.fu-berlin.de), no real per-course pages |
| George Brown College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.george-brown.ca/), no real per-course pages |
| George Washington University | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Georgetown University | USA | CURATED | 62 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Georgia Institute of Technology | USA | CURATED | 76 | All 76 courses share one bare-homepage URL (https://www.gatech.edu), no real per-course pages |
| Georgian College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.georgiancollege.ca), no real per-course pages |
| Goethe University Frankfurt | Germany | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Goldsmiths, University of London | UK | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Grande Prairie Regional College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.gprc.ab.ca), no real per-course pages |
| Griffith College Dublin | Ireland | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Griffith University | Australia | REAL | 373 | **Correction (2026-07-08, Wave 2)**: this row was a false REAL — the original 81 "courses" all pointed at the exact same bare https://www.griffith.edu.au/courses homepage (verified by direct inspection), i.e. it was CURATED, not REAL. Re-crawled from Griffith's own program REST API (https://degrees.griffith.edu.au/rest-api/v3/index/programs), filtered to currentlyOffered=true with an official degree-type tag; every course has a unique real program overview page (e.g. https://www148.griffith.edu.au/programs-courses/Program/5070/Overview) |
| Halmstad University | Sweden | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| HAN University of Applied Sciences | Netherlands | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.han.nl), no real per-course pages |
| Harvard University | USA | CURATED | 62 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| HEC Paris | France | UNSURE | 0 | Not registered in REGISTRY — no course data served |
| Heidelberg University | Germany | CURATED | 40 | All 40 courses share one bare-homepage URL (https://www.uni-heidelberg.de), no real per-course pages |
| Heriot-Watt University | UK | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Heriot-Watt University Dubai | UAE | REAL | 64 | No header, but all 64 courses have unique deep institution URLs (e.g. https://www.hw.ac.uk/dubai/study/undergraduate/accountancy-finance), non-templated count |
| Holland College | Canada | CURATED | 44 | All 44 courses share one bare-homepage URL (https://www.hollandc.pe.ca), no real per-course pages |
| Holmes Institute | Australia | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Humber College | Canada | CURATED | 42 | All 42 courses share one bare-homepage URL (https://www.humber.ca/), no real per-course pages |
| Humboldt University of Berlin | Germany | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.hu-berlin.de), no real per-course pages |
| IBA International Business Academy | Denmark | CURATED | 40 | All 40 courses share one bare-homepage URL (https://www.iba.dk), no real per-course pages |
| IE University | Spain | CURATED | 30 | Header explicitly says curated/estimated/placeholder |
| IESE Business School | Spain | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.iese.edu), no real per-course pages |
| Illinois Institute of Technology | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Imperial College London | UK | UNSURE | 0 | Not registered in REGISTRY — no course data served |
| Indiana University Bloomington | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| INSEAD | France | CURATED | 44 | All 44 courses share one bare-homepage URL (https://www.insead.edu), no real per-course pages |
| Iowa State University | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| IT University of Copenhagen | Denmark | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.itu.dk), no real per-course pages |
| James Cook University Brisbane | Australia | REAL | 53 | No header, but all 53 courses have unique deep institution URLs (e.g. https://www.jcu.edu.au/courses), non-templated count |
| James Cook University Singapore | Singapore | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.jcu.edu.sg), no real per-course pages |
| Johns Hopkins University | USA | CURATED | 62 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Jönköping University | Sweden | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.ju.se), no real per-course pages |
| Justice Institute of British Columbia | Canada | UNSURE | 0 | Not registered in REGISTRY — no course data served |
| Kaplan Business School | Australia | MIXED | 45 | 11% deep-linked, 89% bare-homepage stub — partially real |
| Kaplan Singapore | Singapore | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.kaplan.com.sg), no real per-course pages |
| Karlsruhe Institute of Technology | Germany | CURATED | 61 | All 61 courses share one bare-homepage URL (https://www.kit.edu), no real per-course pages |
| Karolinska Institutet | Sweden | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.ki.se), no real per-course pages |
| Khalifa University | UAE | CURATED | 34 | All 34 courses share one bare-homepage URL (https://www.ku.ac.ae), no real per-course pages |
| King's College London | UK | REAL | 389 | Crawl header (sitemap/Puppeteer/CDX mention) + all 389 courses deep-linked (e.g. https://www.kcl.ac.uk/study/undergraduate/courses/accounting-finance-bsc) |
| Kingston University London | UK | REAL | 60 | Crawl header (sitemap/Puppeteer/CDX mention) + all 60 courses deep-linked (e.g. https://www.kingston.ac.uk/postgraduate-course/accounting-finance-msc/) |
| KTH Royal Institute of Technology | Sweden | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.kth.se), no real per-course pages |
| Kwantlen Polytechnic University | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.kpu.ca), no real per-course pages |
| La Cité College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.lacitec.on.ca), no real per-course pages |
| La Trobe University | Australia | CURATED | 58 | Header explicitly says curated/estimated/placeholder |
| Lakehead University | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.lakeheadu.ca), no real per-course pages |
| Lakeland College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.lakelandcollege.ca), no real per-course pages |
| Lambton College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.lambtoncollege.ca), no real per-course pages |
| Lancaster University | UK | CURATED | 61 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Langara College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.langara.bc.ca), no real per-course pages |
| Leiden University | Netherlands | REAL | 58 | Crawl header (sitemap/Puppeteer/CDX mention) + all 58 courses deep-linked (e.g. https://www.universiteitleiden.nl/en/education/study-programmes/master/computer-science/advanced-computing-and-systems) |
| Lincoln University New Zealand | New Zealand | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Linköping University | Sweden | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| LMU Munich | Germany | CURATED | 71 | All 71 courses share one bare-homepage URL (https://www.lmu.de), no real per-course pages |
| London Metropolitan University | UK | REAL | 49 | No header, but all 49 courses have unique deep institution URLs (e.g. https://www.londonmet.ac.uk/courses/postgraduate/graphic-design---ma/), non-templated count |
| London School of Economics | UK | CURATED | 61 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Loughborough University | UK | REAL | 236 | Crawl header (sitemap/Puppeteer/CDX mention) + all 236 courses deep-linked (e.g. https://lboro.ac.uk/study/postgraduate/masters-degrees/a-z/accounting-and-finance/) |
| Loyalist College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.loyalistcollege.com), no real per-course pages |
| LUISS University | Italy | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.luiss.edu), no real per-course pages |
| Lund University | Sweden | CURATED | 59 | All 59 courses share one bare-homepage URL (https://www.lu.se), no real per-course pages |
| Maastricht University | Netherlands | REAL | 104 | Crawl header (sitemap/Puppeteer/CDX mention) + all 104 courses deep-linked (e.g. https://www.maastrichtuniversity.nl/education/bachelor/programmes/arts-and-culture) |
| MacEwan University | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.macewan.ca), no real per-course pages |
| Macquarie University | Australia | CURATED | 48 | Header explicitly says curated/estimated/placeholder |
| Mälardalen University | Sweden | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.mdh.se), no real per-course pages |
| Management Development Institute of Singapore | Singapore | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.mdis.edu.sg), no real per-course pages |
| Manchester Metropolitan University | UK | CURATED | 48 | Header explicitly says curated/estimated/placeholder |
| Manipal Academy of Higher Education Dubai | UAE | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.manipaldubai.com), no real per-course pages |
| Massachusetts Institute of Technology | USA | CURATED | 62 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Massey University | New Zealand | REAL | 176 | Wave 3: crawled live from massey.ac.nz/study/all-qualifications-and-degrees/ catalogue; each qualification page's schema.org EducationalOccupationalProgram JSON-LD block was parsed for name/duration — the old 2017 XML sitemap was found dead (every prog_id URL now redirects to a generic search stub) and was not used |
| Maynooth University | Ireland | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| McGill University | Canada | REAL | 212 | Crawl header (sitemap/Puppeteer/CDX mention) + all 212 courses deep-linked (e.g. https://www.mcgill.ca/gradapplicants/program/entomology-msc) |
| McMaster University | Canada | REAL | 86 | Crawl header (Source: Puppeteer crawl of https://gs.mcmaster.ca/programs/) + all 86 courses deep-linked (e.g. https://gs.mcmaster.ca/program/ai-and-analytics/) |
| Medicine Hat College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.mhc.ab.ca), no real per-course pages |
| Memorial University of Newfoundland | Canada | CURATED | 48 | All 48 courses share one bare-homepage URL (https://www.mun.ca), no real per-course pages |
| Michigan State University | USA | CURATED | 30 | Header explicitly says curated/estimated/placeholder |
| Mid Sweden University | Sweden | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.miun.se), no real per-course pages |
| Middlesex University | UK | REAL | 110 | Crawl header (sitemap/Puppeteer/CDX mention) + all 110 courses deep-linked (e.g. https://www.mdx.ac.uk/courses/postgraduate/mechatronic-systems-engineering-msc/) |
| Middlesex University Dubai | UAE | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.mdx.ac.ae), no real per-course pages |
| Mohawk College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.mohawk.ca/), no real per-course pages |
| Monash University | Australia | CURATED | 118 | All 118 courses share one bare-homepage URL (https://www.monash.edu), no real per-course pages |
| Mount Allison University | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.mta.ca), no real per-course pages |
| Mount Royal University | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.mtroyal.ca), no real per-course pages |
| Munster Technological University | Ireland | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Murdoch University | Australia | REAL | 49 | No header, but all 49 courses have unique deep institution URLs (e.g. https://www.murdoch.edu.au/course/undergraduate/b1367), non-templated count |
| Murdoch University Dubai | UAE | CURATED | 45 | All 45 courses share one bare-homepage URL (https://murdochdubai.ac.ae), no real per-course pages |
| Murdoch University Singapore | Singapore | CURATED | 45 | All 45 courses share one bare-homepage URL (https://singapore.murdoch.edu.au), no real per-course pages |
| Nanyang Technological University | Singapore | REAL | 84 | Crawl header (sitemap/Puppeteer/CDX mention) + all 84 courses deep-linked (e.g. https://www.ntu.edu.sg/admissions/undergraduate/courses/bachelor-of-business-administration) |
| National College of Ireland | Ireland | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| National University of Singapore | Singapore | MIXED | 100 | 96% deep-linked, 4% bare-homepage stub — partially real |
| Navitas | Australia | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| NC State University | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| New Brunswick Community College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.nbcc.ca), no real per-course pages |
| New York Institute of Technology Vancouver | Canada | REAL | 45 | No header, but all 45 courses have unique deep institution URLs (e.g. https://www.nyit.edu/locations/vancouver), non-templated count |
| New York University | USA | CURATED | 87 | All 87 courses share one bare-homepage URL (https://www.nyu.edu), no real per-course pages |
| Newcastle University | UK | REAL | 228 | No header, but all 228 courses have unique deep institution URLs (e.g. https://www.ncl.ac.uk/postgraduate/degrees/4050f/), non-templated count |
| Niagara College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.niagaracollege.ca), no real per-course pages |
| Niagara University Ontario | Canada | UNSURE | 0 | Not registered in REGISTRY — no course data served |
| NorQuest College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.norquest.ca), no real per-course pages |
| North Island College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.nic.bc.ca), no real per-course pages |
| Northeastern University | USA | REAL | 84 | Crawl header (sitemap/Puppeteer/CDX mention) + all 84 courses deep-linked (e.g. https://catalog.northeastern.edu/graduate/additional-programs/applied-ai-mps-connect/) |
| Northern College of Applied Arts and Technology | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.northernc.on.ca), no real per-course pages |
| Northumbria University | UK | REAL | 383 | No header, but all 383 courses have unique deep institution URLs (e.g. https://www.northumbria.ac.uk/study-at-northumbria/courses/bsc-hons-accounting-extended-degree-uusxci1/), non-templated count |
| Northwestern University | USA | CURATED | 62 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Nottingham Trent University | UK | REAL | 42 | Crawl header (sitemap/Puppeteer/CDX mention) + all 42 courses deep-linked (e.g. https://www.ntu.ac.uk/course/computing-and-technology/pg/next/advanced-computer-science) |
| Nova Scotia Community College | Canada | UNSURE | 0 | Not registered in REGISTRY — no course data served |
| Ohio State University | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Okanagan College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.okanagan.bc.ca), no real per-course pages |
| Olds College of Agriculture and Technology | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.oldscollege.ca), no real per-course pages |
| Ontario Tech University | Canada | CURATED | 41 | All 41 courses share one bare-homepage URL (https://www.ontariotechu.ca), no real per-course pages |
| Oxford Brookes University | UK | REAL | 85 | Crawl header (Source: https://www.brookes.ac.uk/sitemap/courses (/courses/postgraduate/*)) + all 85 courses deep-linked (e.g. https://www.brookes.ac.uk/courses/postgraduate/conservation-ecology) |
| Pace University | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Penn State University | USA | CURATED | 81 | All 81 courses share one bare-homepage URL (https://www.psu.edu), no real per-course pages |
| Politecnico di Milano | Italy | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.polimi.it), no real per-course pages |
| Politecnico di Torino | Italy | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.polito.it), no real per-course pages |
| Pompeu Fabra University | Spain | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.upf.edu), no real per-course pages |
| Portage College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.portagecollege.ca), no real per-course pages |
| Princeton University | USA | CURATED | 62 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| PSB Academy | Singapore | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.psbacademy.com.sg), no real per-course pages |
| Purdue University | USA | REAL | 74 | No header, but all 74 courses have unique deep institution URLs (e.g. https://www.purdue.edu/online/program/master-of-business-and-technology/), non-templated count |
| Queen Mary University of London | UK | REAL | 10 | No header, but all 10 courses have unique deep institution URLs (e.g. https://www.qmul.ac.uk/postgraduate/taught/coursefinder/courses/accounting-and-finance-msc/), non-templated count |
| Queen's University | Canada | REAL | 91 | Crawl header (sitemap/Puppeteer/CDX mention) + all 91 courses deep-linked (e.g. https://www.queensu.ca/artsci/undergraduate/programs) |
| Radboud University | Netherlands | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.ru.nl), no real per-course pages |
| RCSI University of Medicine | Ireland | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Red Deer Polytechnic | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.rdc.ab.ca), no real per-course pages |
| Red River College Polytechnic | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.rrc.ca), no real per-course pages |
| Rensselaer Polytechnic Institute | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Rice University | USA | CURATED | 62 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| RMIT Online Singapore | Singapore | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.rmit.edu.sg), no real per-course pages |
| RMIT University | Australia | REAL | 473 | Crawl header (sitemap/Puppeteer/CDX mention) + all 473 courses deep-linked (e.g. https://www.rmit.edu.au/study-with-us/levels-of-study/online/online-master-of-human-resource-management-mc263o) |
| Robert Gordon University | UK | REAL | 91 | No header, but all 91 courses have unique deep institution URLs (e.g. https://www.rgu.ac.uk/study/courses/pgcert-pgdip-msc-accounting-and-finance), non-templated count |
| Rochester Institute of Technology | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Rochester Institute of Technology Dubai | UAE | REAL | 45 | No header, but all 45 courses have unique deep institution URLs (e.g. https://www.rit.edu/dubai), non-templated count |
| Roskilde University | Denmark | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.ruc.dk), no real per-course pages |
| Royal Holloway, University of London | UK | REAL | 79 | Crawl header (sitemap/Puppeteer/CDX mention) + all 79 courses deep-linked (e.g. https://www.royalholloway.ac.uk/studying-here/postgraduate/biological-sciences/biological-sciences) |
| Royal Roads University | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.royalroads.ca), no real per-course pages |
| Rutgers University | USA | CURATED | 30 | Header explicitly says curated/estimated/placeholder |
| RWTH Aachen University | Germany | CURATED | 53 | All 53 courses share one bare-homepage URL (https://www.rwth-aachen.de), no real per-course pages |
| S P Jain School of Global Management | Singapore | CURATED | 50 | All 50 courses share one bare-homepage URL (https://www.spjain.edu.sg), no real per-course pages |
| S P Jain School of Global Management | UAE | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.spjain.ae), no real per-course pages |
| SAIT (Southern Alberta Institute of Technology) | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.sait.ca/), no real per-course pages |
| Sapienza University of Rome | Italy | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.uniroma1.it), no real per-course pages |
| Saskatchewan Polytechnic | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.sask-poly.ca/), no real per-course pages |
| Sault College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.saultcollege.ca), no real per-course pages |
| Sciences Po Paris | France | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.sciencespo.fr), no real per-course pages |
| Selkirk College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.selkirk.ca), no real per-course pages |
| Seneca Polytechnic | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.senecapolytechnic.ca), no real per-course pages |
| Sheridan College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.sheridan.ca/), no real per-course pages |
| Simon Fraser University | Canada | REAL | 139 | Wave 1 re-crawl (2026-07-07): SFU undergraduate A-Z program directory (https://www.sfu.ca/students/admission/programs/a-z.html), 208 candidate pages individually fetched and validated against each page's own "Degree:"/"Credential:" field (Bachelor/Certificate/Diploma only; Minor-only and 404 pages excluded) → 139 real per-program pages (e.g. https://www.sfu.ca/students/admission/programs/a-z/a/actuarial-science.html) |
| Singapore Institute of Management | Singapore | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.sim.edu.sg), no real per-course pages |
| Singapore Institute of Technology | Singapore | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.singaporetech.edu.sg), no real per-course pages |
| Singapore Management University | Singapore | CURATED | 42 | All 42 courses share one bare-homepage URL (https://www.smu.edu.sg), no real per-course pages |
| Singapore University of Technology & Design | Singapore | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.sutd.edu.sg), no real per-course pages |
| Sorbonne University | France | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.sorbonne-universite.fr), no real per-course pages |
| South East Technological University | Ireland | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Southern Cross University | Australia | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| St. Clair College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.stclaircollege.ca), no real per-course pages |
| St. Lawrence College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.stlawrencecollege.ca), no real per-course pages |
| St. Thomas University | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.stu.ca), no real per-course pages |
| Staffordshire University | UK | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Stanford University | USA | CURATED | 62 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Stevens Institute of Technology | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Stockholm School of Economics | Sweden | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Stockholm University | Sweden | CURATED | 45 | Header explicitly says curated/estimated/placeholder |
| Stony Brook University | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Swansea University | UK | REAL | 95 | Crawl header (sitemap/Puppeteer/CDX mention) + all 95 courses deep-linked (e.g. https://www.swansea.ac.uk/postgraduate/taught/aerospace-civil-electrical-mechanical-engineering/aerospace/msc-aerospace-engineering/) |
| Swedish University of Agricultural Sciences | Sweden | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.slu.se), no real per-course pages |
| Swinburne University of Technology | Australia | MIXED | 45 | 13% deep-linked, 87% bare-homepage stub — partially real |
| Technical University of Berlin | Germany | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Technical University of Denmark | Denmark | CURATED | 36 | All 36 courses share one bare-homepage URL (https://www.dtu.dk), no real per-course pages |
| Technical University of Munich | Germany | REAL | 193 | No header, but all 193 courses have unique deep institution URLs (e.g. https://www.tum.de/en/studies/degree-programs/detail/ai-in-biomedicine-master-of-science-msc), non-templated count |
| Technological University Dublin | Ireland | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.tudublin.ie), no real per-course pages |
| Teesside University | UK | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Temple University | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Texas A&M University | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Think Education | Australia | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Thompson Rivers University | Canada | CURATED | 40 | All 40 courses share one bare-homepage URL (https://www.tru.ca/), no real per-course pages |
| Tilburg University | Netherlands | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.tilburguniversity.edu), no real per-course pages |
| Toronto Metropolitan University | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.torontomu.ca), no real per-course pages |
| Torrens University Australia | Australia | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Trent University | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.trent.ca/), no real per-course pages |
| Trinity College Dublin | Ireland | REAL | 465 | Crawl header (sitemap/Puppeteer/CDX mention) + all 465 courses deep-linked (e.g. https://www.tcd.ie/courses/undergraduate/courses/acting/) |
| TU Dresden | Germany | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Tufts University | USA | CURATED | 50 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| UAE University | UAE | CURATED | 37 | All 37 courses share one bare-homepage URL (https://www.uaeu.ac.ae), no real per-course pages |
| UC Davis | USA | REAL | 100 | No header, but all 100 courses have unique deep institution URLs (e.g. https://grad.ucdavis.edu/programs/gach), non-templated count |
| UC San Diego | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| UC Santa Barbara | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| UCN University College | Denmark | CURATED | 43 | All 43 courses share one bare-homepage URL (https://www.ucn.dk), no real per-course pages |
| Umeå University | Sweden | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.umu.se), no real per-course pages |
| UNC Chapel Hill | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Università Cattolica del Sacro Cuore | Italy | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.unicatt.it), no real per-course pages |
| Université de Moncton | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.umoncton.ca), no real per-course pages |
| University at Buffalo (SUNY) | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University Canada West | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.ucanwest.ca), no real per-course pages |
| University College Cork | Ireland | CURATED | 75 | Header explicitly says curated/estimated/placeholder |
| University College Dublin | Ireland | REAL | 87 | Crawl header (sitemap/Puppeteer/CDX mention) + all 87 courses deep-linked (e.g. https://hub.ucd.ie/usis/!W_HU_MENU.P_PUBLISH?p_tag=COURSE&PROG=BHAGR001) |
| University College London | UK | REAL | 400 | Crawl header (Source: Puppeteer crawl of https://www.ucl.ac.uk/prospective-students/graduate/taught-degrees) + all 400 courses deep-linked (e.g. https://www.ucl.ac.uk/prospective-students/graduate/taught-degrees/advanced-audiology-msc) |
| University of Aberdeen | UK | CURATED | 30 | Header explicitly says curated/estimated/placeholder |
| University of Adelaide | Australia | REAL | 523 | Crawl header (sitemap/Puppeteer/CDX mention) + all 523 courses deep-linked (e.g. https://adelaide.edu.au/study/degrees/bachelor-of-food-and-nutrition-science-honours/) |
| University of Alberta | Canada | CURATED | 91 | All 91 courses share one bare-homepage URL (https://www.ualberta.ca), no real per-course pages |
| University of Amsterdam | Netherlands | REAL | 169 | No header, but all 169 courses have unique deep institution URLs (e.g. https://www.uva.nl/en/programmes/masters/chemistry-molecular-sciences/), non-templated count |
| University of Arizona | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Auckland | New Zealand | REAL | 527 | Crawl header (sitemap/Puppeteer/CDX mention) + all 527 courses deep-linked (e.g. https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/bachelor-of-architectural-studies-bas.html) |
| University of Barcelona | Spain | CURATED | 53 | Header explicitly says curated/estimated/placeholder |
| University of Bath | UK | REAL | 701 | Crawl header (Source: Sitemap crawl of https://www.bath.ac.uk/sitemap.xml) + all 701 courses deep-linked (e.g. https://www.bath.ac.uk/courses/undergraduate-2027/integrated-mechanical-and-electrical-engineering/beng-integrated-mechanical-and-electrical-engineering/) |
| University of Bedfordshire | UK | CURATED | 30 | Header explicitly says curated/estimated/placeholder |
| University of Birmingham | UK | REAL | 603 | Wave 2 re-crawl (2026-07-08): official sitemap (https://www.birmingham.ac.uk/study/sitemap.xml), course URLs under /study/{undergraduate,postgraduate}/subjects/ filtered to a degree-suffix whitelist (BA/BSc/BEng/MEng/MSci/MSc/MA/MRes/LLB/LLM/PhD/PGCert/PGDip), every page fetched and its real H1 title used as the course name (e.g. https://www.birmingham.ac.uk/study/postgraduate/subjects/accounting-and-finance-courses/accounting-and-finance-msc) |
| University of Bologna | Italy | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.unibo.it), no real per-course pages |
| University of Bonn | Germany | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Bordeaux | France | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.u-bordeaux.fr), no real per-course pages |
| University of Bradford | UK | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Bridgeport | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Brighton | UK | CURATED | 142 | Header explicitly says curated/estimated/placeholder |
| University of Bristol | UK | REAL | 155 | Crawl header (sitemap/Puppeteer/CDX mention) + all 155 courses deep-linked (e.g. https://www.bristol.ac.uk/study/postgraduate/taught/study-online/) |
| University of British Columbia | Canada | MIXED | 234 | 95% deep-linked, 5% bare-homepage stub — partially real |
| University of Calgary | Canada | REAL | 97 | Crawl header (sitemap/Puppeteer/CDX mention) + all 97 courses deep-linked (e.g. https://grad.ucalgary.ca/future-students/graduate/discover-opportunities/explore-programs/archaeology-phd) |
| University of California Los Angeles | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of California, Berkeley | USA | CURATED | 50 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Canberra | Australia | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.canberra.edu.au), no real per-course pages |
| University of Canterbury | New Zealand | CURATED | 43 | Header explicitly says curated/estimated/placeholder |
| University of Central Lancashire | UK | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Cincinnati | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Cologne | Germany | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Colorado Boulder | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Connecticut | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Copenhagen | Denmark | REAL | 136 | Crawl header (sitemap/Puppeteer/CDX mention) + all 136 courses deep-linked (e.g. https://www.ku.dk/studies/masters/actuarial-mathematics) |
| University of Dayton | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Delaware | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Derby | UK | REAL | 48 | Crawl header (sitemap/Puppeteer/CDX mention) + all 48 courses deep-linked (e.g. https://www.derby.ac.uk/study/postgraduate-courses/mba/) |
| University of Dundee | UK | REAL | 176 | No header, but all 176 courses have unique deep institution URLs (e.g. https://www.dundee.ac.uk/postgraduate/academic-practice-higher-education), non-templated count |
| University of East Anglia | UK | REAL | 45 | Crawl header (sitemap/Puppeteer/CDX mention) + all 45 courses deep-linked (e.g. https://www.uea.ac.uk/study/postgraduate-courses/mba) |
| University of East London | UK | REAL | 159 | No header, but all 159 courses have unique deep institution URLs (e.g. https://www.uel.ac.uk/postgraduate/courses/msc-clinical-exercise-physiology), non-templated count |
| University of Edinburgh | UK | REAL | 629 | Crawl header (Source: Puppeteer crawl of https://study.ed.ac.uk/programmes/postgraduate-taught-a-z) + all 629 courses deep-linked (e.g. https://study.ed.ac.uk/programmes/postgraduate-taught/1126-accounting-and-financial-management) |
| University of Essex | UK | CURATED | 47 | Header explicitly says curated/estimated/placeholder |
| University of Exeter | UK | REAL | 394 | Crawl header (sitemap/Puppeteer/CDX mention) + all 394 courses deep-linked (e.g. https://www.exeter.ac.uk/masters-degrees/#main-col) |
| University of Florence | Italy | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.unifi.it), no real per-course pages |
| University of Florida | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Galway | Ireland | CURATED | 45 | Header explicitly says curated/estimated/placeholder |
| University of Glasgow | UK | REAL | 282 | Crawl header (Source: Puppeteer crawl of https://www.gla.ac.uk/postgraduate/taught/) + all 282 courses deep-linked (e.g. https://www.gla.ac.uk/postgraduate/taught/academicpractice/) |
| University of Gloucestershire | UK | REAL | 45 | Crawl header (sitemap/Puppeteer/CDX mention) + all 45 courses deep-linked (e.g. https://www.glos.ac.uk/courses/postgraduate/mba/) |
| University of Gothenburg | Sweden | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.gu.se), no real per-course pages |
| University of Granada | Spain | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.ugr.es), no real per-course pages |
| University of Greenwich | UK | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Grenoble Alpes | France | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.univ-grenoble-alpes.fr), no real per-course pages |
| University of Groningen | Netherlands | REAL | 355 | Crawl header (sitemap/Puppeteer/CDX mention) + all 355 courses deep-linked (e.g. https://www.rug.nl/masters/accountancy-and-controlling/) |
| University of Guelph | Canada | MIXED | 45 | 7% deep-linked, 93% bare-homepage stub — partially real |
| University of Hamburg | Germany | REAL | 46 | No header, but all 46 courses have unique deep institution URLs (e.g. https://www.uni-hamburg.de/en/campuscenter/studienangebot/studiengang.html?1525352964), non-templated count |
| University of Hertfordshire | UK | REAL | 45 | Crawl header (sitemap/Puppeteer/CDX mention) + all 45 courses deep-linked (e.g. https://www.herts.ac.uk/courses/msc-computer-science) |
| University of Huddersfield | UK | CURATED | 30 | Header explicitly says curated/estimated/placeholder |
| University of Illinois Urbana-Champaign | USA | REAL | 133 | Crawl header (sitemap/Puppeteer/CDX mention) + all 133 courses deep-linked (e.g. https://grad.illinois.edu/admissions/programs/biosciences-comparative) |
| University of Kent | UK | CURATED | 52 | Header explicitly says curated/estimated/placeholder |
| University of Leeds | UK | REAL | 589 | Wave 2 re-crawl (2026-07-08): official course-search results (https://courses.leeds.ac.uk/course-search/undergraduate-courses and /masters-courses), paginated through all 21 UG + 19 PG result pages; every course has a real courses.leeds.ac.uk page URL and a real scraped duration (not estimated), e.g. https://courses.leeds.ac.uk/f834/accounting-and-finance-bsc |
| University of Leicester | UK | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Lethbridge | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.ulethbridge.ca), no real per-course pages |
| University of Limerick | Ireland | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Lincoln | UK | CURATED | 30 | Header explicitly says curated/estimated/placeholder |
| University of Lyon | France | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.univ-lyon1.fr), no real per-course pages |
| University of Manchester | UK | REAL | 263 | Crawl header (Source: Puppeteer crawl of https://www.manchester.ac.uk/study/masters/courses/list/) + all 263 courses deep-linked (e.g. https://www.manchester.ac.uk/study/masters/courses/list/10867/msc-accounting/) |
| University of Manitoba | Canada | REAL | 340 | Wave 1 re-crawl (2026-07-07): superseded the old MIXED file (whose "real" 9% was actually a shared /asper subsection homepage, not real per-course pages). Re-crawled from the official CourseLeaf academic catalogue A-Z index (https://catalog.umanitoba.ca/azindex/), 627 candidates filtered to 340 by degree-keyword whitelist (Bachelor/Honours/B.Sc/B.A/B.Comm/Master/PhD/Diploma/Certificate; Minor-only and subject-code course-description entries excluded), every URL verified to resolve with real content (e.g. https://catalog.umanitoba.ca/undergraduate-studies/management-business/accounting-bcomm-honours/) |
| University of Mannheim | Germany | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Maryland | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Melbourne | Australia | REAL | 463 | Crawl header (sitemap/Puppeteer/CDX mention) + all 463 courses deep-linked (e.g. https://study.unimelb.edu.au/find/courses/graduate/juris-doctor/) |
| University of Michigan | USA | CURATED | 105 | All 105 courses share one bare-homepage URL (https://www.umich.edu), no real per-course pages |
| University of Milan | Italy | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.unimi.it), no real per-course pages |
| University of Minnesota | USA | CURATED | 30 | Header explicitly says curated/estimated/placeholder |
| University of Montpellier | France | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.umontpellier.fr), no real per-course pages |
| University of Naples Federico II | Italy | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.unina.it), no real per-course pages |
| University of Navarra | Spain | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.unav.edu), no real per-course pages |
| University of New Brunswick | Canada | CURATED | 43 | All 43 courses share one bare-homepage URL (https://www.unb.ca), no real per-course pages |
| University of New England | Australia | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of New South Wales | Australia | CURATED | 108 | All 108 courses share one bare-homepage URL (https://www.unsw.edu.au), no real per-course pages |
| University of Newcastle | Australia | CURATED | 57 | All 57 courses share one bare-homepage URL (https://www.newcastle.edu.au), no real per-course pages |
| University of Northern British Columbia | Canada | CURATED | 40 | All 40 courses share one bare-homepage URL (https://www.unbc.ca/), no real per-course pages |
| University of Notre Dame | USA | CURATED | 62 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Nottingham | UK | CURATED | 61 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Otago | New Zealand | REAL | 74 | Crawl header (sitemap/Puppeteer/CDX mention) + all 74 courses deep-linked (e.g. https://www.otago.ac.nz/healthsciences/programmes/otago810003.html) |
| University of Ottawa | Canada | REAL | 492 | Wave 1 re-crawl (2026-07-07): official CourseLeaf academic catalogue A-Z index (https://catalogue.uottawa.ca/azindex/), 700 candidates filtered to 492 by degree-keyword whitelist (Bachelor/Honours/BASc/BSc/BA/BSocSc/Juris Doctor/Master/Doctorate/Diploma/Certificate; Minor/Major/Microprogram and subject-code course listings excluded), every URL verified to resolve with real content (e.g. https://catalogue.uottawa.ca/en/undergrad/bachelor-fine-arts-bfa/) |
| University of Oxford | UK | UNSURE | 0 | Not registered in REGISTRY — no course data served |
| University of Padua | Italy | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.unipd.it), no real per-course pages |
| University of Paris-Saclay | France | CURATED | 47 | All 47 courses share one bare-homepage URL (https://www.universite-paris-saclay.fr), no real per-course pages |
| University of Pennsylvania | USA | CURATED | 62 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Pisa | Italy | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.unipi.it), no real per-course pages |
| University of Pittsburgh | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Plymouth | UK | CURATED | 30 | Header explicitly says curated/estimated/placeholder |
| University of Portsmouth | UK | REAL | 178 | Crawl header (Source: https://www.port.ac.uk/sitemap.xml (pages 1-4, /study/courses/postgraduate-taught/*)) + all 178 courses deep-linked (e.g. https://www.port.ac.uk/study/courses/postgraduate-taught/ma-applied-linguistics-and-tesol-with-professional-experience) |
| University of Prince Edward Island | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.upei.ca), no real per-course pages |
| University of Queensland | Australia | REAL | 120 | Crawl header (sitemap/Puppeteer/CDX mention) + all 120 courses deep-linked (e.g. https://study.uq.edu.au/study-options/programs/diploma-languages-1602/ancient-greek-ancgra1602) |
| University of Reading | UK | REAL | 130 | Crawl header (sitemap/Puppeteer/CDX mention) + all 130 courses deep-linked (e.g. https://www.reading.ac.uk/ready-to-study/study/2026/accounting-ug) |
| University of Regina | Canada | CURATED | 69 | All 69 courses share one bare-homepage URL (https://www.ur.ca/), no real per-course pages |
| University of Rochester | USA | CURATED | 50 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Roehampton | UK | REAL | 33 | Crawl header (sitemap/Puppeteer/CDX mention) + all 33 courses deep-linked (e.g. https://www.roehampton.ac.uk/postgraduate-courses/mba-business-administration) |
| University of Salamanca | Spain | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.usal.es), no real per-course pages |
| University of Salford | UK | CURATED | 127 | Header explicitly says curated/estimated/placeholder |
| University of Saskatchewan | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.usask.ca), no real per-course pages |
| University of Seville | Spain | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.us.es), no real per-course pages |
| University of Sharjah | UAE | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.sharjah.ac.ae), no real per-course pages |
| University of Sheffield | UK | REAL | 127 | Crawl header (sitemap/Puppeteer/CDX mention) + all 127 courses deep-linked (e.g. https://sheffield.ac.uk/postgraduate/taught/courses/2026/applied-linguistics-and-tesol-ma). Re-verified in Wave 2 (2026-07-08): still 127/127 unique deep-linked URLs, spot-checked live 200s — no re-crawl needed, classification confirmed correct |
| University of South Australia | Australia | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of South Wales | UK | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Southampton | UK | REAL | 472 | Crawl header (Source: Sitemap crawl of https://www.southampton.ac.uk/sitemap.xml) + all 472 courses deep-linked (e.g. https://www.southampton.ac.uk/courses/accounting-finance-degree-bsc) |
| University of Southern California | USA | CURATED | 50 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Southern Denmark | Denmark | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.sdu.dk), no real per-course pages |
| University of Southern Queensland | Australia | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Stirling | UK | CURATED | 30 | Header explicitly says curated/estimated/placeholder |
| University of Strasbourg | France | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.unistra.fr), no real per-course pages |
| University of Strathclyde | UK | REAL | 561 | Crawl header (sitemap/Puppeteer/CDX mention) + all 561 courses deep-linked (e.g. https://www.strath.ac.uk/courses/undergraduate/psychologyimu/) |
| University of Stuttgart | Germany | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Suffolk | UK | REAL | 40 | Crawl header (sitemap/Puppeteer/CDX mention) + all 40 courses deep-linked (e.g. https://www.uos.ac.uk/courses/pg/master-business-administration) |
| University of Sunderland | UK | REAL | 80 | Crawl header (sitemap/Puppeteer/CDX mention) + all 80 courses deep-linked (e.g. https://www.sunderland.ac.uk/postgraduate/llm-commercial-law-international-trade) |
| University of Surrey | UK | REAL | 173 | Crawl header (sitemap/Puppeteer/CDX mention) + all 173 courses deep-linked (e.g. https://www.surrey.ac.uk/postgraduate/education-online-ma) |
| University of Sussex | UK | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Sydney | Australia | REAL | 514 | Crawl header (sitemap/Puppeteer/CDX mention) + all 514 courses deep-linked (e.g. https://www.sydney.edu.au/courses/courses/pc/master-of-professional-engineering-accelerated-biomedical.html) |
| University of Tasmania | Australia | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Technology Sydney | Australia | REAL | 369 | No header, but all 369 courses have unique deep institution URLs (e.g. https://www.uts.edu.au/courses/graduate-certificate-in-pharmacist-prescribing), non-templated count |
| University of Texas Austin | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of the Arts London | UK | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of the Sunshine Coast | Australia | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of the West of England | UK | REAL | 41 | No header, but all 41 courses have unique deep institution URLs (e.g. https://www.uwe.ac.uk/courses/business-and-law/postgraduate/master-of-business-administration-mba), non-templated count |
| University of Toronto | Canada | REAL | 248 | Crawl header (Source: Puppeteer crawl of https://sgs.calendar.utoronto.ca/graduate-programs-at-a-glance) + all 248 courses deep-linked (e.g. https://sgs.calendar.utoronto.ca/degree/Aerospace-Studies) |
| University of Toulouse | France | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.ut-capitole.fr), no real per-course pages |
| University of Trento | Italy | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.unitn.it), no real per-course pages |
| University of Turin | Italy | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.unito.it), no real per-course pages |
| University of Twente | Netherlands | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.utwente.nl), no real per-course pages |
| University of Utah | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Valencia | Spain | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.uv.es), no real per-course pages |
| University of Victoria | Canada | MIXED | 45 | 9% deep-linked, 91% bare-homepage stub — partially real |
| University of Waikato | New Zealand | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Warwick | UK | REAL | 208 | No header, but all 208 courses have unique deep institution URLs (e.g. https://warwick.ac.uk/study/postgraduate/courses-2023/accountingandfinance), non-templated count |
| University of Washington | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Waterloo | Canada | REAL | 92 | Crawl header (Source: Puppeteer crawl of https://uwaterloo.ca/graduate-studies-postdoctoral-affairs/future-students/programs) + all 92 courses deep-linked (e.g. https://uwaterloo.ca/future-graduate-students/programs/by-faculty/math/actuarial-science-master-math-mmath) |
| University of West London | UK | REAL | 45 | Crawl header (sitemap/Puppeteer/CDX mention) + all 45 courses deep-linked (e.g. https://www.uwl.ac.uk/courses/postgraduate-study/business/mba) |
| University of Western Australia | Australia | CURATED | 44 | Header explicitly says curated/estimated/placeholder |
| University of Windsor | Canada | CURATED | 50 | All 50 courses share one bare-homepage URL (https://www.windsor.ca/), no real per-course pages |
| University of Winnipeg | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.uwinnipeg.ca), no real per-course pages |
| University of Wisconsin–Madison | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Wollongong in Dubai | UAE | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.uowdubai.ac.ae), no real per-course pages |
| University of Wolverhampton | UK | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of Worcester | UK | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| University of York | UK | REAL | 218 | No header, but all 218 courses have unique deep institution URLs (e.g. https://www.york.ac.uk/study/postgraduate-taught/courses/msc-accounting-finance/), non-templated count |
| Uppsala University | Sweden | REAL | 112 | No header, but all 112 courses have unique deep institution URLs (e.g. https://www.uu.se/en/study/programme/international-masters-programme-innovative-medicine), non-templated count |
| Utrecht University | Netherlands | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.uu.nl), no real per-course pages |
| Vancouver Community College | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.vcc.ca), no real per-course pages |
| Vancouver Island University | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.viu.ca), no real per-course pages |
| Vanderbilt University | USA | CURATED | 62 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| VIA University College | Denmark | CURATED | 45 | All 45 courses share one bare-homepage URL (https://en.via.dk), no real per-course pages |
| Victoria University of Wellington | New Zealand | REAL | 150 | No header, but all 150 courses have unique deep institution URLs (e.g. https://www.wgtn.ac.nz/explore/degrees/architectural-studies/overview), non-templated count |
| Victoria University Sydney | Australia | REAL | 342 | No header, but all 342 courses have unique deep institution URLs (e.g. https://www.vu.edu.au/courses/certificate-iv-in-tertiary-preparation-22582vic), non-templated count |
| Virginia Tech | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Vrije Universiteit Amsterdam | Netherlands | REAL | 133 | No header, but all 133 courses have unique deep institution URLs (e.g. https://vu.nl/en/education/master/transport-and-network-economics), non-templated count |
| Wageningen University & Research | Netherlands | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.wur.nl), no real per-course pages |
| Webster University | USA | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.webster.ac.ae), no real per-course pages |
| Western Sydney University | Australia | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Western University | Canada | CURATED | 80 | All 80 courses share one bare-homepage URL (https://www.uwo.ca), no real per-course pages |
| Wilfrid Laurier University | Canada | CURATED | 45 | All 45 courses share one bare-homepage URL (https://www.wlu.ca), no real per-course pages |
| Worcester Polytechnic Institute | USA | CURATED | 45 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| Yale University | USA | CURATED | 62 | Identical course-name list shared with other unrelated universities — generic template, not institution-specific |
| York University | Canada | CURATED | 44 | All 44 courses share one bare-homepage URL (https://www.yorku.ca), no real per-course pages |
| Zealand Institute of Business and Technology | Denmark | CURATED | 40 | All 40 courses share one bare-homepage URL (https://www.zealand.dk), no real per-course pages |
