import React, { useState, useEffect } from "react";
import { HotKeys } from "react-hotkeys";

import { notCanvasFilter } from "./global";

import TopBar from "./components/topBar";
import ToolSideBar from "./components/toolSideBar";
import MainScreen from "./components/mainScreen";
import OptionSideBar from "./components/optionSideBar";
import StatusBar from "./components/statusBar";
import UploadScreen from "./components/uploadScreen";
import RenderImage from "./components/renderImage";
import OptionMinimal from "./components/optionMinimal";

import ErrorModal from "./components/errorModal";
import ExportModal from "./components/exportModal";
import SettingModal from "./components/settingModal";
import { Beforeunload } from "react-beforeunload";

import createGlobalStyle from "styled-components";

import "./components.css";
import "./App.css";

const GlobalStyles = createGlobalStyle.div`
  height: 100%;
  --color-1: ${(props) => props.color1};
  --color-2: ${(props) => props.color2};
  --color-3: ${(props) => props.color3};
  --color-4: ${(props) => props.color4};
  --contrast-3: ${(props) => props.contrast3};
  --text-color: ${(props) => props.textColor};
`;

function App() {
  const appName = "2 Process Image";

  const [title, setTitle] = useState(appName);
  const [showOption, setShowOption] = useState(true);

  const [imageURL, setImageURL] = useState("");
  const [landscape, setLandscape] = useState("vertical");
  const [imageType, setImageType] = useState("");
  const [imageSize, setImageSize] = useState("");
  const [imageUnit, setImageUnit] = useState(null);
  const [imageWidth, setImageWidth] = useState(null);
  const [imageHeight, setImageHeight] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);

  const [currentFilter, setCurrentFilter] = useState("");
  const [currentValue, setCurrentValue] = useState(null);

  const [loadImage, setLoadImage] = useState(false);
  const [loadURL, setLoadURL] = useState(false);
  const [currentImage, setCurrentImage] = useState(-1);
  const [changeFilter, setChangeFilter] = useState(false);
  const [resetFilter, setResetFilter] = useState(false);
  const [disableOpacity, setDisableOpacity] = useState(false);

  const [allImage, setAllImage] = useState([]);
  const [countImage, setCountImage] = useState(0);
  const [supportFilter, setSupportFilter] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorTitle, setErrorTitle] = useState(null);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);

  const [loadInformation, setLoadInformation] = useState(false);
  const [imageHistogram, setImageHistogram] = useState([]);
  const [loadHistogram, setLoadHistogram] = useState(false);

  const [showUnload, setShowUnload] = useState(null);

  // Temporary open upload panel will change in v0.5.0
  const [showUpload, setShowUpload] = useState(true);

  // Theme
  const [color1] = useState("#f4eeff");
  const [color2] = useState("#dcd6f7");
  const [color3] = useState("#a6b1e1");
  const [color4] = useState("#424874");
  const [contrast3] = useState("#000000");
  const [textColor] = useState("#000000");

  // Store all hotkey
  const keyMap = {
    TOGGLE_SIDEBAR: "ctrl+b",
    OPEN_EXPORT: "ctrl+shift+e",
    // OPEN_UPLOAD: "ctrl+shift+u",
    OPEN_FULLSCREEN: "ctrl+shift+f",
    OPEN_SETTING: "alt+s",
  };

  // Handle hotkey event
  const handlers = {
    TOGGLE_SIDEBAR: (event) => {
      setShowOption((show) => !show);
    },
    OPEN_EXPORT: (event) => {
      setShowExportModal((show) => !show);
    },
    // OPEN_UPLOAD: (event) => {
    //   setErrorTitle("Error");
    //   setErrorMessage("Test error modal.");
    //   setShowErrorModal((show) => !show);
    // },
    OPEN_FULLSCREEN: (event) => {
      setShowFullScreen((show) => !show);
    },
    OPEN_SETTING: (event) => {
      setShowSettingModal((show) => !show);
    },
  };

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
    setImageUnit("px");

    // const imageInitialExtension = MIME[imageInitialType].ext;

    // Set image information to layout
    setTitle(image.name + " | " + appName); // Set title of web to name of image

    // Check support option sidebar
    if (!notCanvasFilter) {
      setSupportFilter(true);
    } else {
      setErrorTitle("Warning");
      setErrorMessage("All filters are not supported on your browser.");
      setShowErrorModal(true);
    }

    // set image blob
    let newImageURL = URL.createObjectURL(image);
    setImageURL(newImageURL);
    setLoadURL(true);

    setCurrentImage(countImage);
    setCountImage(countImage + 1);

    setAllImage([
      ...allImage,
      {
        id: currentImage + 1,
        name: image.name,
        size: image.size,
        type: image.type,
        url: newImageURL,
        unit: "px",
      },
    ]);

    // Only support opacity filter for png
    if (image.type !== "image/png") {
      setDisableOpacity(true);
    }
  };

  const getFilter = (filter, value) => {
    setCurrentFilter(filter);
    setCurrentValue(value);
  };

  useEffect(() => {
    document.title = title;
  });

  // Check product or development mode
  useEffect(() => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    } else {
      setShowUnload(
        <Beforeunload onBeforeunload={() => "You'll lose your data!"} />
      );
    }
  }, []);

  return (
    <GlobalStyles
      color1={color1}
      color2={color2}
      color3={color3}
      color4={color4}
      contrast3={contrast3}
      textColor={textColor}
    >
      <HotKeys keyMap={keyMap} handlers={handlers} className="h-100">
        <UploadScreen
          handleFiles={handleFiles}
          loadImage={loadImage}
          setImageName={setImageName}
          setImageSize={setImageSize}
          setImageType={setImageType}
          setImageBlob={setImageBlob}
          setShowErrorModal={setShowErrorModal}
          setErrorTitle={setErrorTitle}
          setErrorMessage={setErrorMessage}
          showUpload={showUpload}
          setShowUpload={setShowUpload}
          currentImage={currentImage}
        />
        <TopBar
          imageName={imageName}
          countImage={countImage}
          allImage={allImage}
          setShowFullScreen={setShowFullScreen}
          setShowExportModal={setShowExportModal}
          setShowSettingModal={setShowSettingModal}
          setShowUpload={setShowUpload}
          currentImage={currentImage}
        />
        <div className="flex main f-space-between">
          <ToolSideBar />
          <MainScreen
            imageURL={imageURL}
            landscape={landscape}
            loadImage={loadImage}
            showOption={showOption}
            setShowFullScreen={setShowFullScreen}
            showFullScreen={showFullScreen}
            allImage={allImage}
            setAllImage={setAllImage}
            setLoadInformation={setLoadInformation}
            setShowErrorModal={setShowErrorModal}
            setErrorTitle={setErrorTitle}
            setErrorMessage={setErrorMessage}
            loadURL={loadURL}
          />
          <OptionSideBar
            showOption={showOption}
            setShowOption={setShowOption}
            getFilter={getFilter}
            setChangeFilter={setChangeFilter}
            setResetFilter={setResetFilter}
            disableOpacity={disableOpacity}
            supportFilter={supportFilter}
            setLoadHistogram={setLoadHistogram}
            loadHistogram={loadHistogram}
            imageHistogram={imageHistogram}
            allImage={allImage}
            currentImage={currentImage}
            loadImage={loadImage}
          />
          <OptionMinimal
            showOption={showOption}
            setShowOption={setShowOption}
          />
        </div>
        <StatusBar
          loadImage={loadImage}
          setLoadImage={setLoadImage}
          currentImage={currentImage}
          imageURL={imageURL}
          imageType={imageType}
          imageSize={imageSize}
          imageUnit={imageUnit}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          changeFilter={changeFilter}
          imageBlob={imageBlob}
          allImage={allImage}
          loadInformation={loadInformation}
          imageHistogram={imageHistogram}
          setImageHistogram={setImageHistogram}
          setLoadHistogram={setLoadHistogram}
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
          allImage={allImage}
        />
        <ErrorModal
          showErrorModal={showErrorModal}
          setShowErrorModal={setShowErrorModal}
          errorMessage={errorMessage}
          errorTitle={errorTitle}
        />
        <ExportModal
          showExportModal={showExportModal}
          setShowExportModal={setShowExportModal}
          imageWidth={0}
          imageHeight={0}
          imageName={allImage.length > 0 ? allImage[0].name : ""}
          imageUnit={allImage.length > 0 ? allImage[0].unit : ""}
          imageURL={allImage.length > 0 ? allImage[0].url : ""}
        />
        <SettingModal
          showSettingModal={showSettingModal}
          setShowSettingModal={setShowSettingModal}
        />
      </HotKeys>
      {showUnload}
    </GlobalStyles>
  );
}

export default App;
