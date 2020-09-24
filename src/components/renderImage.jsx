import React, { useRef, useEffect, useState } from "react";
import { getFilter } from "../helper";

// toBlob polyfill
if (!HTMLCanvasElement.prototype.toBlob) {
  Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
    value: function (callback, type, quality) {
      var dataURL = this.toDataURL(type, quality).split(",")[1];
      setTimeout(function () {
        var binStr = atob(dataURL),
          len = binStr.length,
          arr = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          arr[i] = binStr.charCodeAt(i);
        }
        callback(new Blob([arr], { type: type || "image/png" }));
      });
    },
  });
}

function RenderImage(props) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const tempImage = imageRef.current;
  const [imageURL, setImageURL] = useState("");
  const [loadImage, setLoadImage] = useState(false);
  //const [imageFilter, setImageFilter] = useState(resetFilter);

  useEffect(() => {
    const current = props.currentImage;

    if (current >= 0 && props.loadNewImage) {
      setImageURL(props.allImage[current].url);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loadNewImage]);

  // Handle filter event
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const renderImage = (canvas, imageType) => {
      canvas.toBlob(function (blob) {
        if (blob) {
          // props.allImage[props.currentImage].size = roundBytes(blob.size);
          props.allImage[props.currentImage].filterURL = URL.createObjectURL(
            blob
          );

          props.setLoadFilterURL(true);

          if (props.loadNewImage) {
            props.setLoadThumbnail(true);
          }
        }
      }, imageType);
    };

    const current = props.currentImage;
    if (loadImage || props.doneFilter || props.resetFilter) {
      if (current >= 0) {
        let imageWidth = props.allImage[current].width;
        let imageHeight = props.allImage[current].height;
        let thumbnailWidth, thumbnailHeight;

        if (imageWidth >= 1500) {
          thumbnailWidth = 1500;
          thumbnailHeight = (thumbnailWidth * imageWidth) / imageHeight;
        } else {
          thumbnailWidth = imageWidth;
          thumbnailHeight = imageHeight;
        }

        canvas.width = thumbnailWidth;
        canvas.height = thumbnailHeight;

        if (
          props.allImage[current].filterHistory.length - 1 >
          props.allImage[current].filterPosition
        ) {
          props.allImage[current].filterHistory = props.allImage[
            current
          ].filterHistory.slice(0, props.allImage[current].filterPosition + 1);
        }

        if (props.resetFilter) {
          props.allImage[current].filterHistory.push(
            "contrast(100%) brightness(100%) blur(0px) opacity(100%) saturate(100%) grayscale(0%) invert(0%) sepia(0%)"
          );
          props.allImage[current].filterPosition++;
          context.filter = "none";
        } else {
          const currentFilter = getFilter(props.allImage[current].cssFilter);

          props.allImage[current].filterHistory.push(currentFilter);
          props.allImage[current].filterPosition++;
          context.filter = currentFilter;
        }

        if (props.doneFilter) {
          props.setDoneFilter(false);
        }

        context.drawImage(tempImage, 0, 0, thumbnailWidth, thumbnailHeight);
        renderImage(canvas, props.allImage[current].type);
      }
    }

    props.setChangeFilter(false);
    props.setResetFilter(false);
    setLoadImage(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.changeFilter, props.resetFilter, props.doneFilter, loadImage]);

  const handleLoad = (event) => {
    setLoadImage(true);
  };

  return (
    <>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <img
        ref={imageRef}
        src={imageURL}
        onLoad={handleLoad}
        style={{ display: "none", width: "auto", height: "auto" }}
        alt="Temporary"
      />
    </>
  );
}

export default RenderImage;
