import React, { useRef, useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import "../components.css";
import { getFilter } from "../helper";

function MainScreen(props) {
  // const [isDown, setIsDown] = useState(false);
  // const [startAxisY, setStartAxisY] = useState(0);
  // const [scrollTop, setScrollTop] = useState(0);
  const [imageURL, setImageURL] = useState(null);
  const [imageOrient, setImageOrient] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [filterStyle, setFilterStyle] = useState(
    "contrast(100%) brightness(100%) blur(0px) opacity(100%) saturate(100%) grayscale(0%) invert(0%) sepia(0%)"
  );

  const scrollRef = useRef(null);
  // const scrollBar = scrollRef.current;

  const screenRef = useRef(null);
  const screen = screenRef.current;

  useEffect(() => {
    setShowImage(false);

    const current = props.currentImage;

    if (current >= 0) {
      setImageURL(props.allImage[current].url);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentImage]);

  useEffect(() => {
    if (props.loadOrient) {
      const current = props.currentImage;

      setImageOrient(props.allImage[current].orient);
      setShowImage(true);

      props.setLoadOrient(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loadOrient]);

  // useEffect(() => {
  //   if (props.loadFilterURL) {
  //     const current = props.currentImage;

  //     setImageURL(props.allImage[current].url);
  //     props.setLoadFilterURL(false);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.loadFilterURL]);

  useEffect(() => {
    if (props.currentImage >= 0 && props.changeFilter) {
      const current = props.currentImage;
      if (props.allImage[current].cssFilter.reset) {
        setFilterStyle("unset");

        props.allImage[current].cssFilter.reset = false;
      } else {
        setFilterStyle(getFilter(props.allImage[current].cssFilter));
      }

      props.setChangeFilter(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.changeFilter]);

  // Open full screen mode and check browser support.
  useEffect(() => {
    if (props.showFullScreen) {
      if (!document.fullscreenElement) {
        screen.requestFullscreen({ navigationUI: "show" }).catch((err) => {
          props.setShowErrorModal(true);
          props.setErrorTitle("Error");
          props.setErrorMessage(
            `Can not attempt to enable full-screen mode: ${err.message} (${err.name})`
          );
        });
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.showFullScreen]);

  // const dragActive = (event) => {
  //   setIsDown(true);
  //   setStartAxisY(event.pageY - screen.offsetTop);
  //   setScrollTop(screen.scrollTop);
  // };

  // const dragMove = (event) => {
  //   if (!isDown) return;

  //   event.preventDefault();
  //   const positionY = event.pageY - screen.offsetTop;
  //   const changeY = positionY - startAxisY;
  //   screen.scrollTop = scrollTop - changeY;
  // };

  const verticalView = ({ style, ...props }) => {
    const customStyle = {
      backgroundColor: `var(--color-1)`,
      opacity: 0.65,
      paddingLeft: 10,
    };
    return <div {...props} style={{ ...style, ...customStyle }} />;
  };

  return (
    <div
      className={
        "main-screen flex f-hcenter f-vcenter " +
        (props.showOption ? "has-option-layout " : "")
      }
    >
      <Scrollbars
        renderThumbVertical={verticalView}
        ref={scrollRef}
        // className={isDown ? "drag-active" : ""}
        // onMouseDown={dragActive}
        // onMouseLeave={() => setIsDown(false)}
        // onMouseUp={() => setIsDown(false)}
        // onMouseMove={dragMove}
      >
        <div className="flex f-hcenter f-vcenter w-100 h-100">
          <img
            ref={screenRef}
            src={imageURL}
            alt="Will label later"
            style={{ filter: filterStyle }}
            className={
              "main-image-preview " +
              (showImage ? "visible " : "invisible ") +
              (imageOrient === "landscape" ? "w-100 " : "h-100 ")
            }
          />
        </div>
      </Scrollbars>
    </div>
  );
}

export default MainScreen;
