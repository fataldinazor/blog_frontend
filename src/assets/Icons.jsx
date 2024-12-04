function BlogIcon({ color, height, width }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      id="i-forwards"
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
      stroke="currentcolor"
      strokeLinecap="square"
      strokeLinejoin="round"
      strokeWidth="3"
    >
      <path d="M16 2 L30 16 16 30 16 16 2 30 2 2 16 16 Z" />
    </svg>
  );
}

function LikedIcon({ fillColor, stroke }) {
  return (
    <svg
      width="35px"
      height="35px"
      viewBox="0 -1 15 19"
      fill="none"
      stroke={stroke}
      strokeWidth={1.5}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z"
        fill={fillColor}
      />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg
      width="33px"
      height="35px"
      viewBox="-2 0 35 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
    >
      <title>comment-1</title>
      <desc>Created with Sketch Beta.</desc>
      <defs></defs>
      <g
        id="Page-1"
        stroke="#000000"
        strokeWidth="1.0"
        fill="none"
        fillRule="evenodd"
        sketch:type="MSPage"
      >
        <g
          id="Icon-Set"
          sketch:type="MSLayerGroup"
          transform="translate(-100.000000, -255.000000)"
          fill="#000000"
        >
          <path
            d="M116,281 C114.832,281 113.704,280.864 112.62,280.633 L107.912,283.463 L107.975,278.824 C104.366,276.654 102,273.066 102,269 C102,262.373 108.268,257 116,257 C123.732,257 130,262.373 130,269 C130,275.628 123.732,281 116,281 L116,281 Z M116,255 C107.164,255 100,261.269 100,269 C100,273.419 102.345,277.354 106,279.919 L106,287 L113.009,282.747 C113.979,282.907 114.977,283 116,283 C124.836,283 132,276.732 132,269 C132,261.269 124.836,255 116,255 L116,255 Z"
            id="comment-1"
            sketch:type="MSShapeGroup"
          ></path>
        </g>
      </g>
    </svg>
  );
}

function BookmarkIcon({ fillColor }) {
  return (
    <svg
      fill={fillColor}
      stroke="#000000"
      strokeWidth="2.5"
      width="35px"
      height="35px"
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>bookmark</title>
      <path d="M15.476 19.461l-8.451 8.501v-22.924h16.951v22.924l-8.5-8.501z"></path>
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      width="35px"
      height="35px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.5 2.25C14.7051 2.25 13.25 3.70507 13.25 5.5C13.25 5.69591 13.2673 5.88776 13.3006 6.07412L8.56991 9.38558C8.54587 9.4024 8.52312 9.42038 8.50168 9.43939C7.94993 9.00747 7.25503 8.75 6.5 8.75C4.70507 8.75 3.25 10.2051 3.25 12C3.25 13.7949 4.70507 15.25 6.5 15.25C7.25503 15.25 7.94993 14.9925 8.50168 14.5606C8.52312 14.5796 8.54587 14.5976 8.56991 14.6144L13.3006 17.9259C13.2673 18.1122 13.25 18.3041 13.25 18.5C13.25 20.2949 14.7051 21.75 16.5 21.75C18.2949 21.75 19.75 20.2949 19.75 18.5C19.75 16.7051 18.2949 15.25 16.5 15.25C15.4472 15.25 14.5113 15.7506 13.9174 16.5267L9.43806 13.3911C9.63809 12.9694 9.75 12.4978 9.75 12C9.75 11.5022 9.63809 11.0306 9.43806 10.6089L13.9174 7.4733C14.5113 8.24942 15.4472 8.75 16.5 8.75C18.2949 8.75 19.75 7.29493 19.75 5.5C19.75 3.70507 18.2949 2.25 16.5 2.25ZM14.75 5.5C14.75 4.5335 15.5335 3.75 16.5 3.75C17.4665 3.75 18.25 4.5335 18.25 5.5C18.25 6.4665 17.4665 7.25 16.5 7.25C15.5335 7.25 14.75 6.4665 14.75 5.5ZM6.5 10.25C5.5335 10.25 4.75 11.0335 4.75 12C4.75 12.9665 5.5335 13.75 6.5 13.75C7.4665 13.75 8.25 12.9665 8.25 12C8.25 11.0335 7.4665 10.25 6.5 10.25ZM16.5 16.75C15.5335 16.75 14.75 17.5335 14.75 18.5C14.75 19.4665 15.5335 20.25 16.5 20.25C17.4665 20.25 18.25 19.4665 18.25 18.5C18.25 17.5335 17.4665 16.75 16.5 16.75Z"
        fill="#000000"
      />
    </svg>
  );
}

export { BlogIcon, BookmarkIcon, LikedIcon, CommentIcon, ShareIcon };
