import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";

// reducers who will be repsonsible for all the actions and state handling
import wallReducer from './reducers/wallpaper';
import quickpanelReducer from './reducers/quickpanel';
import globalReducer from "./reducers/global";
import homeReducer from "./reducers/home";
import widgetReducer from "./reducers/widget";

const allReducers = {
  wallpaper: wallReducer,
  quickpanel: quickpanelReducer,
  global: globalReducer,
  home: homeReducer,
  widget: widgetReducer
};

const store = configureStore({
  reducer: allReducers,
  middleware: [thunk]
});

export default store;
