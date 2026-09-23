import { type Position, positionFromFen } from '@/chess/position.ts';
import type { Annotation } from '@/openings/spec.ts';
import type { MoveNode, PositionNode } from '@/openings/tree.ts';
import type { Session } from '@/trainer/session.ts';

const nodesOnPath = (session: Session): readonly PositionNode[] => [
  session.opening.root,
  ...session.path,
];

export const currentNode = (session: Session): PositionNode =>
  session.path.at(-1) ?? session.opening.root;

export const currentPosition = (session: Session): Position =>
  positionFromFen(currentNode(session).fen);

export const expectedMoves = (session: Session): readonly MoveNode[] =>
  session.phase.kind === 'playerToMove' || session.phase.kind === 'mistake'
    ? currentNode(session).children
    : [];

export const breadcrumb = (session: Session): readonly string[] =>
  nodesOnPath(session).flatMap((node) => (node.annotation?.name ? [node.annotation.name] : []));

export const visibleNotes = (session: Session): readonly Annotation[] =>
  nodesOnPath(session).flatMap((node) => (node.annotation ? [node.annotation] : []));
