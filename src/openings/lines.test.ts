import { describe, expect, it } from 'vitest';
import { compileOpening } from '@/openings/compile.ts';
import { findLine, listLines } from '@/openings/lines.ts';
import type { LineSpec } from '@/openings/spec.ts';
import type { Opening } from '@/openings/tree.ts';

const opening = (lines: readonly LineSpec[], startFen?: string): Opening =>
  compileOpening({ id: 't', name: 'Test Opening', side: 'white', startFen, lines })._unsafeUnwrap();

const labels = (subject: Opening): string[] => listLines(subject).map((line) => line.label);

describe('listLines', () => {
  it('lists one line per leaf, identified by the leaf’s node id', () => {
    const subject = opening([{ moves: 'e4', branches: [{ moves: 'e5 Nf3' }, { moves: 'c5' }] }]);
    const lines = listLines(subject);
    expect(lines.map((line) => line.id)).toEqual(['e4 e5 Nf3', 'e4 c5']);
    expect(lines[0]?.path.map((node) => node.move.san)).toEqual(['e4', 'e5', 'Nf3']);
  });

  it('labels a line by its deepest name', () => {
    const subject = opening([
      {
        moves: 'e4 c5',
        note: { name: 'Sicilian' },
        branches: [{ moves: 'Nf3', note: { name: 'Open' } }],
      },
    ]);
    expect(labels(subject)).toEqual(['Open']);
  });

  it('adds the first moves after the named position, numbered', () => {
    const subject = opening([
      { moves: 'e4 c5', note: { name: 'Sicilian' }, branches: [{ moves: 'Nf3 d6 d4 cxd4 Nxd4' }] },
    ]);
    expect(labels(subject)).toEqual(['Sicilian: 2.Nf3 d6 3.d4 cxd4 …']);
  });

  it('falls back to the opening name when nothing on the path is named', () => {
    expect(labels(opening([{ moves: 'e4 e5' }]))).toEqual(['Test Opening: 1.e4 e5']);
  });

  it('spells out the whole tail when short labels would collide', () => {
    const subject = opening([
      {
        moves: 'e4 e5',
        note: { name: 'Open Game' },
        branches: [
          { moves: 'Nf3 Nc6 Bc4 Bc5 c3' },
          { moves: 'Nf3 Nc6 Bc4 Bc5 O-O' },
          { moves: 'd4' },
        ],
      },
    ]);
    expect(labels(subject)).toEqual([
      'Open Game: 2.Nf3 Nc6 3.Bc4 Bc5 4.c3',
      'Open Game: 2.Nf3 Nc6 3.Bc4 Bc5 4.O-O',
      'Open Game: 2.d4',
    ]);
  });

  it('numbers from a custom start position', () => {
    const afterE4 = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1';
    expect(labels(opening([{ moves: 'c5 Nf3' }], afterE4))).toEqual(['Test Opening: 1...c5 2.Nf3']);
  });

  it('is empty for an opening without moves', () => {
    expect(listLines(opening([]))).toEqual([]);
  });
});

describe('findLine', () => {
  const subject = opening([{ moves: 'e4', branches: [{ moves: 'e5' }, { moves: 'c5' }] }]);

  it('finds a line by its leaf id', () => {
    expect(findLine(subject, 'e4 c5')?.path.map((node) => node.move.san)).toEqual(['e4', 'c5']);
  });

  it('rejects ids that are not the end of a line', () => {
    expect(findLine(subject, 'e4')).toBeUndefined();
    expect(findLine(subject, 'd4')).toBeUndefined();
  });
});
