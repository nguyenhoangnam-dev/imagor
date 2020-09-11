import React, { useState, useEffect } from "react";
import SliderFilter from "./slider";
import { ResizableBox } from "react-resizable";

import "../resizable.css";
import "../components.css";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

import { AreaChart, Area, XAxis, YAxis } from "recharts";

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
    if (props.loadHistogram) {
      let histogram = props.imageHistogram;

      let arrayArrayToArrayObject = [];

      for (let i = 0; i < 256; i++) {
        arrayArrayToArrayObject[i] = {
          name: i,
          red: histogram[0][i],
          green: histogram[1][i],
          blue: histogram[2][i],
        };
      }

      setDataHistogram(arrayArrayToArrayObject);
      props.setLoadHistogram(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loadHistogram]);

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
          disable={!props.supportFilter}
          getValue={(value) => {
            props.setChangeFilter(true);
            props.getFilter("contrast", value);
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
          getValue={(value) => {
            props.setChangeFilter(true);
            props.getFilter("brightness", value);
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
          getValue={(value) => {
            props.setChangeFilter(true);
            props.getFilter("opacity", value);
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
          disable={!props.supportFilter}
          getValue={(value) => {
            props.setChangeFilter(true);
            props.getFilter("saturate", value);
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
          disable={!props.supportFilter}
          getValue={(value) => {
            props.setChangeFilter(true);
            props.getFilter("grayscale", value);
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
          disable={!props.supportFilter}
          getValue={(value) => {
            props.setChangeFilter(true);
            props.getFilter("invert", value);
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
          disable={!props.supportFilter}
          getValue={(value) => {
            props.setChangeFilter(true);
            props.getFilter("sepia", value);
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
