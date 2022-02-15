import { createSlice } from "@reduxjs/toolkit";
var initialState = {};

const closeExtras = (state, action) => {
  if(action.type != 'home/closeAllApps' && action.payload != "whatsapp") return
  state.media.vis = false
}

const WhatsApp = createSlice({
  name: "whatsapp",
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
    setMedia: (state, action) => {
      if(action.payload) state.media = action.payload;
      state.media.vis = true
      // component variable that indicates the home goback action
      // to not goback and just turn it off
      state.comp = true
    }
  },
  extraReducers: {
    'home/goBack': (state, action) => {
      state.media.vis = false
      state.comp = false
    },
    'home/closeApp': closeExtras,
    'home/closeAllApps': closeExtras
  }
});

export default WhatsApp.reducer;
