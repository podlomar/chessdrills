import { positionFromFen } from '@/chess/position.ts';
import type { Move } from '@/chess/types.ts';
import type { MoveNode, Opening, PositionNode } from '@/openings/tree.ts';

export type Phase =
  | { kind: 'playerToMove' }
  | { kind: 'opponentToMove' }
  | { kind: 'mistake'; attempted: Move }
  | { kind: 'lineComplete' };

export interface Session {
  opening: Opening;
  path: readonly MoveNode[];
  phase: Phase;
  mistakes: number;
}

export type SessionAction =
  | { type: 'playerMoved'; move: Move }
  | { type: 'opponentMoved'; node: MoveNode }
  | { type: 'dismissMistake' }
  | { type: 'restart' };

const phaseAt = (opening: Opening, node: PositionNode): Phase => {
  if (node.children.length === 0) {
    return { kind: 'lineComplete' };
  }
  const turn = positionFromFen(node.fen).turn;
  return { kind: turn === opening.side ? 'playerToMove' : 'opponentToMove' };
};

export const startSession = (opening: Opening): Session => ({
  opening,
  path: [],
  phase: phaseAt(opening, opening.root),
  mistakes: 0,
});

export const sessionReducer = (session: Session, action: SessionAction): Session => {
  switch (action.type) {
    case 'restart':
      return startSession(session.opening);
    default:
      return session;
  }
};
