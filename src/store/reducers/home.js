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

var dev = "whatsapp"
if(process.env.REACT_APP_ENV=="development" && dev!=""){
  initialState.stack.push(dev);
  initialState.ishome = false;
}

const searchpath = (tree, page, path="-")=>{
  var t_path = null;
  if(path.includes("-" + page + "-")) return path

  Object.keys(tree).forEach(key => {
    t_path = t_path || searchpath(tree[key], page, path + key + "-")
  });

  return t_path
}

const Home = createSlice({
  name: "home",
  initialState: initialState,
  reducers: {
    setApps: (state, action) => {
      state.apps = action.payload
    },
    setApp: (state, action) => {
      if(state.apps[action.payload.id]){
        state.apps[action.payload.id] = action.payload.data
      }
    },
    navApp: (state, action) => {
      var [id, page] = action.payload.split("."),
          tmp_path = searchpath({...state.apps[id].pagetree}, page)

      if(tmp_path){
        state.apps[id].path = tmp_path.strip("-").split("-");
      }
    },
    goBack: (state, action) => {
      if(!state.ishome && !state.recent && state.stack.length){
        var cr_app = state.stack.at(-1), tmp = {...state.apps[cr_app]};
        if(tmp.path && tmp.path.length){
          if(tmp.path.length==1){ // set home
            state.ishome = true
            state.recent = false
          }else{
            tmp.path.pop()
            state.apps[cr_app] = {...tmp}
          }
        }
      }
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
