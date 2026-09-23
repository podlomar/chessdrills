import { useState } from 'preact/hooks';
import styles from '@/board/Board.module.css';
import { layoutBoard } from '@/board/layout.ts';
import { PromotionPicker } from '@/board/PromotionPicker.tsx';
import { type Destination, Square } from '@/board/Square.tsx';
import { type Movable, resolveTap } from '@/board/tap.ts';
import type { Position } from '@/chess/position.ts';
import type { Square as ChessSquare, Color, Move, MoveIntent, Piece } from '@/chess/types.ts';

interface BoardProps {
  position: Position;
  orientation: Color;
  movable: Movable;
  lastMove?: Pick<Move, 'from' | 'to'>;
  hintSquares?: readonly ChessSquare[];
  onMove: (intent: MoveIntent) => void;
}

interface Selection {
  position: Position;
  square: ChessSquare;
}

interface PendingPromotion {
  position: Position;
  from: ChessSquare;
  to: ChessSquare;
}

const destinationsFrom = (
  position: Position,
  square: ChessSquare | undefined,
): ReadonlyMap<ChessSquare, Destination> =>
  new Map(
    (square ? position.legalMovesFrom(square) : []).map((move) => [
      move.to,
      move.captured ? 'capture' : 'move',
    ]),
  );

const isCheckedKing = (position: Position, piece: Piece | undefined): boolean =>
  position.inCheck && piece?.kind === 'king' && piece.color === position.turn;

export function Board({
  position,
  orientation,
  movable,
  lastMove,
  hintSquares = [],
  onMove,
}: BoardProps) {
  const { squares, files, ranks } = layoutBoard(orientation);
  // Tagging the selection with its position drops it as soon as a new position arrives.
  const [selection, setSelection] = useState<Selection>();
  const [promotion, setPromotion] = useState<PendingPromotion>();
  const selected = selection?.position === position ? selection.square : undefined;
  const pending = promotion?.position === position ? promotion : undefined;
  const destinations = destinationsFrom(position, selected);

  const tap = (square: ChessSquare): void => {
    const result = resolveTap(position, movable, selected, square);
    setSelection(result.kind === 'select' ? { position, square: result.square } : undefined);
    if (result.kind === 'move') {
      onMove(result.intent);
    }
    if (result.kind === 'promote') {
      setPromotion({ position, from: result.from, to: result.to });
    }
  };

  return (
    <div class={styles.board}>
      <div class={styles.frame}>
        <fieldset class={styles.squares} aria-label="Chessboard">
          {squares.map(({ square, tone }) => {
            const piece = position.pieceAt(square);
            return (
              <Square
                key={square}
                square={square}
                tone={tone}
                piece={piece}
                selected={square === selected}
                destination={destinations.get(square)}
                lastMove={square === lastMove?.from || square === lastMove?.to}
                check={isCheckedKing(position, piece)}
                hint={hintSquares.includes(square)}
                onTap={tap}
              />
            );
          })}
        </fieldset>
        {pending && (
          <PromotionPicker
            color={position.turn}
            onPick={(kind) => {
              setPromotion(undefined);
              onMove({ from: pending.from, to: pending.to, promotion: kind });
            }}
            onCancel={() => setPromotion(undefined)}
          />
        )}
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
