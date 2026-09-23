import type { SquareTone } from '@/board/layout.ts';
import { Piece } from '@/board/Piece.tsx';
import styles from '@/board/Square.module.css';
import type { Piece as ChessPiece, Square as ChessSquare, File, Rank } from '@/chess/types.ts';

interface SquareProps {
  square: ChessSquare;
  tone: SquareTone;
  piece?: ChessPiece;
  fileLabel?: File;
  rankLabel?: Rank;
}

const describe = (square: ChessSquare, piece?: ChessPiece): string =>
  piece ? `${square}, ${piece.color} ${piece.kind}` : square;

export function Square({ square, tone, piece, fileLabel, rankLabel }: SquareProps) {
  return (
    <button
      type="button"
      class={`${styles.square} ${styles[tone]}`}
      aria-label={describe(square, piece)}
    >
      {piece && <Piece piece={piece} />}
      {rankLabel && (
        <span class={`${styles.coordinate} ${styles.rank}`} aria-hidden="true">
          {rankLabel}
        </span>
      )}
      {fileLabel && (
        <span class={`${styles.coordinate} ${styles.file}`} aria-hidden="true">
          {fileLabel}
        </span>
      )}
    </button>
  );
}
