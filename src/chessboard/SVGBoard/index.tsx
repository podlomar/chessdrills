import { ChessBoard } from "../fen.js";
import { Pawn, Rook, Knight, Bishop, Queen, King } from "./pieces.js";

interface Props {
  board: ChessBoard;
}

export const SVGBoard = ({ board }: Props) => {
  const squareSize = 256;
  const boardSize = squareSize * 8;

  return (
    <svg
      viewBox={`0 0 ${boardSize} ${boardSize}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <Pawn color="white" />
        <Pawn color="black" />
        <Rook color="white" />
        <Rook color="black" />
        <Knight color="white" />
        <Knight color="black" />
        <Bishop color="white" />
        <Bishop color="black" />
        <Queen color="white" />
        <Queen color="black" />
        <King color="white" />
        <King color="black" />
      </defs>

      <rect width={boardSize} height={boardSize} fill="#f0d9b5" />
      {[...Array(8)].map((_, row) =>
        [...Array(8)].map((_, col) => {
          const isLightSquare = (row + col) % 2 === 0;
          const piece = board[row * 8 + col];

          return (
            <g key={`${row}-${col}`}>
              {isLightSquare ? null : (
                <rect
                  x={col * squareSize}
                  y={row * squareSize}
                  width={squareSize}
                  height={squareSize}
                  fill="#b58863"
                />
              )}
              <use href={`#${piece}`} x={col * squareSize} y={row * squareSize} />
            </g>
          );
        })
      )}
    </svg>
  );
};
