import * as Comlink from 'comlink';

async function getHistogram(buffer) {
  const length = buffer.length;

  let RGB = [];
  let RGBCMY = [];

  for (let i = 0; i < 256; i++) {
    RGB.push({
      name: i,
      red: 0,
      green: 0,
      blue: 0,
    });
  }

  for (let i = 0; i < length - 2; i += 4) {
    RGB[buffer[i]].red++;
    RGB[buffer[i + 1]].green++;
    RGB[buffer[i + 2]].blue++;
  }

  for (let i = 0; i < 256; i++) {
    let cyan = 0,
      magenta = 0,
      yellow = 0,
      grey;

    grey = Math.min(RGB[i].red, RGB[i].green, RGB[i].blue);

    if (RGB[i].red > RGB[i].green) {
      if (RGB[i].green > RGB[i].blue) {
        yellow = RGB[i].green;
      } else if (RGB[i].blue > RGB[i].green) {
        if (RGB[i].red > RGB[i].blue) {
          magenta = RGB[i].blue;
        } else if (RGB[i].red < RGB[i].blue) {
          magenta = RGB[i].red;
        }
      }
    } else if (RGB[i].red < RGB[i].green) {
      if (RGB[i].red > RGB[i].blue) {
        yellow = RGB[i].red;
      } else if (RGB[i].red < RGB[i].blue) {
        if (RGB[i].blue < RGB[i].green) {
          cyan = RGB[i].blue;
        } else if (RGB[i].blue > RGB[i].green) {
          cyan = RGB[i].green;
        }
      }
    }
    RGBCMY[i] = {
      name: i,
      red: RGB[i].red,
      green: RGB[i].green,
      blue: RGB[i].blue,
      grey,
      cyan,
      magenta,
      yellow,
    };
  }

  return RGBCMY;
}

Comlink.expose(getHistogram);
