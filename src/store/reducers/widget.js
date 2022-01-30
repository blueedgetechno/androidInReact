import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  weather: {
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
};

const Widget = createSlice({
  name: "widget",
  initialState: initialState,
  reducers: {
    weather: (state, action) => {
      state.weather = action.payload;
    }
  },
});

export default Widget.reducer;
