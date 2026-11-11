# Fitness / Gym

A responsive five-page website for a fictional gym in Astana, Kazakhstan.
The Endterm extends the original Midterm website in the same repository,
keeping its topic, pages, membership plans and responsive layout while
adding JavaScript and jQuery interactions.

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
| About | Gym information and features |
| Memberships | Membership plans, comparison table, program search, filters and CRUD |
| Gallery | Responsive photo grid and interactive lightbox |
| Contact | Gym details and registration validation demo |

## Endterm features

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
- JavaScript and jQuery 3.7.1, with event handlers and DOM updates in `js/script.js`.
- Regular expressions, native HTML dialogs and `localStorage`.
- External styles in `css/style.css`, hover/focus states and alternating table rows.
- Google Fonts (Roboto) and lazy-loaded Unsplash gallery images.
- Git, GitHub and GitHub Pages deployment from `main`.

## Individual contributions

| Member | Contribution |
|---|---|
| Bakhtiyar Koishin (`Koishin04`) | Project setup, shared styles, Home page, responsive navigation and deployment; integration of search with CRUD, persistent program table and modal editing; completed registration fixes, password indicator, working lightbox and final README updates. |
| Aldiyar Zhurek | About and Memberships pages, membership cards/table layout, initial program search and category filtering. |
| Kaisar Ashymbai | Original Gallery and Contact pages, initial registration validation and gallery markup, initial Endterm documentation. |

The final registration and lightbox fixes are committed by Bakhtiyar Koishin.
Earlier contributions remain recorded in the repository history.

## Run locally

Clone the repository and serve its root with any static web server. For example,
with Python installed:

```sh
git clone https://github.com/Koishin04/Fitness_Gym-Website.git
cd Fitness_Gym-Website
python -m http.server 8000
```

Open [the local website](http://localhost:8000). No build step or npm installation
is required. An internet connection is needed for jQuery, Google Fonts and
remote stock photos. Use a current browser that supports native HTML dialogs.

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

## Demo content

The gym, contact details and prices are fictional. Photos are stock images from
[Unsplash](https://unsplash.com/), not photographs of a real Fitness / Gym branch.
Social links lead to the platforms' homepages.
