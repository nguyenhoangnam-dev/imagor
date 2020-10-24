import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

import { ReactComponent as Close } from '../../../img/cancel.svg';
import createGlobalStyle from 'styled-components';

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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 15,
    lineHeight: 1.5,
    color: 'black',
    backgroundColor: 'var(--color-2)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-3)',
    marginLeft: 10,
    transition: 'background-color .4s',
    '&:hover': {
      backgroundColor: 'var(--color-3)',
      transition: 'background-color .3s',
    },
  },
}));

function MetadataType(props) {
  return (
    <>
      <h2>{props.title}</h2>
      {Object.entries(props.metaProp).map(([name, description]) =>
        description.description !== '' &&
        name !== 'UserComment' &&
        name !== 'NativeDigest' ? (
          <p key={name}>
            {name}: {description.description}
          </p>
        ) : (
          ''
        )
      )}
    </>
  );
}

function MetadataModal(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [metadata, setMetadata] = useState([]);

  const handleClose = () => {
    setOpen(false);
    props.setShowMetadataModal(false);
  };

  useEffect(() => {
    if (props.showMetadataModal) {
      setOpen(true);
    } else {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.showMetadataModal]);

  useEffect(() => {
    const current = props.currentImage;
    if (current >= 0) {
      setMetadata(Object.entries(props.allImage[current].metadata));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentImage]);

  return (
    <div>
      <Modal
        aria-labelledby="Metadata modal"
        aria-describedby="Show all metadata can get from image."
        className={classes.modal}
        open={open}
        onClose={handleClose}
        BackdropProps={{ style: { backgroundColor: 'transparent' } }}
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
              <h2>Metadata menu</h2>
              <Close
                className="close-tag c-pointer"
                onClick={() => {
                  setOpen(false);
                  props.setShowMetadataModal(false);
                }}
                style={{ fill: 'white' }}
              />
            </div>
            <div
              className="modal-box-content metadata-content"
              style={{ height: 700, overflowY: 'auto' }}
            >
              {metadata.map((metaType) => (
                <MetadataType
                  key={metaType[0]}
                  title={metaType[0]}
                  metaProp={metaType[1]}
                />
              ))}
            </div>
            <div className="modal-box-button flex f-hright f-vcenter">
              <Button
                className={classes.button}
                onClick={() => {
                  setOpen(false);
                  props.setShowMetadataModal(false);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </GlobalStyles>
      </Modal>
    </div>
  );
}

export default MetadataModal;
