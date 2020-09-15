import React, { useState, useEffect } from "react";
import "../components.css";

import { roundBytes } from "../helper";

import { withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import Tooltip from "@material-ui/core/Tooltip";

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

  const [imageType, setImageType] = useState(null);
  const [imageSize, setImageSize] = useState(null);
  const [imageUnit, setImageUnit] = useState(null);
  const [imageWidth, setImageWidth] = useState(null);
  const [imageHeight, setImageHeight] = useState(null);

  // Progress bar animation
  // useEffect(() => {
  //   const progressAnimation = setInterval(function () {
  //     setProgressFilterValue((oldProgress) => {
  //       if (oldProgress === 100 || !props.changeFilter) {
  //         clearInterval(progressAnimation);
  //         return 0;
  //       }

  //       return oldProgress + 1;
  //     });

  //     return () => {
  //       clearInterval(progressAnimation);
  //     };
  //   }, 40);

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.changeFilter]);

  useEffect(() => {
    if (props.currentImage >= 0 && props.loadHistogram) {
      const current = props.currentImage;

      setColorModel(props.allImage[current].colorModel);
      setChannels(props.allImage[current].channels);
      setBitDepth(props.allImage[current].bitDepth);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loadHistogram]);

  useEffect(() => {
    if (props.currentImage >= 0 && props.loadInformation) {
      const current = props.currentImage;
      const allImage = props.allImage[current];

      setImageType(allImage.type);
      setImageSize(roundBytes(allImage.size));
      setImageUnit(allImage.unit);
      setImageWidth(allImage.width);
      setImageHeight(allImage.height);

      setMaker(allImage.maker);
      setModel(allImage.model);
      setFStop(allImage.fStop);
      setExposureTime(allImage.exposureTime);
      setISO(allImage.ISO);
      setExposureBias(allImage.exposureBias);
      setFocalLength(allImage.focalLength);
      setMaxAperture(allImage.maxAperture);
      setMeteringMode(allImage.meteringMode);

      props.setLoadInformation(false);
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
        <Tooltip title="Image channels" placement="top">
          <p>{channels === 0 ? "" : channels}</p>
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

        {fStop ? (
          <Tooltip title="F-stop" placement="top">
            <p>{fStop}</p>
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

        {ISO ? (
          <Tooltip title="ISO speed" placement="top">
            <p>{ISO}</p>
          </Tooltip>
        ) : (
          ""
        )}

        {exposureBias ? (
          <Tooltip title="Exposure bias" placement="top">
            <p>{exposureBias}</p>
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

        {maxAperture ? (
          <Tooltip title="Max aperture" placement="top">
            <p>{maxAperture}</p>
          </Tooltip>
        ) : (
          ""
        )}

        {meteringMode ? (
          <Tooltip title="Metering mode" placement="top">
            <p>{meteringMode}</p>
          </Tooltip>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default StatusBar;
