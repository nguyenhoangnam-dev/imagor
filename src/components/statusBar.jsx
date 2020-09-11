import React, { useState, useEffect } from "react";
import "../components.css";

import { withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import Tooltip from "@material-ui/core/Tooltip";

const { Image } = require("image-js");

const ProgressFilter = withStyles((theme) => ({
  root: {
    height: 14,
    borderRadius: 8,
    width: 200,
    marginLeft: 15,
  },
  colorPrimary: {
    backgroundColor: "#bbe1fa",
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#3282b8",
  },
}))(LinearProgress);

function StatusBar(props) {
  const [progressFilterValue, setProgressFilterValue] = useState(0);
  const [colorModel, setColorModel] = useState(null);
  const [channels, setChannels] = useState(null);
  const [bitDepth, setBitDepth] = useState(null);
  const [maker, setMaker] = useState(null);
  const [model, setModel] = useState(null);
  const [fStop, setFStop] = useState(null);
  const [exposureTime, setExposureTime] = useState(null);
  const [ISO, setISO] = useState(null);
  const [exposureBias, setExposureBias] = useState(null);
  const [focalLength, setFocalLength] = useState(null);
  const [maxAperture, setMaxAperture] = useState(null);
  const [meteringMode, setMeteringMode] = useState(null);

  useEffect(() => {
    if (props.imageBlob && props.loadImage) {
      props.imageBlob.arrayBuffer().then((buffer) => {
        Image.load(buffer).then((image) => {
          setColorModel(image.colorModel);
          setChannels(image.channels);
          setBitDepth(image.bitDepth * image.channels);

          props.setImageHistogram(
            image.getHistograms({
              maxSlots: 256,
              useAlpha: false,
            })
          );

          props.allImage[props.currentImage].colorModel = image.colorModel;
          props.allImage[props.currentImage].channels = image.channels;
          props.allImage[props.currentImage].bitDepth =
            image.bitDepth * image.channels;
          props.allImage[props.currentImage].histograms = image.getHistograms({
            maxSlots: 256,
            useAlpha: false,
          });

          props.setLoadHistogram(true);
          props.setLoadImage(false);
        });
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loadImage]);

  // Progress bar animation
  useEffect(() => {
    const progressAnimation = setInterval(function () {
      setProgressFilterValue((oldProgress) => {
        if (oldProgress === 100 || !props.changeFilter) {
          clearInterval(progressAnimation);
          return 0;
        }

        return oldProgress + 1;
      });

      return () => {
        clearInterval(progressAnimation);
      };
    }, 40);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.changeFilter]);

  // Set EXIF information to status bar.
  useEffect(() => {
    if (props.loadInformation) {
      setMaker(props.allImage[0].maker);
      setModel(props.allImage[0].model);
      setFStop(props.allImage[0].fStop);
      setExposureTime(props.allImage[0].exposureTime);
      setISO(props.allImage[0].ISO);
      setExposureBias(props.allImage[0].exposureBias);
      setFocalLength(props.allImage[0].focalLength);
      setMaxAperture(props.allImage[0].maxAperture);
      setMeteringMode(props.allImage[0].meteringMode);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loadInformation]);

  return (
    <div className="status-bar flex f-vcenter f-space-between">
      <div className="flex f-hleft f-vcenter">
        <Tooltip title="Progress bar" placement="top">
          <ProgressFilter variant="determinate" value={progressFilterValue} />
        </Tooltip>
        <Tooltip title="Image type" placement="top">
          <p>{props.imageType}</p>
        </Tooltip>
        <Tooltip title="Image size" placement="top">
          <p>{props.imageSize}</p>
        </Tooltip>
        <Tooltip title="Image dimension" placement="top">
          <p>
            {props.imageWidth && props.imageHeight
              ? props.imageWidth + " x " + props.imageHeight
              : ""}
          </p>
        </Tooltip>
        <Tooltip title="Image unit" placement="top">
          <p>{props.imageUnit}</p>
        </Tooltip>
        <Tooltip title="Image colour model" placement="top">
          <p>{colorModel}</p>
        </Tooltip>
        <Tooltip title="Image channels" placement="top">
          <p>{channels === 0 ? "" : channels}</p>
        </Tooltip>
        <Tooltip title="Image bit depth" placement="top">
          <p>{bitDepth === 0 ? "" : bitDepth}</p>
        </Tooltip>
      </div>
      <div className="status-bar-right flex f-hright f-vcenter">
        <Tooltip title="Camera maker" placement="top">
          <p>{maker}</p>
        </Tooltip>
        <Tooltip title="Camera model" placement="top">
          <p>{model}</p>
        </Tooltip>
        <Tooltip title="F-stop" placement="top">
          <p>{fStop}</p>
        </Tooltip>
        <Tooltip title="Exposure time" placement="top">
          <p>{exposureTime}</p>
        </Tooltip>
        <Tooltip title="ISO speed" placement="top">
          <p>{ISO}</p>
        </Tooltip>
        <Tooltip title="Exposure bias" placement="top">
          <p>{exposureBias}</p>
        </Tooltip>
        <Tooltip title="Focal length" placement="top">
          <p>{focalLength}</p>
        </Tooltip>
        <Tooltip title="Max aperture" placement="top">
          <p>{maxAperture}</p>
        </Tooltip>
        <Tooltip title="Metering mode" placement="top">
          <p>{meteringMode}</p>
        </Tooltip>
      </div>
    </div>
  );
}

export default StatusBar;
