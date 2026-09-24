import type { OpeningSpec } from '@/openings/spec.ts';

export const wayward: OpeningSpec = {
  id: 'wayward',
  name: 'Wayward Queen Attack',
  side: 'black',
  description: 'Counter the early queen attack with a solid attack.',
  lines: [
    {
      moves: '1.e4 e5 2.Qh5 Nc6 3.Bc4 g6 4.Qf3 Nf6',
      note: { name: 'Wayward Queen Attack' },
      branches: [
        {
          moves: '5.g4 Nd4',
          note: { name: 'G-file Attack' },
          branches: [
            {
              moves: '6.Qd1 d5',
              weight: 3,
              note: { name: 'Queen Retreat' },
            },
            {
              moves: '6.Qd3 d5',
              weight: 3,
              note: { name: 'Guard on d3' },
            },
            {
              moves: '6.Qc3 Bb4',
              weight: 3,
              note: { name: 'Guard on c3' },
            },
          ],
        },
      ],
    },
  ],
};
