import styles from '@/board/Board.module.css';
import { layoutSquares } from '@/board/layout.ts';
import { Square } from '@/board/Square.tsx';
import type { Position } from '@/chess/position.ts';
import type { Color } from '@/chess/types.ts';

interface BoardProps {
  position: Position;
  orientation: Color;
}

export function Board({ position, orientation }: BoardProps) {
  return (
    <div class={styles.board}>
      <fieldset class={styles.grid} aria-label="Chessboard">
        {layoutSquares(orientation).map((layout) => (
          <Square key={layout.square} {...layout} piece={position.pieceAt(layout.square)} />
        ))}
      </fieldset>
    </div>
  );
}
