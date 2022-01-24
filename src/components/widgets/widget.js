import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Calendar from 'react-calendar';

import {Icon} from "../utils";
import './widget.scss';

const ClockDate = (props)=>{
  const date = useSelector((state) => state.global.date);
  var datestring = new Date(date.year, date.month, date.day).toLocaleString("en-us",{
    weekday: "short", day: "numeric", month: props.datemin?"short":"long"
  });

  return <div className={"clock-date"+(props.className?" "+props.className:"")}>{datestring}</div>
}

export const GoogleSearch = () => {
  return (
    <div className="google-search-container">
      <div className="google-input-container flex justify-between items-center">
        <Icon src="apps/google" w={26}/>
        <Icon src="apps/mic" w={24}/>
      </div>
    </div>
  );
};

export const AnalogClock = () => {
  const time = useSelector((state) => state.global.time);

  const calculateAngles = ()=>{
    var hr = time.hours >= 12 ? time.hours - 12 : time.hours,
        mn = time.minutes

    hr *= 30
    hr += mn/2
    mn *= 6
    return [hr, mn]
  }

  return (
    <div className="analog-clock-container">
      <div className="clock-body">
        <div className="minute-container" style={{
          transform: `rotateZ(${calculateAngles()[1]}deg)`
        }}>
          <div className="minute-hand"></div>
        </div>
        <div className="hour-container" style={{
          transform: `rotateZ(${calculateAngles()[0]}deg)`
        }}>
          <div className="hour-hand"></div>
        </div>
        <div className="clock-center"></div>
      </div>
      <ClockDate/>
    </div>
  );
};

export const MinimalClock = () => {
  const time = useSelector((state) => state.global.time);

  return (
    <div className="digital-time-container items-center">
      <div className="flex items-baseline">
        <div className="text-4xl">{time.hours}:{time.minutes}</div>
        <div className="text-xs ml-1">{time.abb}</div>
      </div>
      <ClockDate className="text-sm mt-2"/>
    </div>
  );
};

export const MinimalVertClock = () => {
  const time = useSelector((state) => state.global.time);
  const fillZero = (x)=>{
    return (x<9?"0":"") + x
  }

  return (
    <div className="vert-time-container">
      <div className="flex flex-col">
        <div className="text-6xl font-thin">{fillZero(time.hours)}</div>
        <div className="text-6xl font-thin">{time.minutes}</div>
      </div>
      <ClockDate className="text-sm mt-2" datemin/>
    </div>
  );
};

export const DayCountdown = ()=>{
  return (
    <div className="countdown-container">
      <div className="countdown-topic text-xs">Mom's B'day</div>
      <div className="quant-left text-2xl">215</div>
      <div className="quant-unit text-xs">days left</div>
    </div>
  )
}

export const WideCalender = ()=>{
  const date = useSelector((state) => state.global.date);
  var datemonth = new Date(date.year, date.month, date.day).toLocaleString("en-us",{month: "long"});

  const formatShortWeekday = (label, date)=>{
    return date.toLocaleString("en-us",{weekday: "short"})[0]
  }

  return (
    <div className="calender-container">
      <div className="calendar-month text-xl pb-1">{datemonth}</div>
      <div className="flex">
        <Calendar
          showNavigation={false}
          showNeighboringMonth={false}
          formatShortWeekday={formatShortWeekday}/>

        <div className="calender-events">
          <div className="event-container">
            <div className="event-name text-sm">Disneyland</div>
            <div className="event-time text-xs">All day</div>
          </div>
          <div className="event-container">
            <div className="event-name text-sm">Meeting</div>
            <div className="event-time text-xs">11:00 AM - 2:00 PM</div>
          </div>
          <div className="event-container">
            <div className="event-name text-sm">Business</div>
            <div className="event-time text-xs">3:30 PM - 8:00 PM</div>
          </div>
        </div>
      </div>
    </div>
  )
}
