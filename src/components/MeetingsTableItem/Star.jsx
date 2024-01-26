import * as React from "react";
const Star = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="40px"
    height="40px"
    viewBox="0 0 40 40"
    {...props}
  >
    <g id="surface1">
      <path
        style={{
          fill: "none",
          strokeWidth: 10,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          stroke: "rgb(100%,100%,100%)",
          strokeOpacity: 1,
          strokeMiterlimit: 4,
        }}
        d="M 49.605469 49.605469 L 33.28125 44.068359 L 19.470703 54.375 L 19.693359 37.142578 L 5.625 27.193359 L 22.078125 22.078125 L 27.193359 5.625 L 37.142578 19.693359 L 54.375 19.470703 L 44.068359 33.28125 Z M 49.605469 49.605469 "
        transform="matrix(0.666667,0,0,0.666667,0,0)"
      />
      <path
        style={{
          fillRule: "evenodd",
          fill: "rgb(100%,91.372549%,25.098039%)",
          fillOpacity: 1,
          strokeWidth: 5,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          stroke: "rgb(0%,0%,0%)",
          strokeOpacity: 1,
          strokeMiterlimit: 4,
        }}
        d="M 49.605469 49.605469 L 33.28125 44.068359 L 19.470703 54.375 L 19.693359 37.142578 L 5.625 27.193359 L 22.078125 22.078125 L 27.193359 5.625 L 37.142578 19.693359 L 54.375 19.470703 L 44.068359 33.28125 Z M 49.605469 49.605469 "
        transform="matrix(0.666667,0,0,0.666667,0,0)"
      />
    </g>
  </svg>
);
export default Star;
