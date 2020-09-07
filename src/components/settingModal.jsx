import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

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
}));

function SettingModal(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

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
        <p>Setting modal</p>
      </Modal>
    </div>
  );
}

export default SettingModal;
