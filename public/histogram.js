onmessage = function (event) {
  const histogram = event.data;

  let arrayArrayToArrayObject = [];

  for (let i = 0; i < 256; i++) {
    let cyan = 0,
      magenta = 0,
      yellow = 0,
      grey;

    grey = Math.min(histogram[0][i], histogram[1][i], histogram[2][i]);

    if (histogram[0][i] > histogram[1][i]) {
      if (histogram[1][i] > histogram[2][i]) {
        yellow = histogram[1][i];
      } else if (histogram[2][i] > histogram[1][i]) {
        if (histogram[0][i] > histogram[2][i]) {
          magenta = histogram[2][i];
        } else if (histogram[0][i] < histogram[2][i]) {
          magenta = histogram[0][i];
        }
      }
    } else if (histogram[0][i] < histogram[1][i]) {
      if (histogram[0][i] > histogram[2][i]) {
        yellow = histogram[0][i];
      } else if (histogram[0][i] < histogram[2][i]) {
        if (histogram[2][i] < histogram[1][i]) {
          cyan = histogram[2][i];
        } else if (histogram[2][i] > histogram[1][i]) {
          cyan = histogram[1][i];
        }
      }
    }
    arrayArrayToArrayObject[i] = {
      name: i,
      red: histogram[0][i],
      green: histogram[1][i],
      blue: histogram[2][i],
      grey,
      cyan,
      magenta,
      yellow,
    };
  }

  postMessage(arrayArrayToArrayObject);
};
