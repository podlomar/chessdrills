import { formatMove, formatMoves, type MoveCounter } from '@/openings/notation.ts';

export type OpeningProblem =
  | { kind: 'invalidStartFen'; fen: string }
  | { kind: 'emptyLine' }
  | { kind: 'illegalMove'; san: string }
  | { kind: 'conflictingNote' }
  | { kind: 'conflictingWeight' };

export type OpeningError = OpeningProblem & {
  openingId: string;
  path: readonly string[];
  message: string;
};

const describe = (problem: OpeningProblem, path: readonly string[], start: MoveCounter): string => {
  const where = path.length > 0 ? formatMoves(path, start) : 'the start';
  switch (problem.kind) {
    case 'invalidStartFen':
      return `invalid start FEN "${problem.fen}"`;
    case 'emptyLine':
      return `empty line after ${where}`;
    case 'illegalMove':
      return `illegal move ${formatMove(problem.san, path.length, start)} after ${where}`;
    case 'conflictingNote':
      return `conflicting notes at ${where}`;
    case 'conflictingWeight':
      return `conflicting weights for ${formatMove(path.at(-1) ?? '', path.length - 1, start)} in ${where}`;
  }
};

export const toOpeningError = (
  openingId: string,
  start: MoveCounter,
  path: readonly string[],
  problem: OpeningProblem,
): OpeningError => ({
  ...problem,
  openingId,
  path,
  message: `${openingId}: ${describe(problem, path, start)}`,
});
