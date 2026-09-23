export type OpeningError =
  | { kind: 'emptyLine' }
  | { kind: 'illegalMove'; san: string }
  | { kind: 'conflictingNote' }
  | { kind: 'conflictingWeight' };
