import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";

import { dispatchAction } from "../store/actions";

import * as FaIcons from "@fortawesome/free-solid-svg-icons";
import * as FaRegIcons from "@fortawesome/free-regular-svg-icons";
import * as MUIcons from "@mui/icons-material";
import * as AllIcons from "./icons.js";

export const MaterialIcon = (props) => {
  var icon = props.mui;
  if (props.out) icon += "Outlined";
  if (props.round) icon += "Rounded";
  if (props.twotone) icon += "TwoTone";
  if (props.sharp) icon += "Sharp";

  // const Icon = <div></div>
  const MuiIcon = MUIcons[icon];
  return (
    <MuiIcon
      className={
        props.flip? "flip-true": "" +
        (props.invert? " invert-true": "") +
        (props.rounded? " rounded-true": "")
      } style={{
        width: props.w,
        height: props.h || props.w,
        color: props.color,
        margin: props.margin,
      }}
    />
  );
};

export const Icon = (props) => {
  var src = `/img/icon/${props.ui ? "ui/" : ""}${props.src}`;
  if (props.src && !props.src.includes(".")) {
    src += ".png";
  }

  if (props.ext || (props.src && props.src.includes("http"))) {
    src = props.src;
  }

  var dataset = {}
  Object.entries(props).forEach(([key, value]) => {
    if(key.includes("data-")){
      dataset[key] = value;
    }
  });

  var classname = `uicon prtclk ${props.className || ""}`.trim()
  var styles = {
    borderRadius: props.radii
  }

  if (props.fafa) {
    return (
      <div className={classname} {...dataset} style={styles}
        onClick={props.onClick || (props.action && dispatchAction)}
        data-action={props.action} data-payload={props.payload}>
        <FontAwesomeIcon
          data-flip={props.flip}
          data-invert={props.invert}
          data-rounded={props.rounded}
          style={{
            width: props.w,
            height: props.h || props.w,
            color: props.color,
            margin: props.margin
          }}
          icon={!props.reg ? FaIcons[props.fafa] : FaRegIcons[props.fafa]}
        />
      </div>
    );
  } else if (props.mui) {
    return (
      <div className={classname} {...dataset} style={styles}
        onClick={props.onClick || (props.action && dispatchAction)}
        data-action={props.action} data-payload={props.payload}>
        <MaterialIcon {...props} />
      </div>
    );
  }else if (props.icon) {
    var CustomIcon = AllIcons[props.icon];
    return (
      <div className={classname} {...dataset} style={styles}
        onClick={props.onClick || (props.action && dispatchAction)}
        data-action={props.action} data-payload={props.payload}>
        <CustomIcon {...props} />
      </div>
    );
  } else {
    return (
      <div className={classname} data-active={props.active} {...dataset}
        data-action={props.action} data-payload={props.payload}
        onClick={props.onClick || dispatchAction} style={styles}>
        <img width={props.w} height={props.h} data-flip={props.flip}
          data-invert={props.invert} data-rounded={props.rounded}
          src={src} style={{ margin: props.margin}}
          alt={props.alt || ""}/>
      </div>
    );
  }
};

export const Image = (props) => {
  const dispatch = useDispatch();
  var src = `/img/${(props.dir?props.dir+"/":"")+props.src}`;
  if (props.src && !props.src.includes(".")) {
    src += ".png";
  }

  if(props.ext) src = props.src

  const errorHandler = (e)=>{
    if(props.err) e.target.src = props.err
  }

  var dataset = {}
  Object.entries(props).forEach(([key, value]) => {
    if(key.includes("data-")){
      dataset[key] = value;
    }
  });

  return (
    <div className={`imageCont prtclk ${props.className||''}`} id={props.id} style={{
      backgroundImage: props.back && `url(${src})`
    }} data-back={props.back} onClick={props.onClick || (props.action && dispatchAction)}
      data-action={props.action} data-payload={props.payload} {...dataset}>
        {!props.back?<img
          width={props.w}
          height={props.h}
          data-free={props.free}
          data-var={props.var}
          loading={props.lazy && "lazy"}
          src={src} alt="" onError={errorHandler}/>:null}
    </div>
  )
}

export const LazyComponent = ({ show, children }) => {
  const [loaded, setLoad] = useState(false);

  useEffect(() => {
    if (show && !loaded) setLoad(true);
  }, [show]);

  return show || loaded ? <>{children}</> : null;
};
