import { createSlice } from "@reduxjs/toolkit";

const intialState = {
  open: false,
  extended: false
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
    }
  },
});

export default QuickPanel.reducer;
