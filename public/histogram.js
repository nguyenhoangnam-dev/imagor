onmessage = function (event) {
  const histogram = event.data;

  let arrayArrayToArrayObject = [];

  for (let i = 0; i < 256; i++) {
    arrayArrayToArrayObject[i] = {
      name: i,
      red: histogram[0][i],
      green: histogram[1][i],
      blue: histogram[2][i],
    };
  }

  postMessage(arrayArrayToArrayObject);
};
