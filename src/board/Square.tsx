import type { SquareTone } from '@/board/layout.ts';
import { Piece } from '@/board/Piece.tsx';
import styles from '@/board/Square.module.css';
import type { Piece as ChessPiece, Square as ChessSquare } from '@/chess/types.ts';

export type Destination = 'move' | 'capture';

interface SquareProps {
  square: ChessSquare;
  tone: SquareTone;
  piece?: ChessPiece;
  selected: boolean;
  destination?: Destination;
  lastMove: boolean;
  check: boolean;
  hint: boolean;
  onTap: (square: ChessSquare) => void;
}

const describe = (square: ChessSquare, piece?: ChessPiece): string =>
  piece ? `${square}, ${piece.color} ${piece.kind}` : square;

export function Square({
  square,
  tone,
  piece,
  selected,
  destination,
  lastMove,
  check,
  hint,
  onTap,
}: SquareProps) {
  const classes = [
    styles.square,
    styles[tone],
    lastMove && styles.lastMove,
    selected && styles.selected,
    check && styles.check,
    hint && styles.hint,
    destination && styles[destination],
  ];

  return (
    <button
      type="button"
      class={classes.filter(Boolean).join(' ')}
      aria-label={describe(square, piece)}
      aria-pressed={selected}
      onClick={() => onTap(square)}
    >
      {piece && <Piece piece={piece} />}
    </button>
  );
}
