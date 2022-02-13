export const NetworkIcon = (props) => {
  // network icon that is responsive to a status props indicating network strength
  const status = props.status || 4;
  return (
    <div className="uicon">
      <svg
        viewBox="0 0 110 100"
        width={props.w}
        height={props.h || props.w}
        fill={props.fill}
      >
        <rect x={0} y={75} width={20} height={25} rx={5} ry={5}></rect>
        <rect
          x={30}
          y={50}
          width={20}
          height={50}
          rx={5}
          ry={5}
          fill={status > 1 ? props.fill : props.filldim}
        ></rect>
        <rect
          x={60}
          y={25}
          width={20}
          height={75}
          rx={5}
          ry={5}
          fill={status > 2 ? props.fill : props.filldim}
        ></rect>
        <rect
          x={90}
          y={0}
          width={20}
          height={100}
          rx={5}
          ry={5}
          fill={status > 3 ? props.fill : props.filldim}
        ></rect>
      </svg>
    </div>
  );
};

// Battery Icon by Google Inc. - Iconscout
export const BatteryIcon = (props) => {
  var h = ((props.battery.level || 100)*33);

  return (
    <div className="uicon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 48"
        width={props.w}
        height={props.h || props.w}>
        <g
          style={{
            transform: "translateX(-12px)",
          }}
          fill={null}>
          <path d="M34 10.67c0-1.48-1.19-2.67-2.67-2.67h-3.33v-4h-8v4h-3.33c-1.48 0-2.67 1.19-2.67 2.67v7.33h20v-7.33z" />
          <path d="M14 18v23.33c0 1.47 1.19 2.67 2.67 2.67h14.67c1.47 0 2.67-1.19 2.67-2.67v-23.33h-20.01z" />
          <rect
            x={15}
            y={42.5 - h}
            width={18}
            height={h}
            fill={props.fill}
            rx={2}></rect>
          <g style={{ transform: "translate(19px,16px) scale(0.036)" }}>
            <path
              fill={props.battery.charging ? props.cfill : "none"}
              d="M296 160H180.6l42.6-129.8C227.2 15 215.7 0 200 0H56C44 0 33.8 8.9 32.2 20.8l-32 240C-1.7 275.2 9.5 288 24 288h118.7L96.6 482.5c-3.6 15.2 8 29.5 23.3 29.5 8.4 0 16.4-4.4 20.8-12l176-304c9.3-15.9-2.2-36-20.7-36z"></path>
          </g>
        </g>
      </svg>
    </div>
  );
};

export const pinned = (props) => {
  return (
    <svg viewBox="0 0 16 16" height={16} width={16} {...props} className={
      props.flip? "flip-true": "" +
      (props.invert? " invert-true": "") +
      (props.rounded? " rounded-true": "")
    } style={{
      width: props.w,
      height: props.h || props.w,
      color: props.color,
      margin: props.margin
    }}>
      <path
        d="M12.074 4.21 8.7 8.232l.116 4.233a.4.4 0 0 1-.657.318L.43 6.297a.4.4 0 0 1 .199-.702l4.196-.622L8.196.957a.63.63 0 0 1 .887-.078l2.914 2.445a.63.63 0 0 1 .077.887ZM1.294 14.229a.713.713 0 0 1-1.09-.915l2.674-3.64 1.536 1.288-3.12 3.267Z">
      </path>
    </svg>
  );
};

export const seentick = (props) => {
  return (
    <svg viewBox="0 0 16 15" width="16" height="15" {...props} className={
      props.flip? "flip-true": "" +
      (props.invert? " invert-true": "") +
      (props.rounded? " rounded-true": "")
    } style={{
      width: props.w,
      height: props.h || props.w,
      color: props.color,
      margin: props.margin
    }}>
      <path d="m15.01 3.316-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z">
      </path>
    </svg>
  );
};
