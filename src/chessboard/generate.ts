import { ChessBoard, chessBoardToFen } from "./fen.js";

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

const squareToIndex = (square: string): number => {
  const file = square[0];
  const rank = square[1];

  const fileIndex = files.indexOf(file);
  const rankIndex = ranks.indexOf(rank);

  if (fileIndex === -1 || rankIndex === -1) {
    throw new Error(`Invalid square notation: ${square}`);
  }

  return (7 - rankIndex) * 8 + fileIndex;
}

export const twoKingsAndPawn = (): string => {
  let whiteKingSquare: string;
  let blackKingSquare: string;
  let whitePawnSquare: string;

  const whiteFile = files[Math.floor(Math.random() * 8)];
  const whiteRank = ranks[Math.floor(Math.random() * 8)];
  whiteKingSquare = whiteFile + whiteRank;

  const blackFile = files[Math.floor(Math.random() * 8)];
  const blackRank = ranks[Math.floor(Math.random() * 8)];
  blackKingSquare = blackFile + blackRank;

  const pawnFile = files[Math.floor(Math.random() * 8)];
  const pawnRank = ranks[Math.floor(Math.random() * 8)];
  whitePawnSquare = pawnFile + pawnRank;

  // Ensure kings are not adjacent
  const whiteKingIndex = squareToIndex(whiteKingSquare);
  const blackKingIndex = squareToIndex(blackKingSquare);
  const whitePawnIndex = squareToIndex(whitePawnSquare);

  const isAdjacent = (index1: number, index2: number): boolean => {
    const row1 = Math.floor(index1 / 8);
    const col1 = index1 % 8;
    const row2 = Math.floor(index2 / 8);
    const col2 = index2 % 8;

    return Math.abs(row1 - row2) <= 1 && Math.abs(col1 - col2) <= 1;
  };

  if (isAdjacent(whiteKingIndex, blackKingIndex) || isAdjacent(whiteKingIndex, whitePawnIndex) || isAdjacent(blackKingIndex, whitePawnIndex)) {
    return twoKingsAndPawn(); // Retry if adjacent
  }

  const board: ChessBoard = Array(64).fill(null);
  board[squareToIndex(whiteKingSquare)] = 'K';
  board[squareToIndex(blackKingSquare)] = 'k';
  board[squareToIndex(whitePawnSquare)] = 'P';

  return chessBoardToFen(board) + ' w - - 0 1';
}

