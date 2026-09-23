import styles from '@/board/Board.module.css';
import { layoutSquares } from '@/board/layout.ts';
import { Square } from '@/board/Square.tsx';
import type { Position } from '@/chess/position.ts';

interface BoardProps {
  position: Position;
}

export function Board({ position }: BoardProps) {
  return (
    <fieldset class={styles.board} aria-label="Chessboard">
      {layoutSquares().map(({ square, tone }) => (
        <Square key={square} square={square} tone={tone} piece={position.pieceAt(square)} />
      ))}
    </fieldset>
  );
}
