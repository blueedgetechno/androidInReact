import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";

import wallReducer from './reducers/wallpaper';
import quickpanelReducer from './reducers/quickpanel';
import globalReducer from "./reducers/global";
import homeReducer from "./reducers/home";

const allReducers = {
  wallpaper: wallReducer,
  quickpanel: quickpanelReducer,
  global: globalReducer,
  home: homeReducer
};

const store = configureStore({
  reducer: allReducers,
  middleware: [thunk]
});

export default store;
