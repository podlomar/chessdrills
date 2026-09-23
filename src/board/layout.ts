import type { Color, File, Rank, Square } from '@/chess/types.ts';

export type SquareTone = 'light' | 'dark';

export interface BoardSquare {
  square: Square;
  tone: SquareTone;
  fileLabel?: File;
  rankLabel?: Rank;
}

const files: readonly File[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks: readonly Rank[] = ['1', '2', '3', '4', '5', '6', '7', '8'];

const toneOf = (fileIndex: number, rankIndex: number): SquareTone =>
  (fileIndex + rankIndex) % 2 === 0 ? 'dark' : 'light';

export const layoutSquares = (orientation: Color): readonly BoardSquare[] => {
  const rows = orientation === 'white' ? [...ranks].reverse() : ranks;
  const columns = orientation === 'white' ? files : [...files].reverse();
  return rows.flatMap((rank, row) =>
    columns.map((file, column) => ({
      square: `${file}${rank}` as const,
      tone: toneOf(files.indexOf(file), ranks.indexOf(rank)),
      fileLabel: row === rows.length - 1 ? file : undefined,
      rankLabel: column === 0 ? rank : undefined,
    })),
  );
};
