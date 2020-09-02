import React, { useState, useEffect } from "react";

import { notCanvasFilter } from "./global";
import { roundBytes } from "./helper";

import TopBar from "./components/topBar";
import ToolSideBar from "./components/toolSideBar";
import MainScreen from "./components/mainScreen";
import OptionSideBar from "./components/optionSideBar";
import StatusBar from "./components/statusBar";
import UploadScreen from "./components/uploadScreen";
import RenderImage from "./components/renderImage";

import "./components.css";
import "./App.css";

function App() {
  const appName = "2 Process Image";

  const [title, setTitle] = useState(appName);
  const [showOptionSidebar, setShowOptionSidebar] = useState(true);

  const [imageURL, setImageURL] = useState("");
  const [landscape, setLandscape] = useState("vertical");
  const [imageType, setImageType] = useState("");
  const [imageSize, setImageSize] = useState("");
  const [imageUnit, setImageUnit] = useState("px");
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [imageName, setImageName] = useState("");

  const [currentFilter, setCurrentFilter] = useState("");
  const [currentValue, setCurrentValue] = useState(null);

  const [loadImage, setLoadImage] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [changeFilter, setChangeFilter] = useState(false);
  const [resetFilter, setResetFilter] = useState(false);

  // toBlob polyfill
  if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
      value: function (callback, type, quality) {
        var dataURL = this.toDataURL(type, quality).split(",")[1];
        setTimeout(function () {
          var binStr = atob(dataURL),
            len = binStr.length,
            arr = new Uint8Array(len);
          for (var i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
          }
          callback(new Blob([arr], { type: type || "image/png" }));
        });
      },
    });
  }

  const handleFiles = (image) => {
    // Get information of image
    setImageName(image.name);
    setImageSize(roundBytes(image.size));
    setImageType(image.type);
    // const imageInitialExtension = MIME[imageInitialType].ext;

    // Set image information to layout
    setTitle(image.name + " | " + appName); // Set title of web to name of image

    // Check support option sidebar
    if (notCanvasFilter) {
      setShowOptionSidebar(false);
    }

    // set image blob
    setImageURL(URL.createObjectURL(image));

    setCurrentImage(currentImage + 1);
  };

  const getFilter = (filter, value) => {
    setCurrentFilter(filter);
    setCurrentValue(value);
  };

  useEffect(() => {
    document.title = title;
  });

  return (
    <>
      <UploadScreen handleFiles={handleFiles} />
      <TopBar imageName={imageName} />
      <div className="flex main">
        <ToolSideBar />
        <MainScreen
          imageURL={imageURL}
          landscape={landscape}
          loadImage={loadImage}
        />
        <OptionSideBar
          showOption={showOptionSidebar}
          getFilter={getFilter}
          setChangeFilter={setChangeFilter}
          setResetFilter={setResetFilter}
        />
      </div>
      <StatusBar
        imageType={imageType}
        imageSize={imageSize}
        imageUnit={imageUnit}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
      />
      <RenderImage
        imageURL={imageURL}
        setImageURL={setImageURL}
        setLoadImage={setLoadImage}
        setLandscape={setLandscape}
        setImageWidth={setImageWidth}
        setImageHeight={setImageHeight}
        setImageSize={setImageSize}
        filter={currentFilter}
        value={currentValue}
        imageType={imageType}
        currentImage={currentImage}
        changeFilter={changeFilter}
        setChangeFilter={setChangeFilter}
        resetFilter={resetFilter}
        setResetFilter={setResetFilter}
      />
    </>
  );
}

export default App;
