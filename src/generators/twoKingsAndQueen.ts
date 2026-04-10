import { type ChessBoard, chessBoardToFen } from '../chessboard/fen.js';

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

const squareToIndex = (square: string): number => {
  const fileIndex = files.indexOf(square[0]);
  const rankIndex = ranks.indexOf(square[1]);
  if (fileIndex === -1 || rankIndex === -1) {
    throw new Error(`Invalid square notation: ${square}`);
  }
  return (7 - rankIndex) * 8 + fileIndex;
};

const randomSquare = (): string =>
  files[Math.floor(Math.random() * 8)] + ranks[Math.floor(Math.random() * 8)];

const isAdjacent = (i1: number, i2: number): boolean =>
  Math.abs(Math.floor(i1 / 8) - Math.floor(i2 / 8)) <= 1 &&
  Math.abs((i1 % 8) - (i2 % 8)) <= 1;

export const twoKingsAndQueen = (): string => {
  while (true) {
    const wkSq = randomSquare();
    const bkSq = randomSquare();
    const wqSq = randomSquare();

    const wk = squareToIndex(wkSq);
    const bk = squareToIndex(bkSq);
    const wq = squareToIndex(wqSq);

    if (wk === bk || wk === wq || bk === wq) continue;
    if (isAdjacent(wk, bk)) continue;

    const board: ChessBoard = Array(64).fill(null);
    board[wk] = 'K';
    board[bk] = 'k';
    board[wq] = 'Q';

    return chessBoardToFen(board) + ' w - - 0 1';
  }
};
