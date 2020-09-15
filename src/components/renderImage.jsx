import React, { useRef, useEffect, useState } from "react";
import { roundBytes, getFilter } from "../helper";

const { EXIF } = require("exif-js");
const { Image } = require("image-js");

function RenderImage(props) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const tempImage = imageRef.current;
  //const resetFilter =
  //  "contrast(100%) brightness(100%) blur(0px) opacity(100%) saturate(100%) grayscale(0%) invert(0%) sepia(0%)";

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [loadImage, setLoadImage] = useState(false);
  const [imageURL, setImageURL] = useState("");
  //const [imageFilter, setImageFilter] = useState(resetFilter);

  useEffect(() => {
    const current = props.currentImage;

    if (current >= 0) {
      setImageURL(props.allImage[current].url);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentImage]);

  // Handle filter event
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const renderImage = (canvas, imageType) => {
      canvas.toBlob(function (blob) {
        if (blob) {
          props.allImage[props.currentImage].size = roundBytes(blob.size);
          // props.allImage[props.currentImage].url = URL.createObjectURL(blob);
          props.allImage[props.currentImage].filterURL = URL.createObjectURL(
            blob
          );

          props.setLoadFilterURL(true);
        }
      }, imageType);
    };

    //const setFilter = (context, filerType, value) => {
      //let filter = imageFilter;

     // if (filerType === "blur") {
       // value += "px";
      //} else {
        //value += "%";
      //}

      //let preFilter;

      //if (filerType === "reset") {
        //preFilter = resetFilter;
      //} else {
        //let pattern = new RegExp(`${filerType}\\(\\d+(%|px)\\)`);
        //preFilter = filter.replace(pattern, `${filerType}(${value})`);
      //}

      //context.filter = preFilter;
      //setImageFilter(preFilter);
    ///};

    if (loadImage && (props.doneFilter || props.resetFilter)) {
      canvas.width = imageWidth;
      canvas.height = imageHeight;

      // if (props.resetFilter) {
      // } else {
      //   setFilter(context, props.filter, props.value);
      // }
      const current = props.currentImage;
      if (current >= 0) {
        if (props.allImage[current].cssFilter.reset) {
          context.filter = "unset";

          props.allImage[current].cssFilter.reset = false;
        } else {
          context.filter = getFilter(props.allImage[current].cssFilter);
        }

        if (props.doneFilter) {
          props.setDoneFilter(false);
        }

        context.drawImage(tempImage, 0, 0, imageWidth, imageHeight);
        renderImage(canvas, props.allImage[current].type);
      }
    }

    props.setChangeFilter(false);
    props.setResetFilter(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.changeFilter, props.resetFilter, props.doneFilter]);

  const loadImageEvent = (event) => {
    let tempImageWidth = event.target.width;
    let tempImageHeight = event.target.height;

    setImageWidth(tempImageWidth);
    setImageHeight(tempImageHeight);

    if (!props.allImage[props.currentImage].loadMeta) {
      const current = props.currentImage;

      if (tempImageWidth >= tempImageHeight) {
        props.allImage[current].orient = "landscape";
      } else {
        props.allImage[current].orient = "portrait";
      }

      props.setLoadOrient(true);

      props.allImage[current].width = tempImageWidth;
      props.allImage[current].height = tempImageHeight;

      // Exif-js store data in image element so eraser every time read new image
      tempImage.exifdata = null;

      Image.load(props.allImage[current].url).then((image) => {
        props.allImage[current].colorModel = image.colorModel;
        props.allImage[current].channels = image.channels;
        props.allImage[current].bitDepth = image.bitDepth * image.channels;
        props.allImage[current].histograms = image.getHistograms({
          maxSlots: 256,
          useAlpha: false,
        });

        props.setLoadHistogram(true);
      });

      if (props.allImage[current].type === "image/jpeg") {
        EXIF.getData(tempImage, function () {
          const allMetaData = EXIF.getAllTags(this);

          if (Object.entries(allMetaData).length === 0) {
            props.setLoadInformation(true);
          } else {
            props.allImage[current].maker = allMetaData.Make;
            props.allImage[current].model = allMetaData.Model;

            if (allMetaData.FNumber) {
              props.allImage[current].fStop =
                allMetaData.FNumber.numerator / allMetaData.FNumber.denominator;
            } else {
              props.allImage[current].fStop = null;
            }

            if (allMetaData.ExposureTime) {
              props.allImage[current].exposureTime =
                allMetaData.ExposureTime.numerator +
                "/" +
                allMetaData.ExposureTime.denominator;
            } else {
              props.allImage[current].exposureTime = null;
            }

            if (allMetaData.ISOSpeedRatings) {
              props.allImage[current].ISO =
                "ISO-" + allMetaData.ISOSpeedRatings;
            } else {
              props.allImage[current].ISO = null;
            }

            if (allMetaData.ExposureBias) {
              props.allImage[current].exposureBias =
                allMetaData.ExposureBias + " step";
            } else {
              props.allImage[current].exposureBias = null;
            }

            if (allMetaData.FocalLength) {
              props.allImage[current].focalLength =
                allMetaData.FocalLength + " mm";
            } else {
              props.allImage[current].focalLength = null;
            }

            if (allMetaData.MaxApertureValue) {
              props.allImage[current].maxAperture =
                allMetaData.MaxApertureValue.numerator /
                allMetaData.MaxApertureValue.denominator;
            } else {
              props.allImage[current].maxAperture = null;
            }

            props.allImage[current].meteringMode = allMetaData.MeteringMode;
            props.setLoadInformation(true);
          }
        });
      } else {
        props.setLoadInformation(true);
      }
    } else {
      props.setLoadOrient(true);
      props.setLoadInformation(true);
      props.setLoadHistogram(true);
    }

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
