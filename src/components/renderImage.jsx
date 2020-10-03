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
  const full = useRef(null);
  const imageRef = useRef(null);

  const thumbnail = useRef(null);
  const smallThumbnail = useRef(null);

  const tempImage = imageRef.current;
  const [imageURL, setImageURL] = useState("");
  const [loadImage, setLoadImage] = useState(false);
  //const [imageFilter, setImageFilter] = useState(resetFilter);

  const renderImage = (canvas, imageType, type) => {
    canvas.toBlob(function (blob) {
      if (blob) {
        // props.allImage[props.currentImage].size = roundBytes(blob.size);
        const current = props.currentImage;
        if (type === "thumbnail") {
          const url = URL.createObjectURL(blob);

          props.allImage[current].filterURL = url;
          props.allImageTag[current].thumbnail = url;

          props.allImageTag[current].loadThumbnail = true;

          props.setLoadFilterURL(true);

          if (props.loadNewImage) {
            props.setLoadThumbnail(true);
          }
        } else if (type === "icon") {
          props.allImageTag[current].icon = URL.createObjectURL(blob);

          props.allImageTag[current].loadIcon = true;
          props.setLoadIcon(true);
        }
      }
    }, imageType);
  };

  useEffect(() => {
    const current = props.currentImage;

    if (current >= 0 && props.loadNewImage) {
      setImageURL(props.allImage[current].url);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loadNewImage]);

  // Handle filter event
  useEffect(() => {
    const canvas = thumbnail.current;
    const context = canvas.getContext("2d");

    const current = props.currentImage;
    if (loadImage || props.doneFilter || props.resetFilter) {
      if (current >= 0) {
        let imageWidth = props.allImage[current].width;
        let imageHeight = props.allImage[current].height;
        let thumbnailWidth, thumbnailHeight;

        if (imageWidth >= 1500) {
          thumbnailWidth = 1500;
          thumbnailHeight = (thumbnailWidth * imageHeight) / imageWidth;
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
        renderImage(canvas, props.allImage[current].type, "thumbnail");
      }
    }

    props.setChangeFilter(false);
    props.setResetFilter(false);
    setLoadImage(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.changeFilter, props.resetFilter, props.doneFilter, loadImage]);

  // Load small thumbnail
  useEffect(() => {
    if (props.loadNewImage) {
      const canvas = thumbnail.current;
      const context = canvas.getContext("2d");

      const current = props.currentImage;
      if (loadImage && current >= 0) {
        let imageWidth = props.allImage[current].width;
        let imageHeight = props.allImage[current].height;
        let orient = props.allImage[current].orient;
        let thumbnailWidth, thumbnailHeight;

        if (orient === "landscape") {
          if (imageHeight >= 40) {
            thumbnailHeight = 40;
            thumbnailWidth = (thumbnailHeight * imageWidth) / imageHeight;
          } else {
            thumbnailWidth = imageWidth;
            thumbnailHeight = imageHeight;
          }
        } else {
          if (imageWidth >= 40) {
            thumbnailWidth = 40;
            thumbnailHeight = (thumbnailWidth * imageHeight) / imageWidth;
          } else {
            thumbnailWidth = imageWidth;
            thumbnailHeight = imageHeight;
          }
        }

        canvas.width = thumbnailWidth;
        canvas.height = thumbnailHeight;

        context.drawImage(tempImage, 0, 0, thumbnailWidth, thumbnailHeight);
        renderImage(canvas, props.allImage[current].type, "icon");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadImage]);

  // Render full image
  useEffect(() => {
    if (props.showExportModal) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.showExportModal]);

  const handleLoad = (event) => {
    setLoadImage(true);
  };

  return (
    <>
      <canvas ref={thumbnail} style={{ display: "none" }} />
      <canvas ref={full} style={{ display: "none" }} />
      <canvas ref={smallThumbnail} style={{ display: "none" }} />
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
