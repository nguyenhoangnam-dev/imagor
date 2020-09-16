import React, { useEffect, useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";

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
          className={props.disable ? "c-not-allowed" : ""}
          value={filterValue}
          onChange={changeInputFilter}
          onKeyUp={enterInputFilter}
          disabled={props.disable}
          style={{ backgroundColor: "var(--color-1)" }}
        />
      </div>
    </Tooltip>
  );
}

export default InputFilter;
