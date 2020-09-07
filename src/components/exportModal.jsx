import React, { useEffect, useState } from "react";

import "../components.css";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import SliderQuality from "./slider";

import LinearProgress from "@material-ui/core/LinearProgress";

const ThemeButton = withStyles({
  root: {
    boxShadow: "none",
    textTransform: "none",
    fontSize: 15,
    lineHeight: 1.5,
    color: "white",
    backgroundColor: "#3282b8",
    borderColor: "#3282b8",
    marginLeft: 10,
    "&:hover": {
      backgroundColor: "#0f4c75",
    },
  },
})(Button);

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

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

function ExportModal(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [destType, setDestType] = useState(null); // Will set initial image type
  // const [quality, setQuality] = useState(null);

  // const [renderImage, setRenderImage] = useState(false);
  const [supportQuality, setSupportQuality] = useState(true);
  const [progressFilterValue, setProgressFilterValue] = useState(0);

  const handleClose = () => {
    setOpen(false);
    props.setShowExportModal(false);
  };

  const changeDestType = (event) => {
    const destTypeValue = event.target.value;
    setDestType(destTypeValue);

    if (destTypeValue === "png" || destTypeValue === "bmp") {
      setSupportQuality(false);
    } else {
      setSupportQuality(true);
    }
  };

  const clickRender = (event) => {
    // setRenderImage(true);

    const progressAnimation = setInterval(function () {
      setProgressFilterValue((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(progressAnimation);
          return 0;
        }

        return oldProgress + 1;
      });

      return () => {
        clearInterval(progressAnimation);
      };
    }, 40);
  };

  useEffect(() => {
    if (props.showExportModal) {
      setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.showExportModal]);

  return (
    <div>
      <Modal
        aria-labelledby="Export image modal"
        aria-describedby="Change name, quality, destination image type to export and download final image."
        className={classes.modal}
        open={open}
        onClose={handleClose}
      >
        <div className="export-menu flex f-column">
          <h1>Export menu</h1>
          <p>{props.imageName}</p>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="destType">Destination type</InputLabel>
            <Select
              native
              value={destType}
              onChange={changeDestType}
              inputProps={{
                id: "destType",
              }}
            >
              <option value={"jpg"}>JPG</option>
              <option value={"png"}>PNG</option>
              <option value={"webp"}>WEBP</option>
              <option value={"bmp"}>BMP</option>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <SliderQuality
              className="mt-15"
              filterName={"Quality"}
              defaultValue={100}
              disable={!supportQuality}
              getValue={(value) => {
                // setQuality(value);
              }}
              resetValue={false}
              setResetValue={(value) => {}}
            />
          </FormControl>
          <p>{props.imageWidth + " x " + props.imageHeight}</p>
          <p>{props.imageUnit}</p>
          <img className="export-preview" src={props.imageURL} alt="Preview" />
          <a href={props.imageURL} download={props.imageName}>
            Download
          </a>
          <ProgressFilter variant="determinate" value={progressFilterValue} />
          <ThemeButton onClick={clickRender}>Render</ThemeButton>
        </div>
      </Modal>
    </div>
  );
}

export default ExportModal;
