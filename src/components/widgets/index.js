import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Calendar from 'react-calendar'

import {Icon} from 'components/utils'
import {dispatchAction, dispatchAct, openAppPage} from 'store/actions';
import './widget.scss'

const ClockDate = (props)=>{
  const date = useSelector((state) => state.global.date);
  var datestring = new Date(date.year, date.month, date.day).toLocaleString("en-us",{
    weekday: "short", day: "numeric", month: props.datemin?"short":"long"
  });

  var classNameString = props.className || ""
  return <div className={"clock-date " + classNameString}>{datestring}</div>
}

export const GoogleSearch = () => {

  const handleClick = () => {
    openAppPage("google","google.search")
  }

  return (
    <div className="google-search-container press-in" onClick={handleClick}>
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
    <div className="digital-time-container">
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
    <div className="calender-container medScroll">
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

export const WideWeather = ()=>{
  const date = useSelector((state) => state.global.date);
  const weather = useSelector((state) => state.widget.weather);
  var datemonth = new Date(date.year, date.month, date.day).toLocaleString("en-us",{month: "long"});
  var iconurl = "https://www.metaweather.com/static/img/weather/"

  return (
    <div className="weather-container medScroll">
      <div className="city-container">
        <Icon mui="LocationOn" w={18}/>
        <span>{weather.city}</span>
      </div>
      <ClockDate className="weather-date"/>
      <div className="main-weather">
        <Icon src={iconurl+weather.icon+".svg"} ext w={48}/>
        <div className="today-temperature">{weather.temperature}°</div>
      </div>
      <div className="weather-pred-container">
        {weather && weather.predictions.map((pred, i)=>{
          return(
            <div className="weather-pred" key={i}>
              <Icon src={iconurl + pred.icon + ".svg"} ext w={32}/>
              <div className="pred-day">{pred.day}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const ShortWeather = ()=>{
  const date = useSelector((state) => state.global.date);
  const weather = useSelector((state) => state.widget.weather);
  var datemonth = new Date(date.year, date.month, date.day).toLocaleString("en-us",{month: "long"});
  var iconurl = "https://www.metaweather.com/static/img/weather/"

  return (
    <div className="weather-container short-weather-container medScroll">
      <div className="main-weather">
        <Icon src="weather/clear-sky" w={56}/>
        <div className="today-temperature">{weather.temperature}°</div>
      </div>
      <div className="city-container">
        <Icon mui="LocationOn" w={18}/>
        <span>{weather.city}</span>
      </div>
      <ClockDate className="weather-date"/>
    </div>
  )
}
