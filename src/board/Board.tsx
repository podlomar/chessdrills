import styles from '@/board/Board.module.css';
import { layoutBoard } from '@/board/layout.ts';
import { Square } from '@/board/Square.tsx';
import type { Position } from '@/chess/position.ts';
import type { Color } from '@/chess/types.ts';

interface BoardProps {
  position: Position;
  orientation: Color;
}

export function Board({ position, orientation }: BoardProps) {
  const { squares, files, ranks } = layoutBoard(orientation);

  return (
    <div class={styles.board}>
      <div class={styles.frame}>
        <fieldset class={styles.squares} aria-label="Chessboard">
          {squares.map(({ square, tone }) => (
            <Square key={square} square={square} tone={tone} piece={position.pieceAt(square)} />
          ))}
        </fieldset>
        <div class={`${styles.coordinates} ${styles.ranks}`} aria-hidden="true">
          {ranks.map((rank) => (
            <span key={rank}>{rank}</span>
          ))}
        </div>
        <div class={`${styles.coordinates} ${styles.files}`} aria-hidden="true">
          {files.map((file) => (
            <span key={file}>{file}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
