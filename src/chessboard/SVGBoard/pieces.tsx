interface PieceProps {
  color: "white" | "black";
}

export const Pawn = ({ color }: PieceProps) => (
  <path
    id={color === "white" ? "P" : "p"}
    fill={color === "white" ? "#fff" : "#000"}
    stroke="#000"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="8"
    d="m128 44c-20 0-40 20-20 48-16 4-40 36-4 60-36 16-44 36-44 76h136c0-40-8-60-44-76 36-24 12-56-4-60 20-28 0-48-20-48z"
  />
);

export const Rook = ({ color }: PieceProps) => (
  <g
    id={color === "white" ? "R" : "r"}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="8"
  >
    <path
      fill={color === "white" ? "#fff" : "#000"}
      stroke="#000"
      d="m60 44v44l28 28v68l-40 24v20h160v-20l-40-24v-68l28-28v-44h-24v24h-28v-24h-32v24h-28v-24z"
    />
    <g stroke={color === "white" ? "#000" : "#fff"}>
      <path d="m92 204h72" />
      <path d="m108 176h40" />
      <path d="m96 92h64" />
    </g>
  </g>
);

export const Knight = ({ color }: PieceProps) => (
  <g
    id={color === "white" ? "N" : "n"}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="8"
  >
    <path
      fill={color === "white" ? "#fff" : "#000"}
      stroke="#000"
      d="m52 48 20 16c-12 20-32 48-40 72-4 16 8 40 32 32 24-40 32-8 56-56 12 48-40 72-72 96v20h160v-20l-28-20c34.002-51.199 16-104-12-124-32.914-23.51-76-20-116-16z"
    />
    <g
      fill="none"
      stroke={color === "white" ? "#000" : "#fff"}>
      <path d="m92 204h72" />
      <path d="m160 176c36-48 4-92-24-100" />
    </g>
    <circle
      fill={color === "white" ? "#000" : "#fff"}
      cx="84"
      cy="88"
      r="10"
    />
  </g>
);

export const Bishop = ({ color }: PieceProps) => (
  <g
    id={color === "white" ? "B" : "b"}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="8"
  >
    <path
      d="m128 64c-28 20-56 40-56 64 0 16 7.8117 29.972 24 40l-8 16-40 24v20h160v-20l-40-24-8-16c16.188-10.028 24-24 24-40 0-28-28-44-56-64z"
      fill={color === "white" ? "#fff" : "#000"}
      stroke="#000" />
    <circle
      cx="128"
      cy="48"
      r="16"
      fill={color === "white" ? "#fff" : "#000"}
      stroke="#000"
    />
    <g
      fill="none"
      stroke={color === "white" ? "#000" : "#fff"}
    >
      <path d="m108 112h40" />
      <path d="m128 96v40" />
      <path d="m108 168c16-8 24-8 40 0" />
      <path d="m92 204h72" />
    </g>
  </g>
);

export const Queen = ({ color }: PieceProps) => (
  <g
    id={color === "white" ? "Q" : "q"}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="8"
  >
    <path
      fill={color === "white" ? "#fff" : "#000"}
      stroke="#000"
      d="m128 32a16 16 0 0 0-16 16 16 16 0 0 0 9.7891 14.744l-9.7891 65.256-22.652-55.014a16 16 0 0 0 6.6523-12.986 16 16 0 0 0-16-16 16 16 0 0 0-16 16 16 16 0 0 0 13.238 15.76l6.7617 64.24-35.834-45.607a16 16 0 0 0 3.834-10.393 16 16 0 0 0-16-16 16 16 0 0 0-16 16 16 16 0 0 0 16 16 16 16 0 0 0 0.61133-0.01172l35.389 92.012-24 16v20h160v-20l-24-16 35.389-92.012a16 16 0 0 0 0.61133 0.011719 16 16 0 0 0 16-16 16 16 0 0 0-16-16 16 16 0 0 0-16 16 16 16 0 0 0 3.834 10.393l-35.834 45.607 6.7617-64.24a16 16 0 0 0 13.238-15.76 16 16 0 0 0-16-16 16 16 0 0 0-16 16 16 16 0 0 0 6.6523 12.986l-22.652 55.014-9.7891-65.256a16 16 0 0 0 9.7891-14.744 16 16 0 0 0-16-16z"
    />
    <g
      fill="none"
      stroke={color === "white" ? "#000" : "#fff"}>
      <path d="m92 204h72" />
      <path d="m92 168c24-16 48-16 72 0" />
    </g>
  </g>
);

export const King = ({ color }: PieceProps) => (
  <g
    id={color === "white" ? "K" : "k"}
    stroke="#000"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="8"
  >
    <path
      d="m112 32 4 24-20-4v28l20-4v28c-12-12-28-16-44-16-24 0-40 20-40 44 0 32 40 60 40 60l-24 16v20h160v-20l-24-16s40-28 40-60c0-24-16-44-40-44-16 0-32 4-44 16v-28l20 4v-28l-20 4 4-24h-16z"
      fill={color === "white" ? "#fff" : "#000"}
    />
    <g
      fill="none"
      stroke={color === "white" ? "#000" : "#fff"}
    >
      <path d="m92 204h72" />
      <path d="m128 176c0-24-12-48-36-56s-36 24-16 40 40 16 52 16z" />
      <path d="m128 176c0-24 12-48 36-56s36 24 16 40-40 16-52 16z" />
    </g>
  </g>
);
