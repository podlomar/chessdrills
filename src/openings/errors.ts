export type OpeningError = { kind: 'emptyLine' } | { kind: 'illegalMove'; san: string };
