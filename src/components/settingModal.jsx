import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";

import { ReactComponent as Close } from "../img/cancel.svg";
import createGlobalStyle from "styled-components";
import { contrastColor } from "../helper";

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
  const [colorValue, setColorValue] = useState(props.colorValue);
  const [contrastValue, setContrastValue] = useState(
    contrastColor(props.colorValue)
  );

  const changeInputFilter = (event) => {
    setColorValue(event.target.value);
  };

  const enterInputFilter = (event) => {
    if (event.key === "Enter") {
      setContrastValue(contrastColor(colorValue));
      props.setColorValue(colorValue);
    }
  };

  return (
    <input
      className={props.disable ? "c-not-allowed" : ""}
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
  );
}

function SettingModal(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    props.setShowSettingModal(false);
  };

  useEffect(() => {
    if (props.showSettingModal) {
      setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.showSettingModal]);

  return (
    <div>
      <Modal
        aria-labelledby="Setting modal"
        aria-describedby="Setting message."
        className={classes.modal}
        open={open}
        onClose={handleClose}
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
                  colorValue={props.color1}
                  setColorValue={props.setColor1}
                />
              </div>
              <div className="flex">
                <p>Color 2:</p>
                <InputColor
                  colorValue={props.color2}
                  setColorValue={props.setColor2}
                />
              </div>
              <div className="flex">
                <p>Color 3:</p>
                <InputColor
                  colorValue={props.color3}
                  setColorValue={props.setColor3}
                />
              </div>
              <div className="flex">
                <p>Color 4:</p>
                <InputColor
                  colorValue={props.color4}
                  setColorValue={props.setColor4}
                />
              </div>
            </div>
            <div className="modal-box-button">
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
                  props.setShowSettingModal(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </GlobalStyles>
      </Modal>
    </div>
  );
}

export default SettingModal;
