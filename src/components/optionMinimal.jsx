import React from "react";
import filterLogo from "../adjust.svg";
import "../components.css";

function OptionMinimal(props) {
  return (
    <div className={props.showOption ? "disable" : ""}>
      <div
        className="flex f-hcenter f-vcenter minimal-box"
        onClick={() => props.setShowOption(true)}
      >
        <img className="minimal-icon" src={filterLogo} alt="Filter logo" />
      </div>
    </div>
  );
}

export default OptionMinimal;
