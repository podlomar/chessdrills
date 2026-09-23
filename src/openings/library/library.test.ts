import { describe, expect, it } from 'vitest';
import { compileOpening } from '@/openings/compile.ts';
import { compileLibrary, openingSpecs } from '@/openings/library/index.ts';
import type { PositionNode } from '@/openings/tree.ts';

const allNodes = (root: PositionNode): PositionNode[] => [root, ...root.children.flatMap(allNodes)];

describe('opening library', () => {
  it.each(openingSpecs.map((spec) => [spec.id, spec] as const))('compiles %s', (_, spec) => {
    const compiled = compileOpening(spec);
    expect(compiled.isErr() ? compiled.error.message : 'ok').toBe('ok');
  });

  it('gives every opening a unique id', () => {
    const ids = openingSpecs.map((spec) => spec.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('compiles as a whole, in index order', () => {
    const openings = compileLibrary()._unsafeUnwrap();
    expect(openings.map((opening) => opening.id)).toEqual(openingSpecs.map((spec) => spec.id));
  });

  it('only uses positive weights, so every branch can be picked', () => {
    const weights = compileLibrary()
      ._unsafeUnwrap()
      .flatMap((opening) => allNodes(opening.root))
      .flatMap((node) => node.children.map((child) => child.weight));
    expect(weights.every((weight) => Number.isFinite(weight) && weight > 0)).toBe(true);
  });
});
