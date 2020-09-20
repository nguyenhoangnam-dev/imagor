export const imagePattern = new RegExp("image/(png|jpeg|webp|bmp|svg\\+xml)");

export const hexPattern = new RegExp("^#([0-9a-f]{3}|[0-9a-f]{6})$", "i");

export const percentPattern = new RegExp("^([0-9]|[1-9][0-9]|[100])$");

// Check browser for support feature.
const userAgent = navigator.userAgent.toLowerCase();
const checkBrowser = (regex) => {
  return regex.test(userAgent);
};

const opera = new RegExp("opera");
const chrome = new RegExp("chrome");
// const webkit = new RegExp("webkit");
const safari = new RegExp("safari");

const isOpera = checkBrowser(opera);
const isChrome = checkBrowser(chrome);
// const isWebkit = checkBrowser(webkit);
const isSafari = !isChrome && checkBrowser(safari);

// Check support canvas filter
export const notCanvasFilter = isSafari || isOpera;

// Check real type of image by use some first bytes.
export const MIME = {
  "image/jpeg": {
    ext: "jpg",
    pattern: [0xff, 0xd8, 0xff],
    mask: [0xff, 0xff, 0xff],
  },
  "image/png": {
    ext: "png",
    pattern: [0x89, 0x50, 0x4e, 0x47],
    mask: [0xff, 0xff, 0xff, 0xff],
  },
  "image/webp": {
    ext: "webp",
    pattern: [0x52, 0x49, 0x46, 0x46],
    mask: [0xff, 0xff, 0xff, 0xff],
  },
  "image/bmp": {
    ext: "bmp",
    pattern: [0x42, 0x4d],
    mask: [0xff, 0xff],
  },
  "image/svg+xml": {
    ext: "svg",
  },
};
