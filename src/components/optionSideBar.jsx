import React, { useState, useEffect } from "react";
import SliderFilter from "./slider";
import { ResizableBox } from "react-resizable";

import "../resizable.css";
import "../components.css";

function OptionSideBar(props) {
  const [resetValue, setResetValue] = useState(false);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(0);

  const [blurValue, setBlurValue] = useState(0);

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
        filterName={"Contrast"}
        defaultValue={100}
        disabled={false}
        getValue={(value) => {
          props.setChangeFilter(true);
          props.getFilter("contrast", value);
        }}
        resetValue={resetValue}
        setResetValue={setResetValue}
      />
      <SliderFilter
        filterName={"Brightness"}
        defaultValue={100}
        disabled={false}
        getValue={(value) => {
          props.setChangeFilter(true);
          props.getFilter("brightness", value);
        }}
        resetValue={resetValue}
        setResetValue={setResetValue}
      />
      <SliderFilter
        filterName={"Opacity"}
        defaultValue={100}
        disabled={false}
        getValue={(value) => {
          props.setChangeFilter(true);
          props.getFilter("opacity", value);
        }}
        resetValue={resetValue}
        setResetValue={setResetValue}
        disable={props.disableOpacity}
      />
      <SliderFilter
        filterName={"Saturate"}
        defaultValue={100}
        disabled={false}
        getValue={(value) => {
          props.setChangeFilter(true);
          props.getFilter("saturate", value);
        }}
        resetValue={resetValue}
        setResetValue={setResetValue}
      />
      <SliderFilter
        filterName={"Grayscale"}
        defaultValue={0}
        disabled={false}
        getValue={(value) => {
          props.setChangeFilter(true);
          props.getFilter("grayscale", value);
        }}
        resetValue={resetValue}
        setResetValue={setResetValue}
      />
      <SliderFilter
        filterName={"Invert"}
        defaultValue={0}
        disabled={false}
        getValue={(value) => {
          props.setChangeFilter(true);
          props.getFilter("invert", value);
        }}
        resetValue={resetValue}
        setResetValue={setResetValue}
      />
      <SliderFilter
        filterName={"Sepia"}
        defaultValue={0}
        disabled={false}
        getValue={(value) => {
          props.setChangeFilter(true);
          props.getFilter("sepia", value);
        }}
        resetValue={resetValue}
        setResetValue={setResetValue}
      />
      <div></div>
      <div
        className="flex f-space-between"
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
      <div>
        <button
          onClick={() => {
            setResetValue(true);
            props.setResetFilter(true);
          }}
        >
          Reset
        </button>
        <button
          onClick={() => {
            props.setShowOption(false);
          }}
        >
          Close
        </button>
      </div>
    </ResizableBox>
  );
}

export default OptionSideBar;
