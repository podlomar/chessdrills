import { describe, expect, it } from 'vitest';
import { positionFromFen } from '@/chess/position.ts';
import type { Move } from '@/chess/types.ts';
import { compileOpening } from '@/openings/compile.ts';
import { compileLibrary } from '@/openings/library/index.ts';
import type { LineSpec, OpeningSpec } from '@/openings/spec.ts';
import type { Opening } from '@/openings/tree.ts';
import { seededRandom } from '@/testing/seededRandom.ts';
import { pickWeighted, type Random } from '@/trainer/pick.ts';
import {
  breadcrumb,
  currentNode,
  currentPosition,
  expectedMoves,
  visibleNotes,
} from '@/trainer/selectors.ts';
import { type Session, sessionReducer, startSession } from '@/trainer/session.ts';

const opening = (lines: readonly LineSpec[], side: OpeningSpec['side'] = 'white'): Opening =>
  compileOpening({ id: 'test', name: 'Test', side, lines })._unsafeUnwrap();

const ruyOrSicilian = opening([
  { moves: 'e4 e5', note: { name: 'Open Game' } },
  { moves: 'e4 e5 Nf3 Nc6 Bb5', note: { name: 'Ruy Lopez', comment: 'Pressure on e5.' } },
  { moves: 'e4 e5 Nf3 d6 d4' },
  { moves: 'e4 c5', note: { name: 'Sicilian' } },
  { moves: 'e4 c5 Nf3' },
  { moves: 'e4 c5 Nc3' },
]);

const moveOf = (session: Session, san: string): Move => {
  const move = currentPosition(session).playSan(san)?.move;
  if (!move) {
    throw new Error(`${san} is illegal here`);
  }
  return move;
};

const player = (session: Session, san: string): Session =>
  sessionReducer(session, { type: 'playerMoved', move: moveOf(session, san) });

const opponent = (session: Session, san: string): Session => {
  const node = currentNode(session).children.find((child) => child.move.san === san);
  if (!node) {
    throw new Error(`${san} is not in the tree here`);
  }
  return sessionReducer(session, { type: 'opponentMoved', node });
};

const sans = (session: Session): string[] => session.path.map((node) => node.move.san);

const playThrough = (start: Session, random: Random): Session => {
  let session = start;
  while (session.phase.kind !== 'lineComplete') {
    const choices = currentNode(session).children;
    if (session.phase.kind === 'opponentToMove') {
      const node = pickWeighted(choices, random);
      if (!node) {
        throw new Error('opponent has no move');
      }
      session = sessionReducer(session, { type: 'opponentMoved', node });
    } else {
      const expected = expectedMoves(session)[0];
      if (!expected) {
        throw new Error('player has no move');
      }
      session = sessionReducer(session, { type: 'playerMoved', move: expected.move });
    }
  }
  return session;
};

describe('startSession', () => {
  it('lets White move first when you play White', () => {
    const session = startSession(ruyOrSicilian);
    expect(session).toMatchObject({ path: [], phase: { kind: 'playerToMove' }, mistakes: 0 });
  });

  it('lets the opponent move first when you play Black', () => {
    const session = startSession(opening([{ moves: 'e4 c6' }], 'black'));
    expect(session.phase.kind).toBe('opponentToMove');
  });
});

