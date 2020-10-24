import React, { useState, useRef, useEffect } from 'react';

import { imagePattern, MIME } from '../../../helper/global';
import { checkFirstBytes, checkSVG } from '../../../helper/helper';

import { ReactComponent as Close } from '../../../img/cancel.svg';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

import createGlobalStyle from 'styled-components';

const getPathFromPublic = (path) => `${process.env.PUBLIC_URL}/${path}`;
const wwSVGPath = getPathFromPublic('wwSVG.js');
const wwSVG = new Worker(wwSVGPath);

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
    color: 'var(--text-color)',
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
    '&.Mui-selected': {
      outline: 'none',
    },
  },
}));

const GlobalStyles = createGlobalStyle.div`
  --color-1: ${(props) => props.color1};
  --color-2: ${(props) => props.color2};
  --color-3: ${(props) => props.color3};
  --color-4: ${(props) => props.color4};
  --contrast-3: ${(props) => props.contrast3};
  --text-color: ${(props) => props.textColor};
`;

function OtherImage(props) {
  return (
    <Tooltip title={props.name} placement="bottom">
      <img
        src={props.url}
        style={{ height: '100%' }}
        alt="Previous workplace"
      />
    </Tooltip>
  );
}

function UploadModal(props) {
  const classes = useStyles();
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(true);

  const hiddenFileInput = useRef(null);

  const handleClose = () => {
    setOpen(false);
  };

  // Click event
  // const clickUpload = () => {
  //   setActive(true);
  //   hiddenFileInput.current.click();
  // };

  const showUploadDialog = (event) => {
    event.stopPropagation();

    document.body.onfocus = () => {
      setActive(false);
    };
  };

  // Ignore default event
  const preventDefaults = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // Drag and drop to upload
  // Drag event
  const dragUpload = (event) => {
    preventDefaults(event);
    setActive(true);
  };

  // Leave mouse of upload modal
  const dragLeaveUpload = (event) => {
    preventDefaults(event);
    setActive(false);
  };

  // Drop file to upload modal
  const dropUpload = (event) => {
    preventDefaults(event);
    setActive(false);

    let data = event.dataTransfer;
    let fileList = data.files;
    if (fileList.length > 1) {
      props.setShowErrorModal(true);
      props.setErrorTitle('Error');
      props.setErrorMessage('Can not drop multiple file when upload.');
    } else {
      let fileUploaded = fileList[0];

      checkMIME(fileUploaded);
    }
  };

  // Finish upload
  const finishUpload = (event) => {
    const fileUploaded = event.target.files[0];

    checkMIME(fileUploaded);
  };

  // Check MIME type
  const checkMIME = (image) => {
    let inputSize = image.size;
    let inputType = image.type;

    // Check mime type
    if (!imagePattern.test(inputType)) {
      props.setShowErrorModal(true);
      props.setErrorTitle('Error');
      props.setErrorMessage(
        'Image type of uploaded file is invalid. Project currently only support PNG, JPG, WEBP file type.'
      );
    } else {
      if (inputType === 'image/svg+xml') {
        wwSVG.postMessage(image);
        wwSVG.onmessage = function (event) {
          let svgContent = event.data;
          if (checkSVG(svgContent)) {
            if (inputSize > 52428800) {
              alert('File should be <= 50MB.');
            } else {
              props.handleFiles(image);
            }
          } else {
            alert('Can not read file.');
          }
        };
      } else {
        let fileBlob = image.slice(0, 4);
        let reader = new FileReader();
        reader.readAsArrayBuffer(fileBlob);

        reader.onloadend = function (e) {
          if (!e.target.error) {
            let bytes = new Uint8Array(e.target.result);
            if (checkFirstBytes(bytes, MIME[inputType])) {
              if (inputSize > 419430400) {
                props.setShowErrorModal(true);
                props.setErrorTitle('Error');
                props.setErrorMessage(
                  'Size of uploaded file is too large. Project currently only support file whose size is smaller than 50MB.'
                );
              } else {
                props.handleFiles(image);
              }
            } else {
              props.setShowErrorModal(true);
              props.setErrorTitle('Error');
              props.setErrorMessage('Can not read file.');
            }
          }
        };
      }
    }
  };

  useEffect(() => {
    if (props.currentImage >= 0) {
      setOpen(false);
      props.setShowUploadModal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentImage]);

  useEffect(() => {
    if (props.showUploadModal) {
      setOpen(true);
    } else {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.showUploadModal]);

  useEffect(() => {
    if (!open) {
      setOpen(false);
      props.setShowUploadModal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div>
      <Modal
        aria-labelledby="Error modal"
        aria-describedby="Click or drop file to upload"
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
          className="flex f-vcenter f-column"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            className="modal-box"
            style={{ width: '80%', height: '80%', background: 'white' }}
          >
            <div className="modal-box-header flex f-space-between f-vcenter">
              <h1>Upload menu</h1>
              <Close
                className="close-tag c-pointer"
                onClick={() => {
                  setOpen(false);
                  props.setShowUploadModal(false);
                }}
                style={{ fill: 'white' }}
              />
            </div>
            <div className="modal-box-content" style={{ height: '80%' }}>
              <div
                className={`upload-box ${active ? 'upload-select' : ''}`}
                id="upload-box"
                // onClick={clickUpload}
                onDrag={dragUpload}
                onDragOver={dragUpload}
                onDragLeave={dragLeaveUpload}
                onDrop={dropUpload}
              >
                {/* Hidden upload input to trigger upload */}
                <input
                  type="file"
                  ref={hiddenFileInput}
                  onClick={showUploadDialog}
                  onChange={finishUpload}
                  style={{ display: 'none' }}
                />
                <div className="other-image">
                  {props.currentImage >= 0 ? (
                    props.allImageTag.map((image) => (
                      <OtherImage
                        key={image.id}
                        url={image.thumbnail}
                        name={image.name}
                      />
                    ))
                  ) : (
                    <p>Drop file here to upload</p>
                  )}
                </div>

                {/* <p className="t-grey f-20" id="upload-text">
                  Drop file here to upload
                </p> */}
              </div>
            </div>
            <div className="modal-box-button flex f-vcenter f-space-between">
              <div>
                {/* Apply button */}
                <Button
                  className={classes.button}
                  onClick={() => {
                    setOpen(false);
                    hiddenFileInput.current.click();
                    props.setShowUploadModal(false);
                  }}
                >
                  Upload
                </Button>

                {/* Cancel button */}
                <Button
                  className={classes.button}
                  onClick={() => {
                    setOpen(false);
                    props.setShowUploadModal(false);
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

export default UploadModal;
