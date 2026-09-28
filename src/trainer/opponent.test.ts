import { describe, expect, it } from 'vitest';
import { compileOpening } from '@/openings/compile.ts';
import type { MoveNode, Opening } from '@/openings/tree.ts';
import { chooseOpponentMove } from '@/trainer/opponent.ts';
import { currentPosition } from '@/trainer/selectors.ts';
import { type Session, sessionReducer, startSession } from '@/trainer/session.ts';

const opening: Opening = compileOpening({
  id: 'test',
  name: 'Test',
  side: 'white',
  lines: [{ moves: 'e4', branches: [{ moves: 'e5 Nf3 Nc6' }, { moves: 'c5 Nf3 d6', weight: 3 }] }],
})._unsafeUnwrap();

const moveNodeAt = (id: string): MoveNode => {
  const parentId = id.split(' ').slice(0, -1).join(' ');
  const node = opening.nodes.get(parentId)?.children.find((child) => child.id === id);
  if (!node) {
    throw new Error(`no node ${id}`);
  }
  return node;
};

const playE4 = (session: Session): Session => {
  const move = currentPosition(session).playSan('e4')?.move;
  if (!move) {
    throw new Error('e4 is illegal');
  }
  return sessionReducer(session, { type: 'playerMoved', move });
};

describe('chooseOpponentMove', () => {
  it('waits while it is the player’s turn', () => {
    expect(chooseOpponentMove(startSession(opening), () => 0)).toBeUndefined();
  });

  it('picks among the children by weight', () => {
    const session = playE4(startSession(opening));
    expect(chooseOpponentMove(session, () => 0)?.move.san).toBe('e5');
    expect(chooseOpponentMove(session, () => 0.5)?.move.san).toBe('c5');
  });

  it('follows the session’s line instead of picking', () => {
    const line = [moveNodeAt('e4'), moveNodeAt('e4 c5')];
    const session = playE4(startSession(opening, line));
    expect(chooseOpponentMove(session, () => 0)?.move.san).toBe('c5');
  });
});
