import React, { useEffect, useState } from "react";

import logo from "../img/process.svg";
import exportIcon from "../img/inside.svg";
import upload from "../img/cloud-computing.svg";
import changeView from "../img/synchronization.svg";
import setting from "../img/maintenance.svg";
import { ReactComponent as Close } from "../img/cancel.svg";
import fullScreen from "../img/resize.svg";

import "../components.css";
import Tooltip from "@material-ui/core/Tooltip";

function TagBox(props) {
  const [choose, setChoose] = useState(true);

  const chooseImage = () => {
    if (props.currentImage !== props.keyId) {
      props.setCurrentImage(props.keyId);
    }
  };

  const removeImage = (event) => {
    event.stopPropagation();
    props.allImage[props.keyId] = {
      remove: true,
    };

    props.setAllImage(props.allImage);

    props.setCountAvailable((count) => count - 1);

    if (props.countAvailable === 1 || props.currentImage === props.keyId) {
      // Will change to link list for better performance
      let availablePosition = -1;
      for (let i = props.keyId; i >= 0; i--) {
        if (!props.allImage[i].remove) {
          availablePosition = i;
          break;
        }
      }

      if (availablePosition === -1) {
        for (let i = props.keyId; i < props.allImage.length; i++) {
          if (!props.allImage[i].remove) {
            availablePosition = i;
            break;
          }
        }
      }

      props.setCurrentImage(availablePosition);
    }
  };

  useEffect(() => {
    if (props.keyId === props.currentImage) {
      setChoose(true);
    } else {
      setChoose(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentImage]);

  return (
    <div
      className={
        "flex f-space-between tag-box f-vcenter " + (choose ? "choose" : "")
      }
      onClick={chooseImage}
    >
      <Tooltip title={props.tagName} placement="bottom">
        <p className="tag-image-name">{props.tagName}</p>
      </Tooltip>
      <Tooltip title={"Close (Ctrl + W)"} placement="bottom">
        <Close className="close-tag" onClick={removeImage} />
      </Tooltip>
    </div>
  );
}

function TopBar(props) {
  return (
    <div className="top-bar flex f-vcenter f-space-between">
      <div className="top-left-bar flex f-vcenter f-space-between">
        <div className="logo-box flex f-vcenter">
          <img className="logo" src={logo} alt="Logo" />
        </div>
        <div className="flex tag-bar">
          {props.allImage.map((item) =>
            !item.remove ? (
              <TagBox
                key={item.id}
                keyId={item.id}
                tagName={item.name}
                setCurrentImage={props.setCurrentImage}
                currentImage={props.currentImage}
                allImage={props.allImage}
                setAllImage={props.setAllImage}
                countAvailable={props.countAvailable}
                setCountAvailable={props.setCountAvailable}
              />
            ) : (
              ""
            )
          )}
        </div>
      </div>
      <div className="top-right-bar flex f-vcenter f-hright">
        <Tooltip title="Open export image menu" placement="bottom">
          <img
            className={
              "i-25 main-button " +
              (props.currentImage === -1 ? "inactive c-default" : "c-pointer")
            }
            src={exportIcon}
            onClick={(event) => {
              if (props.currentImage === -1) {
                event.preventDefault();
              } else {
                props.setShowExportModal(true);
              }
            }}
            alt="Export button"
          />
        </Tooltip>
        <Tooltip title="Open upload image panel" placement="bottom">
          <img
            className={
              "i-25 main-button " +
              (props.showUploadModal ? "inactive c-default" : "c-pointer")
            }
            src={upload}
            onClick={() => {
              props.setShowUploadModal(true);
            }}
            alt="Upload button"
          />
        </Tooltip>
        <Tooltip title="Open full screen preview" placement="bottom">
          <img
            className={
              "i-25 main-button " +
              (props.currentImage === -1 ? "inactive c-default" : "c-pointer")
            }
            src={fullScreen}
            onClick={() => props.setShowFullScreen(true)}
            alt="Open full screen preview"
          />
        </Tooltip>
        <Tooltip title="Change preview mode" placement="bottom">
          <img
            className={
              "i-25 main-button " +
              (props.currentImage === -1 ? "inactive c-default" : "c-pointer")
            }
            src={changeView}
            alt="Change view button"
          />
        </Tooltip>
        <Tooltip title="Open setting menu" placement="bottom">
          <img
            className={
              "i-25 main-button " +
              (props.currentImage === -1 ? "inactive c-default" : "c-pointer")
            }
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
