# Frey Liu academic website

This is a populated, editable Jekyll website based on the [academic-website-template](https://github.com/sbryngelson/academic-website-template) by Spencer Bryngelson (MIT license). The site copy was drafted from Frey's previous website and CV dated October 2026. It is an English-language draft for Frey's review, with a short Chinese passage on the Outreach page.

## What's here

- `_config.yml` — name, email, links, colours, navigation, site description.
- `_pages/` — Home, About, Research, Publications, Talks, Teaching, Outreach, Gallery, Software, and Field Notes.
- `_data/` — news, talks, teaching, awards, grants, and software entries.
- `assets/ref.bib` — selected first-author papers, rendered automatically on the Publications page.
- `images/` — selected photographs and figures from the previous website, reduced in size for the web. The original archive remains unchanged.
- `papers/Frey_Liu_CV_2026.pdf` — the supplied five-page CV, unchanged.
- `.github/workflows/deploy.yml` — GitHub Pages deployment, triggered by pushes to the `source` branch.

## Review before publishing

1. Read the text in `_pages/`, especially the About, Research, and Outreach pages, for tone and factual nuance.
2. Check `assets/ref.bib` against your ADS record. This site shows selected first-author papers, and links to ADS for the complete record. The title, status, and year of the two 2026 Y-dwarf papers deserve a final check because one is submitted and one is accepted as of the supplied CV.
3. The included CV contains a telephone number and referees' email addresses. Replace it with a public version if you prefer not to publish those details.
4. Check that you own or have permission to reuse each photograph and research figure from your previous site. Photo captions have been carried over or adapted from that site.
5. Update time-sensitive news, awards, software status, and expected graduation date as these change.

## Preview locally

Install Ruby 3.4 or newer and Bundler. From this directory:

```bash
bundle install
bundle exec jekyll serve
```

Open `http://127.0.0.1:4000/`. To verify a production build:

```bash
JEKYLL_ENV=production bundle exec jekyll build --strict_front_matter
```

## Publish to GitHub Pages

The repository name for a personal GitHub Pages site is `freyfyliu.github.io`.

1. Keep a backup of your current website repository. You can create a branch or download a ZIP from GitHub.
2. Copy **the contents of this directory**, including hidden `.github/`, into a Git repository named `freyfyliu.github.io`. Do not upload the enclosing ZIP as a single file.
3. Push the files to a branch named `source`. This template's deployment workflow watches that branch.
4. In the repository, choose **Settings → Pages → Build and deployment → Source: GitHub Actions**.
5. Check the **Actions** tab. After the *Build and Deploy* workflow succeeds, open `https://freyfyliu.github.io/`.

If your existing site uses a different default branch, you can either create `source` and push this version there, or change `branches: [source]` in `.github/workflows/deploy.yml` to your chosen branch.

## Editing later

- Add a paper in `assets/ref.bib`; add `selected = {true}` to feature it on the homepage. Use `@unpublished` for a submitted manuscript and `@article` for a published or accepted one.
- Add a talk in `_data/talks.yml` or a news item in `_data/news.yml`.
- Add an image to `images/` and reference it with `{{ '/images/filename.jpg' | relative_url }}` in a page.
- Update the downloadable CV at `papers/Frey_Liu_CV_2026.pdf`; change the path in `_config.yml` if the filename changes.
- The source template's build instructions and MIT license are retained in `LICENSE` and the Git history of the upstream project.

No website or GitHub repository has been published or changed by this delivery.
