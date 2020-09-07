import React, { useState, useEffect } from "react";
import SliderFilter from "./slider";
import { ResizableBox } from "react-resizable";

import "../resizable.css";
import "../components.css";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const ThemeButton = withStyles({
  root: {
    boxShadow: "none",
    textTransform: "none",
    fontSize: 15,
    lineHeight: 1.5,
    color: "white",
    backgroundColor: "#3282b8",
    borderColor: "#3282b8",
    marginLeft: 10,
    "&:hover": {
      backgroundColor: "#0f4c75",
    },
  },
})(Button);

function OptionSideBar(props) {
  const [resetValue, setResetValue] = useState(false);
  const [width] = useState(300);
  const [height] = useState(0);

  const [blurValue, setBlurValue] = useState(0);
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

  useEffect(() => {});
  return (
    <ResizableBox
      width={width}
      minConstraints={[225, height]}
      axis={"x"}
      resizeHandles={["w"]}
      className={`option-sidebar flex f-column f-vcenter ${
        props.showOption ? "" : "disable"
      }`}
    >
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
      />
      <div
        className="flex f-space-between mt-15"
        style={{ minWidth: 180, width: "calc(100% - 44px)", maxWidth: 300 }}
      >
        <p>Blur</p>
        <div>
          <input
            className="input-filter-percent"
            value={blurValue}
            onChange={changeBlur}
            onKeyUp={submitBlur}
          />
          <span>px</span>
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
        <ThemeButton
          onClick={() => {
            props.setShowOption(false);
          }}
        >
          Close
        </ThemeButton>
      </div>
    </ResizableBox>
  );
}

export default OptionSideBar;
