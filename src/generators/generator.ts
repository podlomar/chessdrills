export interface Position {
  fen: string;
  turnColor: 'white' | 'black';
  randomized: boolean;
}

export type Generator = {
  generate: (params: URLSearchParams) => Position;
};
