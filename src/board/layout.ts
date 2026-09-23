import type { File, Rank, Square } from '@/chess/types.ts';

export type SquareTone = 'light' | 'dark';

export interface BoardSquare {
  square: Square;
  tone: SquareTone;
}

const files: readonly File[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks: readonly Rank[] = ['1', '2', '3', '4', '5', '6', '7', '8'];

const toneOf = (fileIndex: number, rankIndex: number): SquareTone =>
  (fileIndex + rankIndex) % 2 === 0 ? 'dark' : 'light';

export const layoutSquares = (): readonly BoardSquare[] =>
  [...ranks].reverse().flatMap((rank) =>
    files.map((file) => ({
      square: `${file}${rank}` as const,
      tone: toneOf(files.indexOf(file), ranks.indexOf(rank)),
    })),
  );
