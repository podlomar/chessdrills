import { useMemo, useReducer, useState } from 'preact/hooks';
import { routeHref } from '@/app/route.ts';
import { Board } from '@/board/Board.tsx';
import type { MoveIntent, Square } from '@/chess/types.ts';
import type { MoveNode, NodeId, Opening } from '@/openings/tree.ts';
import { LineInfo } from '@/screens/LineInfo.tsx';
import styles from '@/screens/Trainer.module.css';
import { useOpponentMove } from '@/screens/useOpponentMove.ts';
import {
  breadcrumb,
  currentNode,
  currentPosition,
  expectedMoves,
  visibleNotes,
} from '@/trainer/selectors.ts';
import { type Phase, sessionReducer, startSession } from '@/trainer/session.ts';
import { BoardLayout } from '@/ui/BoardLayout.tsx';
import { Button } from '@/ui/Button.tsx';
import { Panel } from '@/ui/Panel.tsx';

const OPPONENT_DELAY_MS = 500;

interface TrainerProps {
  opening: Opening;
}

const statusText: Record<Phase['kind'], string> = {
  playerToMove: 'Your move',
  opponentToMove: 'Opponent to move',
  mistake: 'Wrong move',
  lineComplete: 'Line complete',
};

export function Trainer({ opening }: TrainerProps) {
  const [session, dispatch] = useReducer(sessionReducer, opening, startSession);
  const [replay, setReplay] = useState<readonly MoveNode[]>();
  useOpponentMove(session, dispatch, {
    delayMs: OPPONENT_DELAY_MS,
    random: Math.random,
    replay,
  });
  const node = currentNode(session);
  // The Board ties its selection to the Position object, so keep it stable per node.
  const position = useMemo(() => currentPosition(session), [node]);

  const [hintAt, setHintAt] = useState<NodeId>();
  const hintSquares: readonly Square[] =
    hintAt === node.id ? [...new Set(expectedMoves(session).map(({ move }) => move.from))] : [];

  const showHint = (): void => {
    setHintAt(node.id);
    dispatch({ type: 'dismissMistake' });
  };

  const nextLine = (): void => {
    setReplay(undefined);
    dispatch({ type: 'restart' });
  };

  const repeatLine = (): void => {
    setReplay(session.path);
    dispatch({ type: 'restart' });
  };

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
          hintSquares={hintSquares}
          onMove={move}
        />
      }
    >
      <a class={styles.back} href={routeHref({ name: 'library' })}>
        ‹ All openings
      </a>
      <h1 class={styles.title}>{opening.name}</h1>
      <p class={styles.status} role="status">
        {statusText[session.phase.kind]}
      </p>
      {session.phase.kind === 'mistake' && (
        <Panel tone="danger">
          <p>
            <strong>{session.phase.attempted.san}</strong> is not in your repertoire.
          </p>
          <div class={styles.actions}>
            <Button onClick={() => dispatch({ type: 'dismissMistake' })}>Try again</Button>
            <Button onClick={showHint}>Show hint</Button>
          </div>
        </Panel>
      )}
      {session.phase.kind === 'lineComplete' && (
        <Panel tone="success">
          <p>
            Line complete{' '}
            {session.mistakes === 0
              ? 'without mistakes.'
              : `with ${session.mistakes} ${session.mistakes === 1 ? 'mistake' : 'mistakes'}.`}
          </p>
          <div class={styles.actions}>
            <Button onClick={nextLine}>Next line</Button>
            <Button onClick={repeatLine}>Repeat line</Button>
          </div>
        </Panel>
      )}
      <LineInfo names={breadcrumb(session)} notes={visibleNotes(session)} />
    </BoardLayout>
  );
}
