import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

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
        aria-describedby="Error message."
        className={classes.modal}
        open={open}
        onClose={handleClose}
      >
        <div className="error-box">
          <h1>{props.errorTitle}</h1>
          <p>{props.errorMessage}</p>
        </div>
      </Modal>
    </div>
  );
}

export default ErrorModal;
