import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  slides: {
    count: 3,
    list: {}
  },
  apps: {},
  favbar: []
};

const Home = createSlice({
  name: "home",
  initialState: initialState,
  reducers: {
    setApps: (state, action) => {
      state.apps = action.payload;
    },
    setSlide: (state, action) => {
      state.slides.list[action.payload.id] = action.payload.data;
    },
    setFavBar: (state, action) => {
      state.favbar = action.payload;
    }
  },
});

export default Home.reducer;
