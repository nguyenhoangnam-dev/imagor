import React from "react";
import { ReactComponent as FilterLogo } from "../../img/adjust.svg";
import Tooltip from "@material-ui/core/Tooltip";

function OptionMinimal(props) {
  return (
    <div className={"option-icon-bar"}>
      {/* Show option sidebar */}
      <Tooltip title="Open filter panel" placement="left">
        <div
          className={
            "flex f-hcenter f-vcenter minimal-box " +
            (props.showOption ? "choose" : "")
          }
          onClick={() => props.setShowOption(!props.showOption)}
        >
          <FilterLogo className="minimal-icon" />
        </div>
      </Tooltip>
    </div>
  );
}

export default OptionMinimal;
