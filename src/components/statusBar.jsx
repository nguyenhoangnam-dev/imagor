import React from "react";
import "../components.css";

function StatusBar(props) {
  return (
    <div className="status-bar flex f-hleft f-vcenter">
      <p>{props.imageType}</p>
      <p>{props.imageSize}</p>
      <p>{props.imageWidth + " x " + props.imageHeight}</p>
      <p>{props.imageUnit}</p>
    </div>
  );
}

export default StatusBar;
