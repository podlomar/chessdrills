import { Board, pieceLetter } from "immutable-chess";
import { Pawn, Rook, Knight, Bishop, Queen, King } from "./pieces.js";

interface Props {
  board: Board;
  orientation?: 'white' | 'black';
}

export const SVGBoard = ({ board, orientation = 'white' }: Props) => {
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

      <rect
        width={boardSize}
        height={boardSize}
        fill="#E2B38D"
        stroke="none"
      />

      {board.map((piece, index) => {
        const rank = orientation === 'white' ? 7 - board.rank(index) : board.rank(index);
        const file = orientation === 'white' ? board.file(index) : 7 - board.file(index);
        const square = board.toSquare(index);
        const isLightSquare = board.squareColor(index) === 'light';
        const letter = piece !== null ? pieceLetter(piece) : null;

        return (
          <g key={`${rank}-${file}`}>
            {isLightSquare ? null : (
              <rect
                x={file * squareSize}
                y={rank * squareSize}
                width={squareSize}
                height={squareSize}
                fill="#A88261"
              />
            )}
            {letter && <use href={`#${letter}`} x={file * squareSize} y={rank * squareSize} />}
          </g>
        );
      })}
    </svg>
  );
};
