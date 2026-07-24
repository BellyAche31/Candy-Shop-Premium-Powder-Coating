# Candy Shop Premium Powder Coating — Website

A free-to-run static website for a motorcycle mag (wheel) powder-coating business, including an interactive color-preview tool and a quote-request form. No build step, no framework, no paid services required.

## Structure

```
index.html        Home page
gallery.html       Gallery + color preview tool
services.html      Services offered
about.html         About the business
contact.html       Quote/booking request form
404.html           Not-found page
css/styles.css     All site styling
js/main.js         Mobile nav toggle, footer year
js/color-preview.js  Color preview data + crossfade logic
images/            All site images (placeholders — see below)
```

## Replacing Placeholder Images

`images/logo/logo.jpg` is the real shop logo. `images/mags/style-a/lemon-yellow.jpg` and `fluorescent-pink.jpg` are real product photos. Everything else in `images/` is still a placeholder SVG labeled "PLACEHOLDER" so it's obvious nothing there is a real photo yet. To go live, just overwrite each file at its existing path with a real photo **using the same filename** — no HTML or JS changes are needed.

| File path | What goes here |
|---|---|
| `images/logo/logo.jpg` | Real logo (already in place) |
| `images/hero/placeholder-hero.svg` | Home page hero photo |
| `images/mags/style-a/base.svg` | Photo of "Style A" mag before coating |
| `images/mags/style-a/lemon-yellow.jpg` | Real photo — Style A coated in Lemon Yellow |
| `images/mags/style-a/fluorescent-pink.jpg` | Real photo — Style A coated in Fluorescent Pink |
| `images/mags/style-a/*.svg` | Remaining colors for Style A, still placeholders |
| `images/mags/style-b/*.svg` | Same pattern for a second mag style ("Deep Dish"), still placeholders |
| `images/gallery/placeholder-1.svg` … `placeholder-6.svg` | General gallery/portfolio shots |

If real photos are `.jpg`/`.png` instead of `.svg`, either convert them to those filenames, or update the matching path in `js/color-preview.js` (for mag photos) or the `<img src>` in the relevant HTML file (for logo/hero/gallery). `js/color-preview.js` has a per-color `overrides` object on the `style-a` entry showing exactly how a placeholder `.svg` path gets swapped for a real `.jpg` — copy that pattern for each new real photo.

To add a new mag style or color to the preview tool, add a new entry to the `MAG_COLOR_MAP` object in `js/color-preview.js` following the existing pattern.

## Setting Up the Quote Form (Formspree)

The contact form (`contact.html`) posts directly to [Formspree](https://formspree.io) — no backend code required.

1. Create a free Formspree account and a new form.
2. Copy the form's endpoint ID from the URL Formspree gives you (looks like `https://formspree.io/f/abc123xy`).
3. In `contact.html`, replace `YOUR_FORM_ID` in the `<form action="...">` attribute with your real ID.

The free Formspree plan currently allows a limited number of submissions per month, which is generally enough for a small shop's quote requests — upgrade only if you outgrow it.

## Deploying for Free (GitHub Pages)

1. Push this repo's code to the `main` branch (or merge this branch into `main`).
2. In the GitHub repo, go to **Settings → Pages**.
3. Under "Build and deployment", set **Source** to "Deploy from a branch", choose branch `main` and folder `/ (root)`.
4. Save. The site will be published at `https://<your-username>.github.io/<repo-name>/`.

This step must be done manually in the GitHub UI — it can't be done via commits.

## Local Preview

Open `index.html` directly in a browser, or run a simple static server from the repo root, e.g.:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
