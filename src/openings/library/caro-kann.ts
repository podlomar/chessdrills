import type { OpeningSpec } from '@/openings/spec.ts';

export const caroKann: OpeningSpec = {
  id: 'caro-kann',
  name: 'Caro-Kann Defence',
  side: 'black',
  description: 'Answer 1.e4 with 1...c6 and 2...d5, against the main White tries.',
  lines: [
    {
      moves: '1.e4 c6',
      note: { name: 'Caro-Kann Defence' },
      branches: [
        {
          moves: '2.d4 d5',
          weight: 5,
          branches: [
            {
              moves: '3.e5 Bf5',
              weight: 3,
              note: {
                name: 'Advance Variation',
                comment: 'Develop the light-squared bishop before ...e6 locks it in.',
              },
              branches: [
                {
                  moves: '4.Nf3 e6 5.Be2 c5 6.Be3 cxd4 7.Nxd4 Ne7',
                  weight: 3,
                  note: { name: 'Short Variation' },
                },
                {
                  moves: '4.Nc3 e6 5.g4 Bg6 6.Nge2 c5 7.h4 h5 8.Nf4',
                  note: { comment: 'Sharp: White gains space on the kingside.' },
                },
                {
                  moves: '4.h4 h5 5.c4 e6 6.Nc3 Ne7',
                },
              ],
            },
            {
              moves:
                '3.Nc3 dxe4 4.Nxe4 Bf5 5.Ng3 Bg6 6.h4 h6 7.Nf3 Nd7 8.h5 Bh7 9.Bd3 Bxd3 10.Qxd3 e6',
              weight: 3,
              note: { name: 'Classical Variation' },
            },
            {
              moves: '3.Nd2 dxe4 4.Nxe4 Bf5 5.Ng3 Bg6',
              note: { comment: 'Usually transposes to the Classical Variation.' },
            },
            {
              moves: '3.exd5 cxd5',
              weight: 2,
              note: { name: 'Exchange Variation' },
              branches: [
                {
                  moves: '4.Bd3 Nc6 5.c3 Nf6 6.Bf4 Bg4 7.Qb3 Qd7 8.Nd2 e6',
                  weight: 2,
                },
                {
                  moves: '4.c4 Nf6 5.Nc3 e6 6.Nf3 Bb4 7.cxd5 Nxd5 8.Qc2',
                  note: { name: 'Panov Attack' },
                },
              ],
            },
          ],
        },
        {
          moves: '2.Nc3 d5 3.Nf3 Bg4 4.h3 Bxf3 5.Qxf3 e6',
          note: { name: 'Two Knights Variation' },
        },
        {
          moves: '2.c4 d5 3.exd5 cxd5 4.cxd5 Nf6',
          note: { name: 'Accelerated Panov Attack' },
        },
      ],
    },
  ],
};
