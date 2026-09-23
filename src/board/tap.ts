import type { Position } from '@/chess/position.ts';
import type { Color, MoveIntent, Square } from '@/chess/types.ts';

export type Movable = Color | 'both' | 'none';

export type TapResult =
  | { kind: 'select'; square: Square }
  | { kind: 'move'; intent: MoveIntent }
  | { kind: 'clear' };

const isSelectable = (position: Position, movable: Movable, square: Square): boolean => {
  const piece = position.pieceAt(square);
  return piece?.color === position.turn && (movable === 'both' || movable === piece.color);
};

export const resolveTap = (
  position: Position,
  movable: Movable,
  selected: Square | undefined,
  tapped: Square,
): TapResult => {
  if (selected && position.legalMovesFrom(selected).some((move) => move.to === tapped)) {
    return { kind: 'move', intent: { from: selected, to: tapped } };
  }
  if (tapped !== selected && isSelectable(position, movable, tapped)) {
    return { kind: 'select', square: tapped };
  }
  return { kind: 'clear' };
};
