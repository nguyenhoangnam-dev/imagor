import React, { useRef, useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import "../components.css";

const { EXIF } = require("exif-js");

function MainScreen(props) {
  // const [isDown, setIsDown] = useState(false);
  // const [startAxisY, setStartAxisY] = useState(0);
  // const [scrollTop, setScrollTop] = useState(0);

  const scrollRef = useRef(null);
  // const scrollBar = scrollRef.current;

  const screenRef = useRef(null);
  const screen = screenRef.current;

  // Get EXIF information to status bar.
  useEffect(() => {
    if (props.imageURL && props.loadImage) {
      EXIF.getData(screen, function () {
        const allMetaData = EXIF.getAllTags(this);

        if (Object.entries(allMetaData).length === 0) {
          props.setLoadInformation(false);
        } else {
          props.allImage[0].maker = allMetaData.Make;
          props.allImage[0].model = allMetaData.Model;
          props.allImage[0].fStop =
            allMetaData.FNumber.numerator / allMetaData.FNumber.denominator;
          props.allImage[0].exposureTime =
            allMetaData.ExposureTime.numerator +
            "/" +
            allMetaData.ExposureTime.denominator;
          props.allImage[0].ISO = "ISO-" + allMetaData.ISOSpeedRatings;
          props.allImage[0].exposureBias = allMetaData.ExposureBias + " step";
          props.allImage[0].focalLength = allMetaData.FocalLength + " mm";
          props.allImage[0].maxAperture =
            allMetaData.MaxApertureValue.numerator /
            allMetaData.MaxApertureValue.denominator;
          props.allImage[0].meteringMode = allMetaData.MeteringMode;
          props.setLoadInformation(true);
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loadImage]);

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
        (props.showOption ? "has-option-layout " : "") +
        (props.loadURL ? "visible" : "invisible ")
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
        <img
          ref={screenRef}
          src={props.imageURL}
          alt="Will label later"
          className={
            "main-image-preview " +
            (props.landscape === "vertical" ? "w-100 " : "h-100 ")
          }
        />
      </Scrollbars>
    </div>
  );
}

export default MainScreen;
