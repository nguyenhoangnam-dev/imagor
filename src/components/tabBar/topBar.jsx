import React, { useEffect, useState } from "react";

import logo from "../../img/process.svg";
import exportIcon from "../../img/inside.svg";
import upload from "../../img/cloud-computing.svg";
import changeView from "../../img/synchronization.svg";
import setting from "../../img/maintenance.svg";
import { ReactComponent as Close } from "../../img/cancel.svg";
import fullScreen from "../../img/resize.svg";

import Tooltip from "@material-ui/core/Tooltip";
import ReactTooltip from "react-tooltip";

function TagBox(props) {
  const [choose, setChoose] = useState(true);

  /**
   * Highlight tag after click
   */
  function chooseImage() {
    if (props.currentImage !== props.keyId) {
      props.setCurrentImage(props.keyId);
    }
  }

  /**
   * Remove workplace after press close icon
   */
  function removeImage() {
    let remove = props.allImage[props.keyId];
    URL.revokeObjectURL(remove.url);
    remove = null;

    props.allImage[props.keyId] = {};

    const allImageTag = props.allImageTag;
    let prePosition = -1;
    let nextPosition = -1;

    for (let i = 0; i < allImageTag.length; i++) {
      if (allImageTag[i].id === props.keyId) {
        if (i !== 0) {
          prePosition = allImageTag[i - 1].id;
        }

        if (i !== allImageTag.length - 1) {
          nextPosition = allImageTag[i + 1].id;
        }

        props.allImageTag.splice(i, 1);

        break;
      }
    }

    props.setTrigger(props.trigger + 1);

    if (props.currentImage === props.keyId) {
      if (prePosition !== -1) {
        props.setCurrentImage(prePosition);
      } else if (nextPosition !== -1) {
        props.setCurrentImage(nextPosition);
      } else {
        props.setCurrentImage(-1);
      }
    }
  }

  // Highligh tag after render
  useEffect(() => {
    if (props.keyId === props.currentImage) {
      setChoose(true);
    } else {
      setChoose(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentImage]);

  // Trigger to close workplace
  useEffect(() => {
    if (props.close) {
      removeImage();
      props.setCloseTag(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.close]);

  // Open next workplace
  useEffect(() => {
    if (props.nextTag) {
      const allImageTag = props.allImageTag;
      let firstPosition = allImageTag[0].id;
      let nextPosition = -1;

      for (let i = 0; i < allImageTag.length; i++) {
        if (allImageTag[i].id === props.keyId) {
          if (i !== allImageTag.length - 1) {
            nextPosition = allImageTag[i + 1].id;
          }

          break;
        }
      }

      props.setTrigger(props.trigger + 1);

      if (nextPosition === -1) {
        props.setCurrentImage(firstPosition);
      } else {
        props.setCurrentImage(nextPosition);
      }

      props.setNextTag(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.nextTag]);

  // Open previous workplace
  useEffect(() => {
    if (props.preTag) {
      const allImageTag = props.allImageTag;
      let prePosition = -1;
      let lastPosition = allImageTag[allImageTag.length - 1].id;

      for (let i = 0; i < allImageTag.length; i++) {
        if (allImageTag[i].id === props.keyId) {
          if (i !== 0) {
            prePosition = allImageTag[i - 1].id;
          }

          break;
        }
      }

      props.setTrigger(props.trigger + 1);

      if (prePosition === -1) {
        props.setCurrentImage(lastPosition);
      } else {
        props.setCurrentImage(prePosition);
      }

      props.setPreTag(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.preTag]);

  return (
    <>
      <div
        data-tip
        data-for={"preview" + props.keyId}
        className={
          "flex f-space-between tag-box f-vcenter " + (choose ? "choose " : " ")
        }
        onClick={chooseImage}
      >
        {/* Load preview image as icon */}
        {props.loadIcon ? (
          <div
            className="flex f-hcenter f-vcenter"
            style={{ width: 25, overflow: "hidden", marginRight: 5 }}
          >
            <img src={props.icon} style={{ height: 24 }} alt="icon" />
          </div>
        ) : (
          ""
        )}

        {/* Show name of workplace unless minify tab */}
        {!props.minifyTab ? (
          <p className="tag-image-name">{props.tagName}</p>
        ) : (
          ""
        )}

        {/* Icon to close workplace */}
        <Tooltip title={"Close (Ctrl + W)"} placement="bottom">
          <Close
            className="close-tag"
            onClick={(event) => {
              event.stopPropagation();
              removeImage();
            }}
          />
        </Tooltip>
      </div>

      {/* Show thumbnail of image when hover tag */}
      <ReactTooltip
        id={"preview" + props.keyId}
        aria-haspopup="true"
        place="bottom"
        textColor="var(--text-color)"
        backgroundColor="var(--color-2)"
        effect="solid"
        delayShow={500}
        className="preview-image-tooltip"
      >
        <p>{props.tagName}</p>
        {props.loadThumbnail ? (
          <img
            src={props.thumbnail}
            style={{ width: 230, paddingTop: 10 }}
            alt="Preview"
          />
        ) : (
          ""
        )}
      </ReactTooltip>
    </>
  );
}

function TopBar(props) {
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    if (props.loadIcon) {
      props.setLoadIcon(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loadIcon]);

  return (
    <div className="top-bar flex f-vcenter f-space-between">
      <div className="top-left-bar flex f-vcenter f-space-between">
        {/* Logo imagor */}
        <div className="logo-box flex f-vcenter">
          <img className="logo" src={logo} alt="Logo" />
        </div>

        {/* Store all workplace */}
        <div className="flex tag-bar">
          {props.allImageTag.map((item) => (
            <TagBox
              key={item.id}
              keyId={item.id}
              tagName={item.name}
              icon={item.icon}
              loadIcon={item.loadIcon}
              thumbnail={item.thumbnail}
              loadThumbnail={item.loadThumbnail}
              setCurrentImage={props.setCurrentImage}
              currentImage={props.currentImage}
              allImage={props.allImage}
              setAllImage={props.setAllImage}
              allImageTag={props.allImageTag}
              setAllImageTag={props.setAllImageTag}
              trigger={trigger}
              setTrigger={setTrigger}
              setCloseTag={props.setCloseTag}
              close={props.closeTag && item.id === props.currentImage}
              setNextTag={props.setNextTag}
              nextTag={props.nextTag && item.id === props.currentImage}
              setPreTag={props.setPreTag}
              preTag={props.preTag && item.id === props.currentImage}
              minifyTab={props.minifyTab}
            />
          ))}
        </div>
      </div>
      <div className="top-right-bar flex f-vcenter f-hright">
        {/* Export button */}
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
              } else if (props.currentImage >= 0) {
                props.setShowExportModal(true);
              }
            }}
            alt="Export button"
          />
        </Tooltip>

        {/* Upload button */}
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

        {/* Full-screen button */}
        <Tooltip title="Open full screen preview" placement="bottom">
          <img
            className={
              "i-25 main-button " +
              (props.currentImage === -1 ? "inactive c-default" : "c-pointer")
            }
            src={fullScreen}
            onClick={(event) => {
              if (props.currentImage === -1) {
                event.preventDefault();
              } else if (props.currentImage >= 0) {
                props.setShowFullScreen(true);
              }
            }}
            alt="Open full screen preview"
          />
        </Tooltip>

        {/* Change view */}
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

        {/* Setting button */}
        <Tooltip title="Open setting menu" placement="bottom">
          <img
            className={"i-25 main-button c-pointer"}
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
