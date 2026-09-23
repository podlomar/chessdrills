export type Random = () => number;

export const pickWeighted = <T extends { weight: number }>(
  items: readonly T[],
  random: Random,
): T | undefined => {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let remaining = random() * total;
  for (const item of items) {
    remaining -= item.weight;
    if (remaining < 0) {
      return item;
    }
  }
  // Floating-point rounding can leave a sliver past the last item.
  return items.at(-1);
};
