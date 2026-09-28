import type { MoveNode } from '@/openings/tree.ts';
import { pickWeighted, type Random } from '@/trainer/pick.ts';
import { candidateMoves } from '@/trainer/selectors.ts';
import type { Session } from '@/trainer/session.ts';

export const chooseOpponentMove = (session: Session, random: Random): MoveNode | undefined =>
  session.phase.kind === 'opponentToMove'
    ? pickWeighted(candidateMoves(session), random)
    : undefined;
