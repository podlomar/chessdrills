import type { Color, Fen, Move } from '@/chess/types.ts';
import type { Annotation } from '@/openings/spec.ts';

// The SAN path from the root, e.g. "" or "e4 c5 Nf3": readable in tests and stable enough to key stats by.
export type NodeId = string;

export interface PositionNode {
  id: NodeId;
  fen: Fen;
  ply: number;
  annotation?: Annotation;
  children: readonly MoveNode[];
}

export interface MoveNode extends PositionNode {
  parentId: NodeId;
  move: Move;
  weight: number;
}

export interface Opening {
  id: string;
  name: string;
  side: Color;
  description?: string;
  root: PositionNode;
  nodes: ReadonlyMap<NodeId, PositionNode>;
}
