import React, { useEffect } from "react";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";

import { ReactComponent as Close } from "../img/cancel.svg";

import "../components.css";

const ThemeButton = withStyles({
  root: {
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
})(Button);

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

function ErrorModal(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
    props.setShowErrorModal(false);
  };

  useEffect(() => {
    if (props.showErrorModal) {
      setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.showErrorModal]);

  return (
    <div>
      <Modal
        aria-labelledby="Error modal"
        aria-describedby={props.errorMessage || ""}
        className={classes.modal}
        open={open}
        onClose={handleClose}
      >
        <div className="error-box">
          <div className="error-box-header flex f-space-between f-vcenter">
            <h1>{props.errorTitle}</h1>
            <Close
              className="close-tag c-pointer"
              onClick={() => {
                setOpen(false);
                props.setShowErrorModal(false);
              }}
              style={{ fill: "white" }}
            />
          </div>
          <div className="error-box-content">
            <p>{props.errorMessage}</p>
          </div>
          <div className="error-box-button flex f-hright f-vcenter">
            <ThemeButton
              onClick={() => {
                setOpen(false);
                props.setShowErrorModal(false);
              }}
            >
              Close
            </ThemeButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ErrorModal;