describe('sessionReducer', () => {
  it('accepts a repertoire move and hands the turn to the opponent', () => {
    const session = player(startSession(ruyOrSicilian), 'e4');
    expect(sans(session)).toEqual(['e4']);
    expect(session.phase.kind).toBe('opponentToMove');
  });

  it('continues after the opponent picks a branch', () => {
    const session = opponent(player(startSession(ruyOrSicilian), 'e4'), 'c5');
    expect(sans(session)).toEqual(['e4', 'c5']);
    expect(session.phase.kind).toBe('playerToMove');
  });

  it('accepts any of several repertoire moves', () => {
    const afterC5 = opponent(player(startSession(ruyOrSicilian), 'e4'), 'c5');
    expect(sans(player(afterC5, 'Nf3'))).toEqual(['e4', 'c5', 'Nf3']);
    expect(sans(player(afterC5, 'Nc3'))).toEqual(['e4', 'c5', 'Nc3']);
  });

  it('records a mistake without changing the path', () => {
    const start = startSession(ruyOrSicilian);
    const session = player(start, 'd4');
    expect(session.path).toBe(start.path);
    expect(session.phase).toMatchObject({ kind: 'mistake', attempted: { san: 'd4' } });
    expect(session.mistakes).toBe(1);
  });

  it('lets the player try again after dismissing a mistake', () => {
    const dismissed = sessionReducer(player(startSession(ruyOrSicilian), 'd4'), {
      type: 'dismissMistake',
    });
    expect(dismissed.phase.kind).toBe('playerToMove');
    expect(dismissed.mistakes).toBe(1);
    expect(sans(player(dismissed, 'e4'))).toEqual(['e4']);
  });

  it('completes the line after the player’s last move', () => {
    const session = player(opponent(player(startSession(ruyOrSicilian), 'e4'), 'c5'), 'Nf3');
    expect(session.phase.kind).toBe('lineComplete');
  });

  it('completes the line after the opponent’s last move', () => {
    const blackLine = startSession(opening([{ moves: 'e4 c6 d4' }], 'black'));
    const session = opponent(player(opponent(blackLine, 'e4'), 'c6'), 'd4');
    expect(sans(session)).toEqual(['e4', 'c6', 'd4']);
    expect(session.phase.kind).toBe('lineComplete');
  });

  it('ignores actions that do not fit the phase', () => {
    const start = startSession(ruyOrSicilian);
    const afterE4 = player(start, 'e4');
    const strayNode = currentNode(afterE4).children[0];
    expect(strayNode).toBeDefined();
    if (!strayNode) {
      return;
    }

    expect(sessionReducer(start, { type: 'opponentMoved', node: strayNode })).toBe(start);
    expect(sessionReducer(start, { type: 'dismissMistake' })).toBe(start);
    expect(sessionReducer(afterE4, { type: 'playerMoved', move: moveOf(afterE4, 'e5') })).toBe(
      afterE4,
    );
    const afterE5 = opponent(afterE4, 'e5');
    const afterNf3 = player(afterE5, 'Nf3');
    expect(sessionReducer(afterNf3, { type: 'opponentMoved', node: strayNode })).toBe(afterNf3);
  });

  it('restarts from the root with a clean slate', () => {
    const played = player(player(startSession(ruyOrSicilian), 'd4'), 'e4');
    expect(sessionReducer(played, { type: 'restart' })).toMatchObject({
      path: [],
      phase: { kind: 'playerToMove' },
      mistakes: 0,
    });
  });

  it('never mutates the session it is given', () => {
    const start = startSession(ruyOrSicilian);
    const snapshot = { path: [...start.path], phase: { ...start.phase }, mistakes: start.mistakes };
    player(start, 'e4');
    player(start, 'd4');
    sessionReducer(start, { type: 'restart' });
    expect({ path: start.path, phase: start.phase, mistakes: start.mistakes }).toEqual(snapshot);
  });
});

describe('selectors', () => {
  it('follows the current node and position', () => {
    const session = opponent(player(startSession(ruyOrSicilian), 'e4'), 'e5');
    expect(currentNode(session).id).toBe('e4 e5');
    expect(currentPosition(session).fen).toBe(
      'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
    );
  });

  it('expects moves only while it is the player’s turn', () => {
    const start = startSession(ruyOrSicilian);
    expect(expectedMoves(start).map((node) => node.move.san)).toEqual(['e4']);
    expect(expectedMoves(player(start, 'd4')).map((node) => node.move.san)).toEqual(['e4']);
    expect(expectedMoves(player(start, 'e4'))).toEqual([]);
  });

  it('collects names and notes along the path', () => {
    const session = player(
      opponent(player(opponent(player(startSession(ruyOrSicilian), 'e4'), 'e5'), 'Nf3'), 'Nc6'),
      'Bb5',
    );
    expect(breadcrumb(session)).toEqual(['Open Game', 'Ruy Lopez']);
    expect(visibleNotes(session)).toEqual([
      { name: 'Open Game' },
      { name: 'Ruy Lopez', comment: 'Pressure on e5.' },
    ]);
  });
});

describe('playing through the library with a seeded RNG', () => {
  const library = compileLibrary()._unsafeUnwrap();

  it.each(library.map((entry) => [entry.id, entry] as const))(
    'always reaches the end of a %s line without mistakes',
    (_, entry) => {
      for (let seed = 1; seed <= 50; seed += 1) {
        const done = playThrough(startSession(entry), seededRandom(seed));
        expect(done.mistakes).toBe(0);
        expect(currentNode(done).children).toEqual([]);
      }
    },
  );

  it('replays every move of a finished line to the stored positions', () => {
    const [sicilian] = library;
    if (!sicilian) {
      throw new Error('library is empty');
    }
    const done = playThrough(startSession(sicilian), seededRandom(3));
    let position = positionFromFen(sicilian.root.fen);
    for (const node of done.path) {
      const played = position.playSan(node.move.san);
      expect(played?.position.fen).toBe(node.fen);
      position = played?.position ?? position;
    }
  });

  it('is deterministic for a given seed', () => {
    const [sicilian] = library;
    if (!sicilian) {
      throw new Error('library is empty');
    }
    const line = (seed: number) => sans(playThrough(startSession(sicilian), seededRandom(seed)));
    expect(line(11)).toEqual(line(11));
  });

  it('shows the Najdorf breadcrumb when the opponent heads there', () => {
    const [sicilian] = library;
    if (!sicilian) {
      throw new Error('library is empty');
    }
    const lines = Array.from({ length: 50 }, (_, index) =>
      playThrough(startSession(sicilian), seededRandom(index + 1)),
    );
    const najdorf = lines.find((session) => breadcrumb(session).includes('Najdorf Variation'));
    expect(najdorf && breadcrumb(najdorf).slice(0, 3)).toEqual([
      'Sicilian Defence',
      'Open Sicilian',
      'Najdorf Variation',
    ]);
  });
});
