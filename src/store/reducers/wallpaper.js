import {createSlice} from '@reduxjs/toolkit';

const walls = ["default.jpg"]
const intialState = {wps: 0,src: walls[0]}

const wallSlice = createSlice({
  name: "wallaper",
  initialState: intialState,
  reducers: {
    setWall: (state, action) => {
      state.src = action.payload
    },
    setWps: (state, action) => {
      state.wps = action.payload
      state.src = walls[action.payload]
    }
  }
})

export default wallSlice.reducer;
