import React, { useEffect, useState } from 'react';

import logo from '../../img/process.svg';
import exportIcon from '../../img/inside.svg';
import upload from '../../img/cloud-computing.svg';
import changeView from '../../img/synchronization.svg';
import setting from '../../img/maintenance.svg';

import fullScreen from '../../img/resize.svg';

import Tooltip from '@material-ui/core/Tooltip';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Tab from './tab';

function TopBar(props) {
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    if (props.loadIcon) {
      props.setLoadIcon(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loadIcon]);

  return (
    <div className="top-bar flex f-vcenter f-space-between">
      <div className="top-left-bar flex f-vcenter f-space-between">
        {/* Logo imagor */}
        <div className="logo-box flex f-vcenter">
          <img className="logo" src={logo} alt="Logo" />
        </div>

        <DndProvider backend={HTML5Backend}>
          {props.allImageTag.map((item) => (
            <Tab
              key={item.id}
              keyId={item.id}
              tagName={item.name}
              icon={item.icon}
              loadIcon={item.loadIcon}
              thumbnail={item.thumbnail}
              loadThumbnail={item.loadThumbnail}
              setCurrentImage={props.setCurrentImage}
              currentImage={props.currentImage}
              allImage={props.allImage}
              setAllImage={props.setAllImage}
              allImageTag={props.allImageTag}
              setAllImageTag={props.setAllImageTag}
              trigger={trigger}
              setTrigger={setTrigger}
              setCloseTag={props.setCloseTag}
              close={props.closeTag && item.id === props.currentImage}
              setNextTag={props.setNextTag}
              nextTag={props.nextTag && item.id === props.currentImage}
              setPreTag={props.setPreTag}
              preTag={props.preTag && item.id === props.currentImage}
              minifyTab={props.minifyTab}
            />
          ))}
        </DndProvider>

        {/* Store all workplace */}
        {/* <div className="flex tag-bar">
          {props.allImageTag.map((item) => (
            <TagBox
              key={item.id}
              keyId={item.id}
              tagName={item.name}
              icon={item.icon}
              loadIcon={item.loadIcon}
              thumbnail={item.thumbnail}
              loadThumbnail={item.loadThumbnail}
              setCurrentImage={props.setCurrentImage}
              currentImage={props.currentImage}
              allImage={props.allImage}
              setAllImage={props.setAllImage}
              allImageTag={props.allImageTag}
              setAllImageTag={props.setAllImageTag}
              trigger={trigger}
              setTrigger={setTrigger}
              setCloseTag={props.setCloseTag}
              close={props.closeTag && item.id === props.currentImage}
              setNextTag={props.setNextTag}
              nextTag={props.nextTag && item.id === props.currentImage}
              setPreTag={props.setPreTag}
              preTag={props.preTag && item.id === props.currentImage}
              minifyTab={props.minifyTab}
            />
          ))}
        </div> */}
      </div>
      <div className="top-right-bar flex f-vcenter f-hright">
        {/* Export button */}
        <Tooltip title="Open export image menu" placement="bottom">
          <img
            className={
              'i-25 main-button ' +
              (props.currentImage === -1 ? 'inactive c-default' : 'c-pointer')
            }
            src={exportIcon}
            onClick={(event) => {
              if (props.currentImage === -1) {
                event.preventDefault();
              } else if (props.currentImage >= 0) {
                props.setShowExportModal(true);
              }
            }}
            alt="Export button"
          />
        </Tooltip>

        {/* Upload button */}
        <Tooltip title="Open upload image panel" placement="bottom">
          <img
            className={
              'i-25 main-button ' +
              (props.showUploadModal ? 'inactive c-default' : 'c-pointer')
            }
            src={upload}
            onClick={() => {
              props.setShowUploadModal(true);
            }}
            alt="Upload button"
          />
        </Tooltip>

        {/* Full-screen button */}
        <Tooltip title="Open full screen preview" placement="bottom">
          <img
            className={
              'i-25 main-button ' +
              (props.currentImage === -1 ? 'inactive c-default' : 'c-pointer')
            }
            src={fullScreen}
            onClick={(event) => {
              if (props.currentImage === -1) {
                event.preventDefault();
              } else if (props.currentImage >= 0) {
                props.setShowFullScreen(true);
              }
            }}
            alt="Open full screen preview"
          />
        </Tooltip>

        {/* Change view */}
        <Tooltip title="Change preview mode" placement="bottom">
          <img
            className={
              'i-25 main-button ' +
              (props.currentImage === -1 ? 'inactive c-default' : 'c-pointer')
            }
            src={changeView}
            alt="Change view button"
          />
        </Tooltip>

        {/* Setting button */}
        <Tooltip title="Open setting menu" placement="bottom">
          <img
            className={'i-25 main-button c-pointer'}
            src={setting}
            onClick={() => props.setShowSettingModal(true)}
            alt="Setting button"
          />
        </Tooltip>
      </div>
    </div>
  );
}

export default TopBar;
