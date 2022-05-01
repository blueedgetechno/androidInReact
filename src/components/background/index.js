import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import "./back.scss";

export const Background = () => {
  const wall = useSelector((state) => state.wallpaper);

  return (
    <div className="background" style={{
        backgroundImage: `url(img/wallpaper/${wall.src})`,
      }}></div>
  );
}

export const OverLay = () => {
  const bright = useSelector((state) => state.quickpanel.lazy_bright)

  return (
    <div className="app-overlay">
      <div className="brightness-overlay" style={{opacity: `${90 - bright*0.9}%`}}></div>
    </div>
  );
}
