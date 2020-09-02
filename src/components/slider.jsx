import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import SliderMaterial from "@material-ui/core/Slider";
import "../components.css";

const useStyles = makeStyles({
  root: {
    width: 180,
  },
});

const sliderStyle = withStyles({
  root: {
    color: "#52af77",
    height: 2,
  },
  thumb: {
    backgroundColor: "#fff",
  },
  rail: {},
});

function Slider(props) {
  const classes = useStyles();
  const defaultValue = props.defaultValue;
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (props.resetValue) {
      setValue(defaultValue);
      props.getValue(defaultValue);
      props.setResetValue(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.resetValue]);

  return (
    <div className={classes.root}>
      <SliderMaterial
        defaultValue={defaultValue}
        disabled={props.disabled}
        aria-labelledby="discrete-slider-custom"
        step={1}
        onChange={(event, newValue) => {
          props.getValue(newValue);
          setValue(newValue);
        }}
        value={value}
      />
    </div>
  );
}

function SliderFilter(props) {
  const [filterValue, setFilterValue] = useState(props.defaultValue);

  return (
    <div style={{ width: 180 }}>
      <div className="flex f-space-between" style={{ width: 180 }}>
        <p>{props.filterName}</p>
        <p>{filterValue}%</p>
      </div>
      <Slider
        defaultValue={props.defaultValue}
        disabled={props.disabled}
        getValue={(value) => {
          setFilterValue(value);

          if (!props.resetValue) {
            props.getValue(value);
          }
        }}
        resetValue={props.resetValue}
        setResetValue={props.setResetValue}
      />
    </div>
  );
}

export default SliderFilter;
