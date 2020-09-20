import React, { useState, useEffect } from "react";

import { roundBytes } from "../helper";

import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import Tooltip from "@material-ui/core/Tooltip";

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

  // Progress bar animation
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

      setImageType(allImage.type);
      setImageSize(roundBytes(allImage.size));
      setImageUnit(allImage.unit);
      setImageWidth(allImage.width);
      setImageHeight(allImage.height);

      setColorModel(allImage.colorModel);
      setBitDepth(allImage.bitDepth);

      setMaker(allImage.maker);
      setModel(allImage.model);
      setFNumber(allImage.fNumber);
      setExposureTime(allImage.exposureTime);
      setFocalLength(allImage.focalLength);
      setXResolution(allImage.xResolution);
      setYResolution(allImage.yResolution);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentImage]);

  // useEffect(() => {
  //   if (props.currentImage >= 0 && props.loadHistogram) {
  //     const current = props.currentImage;

  //     setColorModel(props.allImage[current].colorModel);
  //     setChannels(props.allImage[current].channels);
  //     setBitDepth(props.allImage[current].bitDepth);
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.loadHistogram]);

  // useEffect(() => {
  //   if (props.currentImage >= 0 && props.loadInformation) {
  //     const current = props.currentImage;
  //     const allImage = props.allImage[current];

  //     setImageType(allImage.type);
  //     setImageSize(roundBytes(allImage.size));
  //     setImageUnit(allImage.unit);
  //     setImageWidth(allImage.width);
  //     setImageHeight(allImage.height);

  //     setMaker(allImage.maker);
  //     setModel(allImage.model);
  //     setFStop(allImage.fStop);
  //     setExposureTime(allImage.exposureTime);
  //     setISO(allImage.ISO);
  //     setExposureBias(allImage.exposureBias);
  //     setFocalLength(allImage.focalLength);
  //     setMaxAperture(allImage.maxAperture);
  //     setMeteringMode(allImage.meteringMode);

  //     props.setLoadInformation(false);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.loadInformation]);

  return (
    <div className="status-bar flex f-vcenter f-space-between">
      <div className="flex f-hleft f-vcenter">
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
        <Tooltip title="Image type" placement="top">
          <p>{imageType}</p>
        </Tooltip>
        <Tooltip title="Image size" placement="top">
          <p>{imageSize}</p>
        </Tooltip>
        <Tooltip title="Image dimension" placement="top">
          <p>
            {imageWidth && imageHeight ? imageWidth + " x " + imageHeight : ""}
          </p>
        </Tooltip>
        <Tooltip title="Image unit" placement="top">
          <p>{imageUnit}</p>
        </Tooltip>
        <Tooltip title="Image colour model" placement="top">
          <p>{colorModel}</p>
        </Tooltip>
        <Tooltip title="Image bit depth" placement="top">
          <p>{bitDepth === 0 ? "" : bitDepth}</p>
        </Tooltip>
      </div>
      <div className="status-bar-right flex f-hright f-vcenter">
        {maker ? (
          <Tooltip title="Camera maker" placement="top">
            <p>{maker}</p>
          </Tooltip>
        ) : (
          ""
        )}

        {model ? (
          <Tooltip title="Camera model" placement="top">
            <p>{model}</p>
          </Tooltip>
        ) : (
          ""
        )}

        {fNumber ? (
          <Tooltip title="F-stop" placement="top">
            <p>{fNumber}</p>
          </Tooltip>
        ) : (
          ""
        )}

        {exposureTime ? (
          <Tooltip title="Exposure time" placement="top">
            <p>{exposureTime}</p>
          </Tooltip>
        ) : (
          ""
        )}

        {focalLength ? (
          <Tooltip title="Focal length" placement="top">
            <p>{focalLength}</p>
          </Tooltip>
        ) : (
          ""
        )}

        {xResolution ? (
          <Tooltip title="Horizontal resolution" placement="top">
            <p>{xResolution}</p>
          </Tooltip>
        ) : (
          ""
        )}

        {yResolution ? (
          <Tooltip title="Vertical resolution" placement="top">
            <p>{yResolution}</p>
          </Tooltip>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default StatusBar;
