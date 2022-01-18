import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  time: {
    hours: 0,
    minutes: 0,
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
    },
    date: (state, action) => {
      state.date = action.payload;
    }
  },
});

export default Global.reducer;
