import React from "react";

import logo from "../process.svg";
import exportIcon from "../inside.svg";
import upload from "../cloud-computing.svg";
import changeView from "../synchronization.svg";
import setting from "../maintenance.svg";
import close from "../cancel.svg";
import fullScreen from "../resize.svg";

import "../components.css";
import Tooltip from "@material-ui/core/Tooltip";
// import ExportModal from "./exportModal";
// import SettingModal from "./settingModal";

function TagBox(props) {
  return (
    <div
      className={
        "flex f-space-between tag-box f-vcenter " +
        (props.choose ? "choose" : "")
      }
    >
      <Tooltip title={props.tagName} placement="bottom">
        <p className="tag-image-name">{props.tagName}</p>
      </Tooltip>
      <Tooltip title={"Close (Ctrl + W)"} placement="bottom">
        <img className="close-tag" src={close} alt="Close tag" />
      </Tooltip>
    </div>
  );
}

function TopBar(props) {
  // const [showExportModal, setShowExportModal] = useState(false);
  // const [showSettingModal, setShowSettingModal] = useState(false);
  // const [showFullScreen, setShowFullScreen] = useState(false)
  // const [allTagBox, setAllTagBox] = useState(null);

  // useEffect(() => {
  //   if (props.countImage > 0) {
  //     let newTagBox = "";
  //     props.allImage.forEach((element) => {
  //       newTagBox += <TagBox tagName={element.name} />;
  //     });
  //     setAllTagBox(newTagBox);
  //   } else {
  //     setAllTagBox("");
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.allImage]);

  return (
    <div className="top-bar flex f-vcenter f-space-between">
      <div className="top-left-bar flex f-vcenter f-space-between">
        <div className="logo-box flex f-vcenter">
          <img className="logo" src={logo} alt="Logo" />
        </div>
        <div className="flex tag-bar">
          {props.allImage.map((item) => (
            <TagBox
              key={item.id}
              choose={item.id === props.currentImage}
              tagName={item.name}
            />
          ))}
        </div>
      </div>
      <div className="top-right-bar flex f-vcenter f-hright">
        <Tooltip title="Open export image menu" placement="bottom">
          <img
            className="i-25 main-button"
            src={exportIcon}
            onClick={() => props.setShowExportModal(true)}
            alt="Export button"
          />
        </Tooltip>
        <Tooltip title="Open upload image panel" placement="bottom">
          <img
            className="i-25 main-button"
            src={upload}
            onClick={() => {
              props.setShowUpload(true);
            }}
            alt="Upload button"
          />
        </Tooltip>
        <Tooltip title="Open full screen preview" placement="bottom">
          <img
            className="i-25 main-button"
            src={fullScreen}
            onClick={() => props.setShowFullScreen(true)}
            alt="Open full screen preview"
          />
        </Tooltip>
        <Tooltip title="Change preview mode" placement="bottom">
          <img
            className="i-25 main-button"
            src={changeView}
            alt="Change view button"
          />
        </Tooltip>
        <Tooltip title="Open setting menu" placement="bottom">
          <img
            className="i-25 main-button"
            src={setting}
            onClick={() => props.setShowSettingModal(true)}
            alt="Setting button"
          />
        </Tooltip>
      </div>
    </div>
  );
}

export default TopBar;
