import React from "react";
import "../components.css";

function MainScreen(props) {
  return (
    <div className="main-screen flex f-hcenter f-vcenter">
      <img
        src={props.imageURL}
        alt="Will label later"
        className={
          (props.loadImage ? "" : "disable ") +
          (props.landscape === "vertical" ? "w-100" : "h-100")
        }
      />
    </div>
  );
}

export default MainScreen;
