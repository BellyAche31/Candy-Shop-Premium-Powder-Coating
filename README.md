# Candy Shop Premium Powder Coating — Website

A free-to-run static website for a motorcycle mag (wheel) powder-coating business, including an interactive color-preview tool and a quote-request form. No build step, no framework, no paid services required.

## Structure

```
index.html          Home page
colors.html         Full 59-color catalog (generated — see below)
gallery.html        Past work + color preview tool
services.html       Services offered
pricing.html        Pricelist
about.html          About the business
contact.html        Quote/booking request form
thank-you.html      Post-submit confirmation
404.html            Not-found page
css/styles.css      All site styling
js/main.js          Nav toggle, scroll reveals, progress bar, counters, marquee
js/color-preview.js Color preview data + crossfade logic
tools/gen_colors.py Generates the color catalog + quote-form dropdown
images/             All site images
```

## Replacing Placeholder Images

Nearly everything is a real photo now: the logo, the hero shot, all 24 gallery photos, and every color the preview tool offers. To replace one, overwrite the file at its existing path **using the same filename** — no HTML or JS changes needed.

| File path | What goes here |
|---|---|
| `images/logo/logo.jpg` | Real logo |
| `images/hero/hero.jpg` | Real hero photo |
| `images/gallery/gallery-1.jpg` … `gallery-24.jpg` | Completed-project photos — add more with new `<img>` tags in `gallery.html` |
| `images/mags/style-a/base.svg` | Uncoated "before" mag, Candy Powder Coat — the only drawn placeholder left |
| `images/mags/style-a/*.jpg` | Candy Powder Coat photos: coke red, original orange, lemon yellow, gloss/matte white, marine blue, 24K gold, goblin green, illusion violet, illusion pink, illusion teal green, titanium black silver |
| `images/mags/style-b/*.jpg` | Ceramic Coating photos: marine blue, chrome silver |

Filenames match the color id in `js/color-preview.js`, which matches the name on the color chart.

### The color system

There are **two separate color surfaces**, and they are deliberately different:

| Surface | Shows | Why |
|---|---|---|
| `colors.html` | All **59** finishes | The full catalog customers choose from |
| Color preview on `gallery.html` | Only **photographed** finishes (11 Candy Powder Coat, 2 Ceramic Coating) | The tool swaps real photos — a color with no photo has nothing to show |

Both finishes in the preview tool pass an allow-list as the third argument to `buildColorsForStyle()` in `js/color-preview.js`, so neither ever renders placeholder artwork:

```js
colors: buildColorsForStyle("style-b", { ... }, ["marine-blue", "chrome-silver"])
```

**To add a photographed color to the preview tool:** drop the photo at `images/mags/<finish>/<color-id>.jpg`, then add that id to both the overrides object *and* the allow-list.

### Regenerating the color catalog

The 59 colors appear in two places — the swatch grid on `colors.html` and the Desired Color dropdown on `contact.html`. Both are generated from one source so they can't drift:

```
python3 tools/gen_colors.py
```

That writes `tools/out/colors_sections.html` and `tools/out/contact_options.html`; paste each into the matching page. Edit the `CATALOG` list in `tools/gen_colors.py` to add or rename a color. Color-shifting finishes (chrome, chameleon, prism) take a *list* of hex values and render as a gradient rather than a flat dot.

**Note:** swatch hex values are visual approximations of real powder, not exact matches — the page says so.

## Pricing

`pricing.html` is hand-maintained HTML tables in Philippine pesos, mirroring the shop's pricelist graphic. Update the numbers directly in that file.

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
