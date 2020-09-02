import React, { useState } from "react";
import SliderFilter from "./slider";
import "../components.css";

function OptionSideBar(props) {
  const [resetValue, setResetValue] = useState(false);
  return (
    <div
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
      <button
        onClick={() => {
          setResetValue(true);
          props.setResetFilter(true);
        }}
      >
        Reset
      </button>
    </div>
  );
}

export default OptionSideBar;
