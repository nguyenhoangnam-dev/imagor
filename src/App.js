import React, { useState, useEffect } from 'react';
import { HotKeys } from 'react-hotkeys';

import { notCanvasFilter } from './helper/global';

import {
  TopBar,
  ToolSideBar,
  MainScreen,
  OptionSideBar,
  OptionMinimal,
  StatusBar,
  RenderImage,
} from './layout';

import {
  ErrorModal,
  ExportModal,
  SettingModal,
  UploadModal,
  ColorPickerModal,
  MetadataModal,
} from './modal';

import { Beforeunload } from 'react-beforeunload';

import createGlobalStyle from 'styled-components';

import './components.css';
import './App.css';

const ExifReader = require('exifreader');

// Send theme to the styled-components
const GlobalStyles = createGlobalStyle.div`
  height: 100%;
  --color-1: ${(props) => props.color1};
  --color-2: ${(props) => props.color2};
  --color-3: ${(props) => props.color3};
  --color-4: ${(props) => props.color4};
  --contrast-3: ${(props) => props.contrast3};
  --text-color: ${(props) => props.textColor};
  --inactive-color: ${(props) => props.inactiveColor}
  --icon-color: ${(props) => props.iconColor}
`;

Notification.requestPermission().then(function (permission) {});

function App() {
  const appName = 'Imagor'; // Name of the project may change in the future.
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
  const [showMetadataModal, setShowMetadataModal] = useState(false);

  // State of load events
  const [loadFilterURL, setLoadFilterURL] = useState(false);
  const [loadExport, setLoadExport] = useState(false);
  const [loadThumbnail, setLoadThumbnail] = useState(false);
  const [loadNewImage, setLoadNewImage] = useState(false);
  const [loadIcon, setLoadIcon] = useState(false);
  const [loadUrl, setLoadUrl] = useState(false);

  // State of tags
  const [closeTag, setCloseTag] = useState(false);
  const [nextTag, setNextTag] = useState(false);
  const [preTag, setPreTag] = useState(false);

  // State of general
  const [showUnload, setShowUnload] = useState(null);
  const [env, setEnv] = useState(null);
  const [currentColor, setCurrentColor] = useState(null);
  const [currentInput, setCurrentInput] = useState(null);
  const [showNotification, setShowNotification] = useState(true);
  const [silentNotification, setSilentNotification] = useState(false);
  const [minifyTab, setMinifyTab] = useState(false);
  const [renderImage, setRenderImage] = useState(false);
  const [exportSetting, setExportSetting] = useState({});
  // const [wasm, setWasm] = useState({});

  // Theme
  const [color1, setColor1] = useState('#f4eeff');
  const [color2, setColor2] = useState('#dcd6f7');
  const [color3, setColor3] = useState('#a6b1e1');
  const [color4, setColor4] = useState('#424874');
  const [contrast3] = useState('#000000');
  const [textColor, setTextColor] = useState('#000000');
  const [inactiveColor, setInactiveColor] = useState('#a7b6d4');
  const [iconColor, setIconColor] = useState('#000000');

  // Store all hotkey
  const keyMap = {
    TOGGLE_SIDEBAR: 'ctrl+b',
    OPEN_EXPORT: 'ctrl+shift+e',
    OPEN_UPLOAD: 'ctrl+shift+u',
    OPEN_FULLSCREEN: 'ctrl+shift+f',
    OPEN_SETTING: 'alt+s',
    CLOSE_CURRENT_TAG: 'alt+w',
    OPEN_NEXT_TAG: 'alt+n',
    OPEN_PRE_TAG: 'alt+p',
    UNDO_FILTER: 'alt+z',
    REDO_FILTER: 'alt+shift+z',
    CLOSE_MODAL: 'alt+x',
    OPEN_METADATA: 'alt+i',
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
    CLOSE_MODAL: (event) => {
      if (showErrorModal) {
        setShowErrorModal(false);
      } else if (showSettingModal) {
        setShowSettingModal(false);
      } else if (showExportModal) {
        setShowExportModal(false);
      } else if (showUploadModal) {
        setShowUploadModal(false);
      } else if (showColorPicker) {
        setShowColorPicker(false);
      } else if (showMetadataModal) {
        setShowMetadataModal(false);
      }
    },
    OPEN_METADATA: (event) => {
      setShowMetadataModal(true);
    },
  };

  /**
   * Handle image after upload to get information use ExifReader.
   * TODO: Add meta object to store all metadata.
   * @param {File} image Store data of image after upload.
   */
  function handleFiles(image) {
    const imageName = image.name;
    const imageSize = image.size;
    const imageType = image.type;

    // Set image information to layout
    setTitle(imageName + ' | ' + appName); // Set title of web to name of image

    // Check support filter in canvas before renders.
    if (!notCanvasFilter) {
      setSupportFilter(true);
    } else {
      setErrorTitle('Warning');
      setErrorMessage('All filters are not supported on your browser.');
      setShowErrorModal(true);
    }

    let width, height, orient;

    // ExifReader only working with buffer. Therefore, using arrayBuffer() to change blob -> buffer
    image.arrayBuffer().then((buffer) => {
      // const metadata = ExifReader.load(buffer);

      const metadata = ExifReader.load(buffer, { expanded: true });

      // Because of different property between file types.
      if (imageType === 'image/png') {
        const PNG = metadata.pngFile;
        // This is dimension of the image in px.
        width = PNG['Image Width'].value;
        height = PNG['Image Height'].value;

        if (width >= height) {
          orient = 'landscape';
        } else {
          orient = 'portrait';
        }
      } else if (imageType === 'image/jpeg') {
        // Delete metadata of thumbnail
        delete metadata.Thumbnail;

        const JPG = metadata.file;
        // This is dimension of the image in px.
        width = JPG['Image Width'].value;
        height = JPG['Image Height'].value;

        if (width >= height) {
          orient = 'landscape';
        } else {
          orient = 'portrait';
        }
      } else if (imageType === 'image/webp') {
        // Delete metadata of thumbnail
        delete metadata.Thumbnail;
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
          width,
          height,
          orient,
          unit: 'px',
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
            'contrast(100%) brightness(100%) blur(0px) opacity(100%) saturate(100%) grayscale(0%) invert(0%) sepia(0%)',
          ],
          filterPosition: 0,
          metadata,
        },
      ]);

      // This store only id and name for top bar.
      setAllImageTag([
        ...allImageTag,
        {
          id: countImage,
          name: imageName,
          icon: '',
          loadIcon: false,
          thumbnail: '',
          loadThumbnail: false,
        },
      ]);

      setCurrentImage(countImage); // This is id of each image.
      setCountImage(countImage + 1); // This is the head number of image.

      setLoadNewImage(true); // This state trigger option bar to generate histogram.
    });

    // Only support opacity filter for png
    if (image.type !== 'image/png') {
      setDisableOpacity(true);
    }
  }

  // useEffect(() => {
  //   // eslint-disable-next-line no-unused-expressions
  //   const loadWasm = async () => {
  //     try {
  //       setWasm(await import("external"));
  //     } catch (err) {
  //       console.error(
  //         `Unexpected error in loadWasm. [Message: ${err.message}]`
  //       );
  //     }
  //   };

  //   loadWasm();
  // }, []);

  // This Effect change title of the websites after switch workplace.
  useEffect(() => {
    document.title = title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImage]);

  // Check product or development mode
  useEffect(() => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      setEnv('dev');
    } else {
      setEnv('pro');
    }
  }, []);

  // Trigger when website close with some workplaces till working.
  useEffect(() => {
    if (env === 'pro') {
      setShowUnload(
        <Beforeunload
          onBeforeunload={(event) => {
            if (currentImage === -1) {
              event.preventDefault();
            } else {
              return '';
            }
          }}
        />
      );
    }
  }, [currentImage, env]);

  // Reload filter when change workplace
  useEffect(() => {
    if (currentImage >= 0) {
      setReloadFilter(true);

      setExportSetting({
        type: allImage[currentImage].type,
        width: allImage[currentImage].width,
        height: allImage[currentImage].height,
      });
    } else {
      setSupportFilter(false); // Disable all filter
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImage]);

  return (
    // This is main theme of the website.
    <GlobalStyles
      color1={color1}
      color2={color2}
      color3={color3}
      color4={color4}
      contrast3={contrast3}
      textColor={textColor}
      inactiveColor={inactiveColor}
      iconColor={iconColor}
    >
      {/* This component store all keymap for the website. */}
      <HotKeys keyMap={keyMap} handlers={handlers} className="h-100">
        {/* This bar show all workplace available and switch between them. */}
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
          loadIcon={loadIcon}
          setLoadIcon={setLoadIcon}
          loadThumbnail={loadThumbnail}
          closeTag={closeTag}
          setCloseTag={setCloseTag}
          nextTag={nextTag}
          setNextTag={setNextTag}
          preTag={preTag}
          setPreTag={setPreTag}
          minifyTab={minifyTab}
        />

        {/* This is main area of the website. */}
        <div className="flex main f-space-between">
          {/* This bar stores some tools to manipulate the image. */}
          <ToolSideBar />

          {/* This screen show the image of workplace. */}
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

          {/* This bar has histogram and sliders. */}
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

          {/* This bar store icon of other bars, use to toggle other bars */}
          <OptionMinimal
            showOption={showOption}
            setShowOption={setShowOption}
          />
        </div>

        {/* This bar show most of important information of image such as width, height, etc. */}
        <StatusBar
          currentImage={currentImage}
          allImage={allImage}
          changeFilter={changeFilter}
          setShowMetadataModal={setShowMetadataModal}
        />

        {/* This is where image is rendered to URL. */}
        <RenderImage
          countImage={countImage}
          currentImage={currentImage}
          allImage={allImage}
          allImageTag={allImageTag}
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
          showExportModal={showExportModal}
          setLoadIcon={setLoadIcon}
          setLoadUrl={setLoadUrl}
          renderImage={renderImage}
          setRenderImage={setRenderImage}
          exportSetting={exportSetting}
        />

        {/* This is menu to upload the image. Currently support jpg, png, webp, svg. */}
        <UploadModal
          currentImage={currentImage}
          allImageTag={allImageTag}
          showUploadModal={showUploadModal}
          setShowUploadModal={setShowUploadModal}
          handleFiles={handleFiles}
          setShowErrorModal={setShowErrorModal}
          setErrorTitle={setErrorTitle}
          setErrorMessage={setErrorMessage}
          color1={color1}
          color2={color2}
          color3={color3}
          color4={color4}
          textColor={textColor}
        />

        {/* This is error modal show more information about problem. */}
        <ErrorModal
          showErrorModal={showErrorModal}
          setShowErrorModal={setShowErrorModal}
          errorMessage={errorMessage}
          errorTitle={errorTitle}
          color1={color1}
          color2={color2}
          color3={color3}
          color4={color4}
          textColor={textColor}
        />

        {/* This is menu to choose destination type, name, dimension before render and download. */}
        <ExportModal
          currentImage={currentImage}
          allImage={allImage}
          loadExport={loadExport}
          setLoadExport={setLoadExport}
          showExportModal={showExportModal}
          setShowExportModal={setShowExportModal}
          imageWidth={0}
          imageHeight={0}
          color1={color1}
          color2={color2}
          color3={color3}
          color4={color4}
          textColor={textColor}
          setShowErrorModal={setShowErrorModal}
          setErrorTitle={setErrorTitle}
          setErrorMessage={setErrorMessage}
          showNotification={showNotification}
          silentNotification={silentNotification}
          loadUrl={loadUrl}
          setLoadUrl={setLoadUrl}
          setRenderImage={setRenderImage}
          setExportSetting={setExportSetting}
        />

        {/* This is setting menu for change config of the website. */}
        <SettingModal
          showSettingModal={showSettingModal}
          setShowSettingModal={setShowSettingModal}
          color1={color1}
          color2={color2}
          color3={color3}
          color4={color4}
          textColor={textColor}
          inactiveColor={inactiveColor}
          iconColor={iconColor}
          setColor1={setColor1}
          setColor2={setColor2}
          setColor3={setColor3}
          setColor4={setColor4}
          setTextColor={setTextColor}
          setInactiveColor={setInactiveColor}
          setIconColor={setIconColor}
          setShowColorPicker={setShowColorPicker}
          currentColor={currentColor}
          setCurrentColor={setCurrentColor}
          currentInput={currentInput}
          setCurrentInput={setCurrentInput}
          showColorPicker={showColorPicker}
          setShowErrorModal={setShowErrorModal}
          setErrorTitle={setErrorTitle}
          setErrorMessage={setErrorMessage}
          showNotification={showNotification}
          setShowNotification={setShowNotification}
          silentNotification={silentNotification}
          setSilentNotification={setSilentNotification}
          minifyTab={minifyTab}
          setMinifyTab={setMinifyTab}
        />

        {/* This is color picker menu. */}
        <ColorPickerModal
          showColorPicker={showColorPicker}
          setShowColorPicker={setShowColorPicker}
          currentColor={currentColor}
          setCurrentColor={setCurrentColor}
          color1={color1}
          color2={color2}
          color3={color3}
          color4={color4}
          textColor={textColor}
        />

        {/* Show all metadata of image */}
        <MetadataModal
          allImage={allImage}
          currentImage={currentImage}
          showMetadataModal={showMetadataModal}
          setShowMetadataModal={setShowMetadataModal}
          color1={color1}
          color2={color2}
          color3={color3}
          color4={color4}
          textColor={textColor}
        />
      </HotKeys>
      {showUnload}
    </GlobalStyles>
  );
}

export default App;
