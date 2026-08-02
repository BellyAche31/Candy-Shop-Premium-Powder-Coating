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

`images/logo/logo.jpg` is the real shop logo, `images/hero/hero.jpg` is a real hero photo, `images/gallery/gallery-1.jpg` … `gallery-8.jpg` are real completed-project photos, and `images/mags/style-a/lemon-yellow.jpg` and `fluorescent-pink.jpg` are real product photos. Everything else in `images/` is still a placeholder SVG labeled "PLACEHOLDER" so it's obvious nothing there is a real photo yet. To go live, just overwrite each file at its existing path with a real photo **using the same filename** — no HTML or JS changes are needed.

| File path | What goes here |
|---|---|
| `images/logo/logo.jpg` | Real logo (already in place) |
| `images/hero/hero.jpg` | Real hero photo (already in place) |
| `images/gallery/gallery-1.jpg` … `gallery-8.jpg` | Real completed-project photos (already in place) — add more by adding new `<img>` tags in `gallery.html` |
| `images/mags/style-a/base.svg` | Uncoated "before" mag for the **Candy Powder Coat** finish |
| `images/mags/style-a/lemon-yellow.jpg` | Real photo — Candy Powder Coat in Lemon Yellow |
| `images/mags/style-a/fluorescent-pink.jpg` | Real photo — Candy Powder Coat in Fluorescent Pink |
| `images/mags/style-a/*.svg` | Remaining Candy Powder Coat colors, still placeholders |
| `images/mags/style-b/*.svg` | Same pattern for the **Ceramic Coating** finish, still placeholders |

If real photos are `.jpg`/`.png` instead of `.svg`, either convert them to those filenames, or update the matching path in `js/color-preview.js` (for mag photos) or the `<img src>` in the relevant HTML file (for logo/hero/gallery). `js/color-preview.js` has a per-color `overrides` object on the `style-a` entry showing exactly how a placeholder `.svg` path gets swapped for a real `.jpg` — copy that pattern for each new real photo.

To add a new mag style or color to the preview tool, add a new entry to the `MAG_COLOR_MAP` object in `js/color-preview.js` following the existing pattern.

## The Quote Form (FormSubmit)

The contact form (`contact.html`) posts directly to [FormSubmit](https://formsubmit.co) — no account, no backend code, unlimited submissions, free. Quote requests are emailed to the address at the end of the form's `action` URL.

**Currently delivering to:** `jcg1312003@gmail.com`

### One-time activation (required)

The first time the form is submitted **on the live site**, FormSubmit emails that address a confirmation link. Until someone clicks it once, submissions are not forwarded. So after deploying:

1. Go to the live Contact page and submit one test request.
2. Check that inbox for the FormSubmit confirmation email and click the activation link.
3. Submit once more to confirm it now arrives.

### Changing the destination email

Edit one line in `contact.html` — the email at the end of the `<form action="...">` URL. The new address will need its own one-time activation as above.

### Hiding the email from the page source (recommended)

Once activated, FormSubmit gives you a random alias endpoint (like `https://formsubmit.co/xxxxxxxxxxxx`). Swapping the plain email in the form `action` for that alias keeps the address out of the public HTML so scrapers can't harvest it for spam.

### How it's configured

Hidden fields in the form control FormSubmit's behavior:

| Field | Purpose |
|---|---|
| `_subject` | Subject line of the notification email |
| `_template=table` | Formats the email as a readable table |
| `_captcha=false` | Skips FormSubmit's captcha screen (a honeypot handles spam instead) |
| `_next` | Absolute URL of the page shown after submitting (`thank-you.html`) — must be absolute, a relative path won't work |
| `_honey` | Hidden honeypot field; FormSubmit drops any submission that fills it in |

If you move the site to a different domain, update the `_next` URL in `contact.html` to match.

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
