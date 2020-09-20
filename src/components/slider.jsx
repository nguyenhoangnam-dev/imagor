import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import SliderMaterial from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";

import { percentPattern } from "../global";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  slider: {
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
  rail: {
    backgroundColor: "var(--color-3)",
  },
});

function Slider(props) {
  const classes = useStyles();
  const defaultValue = props.defaultValue;

  return (
    <div className={classes.root}>
      <SliderMaterial
        className={classes.slider}
        classes={{
          thumb: classes.thumb,
          track: classes.track,
          rail: classes.rail,
        }}
        defaultValue={defaultValue}
        disabled={props.disabled || props.disable}
        aria-labelledby="discrete-slider-custom"
        step={1}
        onChange={(event, newValue) => {
          props.setFilterValue(newValue);
        }}
        onChangeCommitted={(event, value) => {
          props.setDoneFilter(true);
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
      if (percentPattern.test(filterValue)) {
        props.setFilterValue(parseInt(filterValue));
        props.setInputDone(true);
      } else {
        props.setInvalidInput(true);
        setFilterValue(props.filterValue);
      }
    } else if (event.key === "ArrowUp") {
      if (filterValue < 100) {
        setFilterValue((current) => parseInt(current) + 1);
        props.setFilterValue(parseInt(filterValue) + 1);
      }
    } else if (event.key === "ArrowDown") {
      if (filterValue > 0) {
        setFilterValue((current) => parseInt(current) - 1);
        props.setFilterValue(parseInt(filterValue) - 1);
      }
    }
  };

  const scrollInputFilter = (event) => {
    if (event.deltaY < 0) {
      if (filterValue < 100) {
        setFilterValue((current) => parseInt(current) + 1);
        props.setFilterValue(parseInt(filterValue) + 1);
      }
    } else if (event.deltaY > 0) {
      if (filterValue > 0) {
        setFilterValue((current) => parseInt(current) - 1);
        props.setFilterValue(parseInt(filterValue) - 1);
      }
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
          onWheel={scrollInputFilter}
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
  const [inputDone, setInputDone] = useState(false);

  useEffect(() => {
    // if (!props.resetValue) {
    //   props.setChangeFilter(true);
    // }
    const current = props.currentImage;
    if (current >= 0) {
      props.allImage[current].cssFilter[props.filterName] = filterValue;
    }

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

  useEffect(() => {
    if (inputDone) {
      props.setDoneFilter(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputDone]);

  useEffect(() => {
    if (props.reloadFilter) {
      const current = props.currentImage;

      setFilterValue(props.allImage[current].cssFilter[props.filterName]);
      props.setReloadFilter(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.reloadFilter]);

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
          setInputDone={setInputDone}
          setInvalidInput={props.setInvalidInput}
        />
      </div>
      <Slider
        defaultValue={props.defaultValue}
        disabled={props.disabled || props.disable}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        setDoneFilter={props.setDoneFilter}
      />
    </div>
  );
}

export default SliderFilter;
