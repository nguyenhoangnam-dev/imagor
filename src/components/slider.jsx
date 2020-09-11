import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import SliderMaterial from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
import "../components.css";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

const SliderStyle = withStyles({
  root: {
    color: "var(--color-4)",
    height: 2,
  },
  thumb: {
    backgroundColor: "var(--color-2)",
    border: "2px solid var(--color-4)",
    "&:focus, &:hover, &$active": {
      boxShadow: "none",
    },
    "&:hover": {
      backgroundColor: "var(--color-3)",
    },
  },
  active: {},
  track: {
    // backgroundColor: "#3282b8",
  },
  rail: {
    backgroundColor: "var(--color-3)",
  },
})(SliderMaterial);

function Slider(props) {
  const classes = useStyles();
  const defaultValue = props.defaultValue;

  return (
    <div className={classes.root}>
      <SliderStyle
        defaultValue={defaultValue}
        disabled={props.disabled || props.disable}
        aria-labelledby="discrete-slider-custom"
        step={1}
        onChange={(event, newValue) => {
          props.setFilterValue(newValue);
        }}
        value={props.filterValue}
      />
    </div>
  );
}

function InputFilter(props) {
  const [filterValue, setFilterValue] = useState(props.filterValue);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const showTooltip = () => {
    setTooltipOpen(props.tooltipReason ? true : false);
  };

  const closeTooltip = () => {
    setTooltipOpen(false);
  };

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
    <Tooltip
      title={props.tooltipReason || ""}
      open={tooltipOpen}
      onOpen={showTooltip}
      onClose={closeTooltip}
      placement="bottom"
    >
      <div>
        <input
          className={
            "input-filter-percent " + (props.disable ? "c-not-allowed" : "")
          }
          value={filterValue}
          onChange={changeInputFilter}
          onKeyUp={enterInputFilter}
          disabled={props.disable}
          style={{ backgroundColor: "var(--color-1)" }}
        />
        <span className={props.disable ? "t-disabled" : ""}>%</span>
      </div>
    </Tooltip>
  );
}

function SliderFilter(props) {
  const [filterValue, setFilterValue] = useState(props.defaultValue);

  useEffect(() => {
    // if (!props.resetValue) {
    //   props.setChangeFilter(true);
    // }
    props.getValue(filterValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValue]);

  useEffect(() => {
    if (props.resetValue) {
      // props.setChangeFilter(false);
      setFilterValue(props.defaultValue);
      props.setResetValue(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.resetValue]);

  return (
    <div style={{ minWidth: 180, width: "calc(100% - 44px)", maxWidth: 300 }}>
      <div className="flex f-space-between" style={{ width: "100%" }}>
        <Tooltip title={props.tooltipText || ""} placement="bottom">
          <p className={"c-default " + (props.disable ? "t-disabled" : "")}>
            {props.filterName}
          </p>
        </Tooltip>

        <InputFilter
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          disable={props.disable}
          tooltipReason={props.tooltipReason}
        />
      </div>
      <Slider
        defaultValue={props.defaultValue}
        disabled={props.disabled || props.disable}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
      />
    </div>
  );
}

export default SliderFilter;
