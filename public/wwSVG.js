onmessage = function (event) {
  let image = event.data;
  let reader = new FileReader();

  reader.onload = function (event) {
    let svgContent = event.target.result;
    postMessage(svgContent);
  };

  reader.readAsText(image);
};
