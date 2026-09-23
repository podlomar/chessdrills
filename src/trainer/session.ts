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

const currentOf = (session: Session): PositionNode => session.path.at(-1) ?? session.opening.root;

const advance = (session: Session, node: MoveNode): Session => ({
  ...session,
  path: [...session.path, node],
  phase: phaseAt(session.opening, node),
});

const playerMoved = (session: Session, move: Move): Session => {
  if (session.phase.kind !== 'playerToMove') {
    return session;
  }
  const node = currentOf(session).children.find((child) => child.move.san === move.san);
  if (!node) {
    return {
      ...session,
      phase: { kind: 'mistake', attempted: move },
      mistakes: session.mistakes + 1,
    };
  }
  return advance(session, node);
};

const opponentMoved = (session: Session, node: MoveNode): Session =>
  session.phase.kind === 'opponentToMove' && node.parentId === currentOf(session).id
    ? advance(session, node)
    : session;

export const sessionReducer = (session: Session, action: SessionAction): Session => {
  switch (action.type) {
    case 'playerMoved':
      return playerMoved(session, action.move);
    case 'opponentMoved':
      return opponentMoved(session, action.node);
    case 'dismissMistake':
      return session.phase.kind === 'mistake'
        ? { ...session, phase: { kind: 'playerToMove' } }
        : session;
    case 'restart':
      return startSession(session.opening);
  }
};
