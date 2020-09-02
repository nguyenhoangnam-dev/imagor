import React, { useRef, useEffect, useState } from "react";
import { roundBytes } from "../helper";

function RenderImage(props) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const tempImage = imageRef.current;
  const resetFilter =
    "contrast(100%) brightness(100%) blur(0px) opacity(100%) saturate(100%) grayscale(0%) invert(0%) sepia(0%)";

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [loadImage, setLoadImage] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [imageFilter, setImageFilter] = useState(resetFilter);

  useEffect(() => {
    setImageURL(props.imageURL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentImage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const renderImage = (canvas, imageType) => {
      canvas.toBlob(function (blob) {
        if (blob) {
          props.setImageSize(roundBytes(blob.size));
          props.setImageURL(URL.createObjectURL(blob));
        }
      }, imageType);
    };

    const setFilter = (context, filerType, value) => {
      let filter = imageFilter;

      if (filerType === "blur") {
        value += "px";
      } else {
        value += "%";
      }

      let preFilter;

      if (filerType === "reset") {
        preFilter = resetFilter;
      } else {
        let pattern = new RegExp(`${filerType}\\(\\d+(%|px)\\)`);
        preFilter = filter.replace(pattern, `${filerType}(${value})`);
      }

      context.filter = preFilter;
      setImageFilter(preFilter);
    };

    if (loadImage && (props.changeFilter || props.resetFilter)) {
      canvas.width = imageWidth;
      canvas.height = imageHeight;

      if (props.resetFilter) {
      } else {
        setFilter(context, props.filter, props.value);
      }

      context.drawImage(tempImage, 0, 0, imageWidth, imageHeight);
      renderImage(canvas, props.imageType);
    }

    props.setChangeFilter(false);
    props.setResetFilter(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.changeFilter, props.resetFilter]);

  const loadImageEvent = (event) => {
    let tempImageWidth = event.target.width;
    let tempImageHeight = event.target.height;

    setImageWidth(tempImageWidth);
    setImageHeight(tempImageHeight);

    props.setImageWidth(tempImageWidth);
    props.setImageHeight(tempImageHeight);

    if (tempImageWidth >= tempImageHeight) {
      props.setLandscape("vertical");
    } else {
      props.setLandscape("Horizontal");
    }

    props.setLoadImage(true);
    setLoadImage(true);
  };

  return (
    <>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <img
        ref={imageRef}
        src={imageURL}
        onLoad={loadImageEvent}
        style={{ display: "none", width: "auto", height: "auto" }}
        alt="Temporary"
      />
    </>
  );
}

export default RenderImage;
