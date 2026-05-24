# Feng-Yuan "Frey" Liu — GitHub Pages website

This is a static personal website package designed for `https://freyfyliu.github.io/`.

## How to publish

1. Unzip this package.
2. Copy all files inside `frey-portfolio-site/` into the root of the `freyfyliu.github.io` repository.
3. Commit and push to GitHub.
4. In the repository settings, enable GitHub Pages from the main branch/root if it is not already enabled.

## Replace placeholder images

The current images are monochrome placeholders in `assets/img/`.

Suggested replacements:
- `Freystandingbeforeatelescope.jpg`
- `ALMAcontinuumfieldplaceholder.jpg`
- `JWSTdeepfieldplaceholder.jpg`
- `NOEMAcontrolroomplaceholder.jpg`
- `CosmosDustMapplaceholder.jpg`
- `LaSillaNightplaceholder.jpg`

Keep the same filenames if you want the pages to update without editing HTML.

## Edit content

- Main page: `index.html`
- Individual pages: `pages/*.html`
- Styles: `assets/css/styles.css`
- Lightweight script: `assets/js/main.js`

No build step is required.


## CV page

The homepage now includes a `CV` link. It opens `pages/cv.html`, where the left panel contains a short CV overview and the right panel embeds the PDF at `assets/pdf/CV_Frey_Liu.pdf`.

To update the CV, replace `assets/pdf/CV_Frey_Liu.pdf` with a new PDF using the same filename.
