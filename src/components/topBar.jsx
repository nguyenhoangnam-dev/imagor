import React, { useState, useEffect } from "react";
import logo from "../process.svg";
import exportIcon from "../inside.svg";
import upload from "../cloud-computing.svg";
import changeView from "../synchronization.svg";
import setting from "../maintenance.svg";
import close from "../cancel.svg";
import "../components.css";
import Tooltip from "@material-ui/core/Tooltip";
import ExportModal from "./exportModal";
import SettingModal from "./settingModal";

function TagBox(props) {
  return (
    <Tooltip title={props.tagName} placement="bottom">
      <div className="flex f-space-between tag-box f-vcenter">
        <p className="tag-image-name">{props.tagName}</p>
        <img className="close-tag" src={close} alt="Close tag" />
      </div>
    </Tooltip>
  );
}

function TopBar(props) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);
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
        <img className="logo" src={logo} alt="Logo" />
        <div className="flex tag-bar">
          {props.allImage.map((item) => (
            <TagBox key={item.id} tagName={item.name} />
          ))}
        </div>
      </div>
      <div className="top-right-bar flex f-vcenter f-hright">
        <Tooltip title="Open export image menu" placement="bottom">
          <img
            className="i-25 main-button"
            src={exportIcon}
            onClick={() => setShowExportModal(true)}
            alt="Export button"
          />
        </Tooltip>
        <Tooltip title="Open upload image panel" placement="bottom">
          <img className="i-25 main-button" src={upload} alt="Upload button" />
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
            onClick={() => setShowSettingModal(true)}
            alt="Setting button"
          />
        </Tooltip>
        <ExportModal
          showExportModal={showExportModal}
          setShowExportModal={setShowExportModal}
          imageWidth={0}
          imageHeight={0}
          imageName={props.allImage.length > 0 ? props.allImage[0].name : ""}
          imageUnit={props.allImage.length > 0 ? props.allImage[0].unit : ""}
          imageURL={props.allImage.length > 0 ? props.allImage[0].url : ""}
        />
        <SettingModal
          showSettingModal={showSettingModal}
          setShowSettingModal={setShowSettingModal}
        />
      </div>
    </div>
  );
}

export default TopBar;
