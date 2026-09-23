import type { SquareTone } from '@/board/layout.ts';
import { Piece } from '@/board/Piece.tsx';
import styles from '@/board/Square.module.css';
import type { Piece as ChessPiece, Square as ChessSquare } from '@/chess/types.ts';

interface SquareProps {
  square: ChessSquare;
  tone: SquareTone;
  piece?: ChessPiece;
}

const describe = (square: ChessSquare, piece?: ChessPiece): string =>
  piece ? `${square}, ${piece.color} ${piece.kind}` : square;

export function Square({ square, tone, piece }: SquareProps) {
  return (
    <button
      type="button"
      class={`${styles.square} ${styles[tone]}`}
      aria-label={describe(square, piece)}
    >
      {piece && <Piece piece={piece} />}
    </button>
  );
}
