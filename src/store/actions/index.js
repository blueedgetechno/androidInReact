import store from "../";
import apps from './data/apps';
import {
  favbar,
  page1apps,
  page2apps,
  page3apps,
  page1wid
} from './data/preset';
import axios from 'axios';
import './prototypes.js';

export const gene_name = () => Math.random().toString(36).substring(2, 10).toLowerCase()

export const dispatchAction = (e) => {
  var action = {
    type: e.target.dataset.action,
    payload: e.target.dataset.payload,
  };

  if (action.type) store.dispatch(action);
};

export const dispatchAct = (action) => {
  if(action.type) store.dispatch(action);
}

export const fetchBatteryStatus = () => {
  var battery = navigator.getBattery();
  battery.then((battery) => {
    store.dispatch({
      type: "global/battery",
      payload: {
        charging: battery.charging,
        level: battery.level,
      },
    });
  });
};

export const fillZero = (x)=>{
  return (x<9?"0":"") + x
}

const fetchTime = () => {
  var date = new Date();
  var timestring = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: !store.getState().global.time.military,
  }).split(" ")

  timestring[0] = timestring[0].split(":")

  store.dispatch({type: "global/time", payload: {
    hours: timestring[0][0],
    minutes: timestring[0][1],
    abb: timestring[1]
  }});
  store.dispatch({type: "global/date", payload: {day: date.getDate(), month: date.getMonth(), year: date.getFullYear()}});
};

const fetchActions = () => {
  fetchBatteryStatus();
  fetchTime();
};

export const fetchWeather = () => {
  var defaultData = {
    city: "New york",
    temperature: "32",
    icon: "c",
    predictions: [
      {
        date: "2020-01-01",
        day: "Mon",
        temperature: "33",
        icon: "lr"
      },{
        date: "2020-01-02",
        day: "Tue",
        temperature: "34",
        icon: "t"
      },{
        date: "2020-01-03",
        day: "Wed",
        temperature: "35",
        icon: "lc"
      },{
        date: "2020-01-04",
        day: "Thu",
        temperature: "36",
        icon: "hr"
      }
    ]
  }

  var geocodingapi = "https://api.techniknews.net/ipgeo/",
      weatherapi = "https://www.metaweather.com/api/location"

  if(true) return

  axios.get(geocodingapi).then(res => res.data).then((res) => {
    defaultData.city = res.regionName + ", " + res.country
    var woeidurl = weatherapi + `/search/?lattlong=${res.lat},${res.lon}`
    console.log(woeidurl);
    axios.get(woeidurl, {
      "mode": "no-cors",
      withCredentials: false
    }).then(res => res.data).then(res => {
      console.log(res);
      if(res && res[0]){
        var weatherurl = weatherapi + "/" + res[0].woeid
        console.log(weatherurl);
        // axios.get(weatherurl).then(res => res.data).then(res => {
          // console.log(res);
        // })
      }
    })
  }).catch(e => e)
}

export const loadSettings = () => {
  fetchActions();
  loadApps();
  fetchWeather();
  const shortUpdates = setInterval(fetchActions, 10000);
  window.onresize = ()=>{
    store.dispatch({type: "global/resolution", payload: {
      width: window.innerWidth,
      height: window.innerHeight
    }})
  };
};

export const loadApps = ()=>{
  var tmp = {}
  for (var i = 0; i < apps.length; i++) {
    tmp[apps[i].icon] = apps[i]
  }

  store.dispatch({type: "home/setApps", payload: tmp});
  store.dispatch({type: "home/setFavBar", payload: favbar});

  var homelist = {}
  // page 1
  for (var i = 0; i < page1apps.length; i++) {
    homelist[page1apps[i].icon] = {
      page: 1,
      type: 'app',
      row: [6,7],
      col: [i+1,i+2]
    }
  }

  // adding home screen widgets
  for (var i = 0; i < page1wid.length; i++) {
    homelist[gene_name()] = {
      page: 1,
      type: 'widget',
      row: page1wid[i].slice(0,2),
      col: page1wid[i].slice(2,4),
      widget: page1wid[i][4]
    }
  }

  // page 2
  for (var i = 0; i < page2apps.length; i++) {
    homelist[page2apps[i].icon] = {
      page: 2,
      type: 'app',
      row: [Math.floor(i/4) + 1, Math.floor(i/4) + 2],
      col: [(i%4)+1,(i%4)+2]
    }
  }

  // page 3
  for (var i = 0; i < page3apps.length; i++) {
    homelist[page3apps[i].icon] = {
      page: 3,
      type: 'app',
      row: [Math.floor(i/4) + 1, Math.floor(i/4) + 2],
      col: [(i%4)+1,(i%4)+2]
    }
  }

  Object.keys(homelist).forEach((key, i) => {
    store.dispatch({type: "home/setSlide", payload: {
      id: key,
      data: homelist[key]
    }});
  });

}
