import store from "../index.js";

export const dispatchAction = (event) => {
  var action = {
    type: event.target.dataset.action,
    payload: event.target.dataset.payload,
  };

  if (action.type) {
    store.dispatch(action);
  }
};

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

const fetchTime = () => {
  var date = new Date();
  var timestring = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: !store.getState().global.time.military,
  }).replace("AM","").replace("PM","").trim().split(":");
  
  store.dispatch({type: "global/time", payload: {hours: timestring[0], minutes: timestring[1]}});
  store.dispatch({type: "global/date", payload: {day: date.getDate(), month: date.getMonth(), year: date.getFullYear()}});
};

const fetchActions = () => {
  fetchBatteryStatus();
  fetchTime();
};

export const loadSettings = () => {
  fetchActions();
  const shortUpdates = setInterval(fetchActions, 10000);

  window.onresize = ()=>{
    store.dispatch({type: "global/resolution", payload: {
      width: window.innerWidth,
      height: window.innerHeight
    }})
  };
};
