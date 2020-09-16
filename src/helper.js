const UNIT = {
  KB: 1024,
  MB: 1024 * 1024,
};
const ROUND = 10;

export const roundBytes = (bytes) => {
  if (bytes >= UNIT.MB)
    return Math.round((bytes / UNIT.MB) * ROUND) / ROUND + "MB";
  else if (bytes >= UNIT.KB)
    return Math.round((bytes / UNIT.KB) * ROUND) / ROUND + "KB";
  else return bytes + "B";
};

export const checkFirstBytes = (bytes, mime) => {
  for (var i = 0, l = mime.mask.length; i < l; ++i) {
    if ((bytes[i] & mime.mask[i]) - mime.pattern[i] !== 0) {
      return false;
    }
  }
  return true;
};

export const getFilter = (filters) =>
  `contrast(${filters.Contrast}%) brightness(${filters.Brightness}%) blur(${filters.Blur}px) opacity(${filters.Opacity}%) saturate(${filters.Saturate}%) grayscale(${filters.Grayscale}%) invert(${filters.Invert}%) sepia(${filters.Sepia}%)`;

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
