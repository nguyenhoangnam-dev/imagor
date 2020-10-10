import tinyColor from "tinycolor2";

const hexPattern = /^((0x){0,1}|#{0,1})([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/g;

function Hex(hex) {
  this.hex = String(hex);

  this.isValid = function () {
    if (hexPattern.test(this.hex)) {
      return true;
    } else if (tinyColor(this.hex).isValid) {
      return true;
    } else {
      return false;
    }
  };

  this.toHex = function () {
    const color = tinyColor(this.hex);

    if (color.isValid()) {
      return color.toHex();
    } else {
      return "000000";
    }
  };

  this.toHsl = function () {
    const color = tinyColor(this.hex);

    return color.toHsl();
  };
}

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
