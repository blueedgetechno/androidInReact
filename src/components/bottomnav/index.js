import React, { useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Icon} from 'components/utils';
import parse from 'color-parse';
import rgba from 'color-rgba';

import './bottom.scss';

const BottomNav = (props) => {
  const [invert, setInvert] = useState(props.invert);
  const navBar = useRef();
  const dispatch = useDispatch();

  const istransparent = (bgcolor)=>{
    var colors = parse(bgcolor)
    return colors.alpha < 0.1;
  }

  const refreshInvert = ()=>{
    var bgcolor = getComputedStyle(navBar.current).getPropertyValue('background-color');
    if(!istransparent(bgcolor)){
      var arr = rgba(bgcolor),
          avg = (arr[0]+arr[1]+arr[2])/3

      if(avg<128) setInvert(true)
      else setInvert(false)
    }else setInvert(false)
  }

  useEffect(()=>{
    if(navBar.current && props.invert==null){
      setTimeout(refreshInvert,100)
    }else if (props.invert!=null) {
      setInvert(props.invert)
    }
  }, [props.bg, props.invert])

  return (
    <div className="bottom-nav" style={{
      backgroundColor: props.bg
    }} ref={navBar}>
      <div className="bt-nav-container" data-invert={invert}>
        <Icon className="bar-icon press-in" fafa="faBars" w={16} action="home/setRecent"/>
        <Icon className="press-in" mui="CropSquare" w={20} action="home/setHome"/>
        <Icon className="press-in" mui="ArrowBackIos" w={20} action="home/goBack"/>
      </div>
    </div>
  );
};

export default BottomNav;
