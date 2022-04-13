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
    },
    watchVideo: (state, action) => {
      state.watch.id = action.payload
      state.comp = true
    },
    closeVid: (state, action) => {
      state.watch.id = null
      state.comp = false
    },
    toggleSub: (state, action) => {
      if(state.subd.includes(action.payload)){
        state.subd = state.subd.filter(x => x!= action.payload)
      }else{
        var tmp = [...state.subd]
        tmp.push(action.payload)
        state.subd = [...tmp]
      }
    }
  },
  extraReducers: {
    'home/goBack': (state, action) => {
      state.comp = false
    }
  }
});

export default YouTube.reducer;
