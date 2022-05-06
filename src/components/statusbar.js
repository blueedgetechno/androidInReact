import React, {useState, useEffect, useRef} from 'react';
import { useSelector } from 'react-redux';
import Hammer from '@win11react/react-hammerjs';

import parse from 'color-parse';
import rgba from 'color-rgba';

import { Icon } from 'components/utils';
import { dispatchAction } from 'store/actions';
import { NetworkIcon, BatteryIcon } from 'components/icons';

import './main.scss';

const StatusBar = (props) => {
  const [invert, setInvert] = useState(props.invert);
  const statusBar = useRef();
  const battery = useSelector((state) => state.global.battery);
  const time = useSelector((state) => state.global.time);

  const istransparent = (bgcolor)=>{
    var colors = parse(bgcolor)
    return colors.alpha < 0.1;
  }

  useEffect(()=>{
    if(props.invert!=null){
      setInvert(props.invert)
    }else if(props.bg || (invert && !props.bg)){
      if(statusBar.current){
        var bgcolor = getComputedStyle(statusBar.current).getPropertyValue('background-color');
        if(!istransparent(bgcolor)){
          var arr = rgba(bgcolor),
              avg = (arr[0]+arr[1]+arr[2])/3

          if(avg<128) setInvert(true)
          else setInvert(false)
        }else{
          setInvert(false)
        }
      }
    }
  }, [props.bg])

  return (
    <Hammer onSwipeDown={dispatchAction} direction="DIRECTION_ALL">
      <div className="status-bar" data-action="quickpanel/open" style={{
        backgroundColor: props.bg
      }} data-invert={invert}>
        <div className="hidden" style={{backgroundColor: props.bg}} ref={statusBar}></div>
        <div className={
            "status-time smooth-trans" + (props.hidetime ? " opacity-0" : "")
          }>{time.hours}:{time.minutes}</div>
        <div className="status-row">
          <Icon fafa="faWifi" w={12} fill="#444" />
          <NetworkIcon w={10} fill={invert?"#ddd":"#222"} filldim="#888" />
          <div className="flex items-center text-xs font-bold">
            <div className="battery-level">
              {Math.round(battery.level * 100) + "%"}
            </div>
            <BatteryIcon w={6} h={12} fill={invert?"#ddd":"#222"} battery={battery}
              filldim={invert?"#555":"#aaa"} cfill={invert?"#010101":"#fefefe"}/>
          </div>
        </div>
      </div>
    </Hammer>
  );
};

export default StatusBar;
