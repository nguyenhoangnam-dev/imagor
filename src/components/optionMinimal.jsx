import React from "react";
import filterLogo from "../adjust.svg";
import "../components.css";
import Tooltip from "@material-ui/core/Tooltip";

function OptionMinimal(props) {
  return (
    <div className={props.showOption ? "disable" : ""}>
      <Tooltip title="Open filter panel" placement="left">
        <div
          className="flex f-hcenter f-vcenter minimal-box"
          onClick={() => props.setShowOption(true)}
        >
          <img className="minimal-icon" src={filterLogo} alt="Filter logo" />
        </div>
      </Tooltip>
    </div>
  );
}

export default OptionMinimal;
