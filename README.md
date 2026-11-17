# Fitness / Gym

A responsive five-page website for a fictional gym in Astana, Kazakhstan.
The Final Project extends the original Midterm and Endterm in the same repository.
It preserves the five pages, team, membership plans, CRUD and gallery, and adds
persistent themes, demo sign-in, an animated FAQ and a public exercise API.

- [Published website](https://koishin04.github.io/Fitness_Gym-Website/)
- [Project repository](https://github.com/Koishin04/Fitness_Gym-Website)

## Team

- Bakhtiyar Koishin — SE-2540
- Aldiyar Zhurek — SE-2540
- Kaisar Ashymbai — SE-2540

## Pages

| Page | Contents |
|---|---|
| Home | Gym introduction and links to the main sections |
| About | Gym information, features and six animated FAQ questions |
| Memberships | Plans, comparison, program search and CRUD, and the wger exercise catalog |
| Gallery | Responsive photo grid and interactive lightbox |
| Contact | Gym details and registration validation demo |

## Final Project features

- **Light/dark theme on every page:** header toggle, saved as `gymTheme`, restored
  before painting and synchronized across tabs. Storage failures show a notice.
- **Demo sign-in on every page:** display-name, sample-email and sample-password
  validation; `gymSession` stores only `{signedIn: true, name}`. A greeting and
  exercise shortcut appear after sign-in. Reloads and page navigation preserve
  the session. Sign-out removes only the session key. Passwords and emails are
  never saved or sent. This demonstrates browser state, not real authentication.
- **FAQ on About:** six questions, jQuery `.slideToggle()`, plus/minus indicators,
  `aria-expanded` and reduced-motion support.
- **Exercise API on Memberships:** live `fetch()` calls to the public wger API,
  JSON parsing and dynamically rendered exercise cards. Search names, equipment
  and muscles, combine with a body-area filter, clear filters, refresh, and load
  additional pages. Search applies to loaded English exercises (30 per request).
  Loading, empty, HTTP/network/JSON and timeout states are handled. A failed
  refresh preserves previously loaded data. API text is inserted with
  `textContent`; author/source/license credits are available per exercise.
- **Project report:** `docs/Final_Project_Report.docx` describes objectives,
  structure, implementation, development, contributions and verification,
  with screenshots, AI acknowledgement and project links.

API endpoints: `https://wger.de/api/v2/exerciseinfo/?limit=30&language=2`
and `https://wger.de/api/v2/license/?limit=100`. Public read access needs no
API key. [Official API documentation](https://wger.readthedocs.io/en/latest/api/api.html).
The exercise catalog requires a network connection and depends on wger availability.

## Retained Endterm features

### Registration validation — Contact

- Required name, email, password, password confirmation and message.
- Email checked with a regular expression; names support Unicode letters.
- Animated, colored password strength indicator: Weak, Medium or Strong.
- Minimum password length of 8 characters and matching confirmation.
- Immediate feedback during typing, with field highlights and accessible messages.
- Invalid submissions are prevented and focus moves to the first invalid field.
- Valid submissions show a success notice without reloading the page.

This is a frontend demonstration: no account is created, no form data or
password is sent or stored, and there is no backend or payment system.
The strength indicator is a simple demonstration, not a security guarantee.

### Dynamic search and filtering — Memberships

- Case-insensitive search over program names and descriptions as the user types.
- All, Strength, Cardio and Group category buttons, combined with the search term.
- Results, result count and empty-state messages update without a page reload.
- Search and CRUD use the same program array, so every change is reflected immediately.

### CRUD — Memberships

- Create programs with a name, category and description.
- Read records in the program table and search results.
- Edit existing programs in a modal dialog, with validation, Save and Cancel.
- Delete records only after confirmation.
- Store programs in `localStorage` under `gymPrograms` and restore them after reload.
- Keep an empty list empty; recover from invalid saved data using sample programs.
- Report when browser storage is unavailable.

Program changes belong to the current browser and website origin. They are
not shared with other users. The original membership pricing cards remain separate.

### Image gallery — Gallery

- Six stock photos in a responsive CSS Grid with Bootstrap cards.
- Click a photo to open a modal lightbox with its caption and image counter.
- Previous/Next buttons and left/right arrow keys cycle through all six photos.
- Close with the close button, Escape or the backdrop.
- Keyboard focus stays inside the dialog and returns to the selected photo on close.
- jQuery `fadeIn()` and `fadeOut()` effects; reduced-motion preferences are respected.

## Design and technologies

- HTML5 semantic structure, shared navigation and footer.
- CSS3, Flexbox, CSS Grid, CSS variables and responsive media queries.
- Bootstrap 5.3.8 stylesheet in `css/bootstrap.min.css`.
- JavaScript and bundled jQuery 3.7.1, with Endterm handlers in `js/script.js` and Final features in separate modules.
- Regular expressions, native HTML dialogs and `localStorage`.
- External styles in `css/style.css`, hover/focus states and alternating table rows.
- Locally bundled Manrope fonts and Unsplash photos; original source links in `docs/ASSETS.md`.
- Git, GitHub and GitHub Pages deployment from `main`.

## Individual contributions

| Member | Contribution |
|---|---|
| Bakhtiyar Koishin (`Koishin04`) | Project setup, shared styles, Home page, responsive navigation and deployment; integration of search with CRUD, persistent program table and modal editing; completed registration fixes, password indicator, working lightbox and README updates; Final responsibility: exercise API requests, JSON processing, search/filter integration, pagination and error handling. |
| Aldiyar Zhurek (`savitarwtf-prog`) | About and Memberships pages, membership cards/table layout, initial program search/filtering. Final responsibility: light/dark theme, sign-in form validation, persistence, sign-out and cross-tab state. |
| Kaisar Ashymbai (`ashimbaykaisar00-ui`) | Original Gallery and Contact pages, initial validation/gallery markup and Endterm documentation. Final responsibility: FAQ behavior/accessibility, bundled resources, credits, README and group report. |

The Endterm registration/lightbox fixes remain under Bakhtiyar Koishin.
The AI-assisted Final implementation is organized into 15 commits, five per
assigned module owner. This allocation records team responsibility; it does not
claim unaided authorship. Earlier Midterm/Endterm history is preserved.
See [Final responsibilities and defense guide](docs/TEAM.md).

## Run locally

Clone the repository and serve its root with any static web server. For example,
with Python installed:

```sh
git clone https://github.com/Koishin04/Fitness_Gym-Website.git
cd Fitness_Gym-Website
python -m http.server 8000
```

Open [the local website](http://localhost:8000). No build step or npm installation
is required. HTML, CSS, JavaScript, jQuery, fonts and static images are included.
Only the exercise API requires internet access. Use a current browser that
supports native HTML dialogs.

## Manual verification

1. On Contact, submit an empty form and check field errors. Try a malformed email,
   short password and mismatched confirmation. Then enter valid sample data and
   check the success notice. Change the password and check confirmation again.
2. On Memberships, add a program, search for it with different capitalization,
   combine the search with a category, edit it in the modal, and reload to check
   persistence. Verify both cancelling and confirming deletion.
3. On Gallery, open each photo, navigate past both ends, use arrow keys and Escape,
   and check that focus returns to the selected thumbnail.
4. Check all five pages at desktop and phone widths. The program table can scroll
   horizontally on small screens.

5. Switch the theme, refresh and visit another page. Sign in using a sample name,
   email and password (at least 8 characters); refresh and navigate to verify the
   greeting. Sign out and verify the theme and CRUD data remain unchanged.
6. On About, open and close each FAQ question with mouse and keyboard.
7. On Memberships, open the exercise catalog. Search `bench`, select Chest,
   load more, and clear filters. Disconnect the network and use Refresh to check
   the error; reconnect and retry. Exercise records remain separate from CRUD.

## Main source files

| File | Responsibility |
|---|---|
| `js/script.js` | Endterm CRUD/search, registration and lightbox |
| `js/theme.js` | Early theme restoration and toggle |
| `js/auth.js` | Demo sign-in validation, session and sign-out |
| `js/faq.js` | FAQ slide animation and indicator |
| `js/exercises.js` | API requests, filtering, rendering and error handling |
| `css/style.css` | Original shared design and Endterm styles |
| `css/final.css` | Dark theme and Final feature styles |

## Submission and defense

Each group member must individually submit both project links to LMS before
the deadline. The team-reported deadline is 18 November 2026 at 00:00
Asia/Oral (UTC+5). Do not make commits after the deadline.

The defense is six minutes: three minutes for the group presentation, followed
by one minute of individual questions per student. The contribution table
records implemented work; presentation roles do not change commit authorship.

## AI acknowledgement and asset credits

OpenAI ChatGPT / Codex assisted with code generation, debugging, test creation,
design implementation and project documentation. The hero artwork was created
with OpenAI image generation. This assistance is acknowledged on the website
and in the group report. See [asset credits](docs/ASSETS.md) for source details.

## Demo content

The gym, contact details and prices are fictional. Gallery photos are stock images from
[Unsplash](https://unsplash.com/), not photographs of a real Fitness / Gym branch.
The shared hero image at `images/training-hero.png` was created with built-in
image generation; its generation brief is saved in `images/training-hero.prompt.txt`.
Social links lead to the platforms' homepages.

## Visual redesign

All five pages use the selected reference style: near-black banners, lime accents,
off-white backgrounds, rounded cards and Manrope typography. Memberships includes
photo-backed program cards, a compact desktop create form, styled tables and the
existing edit dialog. Small-screen layouts stack the cards and forms; wide tables
scroll inside their own regions. Navigation includes a skip link and current-page state.
The redesign preserves the existing registration, search, CRUD and lightbox behavior.
Implemented by Bakhtiyar Koishin (`Koishin04`).
