import React, { useState, useEffect, useRef } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import SliderMaterial from "@material-ui/core/Slider";
import "../components.css";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

const SliderStyle = withStyles({
  root: {
    // color: "#52af77",
    height: 2,
  },
  thumb: {
    backgroundColor: "#fff",
    border: "2px solid #0f4c75",
    "&:focus, &:hover, &$active": {
      boxShadow: "none",
    },
  },
  active: {},
  track: {
    backgroundColor: "#3282b8",
  },
  rail: {
    backgroundColor: "#bbe1fa",
  },
})(SliderMaterial);

function Slider(props) {
  const classes = useStyles();
  const defaultValue = props.defaultValue;

  return (
    <div className={classes.root}>
      <SliderStyle
        defaultValue={defaultValue}
        disabled={props.disabled}
        aria-labelledby="discrete-slider-custom"
        step={1}
        onChange={(event, newValue) => {
          props.setFilterValue(newValue);
        }}
        value={props.filterValue}
        disabled={props.disable}
      />
    </div>
  );
}

function InputFilter(props) {
  const [filterValue, setFilterValue] = useState(props.filterValue);

  const enterInputFilter = (event) => {
    if (event.key === "Enter") {
      props.setFilterValue(filterValue);
    }
  };

  const changeInputFilter = (event) => {
    setFilterValue(event.target.value);
  };

  useEffect(() => {
    setFilterValue(props.filterValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.filterValue]);

  return (
    <div>
      <input
        className="input-filter-percent"
        value={filterValue}
        onChange={changeInputFilter}
        onKeyUp={enterInputFilter}
      />
      <span>%</span>
    </div>
  );
}

function SliderFilter(props) {
  const [filterValue, setFilterValue] = useState(props.defaultValue);

  useEffect(() => {
    props.getValue(filterValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValue]);

  useEffect(() => {
    if (props.resetValue) {
      setFilterValue(props.defaultValue);
      props.setResetValue(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.resetValue]);

  return (
    <div style={{ minWidth: 180, width: "calc(100% - 44px)", maxWidth: 300 }}>
      <div className="flex f-space-between" style={{ width: "100%" }}>
        <p>{props.filterName}</p>
        <InputFilter
          filterValue={filterValue}
          setFilterValue={setFilterValue}
        />
      </div>
      <Slider
        defaultValue={props.defaultValue}
        disabled={props.disabled}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        disable={props.disable}
      />
    </div>
  );
}

export default SliderFilter;
