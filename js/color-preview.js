// Color-preview tool: mag style -> color -> photo, with a crossfade transition.
//
// To swap in real photos later: replace the file at the same path (or edit
// the "image"/"baseImage" string below), keeping the same style/color keys.
// To add a new mag style or color, add another entry following the same shape.

// Shared color list — the menu each finish draws from.
// To add a new color: add it here, then add a matching image file at
// images/mags/<style>/<colorId>.(jpg|svg) for every finish that offers it.
// A finish does NOT have to offer every color — pass an allow-list as the
// third argument to buildColorsForStyle() to restrict it (see style-b below).
const AVAILABLE_COLORS = [
  { id: "coke-red", label: "Coke Red", swatchHex: "#c8102e" },
  { id: "original-orange", label: "Original Orange", swatchHex: "#e8621a" },
  { id: "lemon-yellow", label: "Lemon Yellow", swatchHex: "#fcee21" },
  { id: "gloss-matte-white", label: "Gloss / Matte White", swatchHex: "#f2f2f2" },
  { id: "marine-blue", label: "Marine Blue", swatchHex: "#1b4f9c" },
  { id: "24k-gold", label: "24K Gold", swatchHex: "#d4a017" },
  { id: "goblin-green", label: "Goblin Green", swatchHex: "#6fbe2c" },
  { id: "illusion-violet", label: "Illusion Violet", swatchHex: "#8a3fd1" },
  { id: "illusion-pink", label: "Illusion Pink", swatchHex: "#e8398b" },
  { id: "illusion-teal-green", label: "Illusion Teal Green", swatchHex: "#2fa89a" },
  { id: "titanium-black-silver", label: "Titanium Black Silver", swatchHex: "#3a3d40" },
  { id: "chrome-silver", label: "Chrome Silver", swatchHex: "#c7c9cc" }
];

// onlyIds (optional): restrict this finish to a subset of AVAILABLE_COLORS.
// Omit it to offer every color.
function buildColorsForStyle(styleSlug, overrides, onlyIds) {
  overrides = overrides || {};
  var colors = {};
  AVAILABLE_COLORS.forEach(function (color) {
    if (onlyIds && onlyIds.indexOf(color.id) === -1) {
      return;
    }
    var filename = overrides[color.id] || (color.id + ".svg");
    colors[color.id] = {
      label: color.label,
      swatchHex: color.swatchHex,
      image: "images/mags/" + styleSlug + "/" + filename
    };
  });
  return colors;
}

const MAG_COLOR_MAP = {
  // Both finishes list only colors we have real photos of. The full 59-color
  // catalog lives on colors.html; this tool is the photographed subset.
  "style-a": {
    label: "Candy Powder Coat",
    baseImage: "images/mags/style-a/base.svg",
    colors: buildColorsForStyle("style-a", {
      "coke-red": "coke-red.jpg",
      "original-orange": "original-orange.jpg",
      "lemon-yellow": "lemon-yellow.jpg",
      "gloss-matte-white": "gloss-matte-white.jpg",
      "marine-blue": "marine-blue.jpg",
      "24k-gold": "24k-gold.jpg",
      "goblin-green": "goblin-green.jpg",
      "illusion-violet": "illusion-violet.jpg",
      "illusion-pink": "illusion-pink.jpg",
      "illusion-teal-green": "illusion-teal-green.jpg",
      "titanium-black-silver": "titanium-black-silver.jpg"
    }, [
      "coke-red", "original-orange", "lemon-yellow", "gloss-matte-white",
      "marine-blue", "24k-gold", "goblin-green", "illusion-violet",
      "illusion-pink", "illusion-teal-green", "titanium-black-silver"
    ])
  },
  "style-b": {
    label: "Ceramic Coating",
    baseImage: "images/mags/style-b/chrome-silver.jpg",
    colors: buildColorsForStyle("style-b", {
      "marine-blue": "marine-blue.jpg",
      "chrome-silver": "chrome-silver.jpg"
    }, ["marine-blue", "chrome-silver"])
  }
};

document.addEventListener("DOMContentLoaded", function () {
  var stylePicker = document.querySelector(".mag-style-select");
  var swatchRow = document.querySelector(".swatch-row");
  var baseImg = document.querySelector(".preview-img--base");
  var colorImg = document.querySelector(".preview-img--color");
  var previewLabel = document.querySelector(".preview-label");

  if (!stylePicker || !swatchRow || !baseImg || !colorImg) {
    return;
  }

  var currentStyleKey = Object.keys(MAG_COLOR_MAP)[0];

  // Preload every mapped image so the first crossfade isn't janky.
  Object.keys(MAG_COLOR_MAP).forEach(function (styleKey) {
    var style = MAG_COLOR_MAP[styleKey];
    new Image().src = style.baseImage;
    Object.keys(style.colors).forEach(function (colorKey) {
      new Image().src = style.colors[colorKey].image;
    });
  });

  function renderStylePicker() {
    stylePicker.innerHTML = "";
    Object.keys(MAG_COLOR_MAP).forEach(function (styleKey) {
      var style = MAG_COLOR_MAP[styleKey];
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "style-btn" + (styleKey === currentStyleKey ? " is-selected" : "");
      btn.textContent = style.label;
      btn.setAttribute("data-style", styleKey);
      btn.addEventListener("click", function () {
        currentStyleKey = styleKey;
        renderStylePicker();
        renderSwatches();
        resetToBase();
      });
      stylePicker.appendChild(btn);
    });
  }

  function renderSwatches() {
    var style = MAG_COLOR_MAP[currentStyleKey];
    swatchRow.innerHTML = "";
    Object.keys(style.colors).forEach(function (colorKey) {
      var color = style.colors[colorKey];

      var item = document.createElement("div");
      item.className = "swatch-item";

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "swatch";
      btn.style.background = color.swatchHex;
      btn.setAttribute("data-color", colorKey);
      btn.setAttribute("aria-label", "Preview in " + color.label);
      btn.addEventListener("click", function () {
        selectColor(colorKey);
        Array.prototype.forEach.call(swatchRow.querySelectorAll(".swatch"), function (s) {
          s.classList.remove("is-selected");
        });
        btn.classList.add("is-selected");
      });

      var name = document.createElement("span");
      name.className = "swatch-name";
      name.textContent = color.label;

      item.appendChild(btn);
      item.appendChild(name);
      swatchRow.appendChild(item);
    });
  }

  function resetToBase() {
    var style = MAG_COLOR_MAP[currentStyleKey];
    baseImg.src = style.baseImage;
    baseImg.alt = style.label + " — bare / uncoated";
    baseImg.classList.add("is-active");
    colorImg.classList.remove("is-active");
    if (previewLabel) {
      previewLabel.textContent = style.label + " — Select a Color";
    }
  }

  function selectColor(colorKey) {
    var style = MAG_COLOR_MAP[currentStyleKey];
    var color = style.colors[colorKey];
    if (!color) {
      return;
    }

    var img = new Image();
    img.onload = function () {
      colorImg.src = color.image;
      colorImg.alt = style.label + " coated in " + color.label;
      colorImg.classList.add("is-active");
      baseImg.classList.remove("is-active");
      if (previewLabel) {
        previewLabel.textContent = style.label + " — " + color.label;
      }
    };
    img.src = color.image;
  }

  renderStylePicker();
  renderSwatches();
  resetToBase();
});
