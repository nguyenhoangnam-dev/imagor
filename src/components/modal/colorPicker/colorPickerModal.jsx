import React, { useEffect, useState } from "react";

// Style
import createGlobalStyle from "styled-components";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";

// Image
import { ReactComponent as Close } from "../../../img/cancel.svg";

// Color picker
// import { PhotoshopPicker } from "react-color";
import ColorPicker from "./colorPicker";

const space = require("color-space");

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
    color: "var(--text-color)",
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

function ColorPickerModal(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [breakPoint, setBreakPoint] = useState("");

  const handleClose = () => {
    setOpen(false);
    props.setShowColorPicker(false);
  };

  // Open color picker
  useEffect(() => {
    if (props.showColorPicker) {
      setOpen(true);
      setBreakPoint(props.currentColor);
      console.log(space.rgb.hsl([200, 230, 100]));
    } else {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.showColorPicker]);

  return (
    <div>
      <Modal
        aria-labelledby="Color picker"
        aria-describedby="Choose color"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        onBackdropClick={() => {
          props.setCurrentColor(breakPoint);
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
          <div className="modal-box" style={{ width: 441 }}>
            <div className="modal-box-header flex f-space-between f-vcenter">
              <h1 style={{ color: "var(--text-color)" }}>Color picker modal</h1>
              <Close
                className="close-tag c-pointer"
                onClick={() => {
                  setOpen(false);
                  props.setShowColorPicker(false);
                }}
                style={{ fill: "white" }}
              />
            </div>
            <div className="modal-box-content">
              <ColorPicker
                color={props.currentColor}
                onChangeComplete={(color) => {
                  props.setCurrentColor(color.hex);
                }}
              />
            </div>
            <div className="modal-box-button flex f-vcenter f-space-between">
              <div>
                {/* Apply button */}
                <Button
                  className={classes.button}
                  onClick={() => {
                    setOpen(false);
                    props.setShowColorPicker(false);
                  }}
                >
                  Ok
                </Button>

                {/* Cancel button */}
                <Button
                  className={classes.button}
                  onClick={() => {
                    setOpen(false);
                    props.setCurrentColor(breakPoint);
                    props.setShowColorPicker(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </GlobalStyles>
      </Modal>
    </div>
  );
}

export default ColorPickerModal;
