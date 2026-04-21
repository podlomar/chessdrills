export interface Position {
  fen: string;
  turnColor: 'white' | 'black';
  randomized: boolean;
  description: string;
}

export type Generator = {
  generate: (params: URLSearchParams) => Position;
};
