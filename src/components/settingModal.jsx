import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";

import { ReactComponent as Close } from "../img/cancel.svg";
import createGlobalStyle from "styled-components";
import { contrastColor } from "../helper";
import picker from "../img/color-picker.svg";

import { hexPattern } from "../global";

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
  button: {
    boxShadow: "none",
    textTransform: "none",
    fontSize: 15,
    lineHeight: 1.5,
    color: "black",
    backgroundColor: "var(--color-2)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "var(--color-3)",
    marginLeft: 10,
    transition: "background-color .4s",
    "&:hover": {
      backgroundColor: "var(--color-3)",
      transition: "background-color .3s",
    },
  },
}));

function InputColor(props) {
  const [colorValue, setColorValue] = useState("");
  const [contrastValue, setContrastValue] = useState(
    contrastColor(props.colorValue)
  );

  const changeInputFilter = (event) => {
    const text = event.target.value;

    setColorValue(text);
  };

  const enterInputFilter = (event) => {
    if (event.key === "Enter") {
      if (hexPattern.test(colorValue)) {
        setContrastValue(contrastColor(colorValue));
        props.setColorValue(colorValue);
        props.setColoriValue(colorValue);
      } else {
        props.setInvalidInput(true);
        setColorValue(props.colorValue);
        setContrastValue(contrastColor(props.colorValue));
      }
    }
  };

  useEffect(() => {
    if (props.colorValue) {
      setColorValue(props.colorValue);
      setContrastValue(contrastColor(props.colorValue));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.colorValue]);

  return (
    <>
      <input
        className={
          "setting-input-color " + (props.disable ? "c-not-allowed" : "")
        }
        value={colorValue}
        onChange={changeInputFilter}
        onKeyUp={enterInputFilter}
        disabled={props.disable}
        style={{
          fontFamily: "monospace",
          width: 80,
          border: "1px solid black",
          fontSize: 15,
          paddingRight: 3,
          cursor: "pointer",
          boxSizing: "content-box",
          height: 15,
          backgroundColor: colorValue,
          color: contrastValue,
          textTransform: "uppercase",
          marginLeft: 10,
        }}
      />
      <img
        src={picker}
        onClick={() => {
          props.setColor(true);
        }}
        style={{ height: 15, marginLeft: 5, cursor: "pointer" }}
        alt="Color picker"
      />
    </>
  );
}

function SettingModal(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [breakPoint, setBreakPoint] = useState([]);
  const [color1, setColor1] = useState(false);
  const [color2, setColor2] = useState(false);
  const [color3, setColor3] = useState(false);
  const [color4, setColor4] = useState(false);

  const [color1Value, setColor1Value] = useState(props.color1);
  const [color2Value, setColor2Value] = useState(props.color2);
  const [color3Value, setColor3Value] = useState(props.color3);
  const [color4Value, setColor4Value] = useState(props.color4);

  const [invalidInput, setInvalidInput] = useState(false);

  const handleClose = () => {
    setOpen(false);
    props.setShowSettingModal(false);
  };

  useEffect(() => {
    if (props.showSettingModal) {
      setBreakPoint([props.color1, props.color2, props.color3, props.color4]);
      setOpen(true);
    } else {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.showSettingModal]);

  useEffect(() => {
    if (color1) {
      props.setShowColorPicker(true);
      props.setCurrentColor(props.color1);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color1]);

  useEffect(() => {
    if (color2) {
      props.setShowColorPicker(true);
      props.setCurrentColor(props.color2);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color2]);

  useEffect(() => {
    if (color3) {
      props.setShowColorPicker(true);
      props.setCurrentColor(props.color3);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color3]);

  useEffect(() => {
    if (color4) {
      props.setShowColorPicker(true);
      props.setCurrentColor(props.color4);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color4]);

  useEffect(() => {
    if (props.currentColor) {
      const currentColor = props.currentColor;
      if (color1) {
        setColor1Value(currentColor);
        props.setColor1(currentColor);
      } else if (color2) {
        setColor2Value(currentColor);
        props.setColor2(currentColor);
      } else if (color3) {
        setColor3Value(currentColor);
        props.setColor3(currentColor);
      } else if (color4) {
        setColor4Value(currentColor);
        props.setColor4(currentColor);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentColor]);

  useEffect(() => {
    if (!props.showColorPicker) {
      if (color1) {
        setColor1(false);
      } else if (color2) {
        setColor2(false);
      } else if (color3) {
        setColor3(false);
      } else if (color4) {
        setColor4(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.showColorPicker]);

  useEffect(() => {
    if (invalidInput) {
      props.setErrorTitle("Error");
      props.setErrorMessage("Invalid color.");
      props.setShowErrorModal(true);

      setInvalidInput(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invalidInput]);

  return (
    <div>
      <Modal
        aria-labelledby="Setting modal"
        aria-describedby="Setting message."
        className={classes.modal}
        open={open}
        onClose={handleClose}
        onBackdropClick={() => {
          setOpen(false);
          props.setColor1(breakPoint[0]);
          props.setColor2(breakPoint[1]);
          props.setColor3(breakPoint[2]);
          props.setColor4(breakPoint[3]);
          props.setShowSettingModal(false);
        }}
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
          <div className="modal-box">
            <div className="modal-box-header flex f-space-between f-vcenter">
              <h1>Setting menu</h1>
              <Close
                className="close-tag c-pointer"
                onClick={() => {
                  setOpen(false);
                  props.setShowSettingModal(false);
                }}
                style={{ fill: "white" }}
              />
            </div>
            <div className="modal-box-content">
              <h2>Theme</h2>
              <div className="flex f-vcenter">
                <p>Color 1:</p>
                <InputColor
                  colorValue={color1Value}
                  setColoriValue={setColor1Value}
                  setColorValue={props.setColor1}
                  setColor={setColor1}
                  setInvalidInput={setInvalidInput}
                />
              </div>
              <div className="flex">
                <p>Color 2:</p>
                <InputColor
                  colorValue={color2Value}
                  setColoriValue={setColor2Value}
                  setColorValue={props.setColor2}
                  setColor={setColor2}
                  setInvalidInput={setInvalidInput}
                />
              </div>
              <div className="flex">
                <p>Color 3:</p>
                <InputColor
                  colorValue={color3Value}
                  setColoriValue={setColor3Value}
                  setColorValue={props.setColor3}
                  setColor={setColor3}
                  setInvalidInput={setInvalidInput}
                />
              </div>
              <div className="flex">
                <p>Color 4:</p>
                <InputColor
                  colorValue={color4Value}
                  setColoriValue={setColor4Value}
                  setColorValue={props.setColor4}
                  setColor={setColor4}
                  setInvalidInput={setInvalidInput}
                />
              </div>
            </div>
            <div className="modal-box-button flex f-vcenter f-space-between">
              <div>
                <Button
                  className={classes.button}
                  onClick={() => {
                    setOpen(false);
                    props.setShowSettingModal(false);
                  }}
                >
                  Apply
                </Button>
                <Button
                  className={classes.button}
                  onClick={() => {
                    setOpen(false);
                    props.setColor1(breakPoint[0]);
                    props.setColor2(breakPoint[1]);
                    props.setColor3(breakPoint[2]);
                    props.setColor4(breakPoint[3]);
                    props.setShowSettingModal(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
              <div>
                <Button
                  className={classes.button}
                  onClick={() => {
                    setColor1Value(breakPoint[0]);
                    setColor2Value(breakPoint[1]);
                    setColor3Value(breakPoint[2]);
                    setColor4Value(breakPoint[3]);
                    props.setColor1(breakPoint[0]);
                    props.setColor2(breakPoint[1]);
                    props.setColor3(breakPoint[2]);
                    props.setColor4(breakPoint[3]);
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </GlobalStyles>
      </Modal>
    </div>
  );
}

export default SettingModal;
