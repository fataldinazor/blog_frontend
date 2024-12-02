function LikedIcon({ fillColor, stroke }) {
  return (
    <svg
      width="50px"
      height="50px"
      viewBox="0 0 15 19"
      fill="none"
      stroke={stroke}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z"
        fill={fillColor}
      />
    </svg>
  );
}

function BookmarkIcon({ fillColor }) {
  return (
    <svg
      fill={fillColor}
      stroke="#000000"
      strokeWidth="1.8"
      width="50px"
      height="50px"
      viewBox="-2 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>bookmark</title>
      <path d="M15.476 19.461l-8.451 8.501v-22.924h16.951v22.924l-8.5-8.501z"></path>
    </svg>
  );
}

export { BookmarkIcon, LikedIcon };
