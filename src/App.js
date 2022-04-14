import React, {useState, useEffect} from 'react';

import {Background, OverLay} from 'components/background';
import Home from 'containers/home';
import {loadSettings} from 'store/actions/index';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css';

function App() {

  useEffect(() => {
    if (!window.onstart) {
      // console.log("Loading settings...");
      window.onstart = loadSettings();
    }
  });

  return (
    <div className="App">
      <div className="appwrap">
        <Background/>
        <Home/>
        <OverLay/>
      </div>
    </div>
  );
}

export default App;
