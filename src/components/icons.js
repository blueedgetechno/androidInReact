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
          fill={props.filldim}>
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
