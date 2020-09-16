import React, { useState, useEffect } from "react";
import { HotKeys } from "react-hotkeys";

import { notCanvasFilter } from "./global";

import TopBar from "./components/topBar";
import ToolSideBar from "./components/toolSideBar";
import MainScreen from "./components/mainScreen";
import OptionSideBar from "./components/optionSideBar";
import StatusBar from "./components/statusBar";
import RenderImage from "./components/renderImage";
import OptionMinimal from "./components/optionMinimal";

import ErrorModal from "./components/errorModal";
import ExportModal from "./components/exportModal";
import SettingModal from "./components/settingModal";
import UploadModal from "./components/uploadModal";
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

  const [currentFilter, setCurrentFilter] = useState("");
  const [currentValue, setCurrentValue] = useState(null);

  const [currentImage, setCurrentImage] = useState(-1);
  const [countImage, setCountImage] = useState(0);
  const [countAvailable, setCountAvailable] = useState(0);
  const [allImage, setAllImage] = useState([]);

  const [changeFilter, setChangeFilter] = useState(false);
  const [resetFilter, setResetFilter] = useState(false);
  const [doneFilter, setDoneFilter] = useState(false);

  const [disableOpacity, setDisableOpacity] = useState(false);
  const [supportFilter, setSupportFilter] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorTitle, setErrorTitle] = useState(null);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(true);

  const [loadInformation, setLoadInformation] = useState(false);
  const [loadHistogram, setLoadHistogram] = useState(false);
  const [loadOrient, setLoadOrient] = useState(false);
  const [loadFilterURL, setLoadFilterURL] = useState(false);
  const [loadExport, setLoadExport] = useState(false);

  const [showUnload, setShowUnload] = useState(null);
  const [env, setEnv] = useState(null);

  // Theme
  const [color1, setColor1] = useState("#f4eeff");
  const [color2, setColor2] = useState("#dcd6f7");
  const [color3, setColor3] = useState("#a6b1e1");
  const [color4, setColor4] = useState("#424874");
  const [contrast3] = useState("#000000");
  const [textColor] = useState("#000000");

  // Store all hotkey
  const keyMap = {
    TOGGLE_SIDEBAR: "ctrl+b",
    OPEN_EXPORT: "ctrl+shift+e",
    OPEN_UPLOAD: "ctrl+shift+u",
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
    OPEN_UPLOAD: (event) => {
      setShowUploadModal((show) => !show);
    },
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

    setAllImage([
      ...allImage,
      {
        id: countImage,
        name: image.name,
        size: image.size,
        type: image.type,
        url: newImageURL,
        unit: "px",
        loadMeta: false,
        remove: false,
        cssFilter: {
          Contrast: 100,
          Brightness: 100,
          Blur: 0,
          Opacity: 100,
          Saturate: 100,
          Grayscale: 0,
          Invert: 0,
          Sepia: 0,
          reset: false,
        },
        changeFilter: false,
      },
    ]);

    setCurrentImage(countImage);
    setCountImage(countImage + 1);
    setCountAvailable(countAvailable + 1);

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
      setEnv("dev");
    } else {
      setEnv("pro");
    }
  }, []);

  // Event
  useEffect(() => {
    if (env === "pro") {
      setShowUnload(
        <Beforeunload
          onBeforeunload={(event) => {
            if (currentImage === -1) {
              event.preventDefault();
            } else {
              return "Hello world";
            }
          }}
        />
      );
    }
  }, [currentImage, env]);

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
        <TopBar
          countImage={countImage}
          currentImage={currentImage}
          setCurrentImage={setCurrentImage}
          allImage={allImage}
          setAllImage={setAllImage}
          setShowFullScreen={setShowFullScreen}
          setShowExportModal={setShowExportModal}
          setShowSettingModal={setShowSettingModal}
          showUploadModal={showUploadModal}
          setShowUploadModal={setShowUploadModal}
          countAvailable={countAvailable}
          setCountAvailable={setCountAvailable}
        />
        <div className="flex main f-space-between">
          <ToolSideBar />
          <MainScreen
            countImage={countImage}
            currentImage={currentImage}
            allImage={allImage}
            setAllImage={setAllImage}
            showOption={showOption}
            showFullScreen={showFullScreen}
            setShowFullScreen={setShowFullScreen}
            setLoadInformation={setLoadInformation}
            setShowErrorModal={setShowErrorModal}
            setErrorTitle={setErrorTitle}
            setErrorMessage={setErrorMessage}
            loadOrient={loadOrient}
            setLoadOrient={setLoadOrient}
            loadFilterURL={loadFilterURL}
            setLoadFilterURL={setLoadFilterURL}
            changeFilter={changeFilter}
            setChangeFilter={setChangeFilter}
          />
          <OptionSideBar
            countImage={countImage}
            currentImage={currentImage}
            allImage={allImage}
            showOption={showOption}
            setShowOption={setShowOption}
            getFilter={getFilter}
            setChangeFilter={setChangeFilter}
            setResetFilter={setResetFilter}
            disableOpacity={disableOpacity}
            supportFilter={supportFilter}
            setLoadHistogram={setLoadHistogram}
            loadHistogram={loadHistogram}
            loadInformation={loadInformation}
            setDoneFilter={setDoneFilter}
            loadFilterURL={loadFilterURL}
            setLoadFilterURL={setLoadFilterURL}
          />
          <OptionMinimal
            showOption={showOption}
            setShowOption={setShowOption}
          />
        </div>
        <StatusBar
          currentImage={currentImage}
          allImage={allImage}
          changeFilter={changeFilter}
          loadInformation={loadInformation}
          setLoadInformation={setLoadInformation}
          loadHistogram={loadHistogram}
          setLoadHistogram={setLoadHistogram}
        />
        <RenderImage
          countImage={countImage}
          currentImage={currentImage}
          allImage={allImage}
          filter={currentFilter}
          value={currentValue}
          changeFilter={changeFilter}
          setChangeFilter={setChangeFilter}
          resetFilter={resetFilter}
          setResetFilter={setResetFilter}
          loadInformation={loadInformation}
          setLoadInformation={setLoadInformation}
          setLoadHistogram={setLoadHistogram}
          setLoadOrient={setLoadOrient}
          setLoadFilterURL={setLoadFilterURL}
          doneFilter={doneFilter}
          setDoneFilter={setDoneFilter}
          setLoadExport={setLoadExport}
        />
        <UploadModal
          currentImage={currentImage}
          showUploadModal={showUploadModal}
          setShowUploadModal={setShowUploadModal}
          handleFiles={handleFiles}
          setShowErrorModal={setShowErrorModal}
          setErrorTitle={setErrorTitle}
          setErrorMessage={setErrorMessage}
          loadOrient={loadOrient}
        />
        <ErrorModal
          showErrorModal={showErrorModal}
          setShowErrorModal={setShowErrorModal}
          errorMessage={errorMessage}
          errorTitle={errorTitle}
          color1={color1}
          color2={color2}
          color3={color3}
          color4={color4}
          contrast3={contrast3}
          textColor={textColor}
        />
        <ExportModal
          currentImage={currentImage}
          allImage={allImage}
          loadExport={loadExport}
          setLoadExport={setLoadExport}
          showExportModal={showExportModal}
          setShowExportModal={setShowExportModal}
          imageWidth={0}
          imageHeight={0}
          imageName={allImage.length > 0 ? allImage[0].name : ""}
          imageUnit={allImage.length > 0 ? allImage[0].unit : ""}
          imageURL={allImage.length > 0 ? allImage[0].url : ""}
          color1={color1}
          color2={color2}
          color3={color3}
          color4={color4}
          contrast3={contrast3}
          textColor={textColor}
          setColor1={setColor1}
          setColor2={setColor2}
          setColor3={setColor3}
          setColor4={setColor4}
        />
        <SettingModal
          showSettingModal={showSettingModal}
          setShowSettingModal={setShowSettingModal}
          color1={color1}
          color2={color2}
          color3={color3}
          color4={color4}
          textColor={textColor}
          setColor1={setColor1}
          setColor2={setColor2}
          setColor3={setColor3}
          setColor4={setColor4}
        />
      </HotKeys>
      {showUnload}
    </GlobalStyles>
  );
}

export default App;
