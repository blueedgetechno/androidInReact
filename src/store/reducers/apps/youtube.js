import { createSlice } from "@reduxjs/toolkit";

var initialState = {}

const YouTube = createSlice({
  name: "youtube",
  initialState: initialState,
  reducers: {
    setData: (state, action) => {
      Object.keys(action.payload).forEach(key => {
        state[key] = action.payload[key]
      });
    },
    setProp: (state, action) => {
      state[action.payload.key] = action.payload.value
    }
  }
});

export default YouTube.reducer;
