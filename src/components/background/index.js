import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import "./back.scss";

const Background = () => {
  const wall = useSelector((state) => state.wallpaper);
  const dispatch = useDispatch();

  return (
    <div
      className="background"
      style={{
        backgroundImage: `url(/img/wallpaper/${wall.src})`,
      }}
    ></div>
  );
};

export default Background;
