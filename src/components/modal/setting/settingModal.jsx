import React, { useEffect, useState } from 'react';

// Style
import createGlobalStyle from 'styled-components';

// Component
// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';

import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';

// Tab
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import '../modal.css';

// Image
import { ReactComponent as Close } from '../../../img/cancel.svg';
import picker from '../../../img/color-picker.svg';

// Other
import { hexPattern } from '../../../helper/global';
import { contrastColor } from '../../../helper/helper';

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

function InputColor(props) {
  const [colorValue, setColorValue] = useState('');
  const [contrastValue, setContrastValue] = useState(
    contrastColor(props.colorValue)
  );

  const changeInputFilter = (event) => {
    const text = event.target.value;

    setColorValue(text);
  };

  // Set global color when enter
  const enterInputFilter = (event) => {
    if (event.key === 'Enter') {
      if (hexPattern.test(colorValue)) {
        setContrastValue(contrastColor(colorValue));
        props.setColorValue(colorValue);
        // props.setColoriValue(colorValue);
        props.changeInputValue(props.name, colorValue);
      } else {
        props.setInvalidInput(true);
        setColorValue(props.colorValue);
        setContrastValue(contrastColor(props.colorValue));
      }
    }
  };

  // Set color can text color in input
  useEffect(() => {
    if (props.colorValue) {
      setColorValue(props.colorValue);
      setContrastValue(contrastColor(props.colorValue));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.colorValue]);

  return (
    <>
      {/* Input color value */}
      <input
        className={
          'setting-input-color ' + (props.disable ? 'c-not-allowed' : '')
        }
        value={colorValue}
        onChange={changeInputFilter}
        onKeyUp={enterInputFilter}
        disabled={props.disable}
        style={{
          fontFamily: 'monospace',
          width: 80,
          border: '1px solid black',
          fontSize: 15,
          paddingRight: 3,
          cursor: 'pointer',
          boxSizing: 'content-box',
          height: 15,
          backgroundColor: colorValue,
          color: contrastValue,
          textTransform: 'uppercase',
          marginLeft: 10,
        }}
      />

      {/* Open color picker */}
      <Tooltip
        title="Open color picker modal to choose color"
        placement="right"
      >
        <img
          src={picker}
          onClick={() => {
            props.setColor(true);
            props.setCurrentInput(props.name);
          }}
          style={{ height: 15, marginLeft: 5, cursor: 'pointer' }}
          alt="Color picker"
        />
      </Tooltip>
    </>
  );
}

function SettingModal(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const [color, setColor] = useState(false);
  const [currentInput, setCurrentInput] = useState(props.currentInput);
  const [breakState, setBreakState] = useState(null);

  const [invalidInput, setInvalidInput] = useState(false);

  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);

  const [allValue, setAllValue] = useState({
    showNotification: props.showNotification,
    silentNotification: props.silentNotification,
    minifyTab: props.minifyTab,
    color1: props.color1,
    color2: props.color2,
    color3: props.color3,
    color4: props.color4,
    textColor: props.textColor,
    inactiveColor: props.inactiveColor,
    iconColor: props.iconColor,
  });

  const handleClose = () => {
    setOpen(false);
    props.setShowSettingModal(false);
  };

  const changeValue = (event) => {
    setAllValue({ ...allValue, [event.target.name]: event.target.checked });

    if (event.target.name === 'minifyTab') {
      props.setMinifyTab(event.target.checked);
    }
  };

  // New state
  const changeInputValue = (inputName, inputValue) => {
    setAllValue({ ...allValue, [inputName]: inputValue });
  };

  const resetState = () => {
    setAllValue(breakState);

    setGlobal(breakState);
  };

  /**
   * Set all state of setting to value of object storage
   * @param {Object} storage Store all state of setting
   */
  const setGlobal = (storage) => {
    props.setColor1(storage.color1);
    props.setColor2(storage.color2);
    props.setColor3(storage.color3);
    props.setColor4(storage.color4);
    props.setShowNotification(storage.showNotification);
    props.setSilentNotification(storage.silentNotification);
    props.setMinifyTab(storage.minifyTab);
    props.setTextColor(storage.textColor);
    props.setInactiveColor(storage.inactiveColor);
    props.setIconColor(storage.iconColor);
  };

  useEffect(() => {
    if (color) {
      props.setShowColorPicker(true);
      props.setCurrentColor(props[currentInput]);
      props.setCurrentInput(currentInput);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color]);

  // Store breakpoint of setting for reset or cancel
  useEffect(() => {
    if (props.showSettingModal) {
      setBreakState({
        showNotification: props.showNotification,
        silentNotification: props.silentNotification,
        minifyTab: props.minifyTab,
        color1: props.color1,
        color2: props.color2,
        color3: props.color3,
        color4: props.color4,
        textColor: props.textColor,
        inactiveColor: props.inactiveColor,
        iconColor: props.iconColor,
      });
      setOpen(true);
    } else {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.showSettingModal]);

  // Set color from color picker
  useEffect(() => {
    if (props.currentColor) {
      const currentColor = props.currentColor;
      const inputName = props.currentInput;
      changeInputValue(inputName, currentColor);

      if (inputName === 'color1') {
        props.setColor1(currentColor);
      } else if (inputName === 'color2') {
        props.setColor2(currentColor);
      } else if (inputName === 'color3') {
        props.setColor3(currentColor);
      } else if (inputName === 'color4') {
        props.setColor4(currentColor);
      } else if (inputName === 'textColor') {
        props.setTextColor(currentColor);
      } else if (inputName === 'inactiveColor') {
        props.setInactiveColor(currentColor);
      } else if (inputName === 'iconColor') {
        props.setIconColor(currentColor);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentColor]);

  // Close color picker
  useEffect(() => {
    if (!props.showColorPicker) {
      setColor(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.showColorPicker]);

  // Check invalid input and show error
  useEffect(() => {
    if (invalidInput) {
      props.setErrorTitle('Error');
      props.setErrorMessage('Invalid color.');
      props.setShowErrorModal(true);

      setInvalidInput(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invalidInput]);

  return (
    <div>
      <Modal
        aria-labelledby="Setting modal"
        aria-describedby="Setting message."
        className={classes.modal}
        open={open}
        onClose={handleClose}
        onBackdropClick={() => {
          setOpen(false);
          resetState();
          props.setShowSettingModal(false);
        }}
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
          <Draggable cancel={'.react-resizable-handle'}>
            <Resizable
              width={width}
              height={height}
              // minConstraints={[500, height]}
              // axis={'x'}
              // resizeHandles={['w']}
              onResize={(e, data) => {
                setWidth(data.size.width);
                setHeight(data.size.height);
              }}
            >
              <div className="modal-box">
                <div className="modal-box-header flex f-space-between f-vcenter">
                  <h1>Setting menu</h1>
                  <Close
                    className="close-tag c-pointer"
                    onClick={() => {
                      setOpen(false);
                      props.setShowSettingModal(false);
                    }}
                    style={{ fill: 'white' }}
                  />
                </div>
                <div className="modal-box-content">
                  <Tabs>
                    <TabList>
                      <Tab>Theme</Tab>
                      <Tab>Notification</Tab>
                      <Tab>Tab</Tab>
                      <Tab>Keymap</Tab>
                    </TabList>

                    <TabPanel>
                      <div className="flex f-space-between">
                        <div>
                          {/* Set color 1 */}
                          <div className="flex f-vcenter">
                            <p>Color 1:</p>
                            <InputColor
                              colorValue={allValue.color1}
                              setColorValue={props.setColor1}
                              setInvalidInput={setInvalidInput}
                              name="color1"
                              changeInputValue={changeInputValue}
                              setColor={setColor}
                              setCurrentInput={setCurrentInput}
                            />
                          </div>

                          {/* Set color 2 */}
                          <div className="flex">
                            <p>Color 2:</p>
                            <InputColor
                              colorValue={allValue.color2}
                              setColorValue={props.setColor2}
                              setInvalidInput={setInvalidInput}
                              name="color2"
                              changeInputValue={changeInputValue}
                              setColor={setColor}
                              setCurrentInput={setCurrentInput}
                            />
                          </div>

                          {/* Set color 3 */}
                          <div className="flex">
                            <p>Color 3:</p>
                            <InputColor
                              colorValue={allValue.color3}
                              setColorValue={props.setColor3}
                              setInvalidInput={setInvalidInput}
                              name="color3"
                              changeInputValue={changeInputValue}
                              setColor={setColor}
                              setCurrentInput={setCurrentInput}
                            />
                          </div>

                          {/* Set color 4 */}
                          <div className="flex">
                            <p>Color 4:</p>
                            <InputColor
                              colorValue={allValue.color4}
                              setColorValue={props.setColor4}
                              setInvalidInput={setInvalidInput}
                              name="color4"
                              changeInputValue={changeInputValue}
                              setColor={setColor}
                              setCurrentInput={setCurrentInput}
                            />
                          </div>

                          {/* Set text color */}
                          <div className="flex">
                            <p>Text color:</p>
                            <InputColor
                              colorValue={allValue.textColor}
                              setColorValue={props.setTextColor}
                              setInvalidInput={setInvalidInput}
                              name="textColor"
                              changeInputValue={changeInputValue}
                              setColor={setColor}
                              setCurrentInput={setCurrentInput}
                            />
                          </div>

                          {/* Set inactive text color */}
                          <div className="flex">
                            <p>Inactive text color:</p>
                            <InputColor
                              colorValue={allValue.inactiveColor}
                              setColorValue={props.setInactiveColor}
                              setInvalidInput={setInvalidInput}
                              name="inactiveColor"
                              changeInputValue={changeInputValue}
                              setColor={setColor}
                              setCurrentInput={setCurrentInput}
                            />
                          </div>

                          {/* Set icon color */}
                          <div className="flex">
                            <p>Icon color:</p>
                            <InputColor
                              colorValue={allValue.iconColor}
                              setColorValue={props.setIconColor}
                              setInvalidInput={setInvalidInput}
                              name="iconColor"
                              changeInputValue={changeInputValue}
                              setColor={setColor}
                              setCurrentInput={setCurrentInput}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="small-layout">
                            <div className="small-top-bar"></div>
                            <div className="small-main flex">
                              <div className="small-tool-bar"></div>
                              <div className="small-main-screen"></div>
                              <div className="small-option-sidebar"></div>
                              <div className="small-minimal-sidebar"></div>
                            </div>
                            <div className="small-footer"></div>
                            <div className="small-modal flex f-column f-space-between">
                              <div className="small-modal-header"></div>
                              <div className="small-modal-footer flex f-vcenter">
                                <div className="small-button"></div>
                                <div className="small-button"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel>
                      {/* Set show notification */}
                      <div className="flex f-vcenter">
                        <Tooltip
                          title="This switch turn on or turn off notification but also need permission from browser"
                          placement="bottom"
                        >
                          <p className="c-pointer">Show notification:</p>
                        </Tooltip>

                        <Switch
                          checked={allValue.showNotification}
                          onChange={changeValue}
                          name="showNotification"
                          color="primary"
                          inputProps={{ 'aria-label': 'Show notification' }}
                        />
                      </div>

                      {/* Set silent notification */}
                      <div className="flex f-vcenter">
                        <Tooltip
                          title="This switch turn on or turn off sound on notification but also need permission from OS"
                          placement="bottom"
                        >
                          <p className="c-pointer">Silent notification:</p>
                        </Tooltip>

                        <Switch
                          checked={allValue.silentNotification}
                          onChange={changeValue}
                          name="silentNotification"
                          color="primary"
                          inputProps={{ 'aria-label': 'Silent notification' }}
                        />
                      </div>
                    </TabPanel>
                    <TabPanel>
                      {/* Set show notification */}
                      <div className="flex f-vcenter">
                        <Tooltip
                          title="This switch minify all tab so that only show icon of workplace."
                          placement="bottom"
                        >
                          <p className="c-pointer">Minify tab:</p>
                        </Tooltip>

                        <Switch
                          checked={allValue.minifyTab}
                          onChange={changeValue}
                          name="minifyTab"
                          color="primary"
                          inputProps={{ 'aria-label': 'Show notification' }}
                        />
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <p>In progress</p>
                    </TabPanel>
                  </Tabs>
                </div>
                <div className="modal-box-button flex f-vcenter f-space-between">
                  <div>
                    {/* Apply button */}
                    <Button
                      className={classes.button}
                      onClick={() => {
                        setOpen(false);
                        props.setShowSettingModal(false);
                        setGlobal(allValue);
                      }}
                    >
                      Apply
                    </Button>

                    {/* Cancel button */}
                    <Button
                      className={classes.button}
                      onClick={() => {
                        setOpen(false);
                        resetState();
                        props.setShowSettingModal(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>

                  {/* Reset button */}
                  <div>
                    <Button
                      className={classes.button}
                      onClick={() => {
                        resetState();
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </Resizable>
          </Draggable>
        </GlobalStyles>
      </Modal>
    </div>
  );
}

export default SettingModal;
