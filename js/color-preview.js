// Color-preview tool: mag style -> color -> photo, with a crossfade transition.
//
// To swap in real photos later: replace the file at the same path (or edit
// the "image"/"baseImage" string below), keeping the same style/color keys.
// To add a new mag style or color, add another entry following the same shape.

// Shared color list — used to build each style's `colors` map below.
// To add a new color: add it here, then add matching image files at
// images/mags/<style>/<colorId>.svg for every mag style.
const AVAILABLE_COLORS = [
  { id: "fluorescent-pink", label: "Fluorescent Pink", swatchHex: "#FF2FA0" },
  { id: "lemon-yellow", label: "Lemon Yellow", swatchHex: "#FCEE21" },
  { id: "hi-gloss-white", label: "Hi Gloss White", swatchHex: "#FFFFFF" },
  { id: "fire-red", label: "Fire Red", swatchHex: "#E1261C" },
  { id: "prismatic-blue", label: "Prismatic Blue", swatchHex: "#1477D6" },
  { id: "chameleon-green", label: "Chameleon Green", swatchHex: "#1FA37A" },
  { id: "shocker-violet", label: "Shocker Violet", swatchHex: "#7B2FBE" },
  { id: "chrome", label: "Chrome", swatchHex: "#C7C9CC" },
  { id: "shocker-goblin", label: "Shocker Goblin", swatchHex: "#6FBE2C" },
  { id: "shocker-red", label: "Shocker Red", swatchHex: "#FF1E1E" },
  { id: "titanium-black-silver", label: "Titanium Black Silver", swatchHex: "#3A3D40" },
  { id: "24k-gold", label: "24K Gold", swatchHex: "#D4A017" },
  { id: "original-orange", label: "Original Orange", swatchHex: "#E8621A" },
  { id: "mint-green", label: "Mint Green", swatchHex: "#5FD3AE" }
];

function buildColorsForStyle(styleSlug, overrides) {
  overrides = overrides || {};
  var colors = {};
  AVAILABLE_COLORS.forEach(function (color) {
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
  "style-a": {
    label: "Candy Powder Coat",
    baseImage: "images/mags/style-a/base.svg",
    colors: buildColorsForStyle("style-a", {
      "lemon-yellow": "lemon-yellow.jpg",
      "fluorescent-pink": "fluorescent-pink.jpg",
      "hi-gloss-white": "hi-gloss-white.jpg",
      "shocker-violet": "shocker-violet.jpg",
      "shocker-goblin": "shocker-goblin.jpg",
      "titanium-black-silver": "titanium-black-silver.jpg",
      "prismatic-blue": "prismatic-blue.jpg",
      "24k-gold": "24k-gold.jpg",
      "original-orange": "original-orange.jpg",
      "mint-green": "mint-green.jpg",
      "fire-red": "fire-red.jpg"
    })
  },
  "style-b": {
    label: "Ceramic Coating",
    baseImage: "images/mags/style-b/base.svg",
    colors: buildColorsForStyle("style-b", {
      "prismatic-blue": "prismatic-blue.jpg",
      "chrome": "chrome.jpg"
    })
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
