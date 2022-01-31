import { createSlice } from "@reduxjs/toolkit";

var initialState = {
  slides: {
    count: 3,
    list: {}
  },
  apps: {},
  stack: [],
  ishome: true,
  recent: false,
  favbar: []
};

var dev = "youtube"
if(process.env.REACT_APP_ENV=="development" && dev!=""){
  initialState.stack.push(dev);
  initialState.ishome = false;
}

const Home = createSlice({
  name: "home",
  initialState: initialState,
  reducers: {
    setApps: (state, action) => {
      state.apps = action.payload
    },
    setSlide: (state, action) => {
      state.slides.list[action.payload.id] = action.payload.data
    },
    setFavBar: (state, action) => {
      state.favbar = action.payload
    },
    setHome: (state, action) => {
      state.ishome = true
      state.recent = false
    },
    setRecent: (state, action) => {
      state.recent = true
      state.ishome = true
    },
    closeRecent: (state, action) => {
      state.recent = false
      state.ishome = true
    },
    openApp: (state, action) => {
      if(!action.payload) return;

      var tmp = [...state.stack]
      if(tmp.includes(action.payload)){
        tmp.remove(action.payload)
      }

      tmp.push(action.payload)
      state.stack = [...tmp]
      state.ishome = false
      state.recent = false
    },
    closeApp: (state, action) => {
      if(!action.payload) return;

      var tmp = [...state.stack]
      if(tmp.includes(action.payload)){
        tmp.remove(action.payload)
      }

      state.stack = [...tmp]
    },
    closeAllApps: (state, action) => {
      var tmp = []
      state.stack = [...tmp]

      state.ishome = true
      state.recent = false
    }
  },
});

export default Home.reducer;
