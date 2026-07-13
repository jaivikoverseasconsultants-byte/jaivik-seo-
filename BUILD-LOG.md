# BUILD-LOG.md

Living status record for the Jaivik Overseas SEO portal (`study.jaivikoverseasconsultants.com`).
**Read this before starting any new task.** It exists so a new session doesn't re-discover
what's already built, already broken, or already tried and abandoned.

**Rule: update this file at the end of every task** — add/change rows, move things between
"Done" and "Known broken", note new data waves, note new constraints learned the hard way.

Last updated: 2026-07-13.

---

## 1. Portal features

| Feature | Status | File location | Note |
|---|---|---|---|
| University profile pages | Done | `app/universities/[slug]/page.tsx` (single dynamic route, `generateStaticParams()` → ~476 slugs, all pre-rendered) | Not a runtime fallback — every slug is a real static page at build time. |
| University course listing | Done | `app/universities/<uni>/courses/page.tsx` (459 per-university folders) | One folder per university, imports its own `data/<uni>-courses.ts`. |
| University course detail pages | Done | `app/universities/<uni>/courses/[slug]/page.tsx` (132 of the 459 universities have real course data wired up) | Shared content via `components/CourseRichContent.tsx` + `components/CourseKeyFacts.tsx` (see "Course enrichment sections" below). Title/H1 pattern: `{Course} at {University} — Fees in INR, IELTS & Requirements for Indian Students`. |
| Course enrichment sections (Overview / Fees / Entry Req / PSW-PR / Career) | Done | `components/CourseKeyFacts.tsx`, `lib/course-sections.ts`, `lib/course-faqs.ts` | Real-data-only, each section skips itself if backing data is missing. Career Outcomes only renders if `getUniversityBySlug()` has `avgSalaryINR`/`avgSalaryUSD` (458/459 universities do). PSW/PR pathway covers Canada/Australia/UK/Ireland/Germany/NZ only — other countries skip silently. Added 2026-07-13. |
| FAQ system (FAQPage JSON-LD) | Done | `lib/course-faqs.ts` (`generateFaqs`), `components/CourseFaqSection.tsx` | 4-6 Q&As per course, computed only from real fields (tuition, IELTS, PSW visa rules, cost-of-living, salary payback). Verified rendering + valid JSON-LD on UK/Canada/Australia sample pages. |
| Course category pages | Done | `app/courses/[slug]/page.tsx`, `app/courses/category/[category]/page.tsx` | Generic "MBA Abroad" / category-level landing pages, separate from per-university course pages. |
| Live currency converter | Done | `components/CurrencyConverter.tsx` | Client-side, fetches `exchangerate-api.com`, falls back to a hardcoded rate table + "EST" badge if the fetch fails. Cached in `localStorage` 24h. |
| Cost calculator | Done (client-side) | `app/cost-calculator/page.tsx` | Hardcoded data tables, no network calls. |
| Cost of living guides | Done (client-side) | `app/cost-of-living/page.tsx`, `app/cost-of-living/[country]/page.tsx`, `data/cost-of-living.ts` | Static per-city breakdowns; feeds `lib/course-faqs.ts`'s cost-of-living FAQ too. |
| Eligibility checker | Done (client-side) | `app/eligibility-checker/page.tsx` | Pure client component, hardcoded `UNI_REQS` array, no backend. |
| Find My Course (quiz) | Partial | `app/find-my-course/page.tsx` → `CourseMatcherSimple` | Quiz UI works and filters static `universities` data client-side, but final submission posts to the dead `/api/course-matcher/submit` route (see §2) — completes with no error shown, but the lead never reaches a backend. |
| Course Finder (advanced) | Done (client-side) | `app/course-finder/page.tsx` → `AdvancedCourseFinderClient` | Filters static data client-side; no broken backend dependency. |
| Compare tool | Done | `app/compare/page.tsx` → `components/CompareClient.tsx` | Static comparison data; "unlock full comparison" lead form posts directly to Formspree — works. |
| Site search (header search bar) | **Broken** | `app/api/search/route.ts`, `components/HeroSearch.tsx` | See §2 — always returns empty results in production. |
| IELTS mock test | Partial | `app/mock-test/page.tsx`, `app/mock-test/[level]/[section]/page.tsx` | Reading/Listening/Speaking scoring is fully client-side and works. Writing-task scoring POSTs to the dead `/api/ielts-score` route (§2); falls back gracefully to a client-side heuristic (`estimateBandFromText`), so the UI never breaks, but it's not using the (intended) AI-scored path in production. |
| IELTS coaching page | Done | `app/ielts-coaching/page.tsx` | Static marketing/info content. |
| Lead capture (general) | Partial | `components/LeadForm.tsx` | Posts directly to Formspree (`https://formspree.io/f/xgoqzezk`) — this path works and is what's actually live. |
| Lead capture (API route) | **Dead code** | `app/api/lead/route.ts` | Firestore-write + Brevo email-sequence logic — not reachable under static export (POST routes aren't emitted to `out/`), and no component calls it. Safe to delete or to actually wire up if this path is ever wanted. |
| Course-matcher submit / IELTS-score APIs | **Dead code** | `app/api/course-matcher/submit/route.ts`, `app/api/ielts-score/route.ts` | Same static-export limitation as `/api/lead` — POST-only routes don't exist in the exported `out/` — but these ARE still called by client code (Find My Course, Writing scoring), which get silent 404s. |
| Student login / auth | Partial | `app/student-login/page.tsx` → `components/StudentLoginClient.tsx` | Password login + Register (email/password via Firebase Auth) work. OTP tab is non-functional in production — see §2. |
| Student dashboard (current) | Done | `app/dashboard/student/page.tsx` → `StudentDashboardNew` | Linked from `Navbar.tsx`; the live path. |
| Student dashboard (legacy, orphaned #1) | Dead / superseded | `app/dashboard/page.tsx` → old `StudentDashboard` component | Not linked in nav; distinct from `StudentDashboardNew`. Leftover from an earlier iteration. |
| Student portal (legacy, orphaned #2) | Dead / superseded | `app/student-portal/` (+`/dashboard`, `/verify`) → `StudentPortalClient.tsx` | Uses `localStorage`-based PIN login, not Firebase Auth. Not linked in nav, only reachable by direct URL. Pre-dates the current Firebase-based `student-login` flow. |
| Trainer dashboard | Done (duplicated route) | `app/dashboard/trainer/page.tsx` **and** `app/trainer-dashboard/page.tsx` | Both render the identical `TrainerDashboardClient` — harmless duplicate route, not a bug, just redundant; pick one and redirect the other if doing cleanup. |
| Firebase Cloud Function — auto-deactivation | Unconfirmed | `functions/src/index.ts` (`deactivateInactiveStudents`, scheduled) | Deactivates students after 5 days' inactivity. Cloud Functions (scheduled/`onSchedule`) require the Firebase **Blaze** plan. No evidence in-repo of whether Blaze is actually provisioned — verify in the Firebase console before assuming this runs. |
| Blog | Done | `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `data/blog-posts.ts` | Static posts. |
| Scholarships pages | Done | `app/scholarships/page.tsx`, `app/scholarships-and-low-budget-guide/page.tsx` | Static content. |
| Visa guide | Done | `app/visa-guide/page.tsx`, `app/visa-guide/[country]/page.tsx` | Static per-country content. |
| Book counselling | Done | `app/book-counselling/page.tsx` | Lead form → Formspree (same pattern as `LeadForm.tsx`). |

---

## 2. Known broken / incomplete

1. **Site search returns empty results in production.** `app/api/search/route.ts` has `export const dynamic = 'force-static'`. Under `output: 'export'`, that bakes **one** static JSON response at build time using an empty `q` param, landing in `out/api/search` as `{"courseAtUni":[],"categories":[],"unis":[],"countries":[],"total":0}`. Every runtime fetch from `components/HeroSearch.tsx` gets served this same frozen empty payload — the search dropdown never returns real results. **Fix requires either**: moving search to a client-side corpus (like Course Finder/Compare already do), or standing up a real serverless function outside the static export (Vercel Edge/API route without static export, or a separate backend).
2. **`/api/course-matcher/submit`, `/api/ielts-score`, `/api/lead` are unreachable under static export.** POST-only route handlers are not emitted into `out/` at all when `output: 'export'` is set. Client code still calls two of them:
   - `Find My Course` quiz submission → `/api/course-matcher/submit` (silent 404, lead is lost).
   - IELTS mock test Writing-task scoring → `/api/ielts-score` (silent 404, falls back to a client heuristic, so at least the UX doesn't break).
   - `/api/lead` (Firestore + Brevo) is not called by anything — pure dead code.
   All real lead capture in production actually goes through `components/LeadForm.tsx` posting directly to Formspree, which does work.
3. **OTP login tab is non-functional.** `StudentLoginClient.tsx`'s OTP tab uses Firebase `signInWithPhoneNumber` + `RecaptchaVerifier`. Real SMS delivery via Firebase Phone Auth requires the **Blaze (pay-as-you-go)** plan — the free Spark plan only allows a handful of allow-listed test numbers. No Blaze provisioning evidence found in-repo. Password login and Register tabs (email/password) are real and work.
4. **Three dashboard/portal implementations exist; two are dead.** `app/dashboard/page.tsx` (old `StudentDashboard`) and `app/student-portal/*` (`localStorage`-PIN based `StudentPortalClient`) are both superseded by the current Firebase-based `app/student-login` → `app/dashboard/student` flow. Not linked in nav, but still built and shipped — dead weight, not a live bug, but a source of confusion for future sessions. Safe cleanup candidate.
5. **Trainer dashboard has a duplicate route** (`app/dashboard/trainer` and `app/trainer-dashboard` both render the same client component). Harmless, just redundant.
6. **Fabricated IELTS section-wise scores on ~102 per-university `page.tsx` files** (pre-dates the 2026-07-13 course-enrichment work). The "English Language Requirements" grid on many pages shows hardcoded `sub:` hints like "No band below 5.5" / "Writing 21+" that are copy-pasted boilerplate, not real per-course section data. The shared `CourseKeyFacts.tsx`/FAQ components correctly label IELTS as "university's overall-band standard" without inventing section minimums — this issue is isolated to the older per-page grids and was intentionally left out of scope on 2026-07-13 (see `course-page-content-architecture` memory). If asked to audit data fabrication, start here.
7. **~115 uncommitted crawl/probe/gen scripts sitting in `scripts/`** as of 2026-07-13 (Kent, Essex, MMU, Newcastle, Swansea, QUB, RGU, Dundee, UIUC, Northeastern, Purdue, ASU, UTD, Cardiff, Brunel, Deakin, Curtin, Portsmouth, VUW, York, RHUL and more), plus an uncommitted deletion of `data/dmu-courses.ts` and an edited-but-uncommitted `scripts/crawl-batch2.js`. **None of these have produced any staged change to `data/*.ts` or `app/universities/*`** — treat this as an in-progress, not-yet-integrated crawl attempt (likely a "Wave 4"), not evidence that any of those universities' data has actually changed. Verify before building on top of it; don't assume the crawl succeeded just because the script exists. `qub-courses.ts` in particular is a known orphaned file (see `crawl-patterns` memory) — written but never wired into a registry/page.

---

## 3. Data status

Source of truth: **`DATA-AUDIT.md`** (root) — regenerate from source, don't hand-edit its classification table.

- **458 universities audited.** Classification (most-decisive rule wins): explicit "curated/estimated" wording, or a course-name list shared verbatim across 3+ unrelated universities, or 100% of course URLs collapsing to one bare homepage → **CURATED**. Crawl-provenance header + all URLs deep-linked (or no header but all URLs uniquely deep-linked and a non-template course count) → **REAL**. Mix of both in one file → **MIXED**. No registry entry / unverifiable → **UNSURE**.
- **Current counts** (as of Wave 3, 2026-07-09): **98 REAL**, 343 CURATED, 7 MIXED, 10 UNSURE. Only the 132 universities with real per-university `courses/[slug]/page.tsx` routes actually generate course detail pages — the remaining REAL/CURATED files may have data but no route yet.
- **Wave history:** Wave 1 (2026-07-07): +Simon Fraser, +Dalhousie, +University of Ottawa, +University of Manitoba. Wave 2 (2026-07-08): +Birmingham, +Leeds; corrected Griffith from a false-REAL (was 100% homepage-stub) to genuine REAL via its program REST API. Wave 3 (2026-07-09): +ANU, +Edith Cowan, +Massey; re-verified (no change needed) Queensland/Flinders/Suffolk.
- **Known WAF-blocked universities** (curated data is the deliberate choice, not a shortcut): Cardiff, Brunel, Deakin (AU), Curtin (AU), University of Otago (NZ), NTU Singapore. See `crawl-patterns` memory for the specific blocking behavior of each.
- **Possible Wave 4 in progress, uncommitted** — see §2 item 7. Do not treat as done.
- **Rule: a false REAL is worse than a false CURATED.** Every REAL classification requires a positive, checkable signal — never default a university to REAL without one.

---

## 4. Tech stack & constraints

- **Framework:** Next.js (App Router), TypeScript. **`next.config.mjs` has `output: 'export'` — this is mandatory, not optional.** Do not add ISR, `revalidate`, or any server-rendering feature without checking history first.
- **ISR ban:** ISR was tried for 447 stub universities to cut build time (commit `88665053`, 83% build-time reduction), then reverted to pure SSG (`9261fe49`), then explicitly re-pinned with a comment (`19ebb62b`: *"static export is mandatory (ISR causes account bans)"*). **Never re-introduce ISR on this project** — it has caused hosting account bans before. If build time becomes a problem again, solve it a different way (stub/prune pages, parallelize the build, etc.), not with ISR.
- **The BOM env-var lesson (verified 2026-07-06/07):** All six `NEXT_PUBLIC_FIREBASE_*` values in the **Vercel dashboard's Environment Variables** had a leading UTF-8 BOM (U+FEFF), pasted in from a Windows/Notepad source. Because `output: 'export'` inlines env vars into the client bundle at build time, the BOM landed directly in the shipped Firebase config strings. The corrupted `authDomain`/`apiKey` made the Firebase SDK throw synchronously during internal URL construction — **before any network request was ever sent** — which Firebase surfaced as a generic `auth/network-request-failed` on `/student-login`. Confirmed via headless network capture: zero `googleapis.com` requests were dispatched, which is what distinguished it from a real CSP/network block. **Fix:** re-type Vercel env var values by hand; never paste from Notepad or another Windows-saved text file. **Symptom to recognize this again:** an SDK-level auth error with literally zero outgoing network requests. (Separately, unrelated: 115/132 course-page `.tsx` source files carry a leading BOM — harmless, source-only, stripped by the bundler; a cosmetic cleanup candidate, not the same issue.)
- **Auth/DB:** Firebase Auth (email/password + phone/OTP) + Firestore, client SDK in `lib/firebase.ts`. CSP in `next.config.mjs` allowlists `*.googleapis.com`, `*.firebase.com`, `*.firebaseio.com`, `*.firebaseapp.com`. Cloud Functions live in `functions/` (Blaze-only — see §1).
- **Hosting:** **Vercel is the active deploy target** — confirmed via `.vercel/project.json` (`projectName: "jaivik-seo"`). `netlify.toml` and a "fix: add Netlify Next.js config" commit exist in history but appear to be an earlier/parallel attempt, not the current live host — don't assume Netlify is live without checking the Vercel dashboard first. `firebase.json` only configures Cloud Functions deployment (`firebase deploy --only functions`), not hosting.
- **TypeScript check at build:** `next.config.mjs` sets `typescript: { ignoreBuildErrors: true }` (added to avoid an OOM on Vercel during type-check — commit `d7d74b5d`). This means `npm run build` will **not** catch type errors — always run `npx tsc --noEmit` separately before pushing.
- **"No invented course data — ever" rule.** This is the single most load-bearing rule on this project. Every fee, IELTS score, visa-pathway detail, or salary figure shown to a student must trace back to a real field in a `data/*.ts` file or a verifiable, checkable computation over one (currency conversion, duration-based visa-length rules, etc.). When backing data is missing, the correct behavior is to **skip that section/fact entirely**, not to write a plausible-sounding placeholder, "varies", or generic industry-average number. See `DATA-AUDIT.md`'s REAL/CURATED classification and `lib/course-faqs.ts` / `lib/course-sections.ts` for the reference implementation of "real-data-only, skip-on-missing" content generation.

---

## 5. Deploy checklist

Run all of these before any push that touches `app/`, `components/`, `lib/`, or `data/`:

1. `npx tsc --noEmit` — must be clean. (Build-time type-check is disabled — see §4 — so this is the only type-safety gate.)
2. `npm run build` — full static export must succeed. This is a large static-export site (7000+ pages as of last count); expect several minutes.
3. **Headless HTML check** — since there's no dedicated script for this yet, grep the exported HTML directly in `out/<path>/<slug>.html` (flat files, not `<slug>/index.html`) for whatever the change was meant to add/fix, across at least 2-3 different countries if the change is country-sensitive. Any embedded `<script type="application/ld+json">` blocks should be extracted and `JSON.parse`'d to confirm they're valid, not just present. Note: React splits interpolated text across sibling nodes/HTML comments in the exported output — check for substrings with independent `.includes()` calls rather than one contiguous regex spanning a static heading + a JSX variable.
4. `node scripts/audit-broken-links.js` — must report 0 broken links (compares every university-profile course listing link against every `generateStaticParams()`-generated page).
5. Confirm the git diff/staged files are scoped to the actual change — this repo routinely has unrelated in-progress/uncommitted work sitting in the tree (see §2 item 7); never `git add -A`. Stage explicit file lists.
6. Push to `main` — Vercel auto-deploys from `main`.
7. **Update this file (`BUILD-LOG.md`)** with whatever changed: new/changed feature rows in §1, new bugs found in §2, new data waves in §3, new constraints learned in §4.
