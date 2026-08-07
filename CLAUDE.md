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
