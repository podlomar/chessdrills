import { positionFromFen } from '@/chess/position.ts';
import { formatMove, type MoveCounter } from '@/openings/notation.ts';
import type { MoveNode, NodeId, Opening, PositionNode } from '@/openings/tree.ts';

export interface OpeningLine {
  id: NodeId;
  path: readonly MoveNode[];
  label: string;
}

const SHORT_TAIL_PLIES = 4;

const leafPaths = (node: PositionNode, path: readonly MoveNode[]): (readonly MoveNode[])[] =>
  node.children.length === 0
    ? [path]
    : node.children.flatMap((child) => leafPaths(child, [...path, child]));

const deepestNamed = (path: readonly MoveNode[]): number =>
  path.findLastIndex((node) => node.annotation?.name !== undefined);

const formatTail = (
  path: readonly MoveNode[],
  from: number,
  start: MoveCounter,
  plies: number,
): string => {
  const tail = path
    .slice(from, from + plies)
    .map((node, index) => formatMove(node.move.san, from + index, start, index === 0));
  return from + plies < path.length ? `${tail.join(' ')} …` : tail.join(' ');
};

const labelOf = (
  opening: Opening,
  path: readonly MoveNode[],
  start: MoveCounter,
  plies: number,
): string => {
  const named = deepestNamed(path);
  const name = path[named]?.annotation?.name ?? opening.name;
  const from = named + 1;
  return from < path.length ? `${name}: ${formatTail(path, from, start, plies)}` : name;
};

export const listLines = (opening: Opening): readonly OpeningLine[] => {
  const root = positionFromFen(opening.root.fen);
  const start = { moveNumber: root.moveNumber, turn: root.turn };
  const paths = opening.root.children.length === 0 ? [] : leafPaths(opening.root, []);
  const short = paths.map((path) => labelOf(opening, path, start, SHORT_TAIL_PLIES));
  return paths.map((path, index) => {
    const label = short[index] ?? '';
    const ambiguous = short.filter((other) => other === label).length > 1;
    return {
      id: path.at(-1)?.id ?? '',
      path,
      label: ambiguous ? labelOf(opening, path, start, path.length) : label,
    };
  });
};

export const findLine = (opening: Opening, id: NodeId): OpeningLine | undefined =>
  listLines(opening).find((line) => line.id === id);
