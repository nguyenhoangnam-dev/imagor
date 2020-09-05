import React, { useState, useEffect } from "react";
import "../components.css";

import { withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import Tooltip from "@material-ui/core/Tooltip";

const ProgressFilter = withStyles((theme) => ({
  root: {
    height: 14,
    borderRadius: 8,
    width: 200,
    marginLeft: 15,
  },
  colorPrimary: {
    backgroundColor: "#bbe1fa",
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#3282b8",
  },
}))(LinearProgress);

function StatusBar(props) {
  const [progressFilterValue, setProgressFilterValue] = useState(0);

  useEffect(() => {
    const progressAnimation = setInterval(function () {
      setProgressFilterValue((oldProgress) => {
        if (oldProgress === 100 || !props.changeFilter) {
          clearInterval(progressAnimation);
          return 0;
        }

        return oldProgress + 1;
      });

      return () => {
        clearInterval(progressAnimation);
      };
    }, 40);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.changeFilter]);
  return (
    <div className="status-bar flex f-hleft f-vcenter">
      <Tooltip title="Progress bar" placement="top">
        <ProgressFilter variant="determinate" value={progressFilterValue} />
      </Tooltip>
      <Tooltip title="Image type" placement="top">
        <p>{props.imageType}</p>
      </Tooltip>
      <Tooltip title="Image size" placement="top">
        <p>{props.imageSize}</p>
      </Tooltip>
      <Tooltip title="Image dimension" placement="top">
        <p>{props.imageWidth + " x " + props.imageHeight}</p>
      </Tooltip>
      <Tooltip title="Image unit" placement="top">
        <p>{props.imageUnit}</p>
      </Tooltip>
    </div>
  );
}

export default StatusBar;
