import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { dispatchAction } from "../../store/actions";
import Hammer, { propTypes } from "react-hammerjs";
import { Icon } from "../utils";
import StatusBar from "../../components/statusbar";
import Swiper from "react-slick";

import Slider from '@mui/material/Slider';

import "./qkpanel.scss";

const DateObj = (props) => {
  const date = useSelector((state) => state.global.date);
  const time = useSelector((state) => state.global.time);

  var datestring = new Date(date.year, date.month, date.day).toLocaleString(
    "en-us",
    { weekday: "short", day: "numeric", month: "long" }
  );

  return props.showtime ? (
    <div className="date-day quick-panel-time" data-extended={props.ext}>
      <div className="text-5xl font-thin">
        {time.hours}:{time.minutes}
      </div>
      <div className="date-day-text">{datestring}</div>
    </div>
  ) : (
    <div className={"date-day smooth-trans " + (props.ext ? "opacity-0" : "")}>
      <div className="date-day-text">{datestring}</div>
    </div>
  );
};

export default function QuickPanel() {
  const quickpanel = useSelector((state) => state.quickpanel);
  const dispatch = useDispatch();

  const closePanel = (e) => {
    if (e.target.classList.contains("quickpanel-container")) {
      dispatch({ type: "quickpanel/close" });
    }
  };
  const extendPanel = () => dispatch({ type: "quickpanel/extend" });
  const collapsePanel = (e) => {
    dispatch({ type: "quickpanel/collapse" });
  }

  return (
    <Hammer
      onClick={closePanel}
      onSwipeUp={closePanel}
      onSwipeDown={extendPanel}
      direction="DIRECTION_ALL">
      <div
        className="quickpanel-container backblur"
        data-open={quickpanel.open}>
        <Hammer onSwipeUp={collapsePanel} direction="DIRECTION_ALL">
          <div className="quickpanel" data-extended={quickpanel.extended}>
            <StatusBar hidetime={quickpanel.extended} />
            <DateObj showtime ext={quickpanel.extended} />
            <div className="date-and-setting">
              <DateObj ext={quickpanel.extended} />
              <Icon fafa="faCog" w={16} />
            </div>
            <QuickTool ext={quickpanel.extended} />
            <div className="brightness-input-container flex">
              <Icon className="mr-2" mui="LightMode" w={16}/>
              <Slider size="small" defaultValue={70} aria-label="Small"/>
            </div>
            <div className="quick-panel-bottom-bar"></div>
          </div>
        </Hammer>
      </div>
    </Hammer>
  );
}

const QuickTool = (props) => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: false,
    speed: 200
  };

  var data = [
    {
      name: "Blue",
      state: 1,
      icon: "Wifi",
    },
    {
      name: "Ring",
      state: 0,
      icon: "VolumeUp",
    },
    {
      name: "Bluetooth",
      state: 0,
      icon: "Bluetooth",
    },
    {
      name: "Auto Rotate",
      state: 0,
      icon: "WifiProtectedSetup",
    },
    {
      name: "Airplane mode",
      state: 0,
      icon: "AirplanemodeActive",
    },
    {
      name: "Flash light",
      state: 0,
      icon: "FlashlightOn",
    },
  ];

  data = data.concat(data);
  data = data.concat(data);

  const QuickSwiper = ()=>{
    return (
      <Swiper {...settings} className={"extended-quick" + (
        props.ext ? " extended-quick-open" : ""
      )}>
        <div className="quick-tool-container">
          {data.slice(0, 16).map((item,i) => {
            return (
              <div className="quick-tool-item" key={i}>
                <div className="mini-quick-panel-item" data-active={item.state!=0}>
                  <Icon className="mini-quick-icon" mui={item.icon} w={26}/>
                </div>
                <div className="quick-tool-info">{item.name}</div>
              </div>
            );
          })}
        </div>
        <div className="quick-tool-container">
          {data.slice(17, 24).map((item,i) => {
            return (
              <div className="quick-tool-item" key={i}>
                <div className="mini-quick-panel-item" data-active={item.state!=0}>
                  <Icon className="mini-quick-icon" mui={item.icon} w={26}/>
                </div>
                <div className="quick-tool-info">{item.name}</div>
              </div>
            );
          })}
        </div>
      </Swiper>
    )
  }

  return (
    <div className="notif-panel">
      <div className="mini-quick-panel" data-ext={props.ext}>
        {data.slice(0,6).map((item) => {
          return (
            <div className="mini-quick-panel-item" key={item.name} data-active={item.state!=0}>
              <Icon className="mini-quick-icon" mui={item.icon} w={26} />
            </div>
          );
        })}
      </div>
      <QuickSwiper/>
    </div>
  );
};
