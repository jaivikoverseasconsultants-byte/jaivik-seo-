## URL Stability Rule (added Aug 2026, after a redirect-gap incident)

Any change to this codebase that alters a live, previously-deployed URL — including
but not limited to: course/university slug renames, route restructuring, removing a
data entry that has an existing page, or changing URL patterns — MUST include a
corresponding 301 redirect in vercel.json in the SAME commit. This is not optional
and not a follow-up task.

Context: In July 2026, a course-data migration (replacing fabricated placeholder
course data with real crawled data) changed slugs for hundreds of course URLs with
no redirects added at the time. This caused previously-indexed Google Search Console
pages to 404, tanking organic search performance for weeks before being caught and
fixed retroactively.

Rules going forward:
1. Before merging any change that removes, renames, or restructures a URL that could
   already be live/indexed, check: does an old URL need a redirect to a new one?
2. If yes, add the redirect to vercel.json (NOT next.config.mjs — redirects there are
   silent no-ops in this project's Vercel production setup, per the 2026-07-16
   incident, commit 04863b96).
3. If a course/page is being removed with no direct replacement, do NOT redirect to
   an unrelated page (soft-404 pattern, discouraged by Google) — leave it as a natural
   404 unless a genuine equivalent exists.
4. When in doubt about whether a URL was ever live/indexed, check Google Search
   Console via the wp_gsc_inspect_url tool before deciding.

## Content Completeness Bar (added Oct 2026, founder directive)

The portal's standing mandate, in the founder's own words: "not average, not good,
just best in all" — for years to come, not just this quarter. Concretely:

Every course/university page must be a self-sufficient, real-time answer to every
question a student actually searches about that course — not a pointer that sends
the student to "check the official site" or to a partner platform. The test: if a
source we draw on (a university's own site, KC/coursefinder.ai, any competitor
portal) shows a piece of information about a course, our page must show it too,
usually alongside more context (INR conversion, comparison to similar courses,
counselling CTA) — never less. A page that is a strict subset of what one visible
source already shows is a liability: there is no reason for a student, or Google,
to prefer it.

Why this matters commercially, not just for SEO: a page that actually answers the
student's question (fee, eligibility, deadline, visa outlook) converts that student
into a lead right there, and a site that consistently resolves real student queries
earns Google's trust as an authority — both compound over years. A page that just
says "go check elsewhere" does neither.

Concretely, a course page is expected to carry, whenever the data exists anywhere
reachable: course name, fee (with INR/USD conversion), average scholarship, initial
deposit, intake months, duration, CRICOS/registration status, academic eligibility
(board-wise minimum — CBSE/ICSE/state boards — not just a generic "good academic
record" line), English-language test cutoffs (IELTS/PTE/TOEFL), post-study-work /
visa eligibility (correctly gated — see pswEligible below), and the university's own
course-page link.

This does NOT relax the data-integrity rules elsewhere in this file or in the
codebase's own conventions (feeVerified, pswEligible, CRICOS-never-fabricated). When
a field is genuinely unavailable from any accessible source, the fix is never to
invent a plausible-looking number — it's to say so honestly and route the student to
a free counselling session to get it confirmed (the existing feeDisplay()/
isFeeVerified() "On request" + counselling-CTA pattern is the model to extend to
every other field, e.g. eligibility criteria, as that data becomes available).
Fabricated eligibility percentages or CRICOS numbers are worse than a missing field:
they can get a real student's application wrongly accepted or rejected.

Before marking any university/course-data task "done," check it against this bar,
not just against whether the page renders: would a student searching for this course
find their actual question answered here, or would they still need to leave and
search again?
