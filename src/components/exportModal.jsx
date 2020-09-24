import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import SliderQuality from "./slider";
import { ReactComponent as Close } from "../img/cancel.svg";

import LinearProgress from "@material-ui/core/LinearProgress";
import createGlobalStyle from "styled-components";

const GlobalStyles = createGlobalStyle.div`
  --color-1: ${(props) => props.color1};
  --color-2: ${(props) => props.color2};
  --color-3: ${(props) => props.color3};
  --color-4: ${(props) => props.color4};
  --contrast-3: ${(props) => props.contrast3};
  --text-color: ${(props) => props.textColor};
`;

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  formControl: {
    width: 80,
  },
  input: {
    fontSize: 12,
  },
  progress: {
    height: 14,
    borderRadius: 8,
    width: "100%",
  },
  colorPrimary: {
    backgroundColor: "#bbe1fa",
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#3282b8",
  },
  button: {
    boxShadow: "none",
    textTransform: "none",
    fontSize: 15,
    lineHeight: 1.5,
    color: "black",
    backgroundColor: "var(--color-2)",
    marginLeft: 10,
    transition: "background-color .4s",
    "&:hover": {
      backgroundColor: "var(--color-3)",
      transition: "background-color .3s",
    },
  },
}));

function ExportModal(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  // const [destType, setDestType] = useState(null); // Will set initial image type
  // const [quality, setQuality] = useState(null);

  // const [renderImage, setRenderImage] = useState(false);
  const [supportQuality, setSupportQuality] = useState(true);
  const [progressFilterValue, setProgressFilterValue] = useState(0);

  const [imageName, setImageName] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [imageQuality, setImageQuality] = useState(null);
  const [imageWidth, setImageWidth] = useState(null);
  const [imageHeight, setImageHeight] = useState(null);
  const [imageUnit, setImageUnit] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [imageOrient, setImageOrient] = useState(null);

  const handleClose = () => {
    setOpen(false);
    props.setShowExportModal(false);
  };

  const changeDestType = (event) => {
    const destTypeValue = event.target.value;
    setImageType(destTypeValue);

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
    } else {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.showExportModal]);

  // useEffect(() => {
  //   if (props.loadOrient) {
  //     const current = props.currentImage;

  //     setImageOrient(props.allImage[current].orient);
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.loadOrient]);

  useEffect(() => {
    if (props.currentImage >= 0) {
      const current = props.currentImage;

      setImageName(props.allImage[current].name);

      const currentImageType = props.allImage[current].type;
      if (currentImageType === "image/jpeg") {
        setImageQuality(92);
      } else if (currentImageType === "image/webp") {
        setImageQuality(80);
      }
      setImageType(currentImageType);
      setImageWidth(props.allImage[current].width);
      setImageHeight(props.allImage[current].height);
      setImageUnit(props.allImage[current].unit);
      setImageOrient(props.allImage[current].orient);
      setImageURL(props.allImage[current].url);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentImage]);

  return (
    <div>
      <Modal
        aria-labelledby="Export image modal"
        aria-describedby="Change name, quality, destination image type to export and download final image."
        className={classes.modal}
        open={open}
        onClose={handleClose}
        BackdropProps={{ style: { backgroundColor: "transparent" } }}
      >
        <GlobalStyles
          color1={props.color1}
          color2={props.color2}
          color3={props.color3}
          color4={props.color4}
          contrast3={props.contrast3}
          textColor={props.textColor}
        >
          <div className="modal-box ">
            <div className="modal-box-header flex f-space-between f-vcenter">
              <h1>Export menu</h1>
              <Close
                className="close-tag c-pointer"
                onClick={() => {
                  setOpen(false);
                  props.setShowExportModal(false);
                }}
                style={{ fill: "white" }}
              />
            </div>
            <div className="modal-box-content flex f-column">
              <div className="flex f-vcenter mb-15">
                <div style={{ width: 90 }}>
                  <Tooltip title="Image name" placement="top">
                    <p style={{ display: "inline-block" }}>Name</p>
                  </Tooltip>
                </div>
                <input
                  className="input-focus-none input-focus-border-bottom"
                  type="text"
                  value={imageName}
                  onChange={(event) => {
                    setImageName(event.target.value);
                  }}
                  style={{
                    width: "calc(100% - 90px)",
                    backgroundColor: "var(--color-1)",
                    border: "none",
                  }}
                />
              </div>
              <div className="flex f-vcenter mb-15">
                <div style={{ width: 90 }}>
                  <Tooltip title="Image type" placement="top">
                    <p style={{ display: "inline-block" }}>Type</p>
                  </Tooltip>
                </div>
                <FormControl className={classes.formControl}>
                  <Select
                    className={classes.input}
                    native
                    value={imageType}
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
              </div>

              <SliderQuality
                filterName={"Quality"}
                defaultValue={imageQuality}
                disable={!supportQuality}
                getValue={(value) => {
                  // setQuality(value);
                }}
                resetValue={false}
                setResetValue={(value) => {}}
              />
              <div className="flex f-vcenter mb-15">
                <div style={{ width: 90 }}>
                  <Tooltip title="Image dimension" placement="top">
                    <p style={{ display: "inline-block" }}>Dimension</p>
                  </Tooltip>
                </div>
                <div className="flex f-vcenter">
                  <input
                    type="text"
                    className="input-focus-none input-focus-border-bottom"
                    value={imageWidth}
                    style={{
                      width: 50,
                      backgroundColor: "var(--color-1)",
                      border: "none",
                    }}
                    onChange={(event) => {
                      setImageWidth(event.target.value);
                    }}
                    onKeyUp={(event) => {
                      if (event.key === "Enter") {
                        if (imageWidth === "") {
                          props.setErrorTitle("Error");
                          props.setErrorMessage("Invalid number.");
                          props.setShowErrorModal(true);
                        }
                      }
                    }}
                  />
                  <p>x</p>
                  <input
                    type="text"
                    className="input-focus-none input-focus-border-bottom"
                    value={imageHeight}
                    style={{
                      width: 50,
                      backgroundColor: "var(--color-1)",
                      border: "none",
                    }}
                    onChange={(event) => {
                      setImageHeight(event.target.value);
                    }}
                    onKeyUp={(event) => {
                      if (event.key === "Enter") {
                        if (imageHeight === "") {
                          props.setErrorTitle("Error");
                          props.setErrorMessage("Invalid number.");
                          props.setShowErrorModal(true);
                        }
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flex f-vcenter mb-15">
                <div style={{ width: 90 }}>
                  <Tooltip title="Image unit" placement="top">
                    <p style={{ display: "inline-block" }}>Unit</p>
                  </Tooltip>
                </div>

                <FormControl className={classes.formControl}>
                  <Select
                    className={classes.input}
                    native
                    value={imageUnit}
                    inputProps={{
                      id: "unit",
                    }}
                  >
                    <option value={"px"}>PX</option>
                    <option value={"inch"}>INCH</option>
                    <option value={"cm"}>CM</option>
                    <option value={"mm"}>MM</option>
                  </Select>
                </FormControl>
              </div>

              <div className="flex f-vcenter f-hcenter">
                <img
                  className={
                    "mb-15 " +
                    (imageOrient === "landscape" ? "mw-100" : "mh-300")
                  }
                  src={imageURL}
                  alt="Preview"
                />
              </div>

              <LinearProgress
                className={classes.progress}
                classes={{
                  colorPrimary: classes.colorPrimary,
                  bar: classes.bar,
                }}
                variant="determinate"
                value={progressFilterValue}
              />
            </div>
            <div className="modal-box-button flex f-hright">
              <Button className={classes.button}>
                <a href={props.imageURL} download={props.imageName}>
                  Download
                </a>
              </Button>
              <Button className={classes.button} onClick={clickRender}>
                Render
              </Button>
            </div>
          </div>
        </GlobalStyles>
      </Modal>
    </div>
  );
}

export default ExportModal;
