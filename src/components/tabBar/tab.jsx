import React, { useEffect, useState, useRef } from 'react';
import ReactTooltip from 'react-tooltip';
import { ReactComponent as Close } from '../../img/cancel.svg';
import Tooltip from '@material-ui/core/Tooltip';
// import { useDrag, useDrop } from 'react-dnd';

function Tab(props) {
  const [choose, setChoose] = useState(true);
  const tabRef = useRef(null);
  // const [, drop] = useDrop({
  //   accept: 'card',
  //   hover(item, monitor) {
  //     if (!tabRef.current) {
  //       return;
  //     }

  //     const dragIndex = item.keyId;
  //     const hoverIndex = props.keyId;

  //     // Don't replace items with themselves
  //     if (dragIndex === hoverIndex) {
  //       return;
  //     }

  //     const hoverBoundingRect = tabRef.current?.getBoundingClientRect();
  //     // Get vertical middle
  //     const hoverMiddleY =
  //       (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
  //     // Determine mouse position
  //     const clientOffset = monitor.getClientOffset();
  //     // Get pixels to the top
  //     const hoverClientY = clientOffset.y - hoverBoundingRect;

  //     // Only perform the move when the mouse has crossed half of the items height
  //     // Dragging downwards
  //     if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
  //       return;
  //     }

  //     // Dragging upwards
  //     if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
  //       return;
  //     }

  //     props.moveCard(dragIndex, hoverIndex);

  //     // item.index = hoverIndex
  //     // props.allImageTag
  //   },
  // });

  /**
   * Highlight tag after click
   */
  function chooseImage() {
    if (props.currentImage !== props.keyId) {
      props.setCurrentImage(props.keyId);
    }
  }

  /**
   * Remove workplace after press close icon
   */
  function removeImage() {
    let remove = props.allImage[props.keyId];
    URL.revokeObjectURL(remove.url);
    remove = null;

    props.allImage[props.keyId] = {};

    const allImageTag = props.allImageTag;
    let prePosition = -1;
    let nextPosition = -1;

    for (let i = 0; i < allImageTag.length; i++) {
      if (allImageTag[i].id === props.keyId) {
        if (i !== 0) {
          prePosition = allImageTag[i - 1].id;
        }

        if (i !== allImageTag.length - 1) {
          nextPosition = allImageTag[i + 1].id;
        }

        props.allImageTag.splice(i, 1);

        break;
      }
    }

    props.setTrigger(props.trigger + 1);

    if (props.currentImage === props.keyId) {
      if (prePosition !== -1) {
        props.setCurrentImage(prePosition);
      } else if (nextPosition !== -1) {
        props.setCurrentImage(nextPosition);
      } else {
        props.setCurrentImage(-1);
      }
    }
  }

  // Highligh tag after render
  useEffect(() => {
    if (props.keyId === props.currentImage) {
      setChoose(true);
    } else {
      setChoose(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentImage]);

  // Trigger to close workplace
  useEffect(() => {
    if (props.close) {
      removeImage();
      props.setCloseTag(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.close]);

  // Open next workplace
  useEffect(() => {
    if (props.nextTag) {
      const allImageTag = props.allImageTag;
      let firstPosition = allImageTag[0].id;
      let nextPosition = -1;

      for (let i = 0; i < allImageTag.length; i++) {
        if (allImageTag[i].id === props.keyId) {
          if (i !== allImageTag.length - 1) {
            nextPosition = allImageTag[i + 1].id;
          }

          break;
        }
      }

      props.setTrigger(props.trigger + 1);

      if (nextPosition === -1) {
        props.setCurrentImage(firstPosition);
      } else {
        props.setCurrentImage(nextPosition);
      }

      props.setNextTag(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.nextTag]);

  // Open previous workplace
  useEffect(() => {
    if (props.preTag) {
      const allImageTag = props.allImageTag;
      let prePosition = -1;
      let lastPosition = allImageTag[allImageTag.length - 1].id;

      for (let i = 0; i < allImageTag.length; i++) {
        if (allImageTag[i].id === props.keyId) {
          if (i !== 0) {
            prePosition = allImageTag[i - 1].id;
          }

          break;
        }
      }

      props.setTrigger(props.trigger + 1);

      if (prePosition === -1) {
        props.setCurrentImage(lastPosition);
      } else {
        props.setCurrentImage(prePosition);
      }

      props.setPreTag(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.preTag]);

  return (
    <>
      <div
        data-tip
        data-for={'preview' + props.keyId}
        className={
          'flex f-space-between tag-box f-vcenter ' + (choose ? 'choose ' : ' ')
        }
        onClick={chooseImage}
        ref={tabRef}
      >
        {/* Load preview image as icon */}
        {props.loadIcon ? (
          <div
            className="flex f-hcenter f-vcenter"
            style={{ width: 25, overflow: 'hidden', marginRight: 5 }}
          >
            <img src={props.icon} style={{ height: 24 }} alt="icon" />
          </div>
        ) : (
          ''
        )}

        {/* Show name of workplace unless minify tab */}
        {!props.minifyTab ? (
          <p className="tag-image-name">{props.tagName}</p>
        ) : (
          ''
        )}

        {/* Icon to close workplace */}
        <Tooltip title={'Close (Ctrl + W)'} placement="bottom">
          <Close
            className="close-tag"
            onClick={(event) => {
              event.stopPropagation();
              removeImage();
            }}
          />
        </Tooltip>
      </div>

      {/* Show thumbnail of image when hover tag */}
      <ReactTooltip
        id={'preview' + props.keyId}
        aria-haspopup="true"
        place="bottom"
        textColor="var(--text-color)"
        backgroundColor="var(--color-2)"
        effect="solid"
        delayShow={500}
        className="preview-image-tooltip"
      >
        <p>{props.tagName}</p>
        {props.loadThumbnail ? (
          <img
            src={props.thumbnail}
            style={{ width: 230, paddingTop: 10 }}
            alt="Preview"
          />
        ) : (
          ''
        )}
      </ReactTooltip>
    </>
  );
}

export default Tab;
