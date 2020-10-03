import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import createGlobalStyle from "styled-components";

import { PhotoshopPicker } from "react-color";

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
}));

function ColorPicker(props) {
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
          <PhotoshopPicker
            color={props.currentColor}
            onChangeComplete={(color) => {
              props.setCurrentColor(color.hex);
            }}
            onCancel={() => {
              props.setCurrentColor(breakPoint);
              setOpen(false);
              props.setShowColorPicker(false);
            }}
            onAccept={() => {
              setOpen(false);
              props.setShowColorPicker(false);
            }}
          />
        </GlobalStyles>
      </Modal>
    </div>
  );
}

export default ColorPicker;
