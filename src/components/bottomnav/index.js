import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {Icon} from "../utils";

import './bottom.scss';

const BottomNav = () => {
  const dispatch = useDispatch();

  return (
    <div className="bottom-nav">
      <div className="bt-nav-container">
        <Icon className="bar-icon" fafa="faBars" w={16}/>
        <Icon mui="CropSquare" w={20}/>
        <Icon mui="ArrowBackIos" w={20}/>
      </div>
    </div>
  );
};

export default BottomNav;
