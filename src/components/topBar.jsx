import React from "react";
import logo from "../process.svg";
import close from "../cancel.svg";
import "../components.css";
import Tooltip from "@material-ui/core/Tooltip";

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
  return (
    <div className="top-bar flex f-vcenter f-space-between">
      <img className="logo" src={logo} alt="Logo" />
      <div className="flex tag-bar">
        <TagBox tagName={props.imageName} />
      </div>
    </div>
  );
}

export default TopBar;
