import React, { useState, useEffect } from "react";
import SliderFilter from "./slider";
import { ResizableBox } from "react-resizable";
// import wwHistogram from "../worker/histogram";

import "../resizable.css";
import "../components.css";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

import { AreaChart, Area, XAxis, YAxis } from "recharts";

const { Image } = require("image-js");

const getPathFromPublic = (path) => `${process.env.PUBLIC_URL}/${path}`;
const wwHistogramPath = getPathFromPublic("histogram.js");
const wwHistogram = new Worker(wwHistogramPath);

const ThemeButton = withStyles({
  root: {
    boxShadow: "none",
    textTransform: "none",
    fontSize: 15,
    lineHeight: 1.5,
    color: "black",
    backgroundColor: "var(--color-2)",
    borderColor: "var(--color-3)",
    marginLeft: 10,
    transition: "background-color .4s",
    "&:hover": {
      backgroundColor: "var(--color-3)",
      transition: "background-color .3s",
    },
  },
})(Button);

function OptionSideBar(props) {
  const [resetValue, setResetValue] = useState(false);
  const [width] = useState(300);
  const [height, setHeight] = useState(0);

  const [blurValue, setBlurValue] = useState(0);
  const [dataHistogram, setDataHistogram] = useState([{}]);
  // const [changeFilter, setChangeFilter] = useState(false);

  const submitBlur = (event) => {
    if (event.key === "Enter") {
      props.setChangeFilter(true);
      props.getFilter("blur", blurValue);
    }
  };

  const changeBlur = (event) => {
    setBlurValue(event.target.value);
  };

  useEffect(() => {
    setHeight(window.innerHeight - 55);
  }, []);

  useEffect(() => {
    const current = props.currentImage;

    if (current >= 0 && props.loadHistogram) {
      if (props.allImage[current].changeFilter) {
        wwHistogram.postMessage(props.allImage[current].histograms);

        wwHistogram.onmessage = function (event) {
          props.allImage[current].loadMeta = true;
          props.allImage[current].histogramObject = event.data;
          setDataHistogram(event.data);
          props.setLoadHistogram(false);
        };

        props.allImage[current].changeFilter = false;
      }

      if (
        current >= props.countImage - 1 &&
        !props.allImage[current].loadMeta
      ) {
        wwHistogram.postMessage(props.allImage[current].histograms);

        wwHistogram.onmessage = function (event) {
          props.allImage[current].loadMeta = true;
          props.allImage[current].histogramObject = event.data;
          setDataHistogram(event.data);
          props.setLoadHistogram(false);
        };
      } else {
        setDataHistogram(props.allImage[current].histogramObject);
        props.setLoadHistogram(false);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loadHistogram]);

  useEffect(() => {
    if (props.loadFilterURL) {
      const current = props.currentImage;

      Image.load(props.allImage[current].filterURL).then((image) => {
        props.allImage[current].changeFilter = true;
        props.allImage[current].histograms = image.getHistograms({
          maxSlots: 256,
          useAlpha: false,
        });

        props.setLoadHistogram(true);
      });
      props.setLoadFilterURL(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loadFilterURL]);

  useEffect(() => {
    if (!props.loadHistogram) {
      setDataHistogram([{}]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentImage]);

  // useEffect(() => {
  //   props.setLoadHistogram(false);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.currentImage]);

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
            fillOpacity={0.8}
            fill="#ff0000"
          />
          <Area
            type="monotone"
            dataKey="green"
            stroke="#00ff00"
            fillOpacity={0.8}
            fill="#00ff00"
          />
          <Area
            type="monotone"
            dataKey="blue"
            stroke="#0000ff"
            fillOpacity={0.8}
            fill="#0000ff"
          />
        </AreaChart>
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
            // props.getFilter("contrast", value);
          }}
          resetValue={resetValue}
          setResetValue={setResetValue}
          // setChangeFilter={setChangeFilter}
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
            // props.getFilter("brightness", value);
            // props.allImage[props.currentImage].cssFilter.brightness =
            //   props.currentImage >= 0 ? value : 100;
          }}
          resetValue={resetValue}
          setResetValue={setResetValue}
          disable={!props.supportFilter}
          // setChangeFilter={setChangeFilter}
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
            // props.getFilter("opacity", value);
            // props.allImage[props.currentImage].cssFilter.opacity =
            //   props.currentImage >= 0 ? value : 100;
          }}
          resetValue={resetValue}
          setResetValue={setResetValue}
          disable={props.disableOpacity || !props.supportFilter}
          // setChangeFilter={setChangeFilter}
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
            // props.getFilter("saturate", value);
            // props.allImage[props.currentImage].cssFilter.saturate =
            //   props.currentImage >= 0 ? value : 100;
          }}
          resetValue={resetValue}
          setResetValue={setResetValue}
          // setChangeFilter={setChangeFilter}
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
            // props.getFilter("grayscale", value);
            // props.allImage[props.currentImage].cssFilter.grayscale =
            //   props.currentImage >= 0 ? value : 0;
          }}
          resetValue={resetValue}
          setResetValue={setResetValue}
          // setChangeFilter={setChangeFilter}
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
            // props.getFilter("invert", value);
            // props.allImage[props.currentImage].cssFilter.invert =
            //   props.currentImage >= 0 ? value : 0;
          }}
          resetValue={resetValue}
          setResetValue={setResetValue}
          // setChangeFilter={setChangeFilter}
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
            // props.getFilter("sepia", value);
            // props.allImage[props.currentImage].cssFilter.sepia =
            //   props.currentImage >= 0 ? value : 0;
          }}
          resetValue={resetValue}
          setResetValue={setResetValue}
          // setChangeFilter={setChangeFilter}
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
          <ThemeButton
            onClick={() => {
              setResetValue(true);
              props.allImage[props.currentImage].cssFilter.reset = true;
              props.setChangeFilter(true);
              // setChangeFilter(false);
              props.setResetFilter(true);
            }}
            disabled={!props.supportFilter}
          >
            Reset
          </ThemeButton>
        </div>
      </div>
    </ResizableBox>
  );
}

export default OptionSideBar;
