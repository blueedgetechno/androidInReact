import React from "react";
import { Icon } from "./utils.js";
import { useSelector } from "react-redux";
import Hammer from "react-hammerjs";
import { dispatchAction } from "../store/actions";
import { NetworkIcon, BatteryIcon } from "./icons.js";
import "./main.scss";

const StatusBar = (props) => {
  const battery = useSelector((state) => state.global.battery);
  const time = useSelector((state) => state.global.time);

  return (
    <Hammer onSwipeDown={dispatchAction} direction="DIRECTION_ALL">
      <div className="status-bar" data-action="quickpanel/open">
        <div className={
            "status-time smooth-trans" + (props.hidetime ? " opacity-0" : "")
          }>{time.hours}:{time.minutes}</div>
        <div className="status-row">
          <Icon fafa="faWifi" w={12} fill="#444" />
          <NetworkIcon w={10} fill="#222" filldim="#888" />
          <div className="flex items-center text-xs font-bold">
            <div className="battery-level">
              {Math.round(battery.level * 100) + "%"}
            </div>
            <BatteryIcon w={6} h={12} fill="#222" filldim="#aaa" battery={battery}/>
          </div>
        </div>
      </div>
    </Hammer>
  );
};

export default StatusBar;
