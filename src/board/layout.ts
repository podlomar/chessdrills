import type { Color, File, Rank, Square } from '@/chess/types.ts';

export type SquareTone = 'light' | 'dark';

export interface BoardSquare {
  square: Square;
  tone: SquareTone;
}

export interface BoardLayout {
  squares: readonly BoardSquare[];
  files: readonly File[];
  ranks: readonly Rank[];
}

const files: readonly File[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks: readonly Rank[] = ['1', '2', '3', '4', '5', '6', '7', '8'];

const toneOf = (fileIndex: number, rankIndex: number): SquareTone =>
  (fileIndex + rankIndex) % 2 === 0 ? 'dark' : 'light';

export const layoutBoard = (orientation: Color): BoardLayout => {
  const rows = orientation === 'white' ? [...ranks].reverse() : ranks;
  const columns = orientation === 'white' ? files : [...files].reverse();
  const squares = rows.flatMap((rank) =>
    columns.map((file) => ({
      square: `${file}${rank}` as const,
      tone: toneOf(files.indexOf(file), ranks.indexOf(rank)),
    })),
  );
  return { squares, files: columns, ranks: rows };
};
