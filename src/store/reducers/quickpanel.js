import {
  createSlice
} from "@reduxjs/toolkit";

const intialState = {
  open: false,
  extended: false,
  config: [{
    name: "Wifi",
    state: 1,
    icon: "Wifi",
  }, {
    name: "Mobile data",
    state: 1,
    icon: "SwapVert",
  }, {
    name: "Ring",
    state: 0,
    icon: "VolumeUp",
  }, {
    name: "Bluetooth",
    state: 0,
    icon: "Bluetooth",
  }, {
    name: "Silent",
    state: 0,
    icon: "NotificationsOff",
  }, {
    name: "Auto Rotate",
    state: 0,
    icon: "WifiProtectedSetup",
  }, {
    name: "Airplane",
    state: 0,
    icon: "AirplanemodeActive",
  }, {
    name: "Flash light",
    state: 0,
    icon: "FlashlightOn",
  }, {
    name: "Eye comfort",
    state: 0,
    icon: "Visibility",
  }, {
    name: "Power mode",
    state: 0,
    icon: "BatterySaver",
  }, {
    name: "Location",
    state: 0,
    icon: "LocationOn",
  }, {
    name: "Hotspot",
    state: 0,
    icon: "CellTower",
  }, {
    name: "Connect",
    state: 0,
    icon: "Phonelink",
  }, {
    name: "Do not disturb",
    state: 0,
    icon: "DoNotDisturbOn",
  }, {
    name: "Screen Lock",
    state: 0,
    icon: "Lock",
  }, {
    name: "Screenshot",
    state: 0,
    icon: "Screenshot",
  }, {
    name: "Switch Sim",
    state: 0,
    icon: "SimCardOutlined",
  }, {
    name: "Kid Space",
    state: 0,
    icon: "ChildCare",
  }],
  lazy_bright: 100
};

const QuickPanel = createSlice({
  name: "quickpanel",
  initialState: intialState,
  reducers: {
    open: (state, action) => {
      state.open = true;
    },
    close: (state, action) => {
      state.open = false;
      state.extended = false;
    },
    toggle: (state, action) => {
      state.open = !state.open;
      if (!state.open) {
        state.extended = false;
      }
    },
    extend: (state, action) => {
      state.open = true;
      state.extended = true;
    },
    collapse: (state, action) => {
      state.open = true;
      state.extended = false;
    },
    toggleTool: (state, action) => {
      if(state.config[action.payload]){
        state.config[action.payload].state ^= 1
      }
    },
    setLazyBright: (state, action) => {
      state.lazy_bright = action.payload
    }
  },
});

export default QuickPanel.reducer;
