import React, { useState, useEffect } from "react";

import { roundBytes } from "../helper";

import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import Tooltip from "@material-ui/core/Tooltip";

import github from "../img/github.svg";
import information from "../img/information.svg";

const useStyles = makeStyles((theme) => ({
  progress: {
    height: 14,
    borderRadius: 8,
    width: 200,
    marginLeft: 15,
  },
  colorPrimary: {
    backgroundColor: "var(--color-1)",
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "var(--color-2)",
  },
}));

function StatusBar(props) {
  const classes = useStyles();

  const [progressFilterValue, setProgressFilterValue] = useState(0);
  const [colorModel, setColorModel] = useState(null);
  const [bitDepth, setBitDepth] = useState(null);
  const [maker, setMaker] = useState(null);
  const [model, setModel] = useState(null);
  const [fNumber, setFNumber] = useState(null);
  const [exposureTime, setExposureTime] = useState(null);
  const [focalLength, setFocalLength] = useState(null);
  const [xResolution, setXResolution] = useState(null);
  const [yResolution, setYResolution] = useState(null);

  const [imageType, setImageType] = useState(null);
  const [imageSize, setImageSize] = useState(null);
  const [imageUnit, setImageUnit] = useState(null);
  const [imageWidth, setImageWidth] = useState(null);
  const [imageHeight, setImageHeight] = useState(null);

  // Set metadata
  useEffect(() => {
    if (props.currentImage >= 0) {
      setProgressFilterValue(0);

      const progressAnimation = setInterval(function () {
        setProgressFilterValue((oldProgress) => {
          if (oldProgress === 100 || props.loadHistogram) {
            clearInterval(progressAnimation);
            return 100;
          }

          return oldProgress + 1;
        });

        return () => {
          clearInterval(progressAnimation);
        };
      }, 10);

      const current = props.currentImage;
      const allImage = props.allImage[current];
      const metadata = allImage.metadata;

      setImageType(allImage.type);
      setImageSize(roundBytes(allImage.size));
      setImageUnit(allImage.unit);
      setImageWidth(allImage.width);
      setImageHeight(allImage.height);

      if (allImage.type === "image/jpeg") {
        if (metadata.icc) {
          setColorModel(metadata.icc["Color Space"].description);
        } else {
          setColorModel(metadata.file["Color Components"].description);
        }

        setBitDepth(metadata.file["Bits Per Sample"].description);

        if (metadata.exif) {
          const Exif = metadata.exif;

          if (Exif.Make) {
            setMaker(Exif.Make.description);
          } else {
            setMaker(null);
          }

          if (Exif.Modal) {
            setModel(Exif.Modal.description);
          } else {
            setModel(null);
          }

          if (Exif.ExposureTime) {
            setExposureTime(Exif.ExposureTime.description);
          } else {
            setExposureTime(null);
          }

          if (Exif.FNumber) {
            setFNumber(Exif.FNumber.description);
          } else {
            setFNumber(null);
          }

          if (Exif.FocalLength) {
            setFocalLength(Exif.FocalLength.description);
          } else {
            setFocalLength(null);
          }

          if (Exif.XResolution) {
            setXResolution(Exif.XResolution.description);
          } else {
            setXResolution(null);
          }

          if (Exif.yResolution) {
            setYResolution(Exif.yResolution.description);
          } else {
            setYResolution(null);
          }
        } else {
          setMaker(null);
          setModel(null);
          setFNumber(null);
          setExposureTime(null);
          setFocalLength(null);
          setXResolution(null);
          setYResolution(null);
        }
      } else if (allImage.type === "image/png") {
        const PNG = metadata.pngFile;
        /**
         * Color type describes the image data.
         * 0: Grayscale
         * 2: RGB
         * 3: Palette
         * 4: Grayscale with alpha
         * 6: RGB with alpha
         */
        setColorModel(PNG["Color Type"].description);

        // This is number of bit to store each channel of one pixel.
        setBitDepth(PNG["Bit Depth"].description);

        setMaker(null);
        setModel(null);
        setFNumber(null);
        setExposureTime(null);
        setFocalLength(null);
        setXResolution(null);
        setYResolution(null);
      }
    } else {
      setImageType(null);
      setImageSize(null);
      setImageUnit(null);
      setImageWidth(null);
      setImageHeight(null);

      setColorModel(null);
      setBitDepth(null);

      setMaker(null);
      setModel(null);
      setFNumber(null);
      setExposureTime(null);
      setFocalLength(null);
      setXResolution(null);
      setYResolution(null);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentImage]);

  return (
    <div className="status-bar flex f-vcenter f-space-between">
      <div className="flex f-hleft f-vcenter">
        {/* Progress bar */}
        <Tooltip title="Progress bar" placement="top">
          <LinearProgress
            className={classes.progress}
            classes={{
              colorPrimary: classes.colorPrimary,
              bar: classes.bar,
            }}
            variant="determinate"
            value={progressFilterValue}
          />
        </Tooltip>

        {/* Show image type */}
        <Tooltip title="Image type" placement="top">
          <p>{imageType}</p>
        </Tooltip>

        {/* Show image size */}
        <Tooltip title="Image size" placement="top">
          <p>{imageSize}</p>
        </Tooltip>

        {/* Show image dimension */}
        <Tooltip title="Image dimension" placement="top">
          <p>
            {imageWidth && imageHeight ? imageWidth + " x " + imageHeight : ""}
          </p>
        </Tooltip>

        {/* Show image unit */}
        <Tooltip title="Image unit" placement="top">
          <p>{imageUnit}</p>
        </Tooltip>

        {/* Show color model */}
        <Tooltip title="Image colour model" placement="top">
          <p>{colorModel}</p>
        </Tooltip>

        {/* Show bit depth */}
        <Tooltip title="Image bit depth" placement="top">
          <p>{bitDepth === 0 ? "" : bitDepth}</p>
        </Tooltip>
      </div>
      <div className="status-bar-right flex f-hright f-vcenter">
        {/* Show maker */}
        {maker ? (
          <Tooltip title="Camera maker" placement="top">
            <p>{maker}</p>
          </Tooltip>
        ) : (
          ""
        )}

        {/* Show model */}
        {model ? (
          <Tooltip title="Camera model" placement="top">
            <p>{model}</p>
          </Tooltip>
        ) : (
          ""
        )}

        {/* Show f number */}
        {fNumber ? (
          <Tooltip title="F-stop" placement="top">
            <p>{fNumber}</p>
          </Tooltip>
        ) : (
          ""
        )}

        {/* Show exposure time */}
        {exposureTime ? (
          <Tooltip title="Exposure time" placement="top">
            <p>{exposureTime}</p>
          </Tooltip>
        ) : (
          ""
        )}

        {/* Show focal length */}
        {focalLength ? (
          <Tooltip title="Focal length" placement="top">
            <p>{focalLength}</p>
          </Tooltip>
        ) : (
          ""
        )}

        {/* Show resolution of x axis */}
        {xResolution ? (
          <Tooltip title="Horizontal resolution" placement="top">
            <p>{xResolution}</p>
          </Tooltip>
        ) : (
          ""
        )}

        {/* Show resolution of y axis */}
        {yResolution ? (
          <Tooltip title="Vertical resolution" placement="top">
            <p>{yResolution}</p>
          </Tooltip>
        ) : (
          ""
        )}

        {/* Open metadata button */}
        <Tooltip title="Imagor repository">
          <img
            src={information}
            className={
              props.currentImage >= 0 ? "c-pointer" : "inactive c-default"
            }
            style={{ height: 18, marginLeft: 15 }}
            alt="Open metadata"
            onClick={(event) => {
              if (props.currentImage === -1) {
                event.preventDefault();
              } else if (props.currentImage >= 0) {
                props.setShowMetadataModal(true);
              }
            }}
          />
        </Tooltip>

        {/* Open github profile */}
        <Tooltip title="Imagor repository">
          <a href="https://github.com/nguyenhoangnam-dev/imagor" target="blank">
            <img
              src={github}
              style={{ height: 18, marginLeft: 15 }}
              alt="Link to project in github"
            />
          </a>
        </Tooltip>
      </div>
    </div>
  );
}

export default StatusBar;
