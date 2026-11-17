# Final responsibilities and defense guide

The Final implementation is organized into 15 meaningful commits after the
Endterm commit `351c2a1`: five per assigned module owner. It was developed with
OpenAI ChatGPT / Codex assistance. The author allocation records responsibility
for reviewing, understanding and presenting each module; it does not claim
unaided authorship. Earlier Midterm and Endterm contributions are preserved.

## Bakhtiyar Koishin — Koishin04

Owns the exercise catalog on Memberships.

| Commit topic | Files to study | What to demonstrate |
|---|---|---|
| Catalog structure and responsive controls | `memberships.html`, `css/final.css` | Search, body-area selector, results and loading/error regions |
| wger fetch, JSON and cards | `js/exercises.js` | Public endpoints, English translations, card construction and attribution |
| Combined search and category filtering | `js/exercises.js` | A search and a category apply together to loaded exercises |
| Pagination and duplicate removal | `js/exercises.js` | Next-page URL, appending records and deduplication by ID |
| HTTP, response and timeout handling | `js/exercises.js` | `response.ok`, result validation, AbortController, retry and preserved results |

Be ready to explain `async`/`await`, `fetch()`, `response.json()`, `filter()`,
`Map`, `textContent` and `try`/`catch`/`finally`. Search covers loaded English
exercises, not the whole remote database. The API catalog is separate from the
editable gym-program array in `js/script.js`.

Suggested demo: open Memberships, enter a query, choose a matching body area,
clear filters, load another page and open an exercise's source/license details.

## Aldiyar Zhurek — savitarwtf-prog

Owns the shared theme and demo sign-in.

| Commit topic | Files to study | What to demonstrate |
|---|---|---|
| Theme controls and shared styling | `js/theme.js`, `css/final.css`, all five HTML pages | Root `data-theme` and the shared header button |
| Theme persistence and tab synchronization | `js/theme.js` | `gymTheme`, refresh, navigation and the `storage` event |
| Sign-in dialog and live validation | `js/auth.js`, all five HTML pages | Name, sample-email and password rules, messages and focus |
| Saved session and sign-out | `js/auth.js` | Store only `{signedIn: true, name}`, restore the greeting and remove `gymSession` |
| Session synchronization across tabs | `js/auth.js` | Sign-in/sign-out updates other open tabs |

Be ready to explain DOMContentLoaded, event listeners, localStorage,
JSON serialization, validation and accessible dialog behavior. Theme code runs
early to apply the saved choice before painting. This is a frontend demo:
credentials are not verified, sent or saved. Sign-out preserves `gymTheme`
and `gymPrograms`; it does not call `localStorage.clear()`.

Suggested demo: change the theme, refresh, navigate, submit invalid sign-in
input, sign in with sample values, open another tab and sign out.

## Kaisar Ashymbai — ashimbaykaisar00-ui

Owns the FAQ, bundled resources and project documentation.

| Commit topic | Files to study | What to demonstrate |
|---|---|---|
| Six animated FAQ answers | `about.html`, `js/faq.js`, `css/final.css` | A question toggles its associated answer with `.slideToggle()` |
| Indicators and accessibility | `js/faq.js` | Plus/minus, `aria-expanded`, `.stop(true, true)` and reduced motion |
| Local resource bundling | HTML pages, `css/fonts.css`, `fonts/`, `images/`, `js/jquery-3.7.1.min.js` | Local file paths and retained license notices |
| AI/resource credits and README | HTML footers, `docs/ASSETS.md`, `README.md` | Attribution, project links and feature descriptions |
| Report and team guide | `docs/Final_Project_Report.docx`, `docs/TEAM.md` | Requirements, screenshots, responsibilities and submission details |

Be ready to explain jQuery selectors, click handlers, `aria-controls`, animation
queues and `prefers-reduced-motion`. Bundled files make the static UI independent
of third-party asset CDNs; the live wger catalog still requires internet.
Do not study minified vendor source line by line: understand how it is included
and used by the project.

Suggested demo: open and close an FAQ answer, show its indicator and accessibility
state, then point to the asset credits and report.

## Shared preparation and submission

Each member should understand navigation, script loading and the retained
Endterm features in `js/script.js`: shared-array search/CRUD, local persistence,
registration validation and gallery lightbox.

For the three-minute group presentation, allow roughly one minute per assigned
Final module. Prepare for the individual questions and live changes by tracing
the relevant event handler, state update and DOM update in the source.

Each member must individually submit the deployed website and repository links
to LMS. The team-reported deadline is 18 November 2026 at 00:00 Asia/Oral (UTC+5).
Publishing on GitHub does not submit work to LMS. Do not add commits after the
deadline. The five-per-person count applies to the rewritten Final block only;
the repository's full contribution totals include older history.
