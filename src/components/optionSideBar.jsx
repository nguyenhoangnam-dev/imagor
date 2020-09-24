import React, { useState, useEffect } from "react";
import SliderFilter from "./slider";
import { ResizableBox } from "react-resizable";
import { setFilter } from "../helper";

import "../resizable.css";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

import { AreaChart, Area, XAxis, YAxis } from "recharts";

const { Image } = require("image-js");

const getPathFromPublic = (path) => `${process.env.PUBLIC_URL}/${path}`;
const wwHistogramPath = getPathFromPublic("histogram.js");
const wwHistogram = new Worker(wwHistogramPath);

const useStyles = makeStyles((theme) => ({
  button: {
    boxShadow: "none",
    textTransform: "none",
    fontSize: 15,
    lineHeight: 1.5,
    color: "black",
    backgroundColor: "var(--color-2)",
    marginLeft: 10,
    transition: "background-color .4s",
    "&:hover": {
      backgroundColor: "var(--color-3)",
      transition: "background-color .3s",
    },
  },
}));

function OptionSideBar(props) {
  const classes = useStyles();
  const [resetValue, setResetValue] = useState(false);
  const [width] = useState(300);
  const [height, setHeight] = useState(0);

  const [blurValue, setBlurValue] = useState(0);

  const [dataHistogram, setDataHistogram] = useState([{}]);
  // const [changeFilter, setChangeFilter] = useState(false);

  // Reload slider separately
  const [reloadContrast, setReloadContrast] = useState(false);
  const [reloadBrightness, setReloadBrightness] = useState(false);
  const [reloadOpacity, setReloadOpacity] = useState(false);
  const [reloadSaturate, setReloadSaturate] = useState(false);
  const [reloadGrayscale, setReloadGrayscale] = useState(false);
  const [reloadInvert, setReloadInvert] = useState(false);
  const [reloadSepia, setReloadSepia] = useState(false);

  const [invalidInput, setInvalidInput] = useState(false);

  // const [channel, setChannel] = useState("all");

  /**
   * Set blur value after submit
   * @param {Object} event Store key when key up trigger
   */
  function submitBlur(event) {
    if (event.key === "Enter") {
      props.setChangeFilter(true);
      props.getFilter("blur", blurValue);
    }
  }

  /**
   * Set value after change value in input
   * @param {Object} event Store value when change value in input trigger
   */
  function changeBlur(event) {
    setBlurValue(event.target.value);
  }

  // Set height for react-resizable
  useEffect(() => {
    setHeight(window.innerHeight - 55);
  }, []);

  // Trigger after thumbnail's filter URL update.
  useEffect(() => {
    if (props.loadFilterURL) {
      const current = props.currentImage;

      Image.load(props.allImage[current].filterURL).then((image) => {
        props.allImage[current].changeFilter = true;
        props.allImage[current].histograms = image.getHistograms({
          maxSlots: 256,
          useAlpha: false,
        });
      });
      props.setLoadFilterURL(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loadFilterURL]);

  useEffect(() => {
    const current = props.currentImage;

    if (current >= 0) {
      if (props.loadThumbnail) {
        Image.load(props.allImage[current].filterURL)
          .then((image) => {
            wwHistogram.postMessage(
              image.getHistograms({
                maxSlots: 256,
                useAlpha: false,
              })
            );
          })
          .catch((err) => {
            props.setErrorTitle("Error");
            props.setErrorMessage(
              "Your image is too large to find histogram, color model and bit depth."
            );
            props.setShowErrorModal(true);
          });

        props.setLoadNewImage(false);
        props.setLoadThumbnail(false);
      } else {
        setDataHistogram(props.allImage[current].histogramObject);
      }
    } else {
      setDataHistogram([{}]);
      setResetValue(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loadThumbnail, props.currentImage]);

  useEffect(() => {
    const current = props.currentImage;

    if (props.loadFilterURL) {
      Image.load(props.allImage[current].filterURL)
        .then((image) => {
          wwHistogram.postMessage(
            image.getHistograms({
              maxSlots: 256,
              useAlpha: false,
            })
          );
        })
        .catch((err) => {
          props.setErrorTitle("Error");
          props.setErrorMessage(
            "Your image is too large to find histogram, color model and bit depth."
          );
          props.setShowErrorModal(true);
        });
      if (props.allImage[current].changeFilter) {
        props.allImage[current].changeFilter = false;
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loadFilterURL]);

  useEffect(() => {
    if (props.reloadFilter) {
      const current = props.currentImage;
      const filterHistory = props.allImage[current].filterHistory;
      const filterPosition = props.allImage[current].filterPosition;

      let lastFilter = filterHistory[filterPosition];
      props.allImage[current].cssFilter = setFilter(lastFilter);

      setReloadContrast(true);
      setReloadBrightness(true);
      setReloadOpacity(true);
      setReloadGrayscale(true);
      setReloadSaturate(true);
      setReloadInvert(true);
      setReloadSepia(true);

      props.setReloadFilter(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.reloadFilter]);

  useEffect(() => {
    const current = props.currentImage;
    if (props.undoFilter && props.allImage[current].filterPosition >= 0) {
      props.allImage[current].filterPosition--;
      let filterPosition = props.allImage[current].filterPosition;

      const filterHistory = props.allImage[current].filterHistory;
      let currentFilter = filterHistory[filterPosition];
      props.allImage[current].cssFilter = setFilter(currentFilter);

      setReloadContrast(true);
      setReloadBrightness(true);
      setReloadOpacity(true);
      setReloadGrayscale(true);
      setReloadSaturate(true);
      setReloadInvert(true);
      setReloadSepia(true);

      props.setUndoFilter(false);
    } else {
      props.setUndoFilter(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.undoFilter]);

  useEffect(() => {
    const current = props.currentImage;
    if (
      props.redoFilter &&
      props.allImage[current].filterPosition <
        props.allImage[current].filterHistory.length - 1
    ) {
      props.allImage[current].filterPosition++;
      let filterPosition = props.allImage[current].filterPosition;

      const filterHistory = props.allImage[current].filterHistory;
      let currentFilter = filterHistory[filterPosition];
      props.allImage[current].cssFilter = setFilter(currentFilter);

      setReloadContrast(true);
      setReloadBrightness(true);
      setReloadOpacity(true);
      setReloadGrayscale(true);
      setReloadSaturate(true);
      setReloadInvert(true);
      setReloadSepia(true);

      props.setRedoFilter(false);
    } else {
      props.setRedoFilter(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.redoFilter]);

  useEffect(() => {
    if (invalidInput) {
      props.setErrorTitle("Error");
      props.setErrorMessage("Invalid percent value.");
      props.setShowErrorModal(true);

      setInvalidInput(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invalidInput]);

  wwHistogram.onmessage = function (event) {
    const current = props.currentImage;
    props.allImage[current].loadMeta = true;
    props.allImage[current].histogramObject = event.data;
    setDataHistogram(event.data);
  };

  return (
    <ResizableBox
      width={width}
      height={height}
      minConstraints={[225, height]}
      axis={"x"}
      resizeHandles={["w"]}
      className={`option-sidebar flex f-column f-vcenter ${
        props.showOption ? "" : "disable"
      }`}
    >
      <div className="filter-box w-100 flex f-column f-vcenter">
        <AreaChart
          width={180}
          height={150}
          data={dataHistogram}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          className="flex f-hcenter f-vcenter"
          style={{
            minWidth: 180,
            width: "calc(100% - 44px)",
            maxWidth: 300,
            border: "1px solid black",
            marginBottom: 10,
          }}
        >
          <XAxis dataKey="name" hide={true} />
          <YAxis hide={true} scale="sqrt" />
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <Area
            type="monotone"
            dataKey="red"
            stroke="#ff0000"
            fillOpacity={1}
            fill="#ff0000"
          />
          <Area
            type="monotone"
            dataKey="green"
            stroke="#00ff00"
            fillOpacity={1}
            fill="#00ff00"
          />
          <Area
            type="monotone"
            dataKey="blue"
            stroke="#0000ff"
            fillOpacity={1}
            fill="#0000ff"
          />
          <Area
            type="monotone"
            dataKey="cyan"
            stroke="#00ffff"
            fillOpacity={1}
            fill="#00ffff"
          />
          <Area
            type="monotone"
            dataKey="magenta"
            stroke="#ff00ff"
            fillOpacity={1}
            fill="#ff00ff"
          />
          <Area
            type="monotone"
            dataKey="yellow"
            stroke="#ffff00"
            fillOpacity={1}
            fill="#ffff00"
          />
          <Area
            type="monotone"
            dataKey="grey"
            stroke="#bbbbbb"
            fillOpacity={1}
            fill="#bbbbbb"
          />
        </AreaChart>
        {/* <select>
          <option value="all">all</option>
          <option value="red">red</option>
          <option value="green">green</option>
          <option value="blue">blue</option>
          <option value="grey">grey</option>
        </select> */}
        <SliderFilter
          className="mt-15"
          filterName={"Contrast"}
          defaultValue={100}
          currentImage={props.currentImage}
          allImage={props.allImage}
          setDoneFilter={props.setDoneFilter}
          disable={!props.supportFilter}
          getValue={(value) => {
            props.setChangeFilter(true);
          }}
          resetValue={resetValue}
          setResetValue={setResetValue}
          reloadFilter={reloadContrast}
          setReloadFilter={setReloadContrast}
          setInvalidInput={setInvalidInput}
          tooltipText="Difference in luminance or colour that makes an object (or its representation in an image or display) distinguishable."
        />
        <SliderFilter
          className="mt-15"
          filterName={"Brightness"}
          defaultValue={100}
          currentImage={props.currentImage}
          allImage={props.allImage}
          setDoneFilter={props.setDoneFilter}
          getValue={(value) => {
            props.setChangeFilter(true);
          }}
          resetValue={resetValue}
          setResetValue={setResetValue}
          disable={!props.supportFilter}
          reloadFilter={reloadBrightness}
          setReloadFilter={setReloadBrightness}
          setInvalidInput={setInvalidInput}
          tooltipText="An attribute of visual perception in which a source appears to be radiating or reflecting light."
        />
        <SliderFilter
          className="mt-15"
          filterName={"Opacity"}
          defaultValue={100}
          currentImage={props.currentImage}
          allImage={props.allImage}
          setDoneFilter={props.setDoneFilter}
          getValue={(value) => {
            props.setChangeFilter(true);
          }}
          resetValue={resetValue}
          setResetValue={setResetValue}
          disable={props.disableOpacity || !props.supportFilter}
          reloadFilter={reloadOpacity}
          setReloadFilter={setReloadOpacity}
          setInvalidInput={setInvalidInput}
          tooltipText="Describes the transparency level, it ranges from 0 to 1."
          tooltipReason="Image type not support opacity filter."
        />
        <SliderFilter
          className="mt-15"
          filterName={"Saturate"}
          defaultValue={100}
          currentImage={props.currentImage}
          allImage={props.allImage}
          setDoneFilter={props.setDoneFilter}
          disable={!props.supportFilter}
          getValue={(value) => {
            props.setChangeFilter(true);
          }}
          resetValue={resetValue}
          setResetValue={setResetValue}
          reloadFilter={reloadSaturate}
          setReloadFilter={setReloadSaturate}
          setInvalidInput={setInvalidInput}
          tooltipText="Describes the depth or intensity of color present within an image."
        />
        <SliderFilter
          className="mt-15"
          filterName={"Grayscale"}
          defaultValue={0}
          currentImage={props.currentImage}
          allImage={props.allImage}
          setDoneFilter={props.setDoneFilter}
          disable={!props.supportFilter}
          getValue={(value) => {
            props.setChangeFilter(true);
          }}
          resetValue={resetValue}
          setResetValue={setResetValue}
          reloadFilter={reloadGrayscale}
          setReloadFilter={setReloadGrayscale}
          setInvalidInput={setInvalidInput}
          tooltipText="The value of each pixel is a single sample representing only an amount of light."
        />
        <SliderFilter
          className="mt-15"
          filterName={"Invert"}
          defaultValue={0}
          currentImage={props.currentImage}
          allImage={props.allImage}
          setDoneFilter={props.setDoneFilter}
          disable={!props.supportFilter}
          getValue={(value) => {
            props.setChangeFilter(true);
          }}
          resetValue={resetValue}
          setResetValue={setResetValue}
          reloadFilter={reloadInvert}
          setReloadFilter={setReloadInvert}
          setInvalidInput={setInvalidInput}
          tooltipText="Change all pixel color to the opposite."
        />
        <SliderFilter
          className="mt-15"
          filterName={"Sepia"}
          defaultValue={0}
          currentImage={props.currentImage}
          allImage={props.allImage}
          setDoneFilter={props.setDoneFilter}
          disable={!props.supportFilter}
          getValue={(value) => {
            props.setChangeFilter(true);
          }}
          resetValue={resetValue}
          setResetValue={setResetValue}
          reloadFilter={reloadSepia}
          setReloadFilter={setReloadSepia}
          setInvalidInput={setInvalidInput}
          tooltipText="A form of photographic print toning – a tone added to a black and white photograph in the darkroom to “warm” up the tones."
        />
        <div
          className="flex f-space-between"
          style={{ minWidth: 180, width: "calc(100% - 44px)", maxWidth: 300 }}
        >
          <Tooltip title="Blur image." placement="bottom">
            <p className={!props.supportFilter ? "t-disabled" : ""}>Blur</p>
          </Tooltip>

          <div>
            <input
              className="input-filter-percent"
              value={blurValue}
              onChange={changeBlur}
              onKeyUp={submitBlur}
              style={{ backgroundColor: "var(--color-1)" }}
              disabled={!props.supportFilter}
            />
            <span className={!props.supportFilter ? "t-disabled" : ""}>px</span>
          </div>
        </div>
        <div
          className="flex f-hright mt-25"
          style={{ minWidth: 180, width: "calc(100% - 44px)", maxWidth: 300 }}
        >
          <Button
            className={classes.button}
            onClick={() => {
              setResetValue(true);
              props.allImage[props.currentImage].cssFilter.reset = true;
              props.setChangeFilter(true);
              props.setResetFilter(true);
            }}
            disabled={!props.supportFilter}
          >
            Reset
          </Button>
        </div>
      </div>
    </ResizableBox>
  );
}

export default OptionSideBar;
