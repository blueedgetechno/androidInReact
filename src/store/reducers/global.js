import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  time: {
    hours: 0,
    minutes: 0,
    abb: "",
    military: false
  },
  date: {
    day: 1,
    month: 0,
    year: 1970
  },
  battery: {
    charging: false,
    level: 1,
  },
  display: {
    width: window.innerWidth,
    height: window.innerHeight
  }
};

const Global = createSlice({
  name: "global",
  initialState: initialState,
  reducers: {
    battery: (state, action) => {
      state.battery = action.payload;
    },
    time: (state, action) => {
      state.time.hours = action.payload.hours;
      state.time.minutes = action.payload.minutes;
      state.time.abb = action.payload.abb;
    },
    date: (state, action) => {
      state.date = action.payload;
    },
    resolution: (state, action) => {
      state.display.width = action.payload.width;
      state.display.height = action.payload.height;
    }
  },
});

export default Global.reducer;
