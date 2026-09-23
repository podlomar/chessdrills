import { describe, expect, it } from 'vitest';
import { compileOpening } from '@/openings/compile.ts';
import type { OpeningError } from '@/openings/errors.ts';
import { parseMoves } from '@/openings/moves.ts';
import type { Annotation, LineSpec, OpeningSpec } from '@/openings/spec.ts';
import type { MoveNode, Opening } from '@/openings/tree.ts';

const spec = (lines: readonly LineSpec[], extra: Partial<OpeningSpec> = {}): OpeningSpec => ({
  id: 'test-opening',
  name: 'Test Opening',
  side: 'white',
  lines,
  ...extra,
});

const compile = (lines: readonly LineSpec[], extra: Partial<OpeningSpec> = {}): Opening =>
  compileOpening(spec(lines, extra))._unsafeUnwrap();

const compileError = (lines: readonly LineSpec[], extra: Partial<OpeningSpec> = {}): OpeningError =>
  compileOpening(spec(lines, extra))._unsafeUnwrapErr();

const childSans = (opening: Opening, id: string): string[] =>
  opening.nodes.get(id)?.children.map((child) => child.move.san) ?? [];

const moveNode = (opening: Opening, id: string): MoveNode | undefined => {
  const parentId = id.split(' ').slice(0, -1).join(' ');
  return opening.nodes.get(parentId)?.children.find((child) => child.id === id);
};

describe('parseMoves', () => {
  it('splits SAN on any whitespace', () => {
    expect(parseMoves('  e4  c5\nNf3\td6 ')).toEqual(['e4', 'c5', 'Nf3', 'd6']);
  });

  it('strips move numbers in every common form', () => {
    expect(parseMoves('1. e4 c5 2.Nf3 2... d6 3.d4 3…cxd4 4...Nxd4')).toEqual([
      'e4',
      'c5',
      'Nf3',
      'd6',
      'd4',
      'cxd4',
      'Nxd4',
    ]);
  });

  it('returns nothing for blank input', () => {
    expect(parseMoves('   ')).toEqual([]);
  });
});

describe('compileOpening', () => {
  it('copies the opening metadata', () => {
    const opening = compile([{ moves: 'e4' }], { description: 'A test.', side: 'black' });
    expect(opening).toMatchObject({
      id: 'test-opening',
      name: 'Test Opening',
      side: 'black',
      description: 'A test.',
    });
  });

  it('builds one node per position, keyed by SAN path', () => {
    const opening = compile([{ moves: '1.e4 c5 2.Nf3' }]);

    expect([...opening.nodes.keys()]).toEqual(['', 'e4', 'e4 c5', 'e4 c5 Nf3']);
    expect(opening.root).toMatchObject({ id: '', ply: 0 });
    expect(opening.root.fen).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    expect(moveNode(opening, 'e4 c5 Nf3')).toMatchObject({
      parentId: 'e4 c5',
      ply: 3,
      fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
      move: { from: 'g1', to: 'f3', san: 'Nf3', piece: { color: 'white', kind: 'knight' } },
    });
  });

  it('normalizes SAN, so node ids never carry check marks from the source', () => {
    const opening = compile([{ moves: 'e4 f5 Qh5' }]);
    expect(opening.nodes.has('e4 f5 Qh5+')).toBe(true);
  });

  it('continues branches from the end of their parent segment', () => {
    const opening = compile([
      { moves: 'e4 c5', branches: [{ moves: 'Nf3 d6' }, { moves: 'Nc3 Nc6' }] },
    ]);
    expect(childSans(opening, 'e4 c5')).toEqual(['Nf3', 'Nc3']);
    expect(opening.nodes.has('e4 c5 Nc3 Nc6')).toBe(true);
  });

  it('attaches a note to the position at the end of its segment', () => {
    const opening = compile([{ moves: 'e4 c5', note: { name: 'Sicilian Defence' } }]);
    expect(opening.nodes.get('e4')?.annotation).toBeUndefined();
    expect(opening.nodes.get('e4 c5')?.annotation).toEqual({ name: 'Sicilian Defence' });
  });

  it('starts from a custom FEN', () => {
    const afterE4 = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1';
    const opening = compile([{ moves: 'c5' }], { startFen: afterE4, side: 'black' });
    expect(opening.root.fen).toBe(afterE4);
    expect(childSans(opening, '')).toEqual(['c5']);
  });
});

