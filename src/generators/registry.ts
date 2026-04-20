import { type Generator } from "./generator";

const registry = new Map<string, Generator>();

export const register = (id: string, gen: Generator): void => {
  registry.set(id, gen);
};

export const lookup = (id: string): Generator | null =>
  registry.get(id) ?? null;
