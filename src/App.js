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
import ColorPickerModal from "./components/colorPicker";

import { Beforeunload } from "react-beforeunload";

import createGlobalStyle from "styled-components";

import "./components.css";
import "./App.css";

const ExifReader = require("exifreader");

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

  // State of workplace
  const [currentImage, setCurrentImage] = useState(-1);
  const [countImage, setCountImage] = useState(0);
  const [allImage, setAllImage] = useState([]);
  const [allImageTag, setAllImageTag] = useState([]);

  // State of filters
  const [changeFilter, setChangeFilter] = useState(false);
  const [resetFilter, setResetFilter] = useState(false);
  const [doneFilter, setDoneFilter] = useState(false);

  // State of components
  const [showOption, setShowOption] = useState(true);
  const [disableOpacity, setDisableOpacity] = useState(false);
  const [supportFilter, setSupportFilter] = useState(false);

  // Filter history
  const [reloadFilter, setReloadFilter] = useState(false); // Set all filter sliders to default value when change workplaces
  const [undoFilter, setUndoFilter] = useState(false);
  const [redoFilter, setRedoFilter] = useState(false);

  // State of modals
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorTitle, setErrorTitle] = useState(null);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // State of load events
  const [loadFilterURL, setLoadFilterURL] = useState(false);
  const [loadExport, setLoadExport] = useState(false);
  const [loadThumbnail, setLoadThumbnail] = useState(false);
  const [loadNewImage, setLoadNewImage] = useState(false);

  // State of tags
  const [closeTag, setCloseTag] = useState(false);
  const [nextTag, setNextTag] = useState(false);
  const [preTag, setPreTag] = useState(false);

  // State of general
  const [showUnload, setShowUnload] = useState(null);
  const [env, setEnv] = useState(null);
  const [currentColor, setCurrentColor] = useState(null);

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
    CLOSE_CURRENT_TAG: "alt+w",
    OPEN_NEXT_TAG: "alt+n",
    OPEN_PRE_TAG: "alt+p",
    UNDO_FILTER: "alt+z",
    REDO_FILTER: "alt+shift+z",
  };

  // Handle hotkey event
  const handlers = {
    TOGGLE_SIDEBAR: (event) => {
      setShowOption((show) => !show);
    },
    OPEN_EXPORT: (event) => {
      setShowExportModal(true);
    },
    OPEN_UPLOAD: (event) => {
      setShowUploadModal(true);
    },
    OPEN_FULLSCREEN: (event) => {
      setShowFullScreen(true);
    },
    OPEN_SETTING: (event) => {
      setShowSettingModal(true);
    },
    CLOSE_CURRENT_TAG: (event) => {
      setCloseTag(true);
    },
    OPEN_NEXT_TAG: (event) => {
      setNextTag(true);
    },
    OPEN_PRE_TAG: (event) => {
      setPreTag(true);
    },
    UNDO_FILTER: (event) => {
      setUndoFilter(true);
    },
    REDO_FILTER: (event) => {
      setRedoFilter(true);
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
    const imageName = image.name;
    const imageSize = image.size;
    const imageType = image.type;

    // Set image information to layout
    setTitle(imageName + " | " + appName); // Set title of web to name of image

    // Check support option sidebar
    if (!notCanvasFilter) {
      setSupportFilter(true);
    } else {
      setErrorTitle("Warning");
      setErrorMessage("All filters are not supported on your browser.");
      setShowErrorModal(true);
    }

    let colorModel,
      bitDepth,
      maker,
      model,
      exposureTime,
      fNumber,
      focalLength,
      xResolution,
      yResolution,
      width,
      height,
      orient;

    image.arrayBuffer().then((buffer) => {
      const metadata = ExifReader.load(buffer);

      console.log(metadata);
      if (imageType === "image/png") {
        colorModel = metadata["Color Type"].description;

        bitDepth = metadata["Bit Depth"].description;

        width = metadata["Image Width"].value;
        height = metadata["Image Height"].value;

        if (width >= height) {
          orient = "landscape";
        } else {
          orient = "portrait";
        }
      } else if (imageType === "image/jpeg") {
        if (metadata["Color Space"]) {
          colorModel = metadata["Color Space"].description;
        } else {
          colorModel = metadata["Color Components"].description;
        }

        bitDepth = metadata["Bits Per Sample"].description;

        if (metadata.Make) {
          maker = metadata.Make.description;
        }

        if (metadata.Model) {
          model = metadata.Model.description;
        }

        if (metadata.ExposureTime) {
          exposureTime = metadata.ExposureTime.description;
        }

        if (metadata.FNumber) {
          fNumber = metadata.FNumber.description;
        }

        if (metadata.FocalLength) {
          focalLength = metadata.FocalLength.description;
        }

        if (metadata.XResolution) {
          xResolution = metadata.XResolution.description;
        }

        if (metadata.YResolution) {
          yResolution = metadata.YResolution.description;
        }

        width = metadata["Image Width"].value;
        height = metadata["Image Height"].value;

        if (width >= height) {
          orient = "landscape";
        } else {
          orient = "portrait";
        }
      } else if (imageType === "image/webp") {
      }

      // set image URL
      let newImageURL = URL.createObjectURL(image);

      setAllImage([
        ...allImage,
        {
          id: countImage,
          name: imageName,
          size: imageSize,
          type: imageType,
          url: newImageURL,
          colorModel,
          bitDepth,
          maker,
          model,
          exposureTime,
          fNumber,
          focalLength,
          xResolution,
          yResolution,
          width,
          height,
          orient,
          unit: "px",
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
          filterHistory: [
            "contrast(100%) brightness(100%) blur(0px) opacity(100%) saturate(100%) grayscale(0%) invert(0%) sepia(0%)",
          ],
          filterPosition: 0,
        },
      ]);

      setAllImageTag([...allImageTag, { id: countImage, name: imageName }]);

      setCurrentImage(countImage);
      setCountImage(countImage + 1);

      setLoadNewImage(true);
    });

    // Only support opacity filter for png
    if (image.type !== "image/png") {
      setDisableOpacity(true);
    }
  };

  useEffect(() => {
    document.title = title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImage]);

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

  useEffect(() => {
    if (currentImage >= 0) {
      setReloadFilter(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImage]);

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
          allImageTag={allImageTag}
          setAllImageTag={setAllImageTag}
          setShowFullScreen={setShowFullScreen}
          setShowExportModal={setShowExportModal}
          setShowSettingModal={setShowSettingModal}
          showUploadModal={showUploadModal}
          setShowUploadModal={setShowUploadModal}
          closeTag={closeTag}
          setCloseTag={setCloseTag}
          nextTag={nextTag}
          setNextTag={setNextTag}
          preTag={preTag}
          setPreTag={setPreTag}
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
            setShowErrorModal={setShowErrorModal}
            setErrorTitle={setErrorTitle}
            setErrorMessage={setErrorMessage}
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
            setChangeFilter={setChangeFilter}
            setResetFilter={setResetFilter}
            disableOpacity={disableOpacity}
            supportFilter={supportFilter}
            doneFilter={doneFilter}
            setDoneFilter={setDoneFilter}
            loadFilterURL={loadFilterURL}
            setLoadFilterURL={setLoadFilterURL}
            setShowErrorModal={setShowErrorModal}
            setErrorTitle={setErrorTitle}
            setErrorMessage={setErrorMessage}
            loadThumbnail={loadThumbnail}
            setLoadThumbnail={setLoadThumbnail}
            loadNewImage={loadNewImage}
            setLoadNewImage={setLoadNewImage}
            reloadFilter={reloadFilter}
            setReloadFilter={setReloadFilter}
            undoFilter={undoFilter}
            setUndoFilter={setUndoFilter}
            redoFilter={redoFilter}
            setRedoFilter={setRedoFilter}
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
        />
        <RenderImage
          countImage={countImage}
          currentImage={currentImage}
          allImage={allImage}
          changeFilter={changeFilter}
          setChangeFilter={setChangeFilter}
          resetFilter={resetFilter}
          setResetFilter={setResetFilter}
          setLoadFilterURL={setLoadFilterURL}
          doneFilter={doneFilter}
          setDoneFilter={setDoneFilter}
          setLoadExport={setLoadExport}
          setLoadThumbnail={setLoadThumbnail}
          loadNewImage={loadNewImage}
        />
        <UploadModal
          currentImage={currentImage}
          showUploadModal={showUploadModal}
          setShowUploadModal={setShowUploadModal}
          handleFiles={handleFiles}
          setShowErrorModal={setShowErrorModal}
          setErrorTitle={setErrorTitle}
          setErrorMessage={setErrorMessage}
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
          setShowErrorModal={setShowErrorModal}
          setErrorTitle={setErrorTitle}
          setErrorMessage={setErrorMessage}
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
          setShowColorPicker={setShowColorPicker}
          currentColor={currentColor}
          setCurrentColor={setCurrentColor}
          showColorPicker={showColorPicker}
          setShowErrorModal={setShowErrorModal}
          setErrorTitle={setErrorTitle}
          setErrorMessage={setErrorMessage}
        />
        <ColorPickerModal
          showColorPicker={showColorPicker}
          setShowColorPicker={setShowColorPicker}
          currentColor={currentColor}
          setCurrentColor={setCurrentColor}
        />
      </HotKeys>
      {showUnload}
    </GlobalStyles>
  );
}

export default App;
