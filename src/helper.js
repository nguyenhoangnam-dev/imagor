const UNIT = {
  KB: 1024,
  MB: 1024 * 1024,
};
const ROUND = 10;

/**
 * Convert it to KB or MB
 * @param {Number} bytes Number of bytes
 */
export const roundBytes = (bytes) => {
  if (bytes >= UNIT.MB)
    return Math.round((bytes / UNIT.MB) * ROUND) / ROUND + "MB";
  else if (bytes >= UNIT.KB)
    return Math.round((bytes / UNIT.KB) * ROUND) / ROUND + "KB";
  else return bytes + "B";
};

// Check some first bytes to find image type
export const checkFirstBytes = (bytes, mime) => {
  for (var i = 0, l = mime.mask.length; i < l; ++i) {
    if ((bytes[i] & mime.mask[i]) - mime.pattern[i] !== 0) {
      return false;
    }
  }
  return true;
};

/**
 * Convert object to string
 * @param {Object} filters Contain value of all filter
 */
export const getFilter = (filters) =>
  `contrast(${filters.Contrast}%) brightness(${filters.Brightness}%) blur(${filters.Blur}px) opacity(${filters.Opacity}%) saturate(${filters.Saturate}%) grayscale(${filters.Grayscale}%) invert(${filters.Invert}%) sepia(${filters.Sepia}%)`;

/**
 * Find contrast of current color
 * @param {String} hex Value of color
 */
export const contrastColor = (hex) => {
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);

  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#FFFFFF";
};

// Pattern to check SVG
let svgPattern = /^\s*(?:<\?xml[^>]*>\s*)?(?:<!doctype svg[^>]*\s*(?:\[?(?:\s*<![^>]*>\s*)*\]?)*[^>]*>\s*)?(?:<svg[^>]*>[^]*<\/svg>|<svg[^/>]*\/\s*>)\s*$/i;
let htmlCommentRegex = /<!--([\s\S]*?)-->/g;
let entityRegex = /\s*<!Entity\s+\S*\s*(?:"|')[^"]+(?:"|')\s*>/gim;

function cleanEntities(svg) {
  return svg.replace(entityRegex, "");
}

// Check SVG file
export const checkSVG = (svg) => {
  return (
    Boolean(svg) &&
    svgPattern.test(cleanEntities(svg.toString()).replace(htmlCommentRegex, ""))
  );
};

// Change filter name to uppercase first letter
function upperFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Convert filter to object
export const setFilter = (filterString) => {
  const sampleFilter = {
    Contrast: 100,
    Brightness: 100,
    Blur: 0,
    Opacity: 100,
    Saturate: 100,
    Grayscale: 0,
    Invert: 0,
    Sepia: 0,
    reset: false,
  };

  let filterArray = filterString.split(" ");

  for (let i = 0; i < filterArray.length; i++) {
    let filter = filterArray[i].split("(");
    sampleFilter[upperFirstLetter(filter[0])] = parseInt(filter[1]);
  }
  return sampleFilter;
};
