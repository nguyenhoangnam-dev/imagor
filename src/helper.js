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
