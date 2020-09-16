import React, { useState, useRef, useEffect } from "react";
import { imagePattern, MIME } from "../global";
import { checkFirstBytes, roundBytes } from "../helper";

function UploadScreen(props) {
  const [active, setActive] = useState(false);
  const [disable, setDisable] = useState(false);

  const hiddenFileInput = useRef(null);

  const clickUpload = () => {
    setActive(true);
    hiddenFileInput.current.click();
  };

  const showUploadDialog = (event) => {
    event.stopPropagation();

    document.body.onfocus = () => {
      setActive(false);
    };
  };

  const preventDefaults = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const dragUpload = (event) => {
    preventDefaults(event);
    setActive(true);
  };

  const dragLeaveUpload = (event) => {
    preventDefaults(event);
    setActive(false);
  };

  const dropUpload = (event) => {
    preventDefaults(event);
    setActive(false);

    let data = event.dataTransfer;
    let fileList = data.files;
    if (fileList.length > 1) {
      props.setShowErrorModal(true);
      props.setErrorTitle("Error");
      props.setErrorMessage("Can not drop multiple file when upload.");
    } else {
      let fileUploaded = fileList[0];

      props.setImageBlob(fileUploaded);
      checkMIME(fileUploaded);
    }
  };

  const finishUpload = (event) => {
    const fileUploaded = event.target.files[0];

    props.setImageBlob(fileUploaded);
    checkMIME(fileUploaded);
  };

  const checkMIME = (image) => {
    let inputSize = image.size;
    let inputType = image.type;

    // Check mime type
    if (!imagePattern.test(inputType)) {
      props.setShowErrorModal(true);
      props.setErrorTitle("Error");
      props.setErrorMessage(
        "Image type of uploaded file is invalid. Project currently only support PNG, JPG, WEBP file type."
      );
    } else {
      if (inputType === "image/svg+xml") {
        // wwSVG.postMessage(image);
        // wwSVG.addEventListener("message", function (event) {
        //   let svgContent = event.data;
        //   if (checkSVG(svgContent)) {
        //     if (inputSize > 52428800) {
        //       alert("File should be <= 50MB.");
        //     } else {
        //       handleFiles(image);
        //     }
        //   } else {
        //     alert("Can not read file.");
        //   }
        // });
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
                props.setErrorTitle("Error");
                props.setErrorMessage(
                  "Size of uploaded file is too large. Project currently only support file whose size is smaller than 50MB."
                );
              } else {
                // Get information of image
                props.setImageName(image.name);
                props.setImageSize(roundBytes(image.size)); // B -> {B, KB, MB}
                props.setImageType(image.type);

                props.handleFiles(image);
              }
            } else {
              props.setShowErrorModal(true);
              props.setErrorTitle("Error");
              props.setErrorMessage("Can not read file.");
            }
          }
        };
      }
    }
  };

  useEffect(() => {
    if (props.loadImage) {
      setDisable(true);
      props.setShowUpload(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loadImage]);

  useEffect(() => {
    if (props.showUpload) {
      setDisable(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.showUpload]);

  return (
    <div
      className={`upload-panel flex f-hcenter f-vcenter ${
        disable ? "disable" : ""
      }`}
    >
      <div
        className={`upload-box flex f-hcenter f-vcenter ${
          active ? "upload-select" : ""
        }`}
        id="upload-box"
        onClick={clickUpload}
        onDrag={dragUpload}
        onDragOver={dragUpload}
        onDragLeave={dragLeaveUpload}
        onDrop={dropUpload}
      >
        <input
          type="file"
          ref={hiddenFileInput}
          onClick={showUploadDialog}
          onChange={finishUpload}
          style={{ display: "none" }}
        />

        <svg
          id="upload-icon"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13.5 23h-3c-.552 0-1-.449-1-1v-5H7a.5.5 0 01-.354-.854l5-5a.5.5 0 01.707 0l5 5A.499.499 0 0117 17h-2.5v5c0 .551-.448 1-1 1zm-5.293-7H10a.5.5 0 01.5.5V22h3v-5.5a.5.5 0 01.5-.5h1.793L12 12.207z" />
          <path d="M4.501 16.97a.559.559 0 01-.057-.003A4.992 4.992 0 010 12a5.006 5.006 0 014.656-4.988C5.348 3.556 8.433 1 12 1a7.508 7.508 0 016.653 4.044A5.985 5.985 0 0124 11c0 2.68-1.796 5.05-4.366 5.762a.5.5 0 11-.267-.964C21.506 15.206 23 13.232 23 11a4.983 4.983 0 00-4.697-4.981.5.5 0 01-.426-.288A6.503 6.503 0 0012 2C8.785 2 6.023 4.395 5.575 7.57A.5.5 0 015.08 8C2.794 8 1 9.794 1 12a3.992 3.992 0 003.556 3.973.5.5 0 01-.055.997z" />
        </svg>

        <p className="t-grey f-20" id="upload-text">
          Click, or drop file here to upload
        </p>
      </div>
    </div>
  );
}

export default UploadScreen;
