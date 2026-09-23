import { describe, expect, it } from 'vitest';
import { seededRandom } from '@/testing/seededRandom.ts';
import { pickWeighted } from '@/trainer/pick.ts';

const items = [
  { id: 'a', weight: 1 },
  { id: 'b', weight: 3 },
];

describe('pickWeighted', () => {
  it('maps the random number onto cumulative weights', () => {
    expect(pickWeighted(items, () => 0)?.id).toBe('a');
    expect(pickWeighted(items, () => 0.249)?.id).toBe('a');
    expect(pickWeighted(items, () => 0.25)?.id).toBe('b');
    expect(pickWeighted(items, () => 0.999999)?.id).toBe('b');
  });

  it('never picks a zero-weight item', () => {
    const withZero = [{ id: 'never', weight: 0 }, ...items];
    expect(pickWeighted(withZero, () => 0)?.id).toBe('a');
  });

  it('returns undefined for no items', () => {
    expect(pickWeighted([], () => 0.5)).toBeUndefined();
  });

  it('picks in proportion to weight', () => {
    const random = seededRandom(42);
    const draws = 10_000;
    const picksOfB = Array.from({ length: draws }, () => pickWeighted(items, random)).filter(
      (item) => item?.id === 'b',
    ).length;
    expect(picksOfB / draws).toBeCloseTo(0.75, 1);
  });

  it('repeats the same picks for the same seed', () => {
    const run = (seed: number) => {
      const random = seededRandom(seed);
      return Array.from({ length: 20 }, () => pickWeighted(items, random)?.id).join('');
    };
    expect(run(7)).toBe(run(7));
    expect(run(7)).not.toBe(run(8));
  });
});
