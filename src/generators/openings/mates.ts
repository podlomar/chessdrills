import { register } from '../registry.js';
import type { Position } from '../generator.js';

export const wayward_queen_attack = (): Position => {
  return {
    fen: 'rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2',
    turnColor: 'black',
    randomized: false,
    description: "White's queen came out too early. Play as black and punish the premature attack.",
  };
};

register('wayward_queen_attack', { generate: () => wayward_queen_attack() });
