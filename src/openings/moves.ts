const MOVE_NUMBER = /^\d+(\.+|…)/;

export const parseMoves = (text: string): readonly string[] =>
  text
    .split(/\s+/)
    .map((token) => token.replace(MOVE_NUMBER, ''))
    .filter((token) => token !== '');
