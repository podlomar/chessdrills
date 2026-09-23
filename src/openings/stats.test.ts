import { describe, expect, it } from 'vitest';
import { compileOpening } from '@/openings/compile.ts';
import type { LineSpec } from '@/openings/spec.ts';
import { countLines } from '@/openings/stats.ts';

const lines = (specs: readonly LineSpec[]): number =>
  countLines(compileOpening({ id: 't', name: 'T', side: 'white', lines: specs })._unsafeUnwrap());

describe('countLines', () => {
  it('counts one line per leaf', () => {
    expect(lines([{ moves: 'e4 e5' }])).toBe(1);
    expect(lines([{ moves: 'e4', branches: [{ moves: 'e5' }, { moves: 'c5 Nf3' }] }])).toBe(2);
  });

  it('counts merged prefixes once', () => {
    expect(lines([{ moves: 'e4 e5' }, { moves: 'e4 e5 Nf3' }, { moves: 'e4 c5' }])).toBe(2);
  });

  it('is zero for an opening without moves', () => {
    expect(lines([])).toBe(0);
  });
});
