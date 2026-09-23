import { useMemo, useReducer } from 'preact/hooks';
import { Board } from '@/board/Board.tsx';
import type { MoveIntent } from '@/chess/types.ts';
import type { Opening } from '@/openings/tree.ts';
import { LineInfo } from '@/screens/LineInfo.tsx';
import styles from '@/screens/Trainer.module.css';
import { useOpponentMove } from '@/screens/useOpponentMove.ts';
import { breadcrumb, currentNode, currentPosition, visibleNotes } from '@/trainer/selectors.ts';
import { type Phase, sessionReducer, startSession } from '@/trainer/session.ts';
import { BoardLayout } from '@/ui/BoardLayout.tsx';

const OPPONENT_DELAY_MS = 500;

interface TrainerProps {
  opening: Opening;
}

const statusText: Record<Phase['kind'], string> = {
  playerToMove: 'Your move',
  opponentToMove: 'Opponent to move',
  mistake: 'Not in your repertoire',
  lineComplete: 'Line complete',
};

export function Trainer({ opening }: TrainerProps) {
  const [session, dispatch] = useReducer(sessionReducer, opening, startSession);
  useOpponentMove(session, dispatch, { delayMs: OPPONENT_DELAY_MS, random: Math.random });
  const node = currentNode(session);
  // The Board ties its selection to the Position object, so keep it stable per node.
  const position = useMemo(() => currentPosition(session), [node]);

  const move = (intent: MoveIntent): void => {
    const played = position.play(intent);
    if (played) {
      dispatch({ type: 'playerMoved', move: played.move });
    }
  };

  return (
    <BoardLayout
      label="Trainer"
      board={
        <Board
          position={position}
          orientation={opening.side}
          movable={session.phase.kind === 'playerToMove' ? opening.side : 'none'}
          lastMove={session.path.at(-1)?.move}
          onMove={move}
        />
      }
    >
      <h1 class={styles.title}>{opening.name}</h1>
      <p class={styles.status} role="status">
        {statusText[session.phase.kind]}
      </p>
      <LineInfo names={breadcrumb(session)} notes={visibleNotes(session)} />
    </BoardLayout>
  );
}
