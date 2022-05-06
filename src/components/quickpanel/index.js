import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Hammer, { displayName, propTypes } from '@win11react/react-hammerjs';
import Slider from '@mui/material/Slider';
import Swiper from 'react-slick';

import { Icon } from 'components/utils';
import StatusBar from 'components/statusbar';
import { dispatchAction, dispatchAct } from 'store/actions';

import './qkpanel.scss';

const DateObj = (props) => {
  const date = useSelector((state) => state.global.date)
  const time = useSelector((state) => state.global.time)

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
  )
}

export default function QuickPanel() {
  const [brightness, setBrightness] = useState(100)
  const quickpanel = useSelector((state) => state.quickpanel)
  const display = useSelector((state) => state.global.display)

  const closePanel = (e) => {
    if (e.target.classList.contains("quickpanel-container")) {
      dispatchAct({ type: "quickpanel/close" })
    }
  }

  const handleBright = (e, value) => setBrightness(value)
  const extendPanel = () => dispatchAct({ type: "quickpanel/extend" })
  const collapsePanel = (e) => {
    dispatchAct({ type: "quickpanel/collapse" })
  }

  useEffect(() => {
    dispatchAct({type: "quickpanel/setLazyBright", payload: brightness})
  }, [brightness])

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
            <DateObj showtime ext={quickpanel.extended && display.height > 600} />
            <div className="date-and-setting">
              <DateObj ext={quickpanel.extended} />
              <Icon fafa="faCog" w={16} />
            </div>
            <QuickTool ext={quickpanel.extended} tools={quickpanel.config}/>
            <div className="brightness-input-container flex">
              <Icon className="mr-2" mui="LightMode" w={16}/>
              <Slider value={brightness} defaultValue={brightness}
                onChange={handleBright} size="small" aria-label="Small"/>
            </div>
            <div className="quick-panel-bottom-bar"></div>
          </div>
        </Hammer>
      </div>
    </Hammer>
  )
}

const QuickTool = (props) => {
  const [toolCount, setToolCount] = useState(12)
  const display = useSelector((state) => state.global.display)
  const settings = {
    dots: true,
    arrows: false,
    infinite: false,
    speed: 200
  }

  useEffect(() => {
    if(display.height > 600) setToolCount(12)
    else setToolCount(8)
  },[display.height])

  return (
    <div className="notif-panel">
      <div className="mini-quick-panel" data-ext={props.ext}>
        {props.tools && props.tools.slice(0,6).map((item) => {
          return (
            <div className="mini-quick-panel-item" key={item.name} data-active={item.state!=0}>
              <Icon className="mini-quick-icon" mui={item.icon} w={26} />
            </div>
          );
        })}
      </div>
      <Swiper {...settings} className={"extended-quick" + (
        props.ext ? " extended-quick-open" : ""
      )}>
        {props.tools && props.tools.map((temp, idx) => {
          if(idx%toolCount==0){
            return (
              <div className="quick-tool-container" key={idx}>
                {props.tools.slice(idx, idx+toolCount).map((item,i) => {
                  return (
                    <div className="quick-tool-item press-in prtclk" onClick={dispatchAction}
                      data-action="quickpanel/toggleTool" data-payload={i} key={i}>
                      <div className="mini-quick-panel-item" data-active={item.state!=0}>
                        <Icon className="mini-quick-icon" mui={item.icon} w={26}/>
                      </div>
                      <div className="quick-tool-info">{item.name}</div>
                    </div>
                  );
                })}
              </div>
            )
          }
        })}
      </Swiper>
    </div>
  )
}
