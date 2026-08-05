#!/usr/bin/env python3
"""Single source of truth for the Candy Shop color catalog.

The 59 colors appear in two places — the swatch grid on colors.html and the
Desired Color dropdown on contact.html. Both are generated from CATALOG below
so they can never drift apart. Run from the repo root:

    python3 tools/gen_colors.py

It writes two fragments to tools/out/ which you then paste into the two pages
(the site is deliberately build-step-free, so this is a one-shot generator
rather than something that runs on deploy).
"""
import html, json, os

os.makedirs("tools/out", exist_ok=True)

# (label, swatch)  — swatch is a hex string, or a list of hex for color-shifting finishes
CATALOG = [
    ("Standard Colors", "standard", "Everyday finishes — solid, durable, and the most affordable tier.", [
        ("Gloss / Matte Black",      "#1a1a1a"),
        ("Gloss / Matte White",      "#f2f2f2"),
        ("Pearl White",              "#efece4"),
        ("Textured Black",           "#2b2b2b"),
        ("Sahara Black",             "#3a3632"),
        ("Wrinkle Black",            "#242424"),
        ("Velvet Green",             "#2f6b45"),
        ("Coke Red",                 "#c8102e"),
        ("Original Orange",          "#e8621a"),
        ("Lemon Yellow",             "#fcee21"),
        ("Marine Blue",              "#1b4f9c"),
        ("Aqua Marine Blue",         "#2196c4"),
        ("Bubblegum Blue",           "#4db8e8"),
        ("Soul White",               "#ffffff"),
        ("Spirit White",             "#faf9f5"),
    ]),
    ("Chrome Edition", "chrome", "Mirror-bright metallic chrome finishes.", [
        ("Chrome Silver",            ["#f2f3f5", "#c7c9cc", "#8b8f94"]),
        ("Chrome Red",               ["#f0808a", "#d62828", "#7d1418"]),
        ("Chrome Blue",              ["#8fc0f0", "#2a6fd6", "#153e7d"]),
        ("Chrome Yellow",            ["#f7e39a", "#e8c020", "#8a7010"]),
        ("Chrome Copper",            ["#e2a97e", "#b87333", "#6d431c"]),
        ("Chrome Pink",              ["#f5aacd", "#e0559b", "#8a2f5e"]),
        ("Chrome Green",             ["#93dba6", "#3aa856", "#1e6331"]),
        ("Chrome Gold",              ["#f0dfa4", "#d4af37", "#8a6f1c"]),
        ("Chrome Magenta Purple",    ["#d98fd6", "#a03a9e", "#5e1f5c"]),
        ("Chrome Cherry",            ["#e88aa6", "#b3184a", "#6b0d2c"]),
        ("Chrome Purple",            ["#bb96e0", "#7b3fbf", "#472470"]),
    ]),
    ("Premium Colors", "premium", "Deep candy, illusion and multi-layer finishes — our signature work.", [
        ("Illusion Red",             "#d21f26"),
        ("Illusion Blue",            "#2360b8"),
        ("24K Gold",                 "#d4a017"),
        ("Shocker Green",            "#35c46a"),
        ("Shocker Yellow Green",     "#b6d92e"),
        ("Illusion Violet",          "#8a3fd1"),
        ("Illusion Purple",          "#6b3fa0"),
        ("Goblin Green",             "#6fbe2c"),
        ("Illusion Pink",            "#e8398b"),
        ("Illusion Berry Pink",      "#c62368"),
        ("Illusion Chrome Black",    "#3d3d42"),
        ("Titanium Black Silver",    "#3a3d40"),
        ("Malaysian Blue",           "#1c3f94"),
        ("Deep Purple",              "#4b2a83"),
        ("Champagne Gold",           "#d9c193"),
        ("Rose Gold",                "#c98f7e"),
        ("Illusion Teal Green",      "#2fa89a"),
        ("Illusion Copper",          "#a9603a"),
        ("Illusion Lake Green",      "#3f9e7c"),
        ("Sparkling Blue",           "#2b7fd4"),
    ]),
    ("Metallic Colors", "metallic", "Fine metal-flake finishes that catch the light.", [
        ("Gold Metallic",            "#c9a227"),
        ("Metallic Dark Bronze",     "#6b4f2a"),
        ("Metallic Light Bronze",    "#a3855a"),
        ("Electro Silver",           "#b8bcc0"),
        ("Alloy Silver",             "#9ba0a5"),
        ("Metallic Green",           "#3f7d54"),
    ]),
    ("Chameleon Edition", "chameleon", "Color-shifting finishes that change with the angle and the light.", [
        ("Chameleon Pearl White (Gold)",   ["#fdfbf2", "#e6d9a8", "#c9b06a"]),
        ("Chameleon Pearl White (Silver)", ["#fdfdfd", "#dfe4e8", "#a8b2ba"]),
        ("Chameleon Blue",                 ["#3fd0e0", "#2a6fd6", "#6b3fbf"]),
        ("Prism Blue",                     ["#5fe0d0", "#2b7fd4", "#3f3fa8"]),
        ("Prism Green",                    ["#c3e86a", "#35c46a", "#1f7a86"]),
        ("Prism Violet",                   ["#e88ad6", "#8a3fd1", "#3b2a8a"]),
        ("Chameleon Blue Violet",          ["#4fb8e8", "#5a45c9", "#9c3fb5"]),
    ]),
]


def slug(name):
    out = name.lower()
    for a, b in [("(", ""), (")", ""), ("/", " "), ("&", " ")]:
        out = out.replace(a, b)
    return "-".join(out.split())


def swatch_style(sw):
    if isinstance(sw, list):
        stops = ", ".join(sw)
        return f"background: linear-gradient(135deg, {stops});"
    return f"background: {sw};"


sections, options = [], []
total = 0
for title, cat_id, blurb, colors in CATALOG:
    total += len(colors)
    chips = []
    for name, sw in colors:
        chips.append(
            '          <li class="color-chip reveal-pop">\n'
            f'            <span class="color-chip__dot" style="{swatch_style(sw)}"></span>\n'
            f'            <span class="color-chip__name">{html.escape(name)}</span>\n'
            "          </li>"
        )
    sections.append(
        f'      <section class="color-category" id="{cat_id}">\n'
        '        <div class="color-category__head reveal">\n'
        f'          <h2>{html.escape(title)}</h2>\n'
        f'          <p>{html.escape(blurb)}</p>\n'
        f'          <span class="color-category__count">{len(colors)} finishes</span>\n'
        "        </div>\n"
        '        <ul class="color-grid">\n'
        + "\n".join(chips)
        + "\n        </ul>\n"
        "      </section>"
    )
    opts = "\n".join(
        f'              <option value="{slug(n)}">{html.escape(n)}</option>' for n, _ in colors
    )
    options.append(
        f'            <optgroup label="{html.escape(title)}">\n{opts}\n            </optgroup>'
    )

open("tools/out/colors_sections.html", "w").write("\n\n".join(sections) + "\n")
open("tools/out/contact_options.html", "w").write("\n".join(options) + "\n")

flat = [(n, sw) for _, _, _, cs in CATALOG for n, sw in cs]
json.dump({slug(n): n for n, _ in flat}, open("tools/out/color_slugs.json", "w"), indent=1)
print(f"{total} colours across {len(CATALOG)} categories")
print("categories:", ", ".join(f"{t} ({len(c)})" for t, _, _, c in CATALOG))
