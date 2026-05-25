# Feng-Yuan &ldquo;Frey&rdquo; Liu &mdash; personal site

A static, dependency-free site for `https://freyfyliu.github.io/`, built to the
two-column design in `website_design.pdf`:

- **Left column** &mdash; your persistent home content (*Research &middot; Career path
  &middot; Teaching*). It is always on screen.
- **Right column** &mdash; the **interactive deep-field image** on the home view, or a
  **sub-page** (THISTLE, CV, Gallery, Students, 404).

### Scrolling behaviour (the key spec)

| View | Behaviour |
| --- | --- |
| **Home** (`/` or `/#/`) | The interactive image is shown and the two columns belong to **one document**, so they **scroll together**. |
| **Sub-page** (`/#/thistle`, `/#/cv`, `/#/gallery`, `/#/students`) | The left and right columns are two panes that **scroll independently**. |

The links inside the left column (*THISTLE*, *CV*, *gallery*, *students*) open the
matching sub-page on the right. Clicking your name returns to the home view.
Any unknown route shows the *&ldquo;beyond the observable Universe&rdquo;* 404 view.

## Publish

1. Copy everything in this folder into the root of the `freyfyliu.github.io` repo.
2. Commit and push.
3. Settings &rarr; Pages &rarr; deploy from the `main` branch, root (`/`).

No build step. Because routing uses the URL hash (`#/&hellip;`), every route works on
plain GitHub Pages.

## Edit content

- **Home / left column** &mdash; the three `.block` sections in `index.html`.
- **Sub-pages** &mdash; the `<template id="tpl-…">` blocks near the bottom of
  `index.html` (THISTLE, CV, Gallery, Students, 404).
- **Routes** &mdash; the `ROUTES` map at the top of `assets/js/app.js`.
- **Styling** &mdash; `assets/css/styles.css` (`--right-w: 61.11vw` sets the column
  split; `--ink`, `--paper`, `--link` set the palette).

## Replace the placeholder images

Real images are loaded by their intended names and quietly fall back to the
bundled placeholders if missing. Drop files with these names into `assets/img/`
and they appear automatically:

| Drop-in file | Used by | Falls back to |
| --- | --- | --- |
| `img_thistle.jpg` | THISTLE figure | `ALMAcontinuumfieldplaceholder.jpg` |
| `img0.jpg` &hellip; `img3.jpg` | Gallery | the six `…placeholder.jpg` images |
| `student_chang.jpg`, `student_lewis.jpg`, `student_daria.jpg` | Students | placeholder photos |
| `img404.jpg` | 404 view | `JWSTdeepfieldplaceholder.jpg` |

## Update the CV

Replace `assets/pdf/CV_Frey_Liu.pdf` with a new file of the same name, and edit
the date in the `tpl-cv` template in `index.html`.

## The interactive image

`assets/js/deepfield.js` (your existing JADES deep-field gravitational-lens
widget) is mounted on the home view by `assets/js/app.js`. Move your mouse over
it to lens the field; scroll over it to zoom; it cycles wavelength bands on its
own. It pauses automatically when off screen.
