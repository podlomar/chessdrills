import { useState } from 'preact/hooks';
import { Board } from '@/board/Board.tsx';
import { type PlayResult, type Position, positionFromFen } from '@/chess/position.ts';
import type { Color, MoveIntent } from '@/chess/types.ts';
import styles from '@/screens/FreePlay.module.css';
import { BoardLayout } from '@/ui/BoardLayout.tsx';
import { Button } from '@/ui/Button.tsx';

const startPosition = positionFromFen();

const colorName = (color: Color): string => (color === 'white' ? 'White' : 'Black');

const describeStatus = (position: Position): string => {
  const side = colorName(position.turn);
  if (position.isGameOver) {
    const winner = colorName(position.turn === 'white' ? 'black' : 'white');
    return position.inCheck ? `Checkmate, ${winner} wins` : 'Draw';
  }
  return position.inCheck ? `${side} to move, in check` : `${side} to move`;
};

export function FreePlay() {
  const [plies, setPlies] = useState<readonly PlayResult[]>([]);
  const last = plies.at(-1);
  const position = last?.position ?? startPosition;

  const move = (intent: MoveIntent): void => {
    const result = position.play(intent);
    if (result) {
      setPlies([...plies, result]);
    }
  };

  return (
    <BoardLayout
      label="Free play"
      board={
        <Board
          position={position}
          orientation="white"
          movable="both"
          lastMove={last?.move}
          onMove={move}
        />
      }
    >
      <div class={styles.controls}>
        <p class={styles.status} role="status">
          {describeStatus(position)}
        </p>
        <Button disabled={plies.length === 0} onClick={() => setPlies(plies.slice(0, -1))}>
          Undo
        </Button>
        <Button disabled={plies.length === 0} onClick={() => setPlies([])}>
          Reset
        </Button>
      </div>
    </BoardLayout>
  );
}
