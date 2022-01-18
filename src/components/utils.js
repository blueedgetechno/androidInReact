import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";
// import './general.scss';

import { dispatchAction } from "../store/actions";

import * as FaIcons from "@fortawesome/free-solid-svg-icons";
import * as FaRegIcons from "@fortawesome/free-regular-svg-icons";
import * as MUIcons from "@mui/icons-material";
// import SettingsIcon from '@mui/icons-material/Settings';

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

  var prtclk = "";
  if (props.src) {
    if (props.onClick || props.pr) {
      prtclk = "prtclk";
    }
  }

  if (props.fafa) {
    return (
      <div
        className={`uicon prtclk ${props.className || ""}`}
        onClick={props.onClick || (props.click && dispatchAction)}
        data-action={props.click} data-payload={props.payload}>
        <FontAwesomeIcon
          data-flip={props.flip}
          data-invert={props.invert}
          data-rounded={props.rounded}
          style={{
            width: props.w,
            height: props.h || props.w,
            color: props.color,
            margin: props.margin,
          }}
          icon={!props.reg ? FaIcons[props.fafa] : FaRegIcons[props.fafa]}
        />
      </div>
    );
  } else if (props.mui) {
    return (
      <div
        className={`uicon prtclk ${props.className || ""}`}
        onClick={props.onClick || (props.click && dispatchAction)}
        data-action={props.click} data-payload={props.payload}>
        <MaterialIcon {...props} />
      </div>
    );
  } else {
    return (
      <div
        className={`uicon ${props.className || ""} ${prtclk}`}
        data-open={props.open}
        data-action={props.click}
        data-active={props.active}
        data-payload={props.payload}
        onClick={props.onClick || (props.pr && dispatchAction)}
        data-pr={props.pr}>
        <img
          width={props.w}
          height={props.h}
          data-action={props.click}
          data-payload={props.payload}
          data-click={props.click}
          onClick={props.click ? dispatchAction : null}
          data-flip={props.flip}
          data-invert={props.invert}
          data-rounded={props.rounded}
          src={src}
          style={{ margin: props.margin }}
          alt=""
        />
      </div>
    );
  }
};

export const LazyComponent = ({ show, children }) => {
  const [loaded, setLoad] = useState(false);

  useEffect(() => {
    if (show && !loaded) setLoad(true);
  }, [show]);

  return show || loaded ? <>{children}</> : null;
};