describe('merging', () => {
  it('merges siblings that start with the same move', () => {
    const opening = compile([{ moves: 'e4 c5 Nf3' }, { moves: 'e4 c5 Nc3' }, { moves: 'e4 e5' }]);
    expect(childSans(opening, '')).toEqual(['e4']);
    expect(childSans(opening, 'e4')).toEqual(['c5', 'e5']);
    expect(childSans(opening, 'e4 c5')).toEqual(['Nf3', 'Nc3']);
  });

  it('compiles flat and nested spellings of a repertoire to the same tree', () => {
    const flat = compile([
      { moves: 'e4 c5', note: { name: 'Sicilian' } },
      { moves: 'e4 c5 Nf3 d6' },
      { moves: 'e4 c5 Nf3 Nc6' },
    ]);
    const nested = compile([
      {
        moves: 'e4 c5',
        note: { name: 'Sicilian' },
        branches: [{ moves: 'Nf3', branches: [{ moves: 'd6' }, { moves: 'Nc6' }] }],
      },
    ]);
    expect(nested.root).toEqual(flat.root);
  });

  it('accepts the same note written twice', () => {
    const note: Annotation = {
      name: 'Najdorf',
      links: [{ kind: 'video', label: 'Intro', url: 'https://x' }],
    };
    const opening = compile([
      { moves: 'e4 c5', note: { ...note } },
      { moves: 'e4 c5', note: { links: [...(note.links ?? [])], name: 'Najdorf' } },
    ]);
    expect(opening.nodes.get('e4 c5')?.annotation?.name).toBe('Najdorf');
  });

  it('keeps a note when a merged line has none', () => {
    const opening = compile([
      { moves: 'e4 c5', note: { name: 'Sicilian' } },
      { moves: 'e4 c5 Nf3' },
    ]);
    expect(opening.nodes.get('e4 c5')?.annotation).toEqual({ name: 'Sicilian' });
  });
});

describe('weights', () => {
  it('defaults to 1', () => {
    const opening = compile([{ moves: 'e4 c5' }]);
    expect(moveNode(opening, 'e4')?.weight).toBe(1);
  });

  it('applies to the first move of the segment only', () => {
    const opening = compile([{ moves: 'e4', branches: [{ moves: 'c5 Nf3', weight: 3 }] }]);
    expect(moveNode(opening, 'e4 c5')?.weight).toBe(3);
    expect(moveNode(opening, 'e4 c5 Nf3')?.weight).toBe(1);
  });

  it('survives merging with a line that leaves the weight out', () => {
    const opening = compile([
      { moves: 'e4', branches: [{ moves: 'c5 Nf3' }, { moves: 'c5 Nc3', weight: 2 }] },
    ]);
    expect(moveNode(opening, 'e4 c5')?.weight).toBe(2);
  });
});

describe('errors', () => {
  it('reports an illegal move deep in a line with the opening id and full path', () => {
    const error = compileError([
      {
        moves: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3',
        branches: [{ moves: 'a6 Be3 e5 Nb3 Be7 f3 Nf6' }],
      },
    ]);
    expect(error).toMatchObject({
      kind: 'illegalMove',
      san: 'Nf6',
      openingId: 'test-opening',
      path: [
        'e4',
        'c5',
        'Nf3',
        'd6',
        'd4',
        'cxd4',
        'Nxd4',
        'Nf6',
        'Nc3',
        'a6',
        'Be3',
        'e5',
        'Nb3',
        'Be7',
        'f3',
      ],
    });
    expect(error.message).toBe(
      'test-opening: illegal move 8...Nf6 after 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Be3 e5 7.Nb3 Be7 8.f3',
    );
  });

  it('reports an illegal first move', () => {
    expect(compileError([{ moves: 'e5' }]).message).toBe(
      'test-opening: illegal move 1.e5 after the start',
    );
  });

  it('numbers moves from a custom start position', () => {
    const afterE4 = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1';
    expect(compileError([{ moves: 'c5 Nf3 Nf3' }], { startFen: afterE4 }).message).toBe(
      'test-opening: illegal move 2...Nf3 after 1...c5 2.Nf3',
    );
  });

  it('rejects an invalid start FEN', () => {
    expect(compileError([{ moves: 'e4' }], { startFen: 'not a fen' })).toMatchObject({
      kind: 'invalidStartFen',
      message: 'test-opening: invalid start FEN "not a fen"',
    });
  });

  it('rejects an empty segment', () => {
    expect(compileError([{ moves: 'e4', branches: [{ moves: ' ' }] }])).toMatchObject({
      kind: 'emptyLine',
      path: ['e4'],
      message: 'test-opening: empty line after 1.e4',
    });
  });

  it('rejects conflicting notes on a merged position', () => {
    expect(
      compileError([
        { moves: 'e4 c5', note: { name: 'Sicilian' } },
        { moves: 'e4 c5', note: { name: 'Sicilian Defence' } },
      ]),
    ).toMatchObject({
      kind: 'conflictingNote',
      path: ['e4', 'c5'],
      message: 'test-opening: conflicting notes at 1.e4 c5',
    });
  });

  it('rejects conflicting explicit weights on a merged move', () => {
    expect(
      compileError([
        {
          moves: 'e4',
          branches: [
            { moves: 'c5', weight: 2 },
            { moves: 'c5 Nf3', weight: 3 },
          ],
        },
      ]),
    ).toMatchObject({
      kind: 'conflictingWeight',
      path: ['e4', 'c5'],
      message: 'test-opening: conflicting weights for 1...c5 in 1.e4 c5',
    });
  });
});
