import React, { useRef, useEffect, useState } from 'react';
import { getFilter } from '../helper/helper';

// toBlob polyfill
if (!HTMLCanvasElement.prototype.toBlob) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value: function (callback, type, quality) {
      var dataURL = this.toDataURL(type, quality).split(',')[1];
      setTimeout(function () {
        var binStr = atob(dataURL),
          len = binStr.length,
          arr = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          arr[i] = binStr.charCodeAt(i);
        }
        callback(new Blob([arr], { type: type || 'image/png' }));
      });
    },
  });
}

function RenderImage(props) {
  const imageRef = useRef(null);

  const full = useRef(null);
  const thumbnail = useRef(null);
  const smallThumbnail = useRef(null);

  const tempImage = imageRef.current;
  const [imageURL, setImageURL] = useState('');
  const [loadImage, setLoadImage] = useState(false);
  //const [imageFilter, setImageFilter] = useState(resetFilter);

  const renderImage = (canvas, imageType, type, quality) => {
    if (!quality) {
      if (imageType === 'image/jpeg') {
        quality = 0.92;
      } else if (imageType === 'image/webp') {
        quality = 0.8;
      } else {
        quality = 1;
      }
    } else {
      quality /= 100;
    }

    canvas.toBlob(
      function (blob) {
        if (blob) {
          // props.allImage[props.currentImage].size = roundBytes(blob.size);
          const current = props.currentImage;
          const url = URL.createObjectURL(blob);

          if (type === 'thumbnail') {
            props.allImageTag[current].thumbnail = url;

            if (props.loadNewImage) {
              props.setLoadThumbnail(true);
            } else {
              props.setLoadFilterURL(true);
            }
          } else if (type === 'icon') {
            props.allImageTag[current].icon = url;

            props.allImageTag[current].loadIcon = true;
            props.setLoadIcon(true);
          } else if (type === 'full') {
            props.allImage[current].renderUrl = url;
            props.allImage[current].renderSize = blob.size;
            props.setLoadUrl(true);
          }
        }
      },
      imageType,
      quality
    );
  };

  useEffect(() => {
    const current = props.currentImage;

    if (current >= 0) {
      setImageURL(props.allImage[current].url);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentImage]);

  // Handle filter event
  useEffect(() => {
    const canvas = thumbnail.current;
    const context = canvas.getContext('2d');

    const current = props.currentImage;
    if (loadImage || props.doneFilter || props.resetFilter) {
      if (current >= 0) {
        let imageWidth = props.allImage[current].width;
        let imageHeight = props.allImage[current].height;
        let thumbnailWidth, thumbnailHeight;

        if (imageWidth >= 1500) {
          thumbnailWidth = 1500;
          thumbnailHeight = (thumbnailWidth * imageHeight) / imageWidth;
        } else {
          thumbnailWidth = imageWidth;
          thumbnailHeight = imageHeight;
        }

        canvas.width = thumbnailWidth;
        canvas.height = thumbnailHeight;

        if (
          props.allImage[current].filterHistory.length - 1 >
          props.allImage[current].filterPosition
        ) {
          props.allImage[current].filterHistory = props.allImage[
            current
          ].filterHistory.slice(0, props.allImage[current].filterPosition + 1);
        }

        if (props.resetFilter) {
          props.allImage[current].filterHistory.push(
            'contrast(100%) brightness(100%) blur(0px) opacity(100%) saturate(100%) grayscale(0%) invert(0%) sepia(0%)'
          );
          props.allImage[current].filterPosition++;
          context.filter = 'none';
        } else {
          const currentFilter = getFilter(props.allImage[current].cssFilter);

          props.allImage[current].filterHistory.push(currentFilter);
          props.allImage[current].filterPosition++;
          context.filter = currentFilter;
        }

        if (props.doneFilter) {
          props.setDoneFilter(false);
        }

        context.drawImage(tempImage, 0, 0, thumbnailWidth, thumbnailHeight);

        props.allImage[current].blobThumbnail = context.getImageData(
          0,
          0,
          thumbnailWidth,
          thumbnailHeight
        ).data;
        props.allImageTag[current].loadThumbnail = true;

        renderImage(canvas, props.allImage[current].type, 'thumbnail');
      }
    }

    props.setChangeFilter(false);
    props.setResetFilter(false);
    setLoadImage(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.changeFilter, props.resetFilter, props.doneFilter, loadImage]);

  // Load small thumbnail
  useEffect(() => {
    if (props.loadNewImage) {
      const canvas = smallThumbnail.current;
      const context = canvas.getContext('2d');

      const current = props.currentImage;
      if (loadImage && current >= 0) {
        let imageWidth = props.allImage[current].width;
        let imageHeight = props.allImage[current].height;
        let orient = props.allImage[current].orient;
        let thumbnailWidth, thumbnailHeight;

        if (orient === 'landscape') {
          if (imageHeight >= 40) {
            thumbnailHeight = 40;
            thumbnailWidth = (thumbnailHeight * imageWidth) / imageHeight;
          } else {
            thumbnailWidth = imageWidth;
            thumbnailHeight = imageHeight;
          }
        } else {
          if (imageWidth >= 40) {
            thumbnailWidth = 40;
            thumbnailHeight = (thumbnailWidth * imageHeight) / imageWidth;
          } else {
            thumbnailWidth = imageWidth;
            thumbnailHeight = imageHeight;
          }
        }

        canvas.width = thumbnailWidth;
        canvas.height = thumbnailHeight;

        context.drawImage(tempImage, 0, 0, thumbnailWidth, thumbnailHeight);
        renderImage(canvas, props.allImage[current].type, 'icon');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadImage]);

  // Render full image
  useEffect(() => {
    let render = false;
    if (props.showExportModal) {
      render = true;
    } else if (props.renderImage) {
      render = true;
      props.setRenderImage(false);
    }

    if (render) {
      const canvas = full.current;
      const context = canvas.getContext('2d');

      const current = props.currentImage;
      if (current >= 0) {
        let imageWidth = props.exportSetting.width;
        let imageHeight = props.exportSetting.height;

        canvas.width = imageWidth;
        canvas.height = imageHeight;

        const currentFilter = getFilter(props.allImage[current].cssFilter);
        context.filter = currentFilter;

        context.drawImage(tempImage, 0, 0, imageWidth, imageHeight);
        renderImage(
          canvas,
          props.exportSetting.type,
          'full',
          props.exportSetting.quality
        );
      }

      render = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.showExportModal, props.renderImage]);

  const handleLoad = (event) => {
    setLoadImage(true);
  };

  return (
    <>
      <canvas ref={thumbnail} style={{ display: 'none' }} />
      <canvas ref={full} style={{ display: 'none' }} />
      <canvas ref={smallThumbnail} style={{ display: 'none' }} />
      <img
        ref={imageRef}
        src={imageURL}
        onLoad={handleLoad}
        style={{ display: 'none', width: 'auto', height: 'auto' }}
        alt="Temporary"
      />
    </>
  );
}

export default RenderImage;
