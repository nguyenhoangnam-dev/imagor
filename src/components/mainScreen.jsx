import React, { useState, useRef } from "react";
import "../components.css";

function MainScreen(props) {
  const [isDown, setIsDown] = useState(false);
  const [startAxisY, setStartAxisY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const screenRef = useRef(null);
  const screen = screenRef.current;

  const dragActive = (event) => {
    setIsDown(true);
    setStartAxisY(event.pageY - screen.offsetTop);
    setScrollTop(screen.scrollTop);
  };

  const dragMove = (event) => {
    if (!isDown) return;

    event.preventDefault();
    const positionY = event.pageY - screen.offsetTop;
    const changeY = positionY - startAxisY;
    screen.scrollTop = scrollTop - changeY;
  };

  return (
    <div
      ref={screenRef}
      className={
        "main-screen flex f-hcenter f-vcenter " +
        (props.showOption ? "has-option-layout " : "") +
        (isDown ? "drag-active" : "")
      }
      onMouseDown={dragActive}
      onMouseLeave={() => setIsDown(false)}
      onMouseUp={() => setIsDown(false)}
      onMouseMove={dragMove}
    >
      <img
        src={props.imageURL}
        alt="Will label later"
        className={
          "main-image-preview " +
          (props.loadImage ? "" : "disable ") +
          (props.landscape === "vertical" ? "w-100 " : "h-100 ")
        }
      />
    </div>
  );
}

export default MainScreen;
