import React from "react";
import logo from "../process.svg";
import close from "../cancel.svg";
import "../components.css";

function TagBox(props) {
  return (
    <div className="flex f-space-between tag-box f-vcenter">
      <p className="tag-image-name">{props.tagName}</p>
      <img className="close-tag" src={close} alt="Close tag" />
    </div>
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
