import type { Opening, PositionNode } from '@/openings/tree.ts';

const countLeaves = (node: PositionNode): number =>
  node.children.length === 0
    ? 1
    : node.children.reduce((sum, child) => sum + countLeaves(child), 0);

export const countLines = (opening: Opening): number =>
  opening.root.children.length === 0 ? 0 : countLeaves(opening.root);
