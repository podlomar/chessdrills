import { useEffect } from 'preact/hooks';
import { chooseOpponentMove } from '@/trainer/opponent.ts';
import type { Random } from '@/trainer/pick.ts';
import type { Session, SessionAction } from '@/trainer/session.ts';

interface OpponentOptions {
  delayMs: number;
  random: Random;
}

export const useOpponentMove = (
  session: Session,
  dispatch: (action: SessionAction) => void,
  { delayMs, random }: OpponentOptions,
): void => {
  useEffect(() => {
    const node = chooseOpponentMove(session, random);
    if (!node) {
      return;
    }
    const timer = setTimeout(() => dispatch({ type: 'opponentMoved', node }), delayMs);
    return () => clearTimeout(timer);
  }, [session, dispatch, delayMs, random]);
};
