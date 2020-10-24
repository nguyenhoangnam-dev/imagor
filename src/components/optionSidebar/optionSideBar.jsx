import React, { useState, useEffect, useLayoutEffect } from 'react';
import SliderFilter from '../common/slider';
import { ResizableBox } from 'react-resizable';
import { setFilter } from '../../helper/helper';

import '../../resizable.css';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!../../worker/histogram.worker.js';
import * as Comlink from 'comlink';

const useStyles = makeStyles((theme) => ({
  button: {
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 15,
    lineHeight: 1.5,
    color: 'black',
    backgroundColor: 'var(--color-2)',
    marginLeft: 10,
    transition: 'background-color .4s',
    '&:hover': {
      backgroundColor: 'var(--color-3)',
      transition: 'background-color .3s',
    },
  },
}));

function OptionSideBar(props) {
  const classes = useStyles();
  const [resetValue, setResetValue] = useState(false);
  const [width] = useState(300);
  const [height, setHeight] = useState(0);

  const [blurValue, setBlurValue] = useState(0);

  const [dataHistogram, setDataHistogram] = useState([{}]);
  // const [changeFilter, setChangeFilter] = useState(false);

  // Reload slider separately
  const [reloadContrast, setReloadContrast] = useState(false);
  const [reloadBrightness, setReloadBrightness] = useState(false);
  const [reloadOpacity, setReloadOpacity] = useState(false);
  const [reloadSaturate, setReloadSaturate] = useState(false);
  const [reloadGrayscale, setReloadGrayscale] = useState(false);
  const [reloadInvert, setReloadInvert] = useState(false);
  const [reloadSepia, setReloadSepia] = useState(false);

  const [invalidInput, setInvalidInput] = useState(false);

  const [showRedChannel, setShowRedChannel] = useState(false);
  const [showGreenChannel, setShowGreenChannel] = useState(false);
  const [showBlueChannel, setShowBlueChannel] = useState(false);
  const [showGreyChannel, setShowGreyChannel] = useState(false);

  useEffect(() => {
    for (let i = 0; i < 256; i++) {
      dataHistogram.push({
        name: i,
        red: 0,
        green: 0,
        blue: 0,
        grey: 0,
        cyan: 0,
        magenta: 0,
        yellow: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Set blur value after submit
   * @param {Object} event Store key when key up trigger
   */
  function submitBlur(event) {
    if (event.key === 'Enter') {
      props.setChangeFilter(true);
      props.getFilter('blur', blurValue);
    }
  }

  /**
   * Set value after change value in input
   * @param {Object} event Store value when change value in input trigger
   */
  function changeBlur(event) {
    setBlurValue(event.target.value);
  }

  useLayoutEffect(() => {
    window.addEventListener('resize', () => {
      console.log(window.innerHeight - 55);
      setHeight(window.innerHeight - 55);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set height for react-resizable
  useEffect(() => {
    setHeight(window.innerHeight - 55);
  }, []);

  // Load image to color histogram after upload new image
  useEffect(() => {
    const current = props.currentImage;

    if (current >= 0) {
      if (props.loadThumbnail) {
        const imageBlob = props.allImage[current].blobThumbnail;

        (async () => {
          try {
            const getHistogram = Comlink.wrap(new Worker());

            // @ts-ignore
            let histogram = await getHistogram(imageBlob);
            setDataHistogram(histogram);

            props.allImage[current].loadMeta = true;
            props.allImage[current].histogramObject = histogram;
          } catch (err) {
            console.log(err);
          }
        })();

        props.setLoadNewImage(false);
        props.setLoadThumbnail(false);
      } else {
        setDataHistogram(props.allImage[current].histogramObject);
      }
    } else {
      setDataHistogram([{}]);
      setResetValue(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loadThumbnail, props.currentImage]);

  // Load image to color histogram after update filter
  useEffect(() => {
    const current = props.currentImage;

    if (props.loadFilterURL) {
      const imageBlob = props.allImage[current].blobThumbnail;

      (async () => {
        try {
          const getHistogram = Comlink.wrap(new Worker());

          // @ts-ignore
          let histogram = await getHistogram(imageBlob);
          setDataHistogram(histogram);

          props.allImage[current].loadMeta = true;
          props.allImage[current].histogramObject = histogram;
        } catch (err) {
          console.log(err);
        }
      })();

      if (props.allImage[current].changeFilter) {
        props.allImage[current].changeFilter = false;
      }

      props.setLoadFilterURL(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loadFilterURL]);

  // Reset all slider after load new image
  useEffect(() => {
    if (props.reloadFilter) {
      const current = props.currentImage;
      const filterHistory = props.allImage[current].filterHistory;
      const filterPosition = props.allImage[current].filterPosition;

      let lastFilter = filterHistory[filterPosition];
      props.allImage[current].cssFilter = setFilter(lastFilter);

      setReloadContrast(true);
      setReloadBrightness(true);
      setReloadOpacity(true);
      setReloadGrayscale(true);
      setReloadSaturate(true);
      setReloadInvert(true);
      setReloadSepia(true);

      props.setReloadFilter(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.reloadFilter]);

  // Reset all slider after undo filter
  useEffect(() => {
    const current = props.currentImage;
    if (props.undoFilter && props.allImage[current].filterPosition >= 0) {
      props.allImage[current].filterPosition--;
      let filterPosition = props.allImage[current].filterPosition;

      const filterHistory = props.allImage[current].filterHistory;
      let currentFilter = filterHistory[filterPosition];
      props.allImage[current].cssFilter = setFilter(currentFilter);

      setReloadContrast(true);
      setReloadBrightness(true);
      setReloadOpacity(true);
      setReloadGrayscale(true);
      setReloadSaturate(true);
      setReloadInvert(true);
      setReloadSepia(true);

      props.setUndoFilter(false);
    } else {
      props.setUndoFilter(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.undoFilter]);

  // Reset all slider after redo filter
  useEffect(() => {
    const current = props.currentImage;
    if (
      props.redoFilter &&
      props.allImage[current].filterPosition <
        props.allImage[current].filterHistory.length - 1
    ) {
      props.allImage[current].filterPosition++;
      let filterPosition = props.allImage[current].filterPosition;

      const filterHistory = props.allImage[current].filterHistory;
      let currentFilter = filterHistory[filterPosition];
      props.allImage[current].cssFilter = setFilter(currentFilter);

      setReloadContrast(true);
      setReloadBrightness(true);
      setReloadOpacity(true);
      setReloadGrayscale(true);
      setReloadSaturate(true);
      setReloadInvert(true);
      setReloadSepia(true);

      props.setRedoFilter(false);
    } else {
      props.setRedoFilter(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.redoFilter]);

  // Show error when input invalid number
  useEffect(() => {
    if (invalidInput) {
      props.setErrorTitle('Error');
      props.setErrorMessage('Invalid percent value.');
      props.setShowErrorModal(true);

      setInvalidInput(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invalidInput]);

  return (
    <ResizableBox
      width={width}
      height={height}
      minConstraints={[225, height]}
      axis={'x'}
      resizeHandles={['w']}
      className={`option-sidebar flex f-column f-vcenter ${
        props.showOption ? '' : 'disable'
      }`}
    >
      <div className="filter-box w-100 flex f-column f-vcenter">
        {/* Color histogram */}
        <ResponsiveContainer
          width={'100%'}
          height={150}
          minWidth={180}
          className="flex f-hcenter f-vend "
        >
          <AreaChart
            data={dataHistogram}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            className="flex histogram-box"
          >
            <defs>
              <linearGradient id="redGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="#880000" stopOpacity={1} />
                <stop offset="95%" stopColor="#ff0000" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="#008800" stopOpacity={1} />
                <stop offset="95%" stopColor="#00ff00" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="#000088" stopOpacity={1} />
                <stop offset="95%" stopColor="#0000ff" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="cyanGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="#008888" stopOpacity={1} />
                <stop offset="95%" stopColor="#00ffff" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="magentaGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="#880088" stopOpacity={1} />
                <stop offset="95%" stopColor="#ff00ff" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="yellowGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="#88888800" stopOpacity={1} />
                <stop offset="95%" stopColor="#ffff00" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="greyGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="#888888" stopOpacity={1} />
                <stop offset="95%" stopColor="#ffffff" stopOpacity={1} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" hide={true} />
            <YAxis hide={true} scale="sqrt" />
            <CartesianGrid
              strokeDasharray="3"
              horizontalPoints={[0]}
              verticalPoints={[0, 85, 170, 256]}
            />
            <Area
              type="monotone"
              dataKey="red"
              strokeOpacity={0}
              fillOpacity={1}
              fill="url(#redGradient)"
              hide={showRedChannel}
            />
            <Area
              type="monotone"
              dataKey="green"
              strokeOpacity={0}
              fillOpacity={1}
              fill="url(#greenGradient)"
              hide={showGreenChannel}
            />
            <Area
              type="monotone"
              dataKey="blue"
              strokeOpacity={0}
              fillOpacity={1}
              fill="url(#blueGradient)"
              hide={showBlueChannel}
            />
            <Area
              type="monotone"
              dataKey="cyan"
              strokeOpacity={0}
              fillOpacity={1}
              fill="url(#cyanGradient)"
              hide={showGreenChannel || showBlueChannel}
            />
            <Area
              type="monotone"
              dataKey="magenta"
              strokeOpacity={0}
              fillOpacity={1}
              fill="url(#magentaGradient)"
              hide={showRedChannel || showBlueChannel}
            />
            <Area
              type="monotone"
              dataKey="yellow"
              strokeOpacity={0}
              fillOpacity={1}
              fill="url(#yellowGradient)"
              hide={showRedChannel || showGreenChannel}
            />
            <Area
              type="monotone"
              dataKey="grey"
              strokeOpacity={0}
              fillOpacity={1}
              fill="url(#greyGradient)"
              hide={
                (showRedChannel || showGreenChannel || showBlueChannel) &&
                showGreyChannel
              }
            />
          </AreaChart>
        </ResponsiveContainer>

        <div
          className="flex f-space-between"
          style={{
            minWidth: 180,
            width: 'calc(100% - 44px)',
            maxWidth: 300,
            marginBottom: 10,
          }}
        >
          <p>Channel</p>
          <select
            style={{ backgroundColor: 'var(--color-1)' }}
            className="c-pointer"
            onChange={(event) => {
              const channel = event.target.value;

              if (channel === 'all') {
                setShowRedChannel(false);
                setShowGreenChannel(false);
                setShowBlueChannel(false);
                setShowGreyChannel(true);
              } else if (channel === 'red') {
                setShowRedChannel(false);
                setShowGreenChannel(true);
                setShowBlueChannel(true);
                setShowGreyChannel(true);
              } else if (channel === 'blue') {
                setShowRedChannel(true);
                setShowGreenChannel(true);
                setShowBlueChannel(false);
                setShowGreyChannel(true);
              } else if (channel === 'green') {
                setShowRedChannel(true);
                setShowGreenChannel(false);
                setShowBlueChannel(true);
                setShowGreyChannel(true);
              } else if (channel === 'grey') {
                setShowGreyChannel(false);
                setShowRedChannel(true);
                setShowGreenChannel(true);
                setShowBlueChannel(true);
              }
            }}
          >
            <option value="all">all</option>
            <option value="red">red</option>
            <option value="green">green</option>
            <option value="blue">blue</option>
            <option value="grey">grey</option>
          </select>
        </div>

        {/* Contrast filter */}
        <SliderFilter
          className="mt-15"
          filterName={'Contrast'}
          defaultValue={100}
          currentImage={props.currentImage}
          allImage={props.allImage}
          setDoneFilter={props.setDoneFilter}
          disable={!props.supportFilter}
          getValue={(value) => {
            props.setChangeFilter(true);
          }}
          resetValue={resetValue}
          setResetValue={setResetValue}
          reloadFilter={reloadContrast}
          setReloadFilter={setReloadContrast}
          setInvalidInput={setInvalidInput}
          tooltipText="Difference in luminance or colour that makes an object (or its representation in an image or display) distinguishable."
        />

        {/* Brightness filter */}
        <SliderFilter
          className="mt-15"
          filterName={'Brightness'}
          defaultValue={100}
          currentImage={props.currentImage}
          allImage={props.allImage}
          setDoneFilter={props.setDoneFilter}
          getValue={(value) => {
            props.setChangeFilter(true);
          }}
          resetValue={resetValue}
          setResetValue={setResetValue}
          disable={!props.supportFilter}
          reloadFilter={reloadBrightness}
          setReloadFilter={setReloadBrightness}
          setInvalidInput={setInvalidInput}
          tooltipText="An attribute of visual perception in which a source appears to be radiating or reflecting light."
        />

        {/* Opacity filter */}
        <SliderFilter
          className="mt-15"
          filterName={'Opacity'}
          defaultValue={100}
          currentImage={props.currentImage}
          allImage={props.allImage}
          setDoneFilter={props.setDoneFilter}
          getValue={(value) => {
            props.setChangeFilter(true);
          }}
          resetValue={resetValue}
          setResetValue={setResetValue}
          disable={props.disableOpacity || !props.supportFilter}
          reloadFilter={reloadOpacity}
          setReloadFilter={setReloadOpacity}
          setInvalidInput={setInvalidInput}
          tooltipText="Describes the transparency level, it ranges from 0 to 1."
          tooltipReason="Image type not support opacity filter."
        />

        {/* Saturate filter */}
        <SliderFilter
          className="mt-15"
          filterName={'Saturate'}
          defaultValue={100}
          currentImage={props.currentImage}
          allImage={props.allImage}
          setDoneFilter={props.setDoneFilter}
          disable={!props.supportFilter}
          getValue={(value) => {
            props.setChangeFilter(true);
          }}
          resetValue={resetValue}
          setResetValue={setResetValue}
          reloadFilter={reloadSaturate}
          setReloadFilter={setReloadSaturate}
          setInvalidInput={setInvalidInput}
          tooltipText="Describes the depth or intensity of color present within an image."
        />

        {/* Grayscale filter */}
        <SliderFilter
          className="mt-15"
          filterName={'Grayscale'}
          defaultValue={0}
          currentImage={props.currentImage}
          allImage={props.allImage}
          setDoneFilter={props.setDoneFilter}
          disable={!props.supportFilter}
          getValue={(value) => {
            props.setChangeFilter(true);
          }}
          resetValue={resetValue}
          setResetValue={setResetValue}
          reloadFilter={reloadGrayscale}
          setReloadFilter={setReloadGrayscale}
          setInvalidInput={setInvalidInput}
          tooltipText="The value of each pixel is a single sample representing only an amount of light."
        />

        {/* Invert filter */}
        <SliderFilter
          className="mt-15"
          filterName={'Invert'}
          defaultValue={0}
          currentImage={props.currentImage}
          allImage={props.allImage}
          setDoneFilter={props.setDoneFilter}
          disable={!props.supportFilter}
          getValue={(value) => {
            props.setChangeFilter(true);
          }}
          resetValue={resetValue}
          setResetValue={setResetValue}
          reloadFilter={reloadInvert}
          setReloadFilter={setReloadInvert}
          setInvalidInput={setInvalidInput}
          tooltipText="Change all pixel color to the opposite."
        />

        {/* Sepia filter */}
        <SliderFilter
          className="mt-15"
          filterName={'Sepia'}
          defaultValue={0}
          currentImage={props.currentImage}
          allImage={props.allImage}
          setDoneFilter={props.setDoneFilter}
          disable={!props.supportFilter}
          getValue={(value) => {
            props.setChangeFilter(true);
          }}
          resetValue={resetValue}
          setResetValue={setResetValue}
          reloadFilter={reloadSepia}
          setReloadFilter={setReloadSepia}
          setInvalidInput={setInvalidInput}
          tooltipText="A form of photographic print toning – a tone added to a black and white photograph in the darkroom to “warm” up the tones."
        />
        <div
          className="flex f-space-between"
          style={{ minWidth: 180, width: 'calc(100% - 44px)', maxWidth: 300 }}
        >
          <Tooltip title="Blur image." placement="bottom">
            <p className={!props.supportFilter ? 't-disabled' : ''}>Blur</p>
          </Tooltip>

          <div>
            <input
              className="input-filter-percent"
              value={blurValue}
              onChange={changeBlur}
              onKeyUp={submitBlur}
              style={{ backgroundColor: 'var(--color-1)' }}
              disabled={!props.supportFilter}
            />
            <span className={!props.supportFilter ? 't-disabled' : ''}>px</span>
          </div>
        </div>
        <div
          className="flex f-hright mt-25"
          style={{ minWidth: 180, width: 'calc(100% - 44px)', maxWidth: 300 }}
        >
          <Button
            className={classes.button}
            onClick={() => {
              props.allImage[props.currentImage].cssFilter.reset = true;
              setResetValue(true);

              props.setChangeFilter(true);
              props.setResetFilter(true);
            }}
            disabled={!props.supportFilter}
          >
            Reset
          </Button>
        </div>
      </div>
    </ResizableBox>
  );
}

export default OptionSideBar;
