import { err, ok, type Result } from 'neverthrow';
import { type Position, positionFromFen } from '@/chess/position.ts';
import type { Move } from '@/chess/types.ts';
import type { OpeningError } from '@/openings/errors.ts';
import { parseMoves } from '@/openings/moves.ts';
import type { Annotation, LineSpec, OpeningSpec } from '@/openings/spec.ts';
import type { MoveNode, NodeId, Opening, PositionNode } from '@/openings/tree.ts';

interface DraftNode {
  id: NodeId;
  position: Position;
  ply: number;
  annotation?: Annotation;
  children: DraftMove[];
}

interface DraftMove extends DraftNode {
  move: Move;
  weight?: number;
}

const childId = (parent: DraftNode, move: Move): NodeId =>
  parent.id === '' ? move.san : `${parent.id} ${move.san}`;

const compileLines = (
  parent: DraftNode,
  lines: readonly LineSpec[],
): Result<void, OpeningError> => {
  for (const line of lines) {
    const compiled = compileLine(parent, line);
    if (compiled.isErr()) {
      return compiled;
    }
  }
  return ok();
};

const compileLine = (parent: DraftNode, line: LineSpec): Result<void, OpeningError> => {
  const sans = parseMoves(line.moves);
  if (sans.length === 0) {
    return err({ kind: 'emptyLine' });
  }
  let node = parent;
  for (const [index, san] of sans.entries()) {
    const played = node.position.playSan(san);
    if (!played) {
      return err({ kind: 'illegalMove', san });
    }
    const child: DraftMove = {
      id: childId(node, played.move),
      position: played.position,
      ply: node.ply + 1,
      move: played.move,
      weight: index === 0 ? line.weight : undefined,
      children: [],
    };
    node.children.push(child);
    node = child;
  }
  node.annotation = line.note;
  return compileLines(node, line.branches ?? []);
};

const freezeChildren = (parent: DraftNode): readonly MoveNode[] =>
  parent.children.map((child) => ({
    id: child.id,
    fen: child.position.fen,
    ply: child.ply,
    annotation: child.annotation,
    children: freezeChildren(child),
    parentId: parent.id,
    move: child.move,
    weight: child.weight ?? 1,
  }));

const indexNodes = (root: PositionNode): ReadonlyMap<NodeId, PositionNode> => {
  const nodes = new Map<NodeId, PositionNode>();
  const visit = (node: PositionNode): void => {
    nodes.set(node.id, node);
    node.children.forEach(visit);
  };
  visit(root);
  return nodes;
};

export const compileOpening = (spec: OpeningSpec): Result<Opening, OpeningError> => {
  const draft: DraftNode = {
    id: '',
    position: positionFromFen(spec.startFen),
    ply: 0,
    children: [],
  };
  return compileLines(draft, spec.lines).map(() => {
    const root: PositionNode = {
      id: draft.id,
      fen: draft.position.fen,
      ply: draft.ply,
      children: freezeChildren(draft),
    };
    return {
      id: spec.id,
      name: spec.name,
      side: spec.side,
      description: spec.description,
      root,
      nodes: indexNodes(root),
    };
  });
};
