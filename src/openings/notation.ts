import type { Color } from '@/chess/types.ts';

export interface MoveCounter {
  moveNumber: number;
  turn: Color;
}

export const formatMove = (
  san: string,
  index: number,
  start: MoveCounter,
  numberBlack = true,
): string => {
  const halfMoves = index + (start.turn === 'black' ? 1 : 0);
  const moveNumber = start.moveNumber + Math.floor(halfMoves / 2);
  if (halfMoves % 2 === 0) {
    return `${moveNumber}.${san}`;
  }
  return numberBlack ? `${moveNumber}...${san}` : san;
};

export const formatMoves = (sans: readonly string[], start: MoveCounter): string =>
  sans.map((san, index) => formatMove(san, index, start, index === 0)).join(' ');
