import { useEffect } from 'preact/hooks';
import type { MoveNode } from '@/openings/tree.ts';
import { chooseOpponentMove } from '@/trainer/opponent.ts';
import type { Random } from '@/trainer/pick.ts';
import type { Session, SessionAction } from '@/trainer/session.ts';

interface OpponentOptions {
  delayMs: number;
  random: Random;
  replay?: readonly MoveNode[];
}

export const useOpponentMove = (
  session: Session,
  dispatch: (action: SessionAction) => void,
  { delayMs, random, replay }: OpponentOptions,
): void => {
  useEffect(() => {
    const node = chooseOpponentMove(session, random, replay);
    if (!node) {
      return;
    }
    const timer = setTimeout(() => dispatch({ type: 'opponentMoved', node }), delayMs);
    return () => clearTimeout(timer);
  }, [session, dispatch, delayMs, random, replay]);
};
