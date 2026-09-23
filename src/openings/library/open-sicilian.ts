import type { OpeningSpec } from '@/openings/spec.ts';

export const openSicilian: OpeningSpec = {
  id: 'open-sicilian',
  name: 'Open Sicilian',
  side: 'white',
  description: 'Meet 1...c5 with 2.Nf3 and 3.d4 against the main Black setups.',
  lines: [
    {
      moves: '1.e4 c5',
      note: { name: 'Sicilian Defence' },
      branches: [
        {
          moves: '2.Nf3',
          branches: [
            {
              moves: '2...d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3',
              weight: 3,
              note: { name: 'Open Sicilian' },
              branches: [
                {
                  moves: '5...a6',
                  weight: 3,
                  note: { name: 'Najdorf Variation' },
                  branches: [
                    {
                      moves: '6.Be3',
                      note: {
                        name: 'English Attack',
                        comment: 'Castle long and throw the kingside pawns forward.',
                      },
                      branches: [
                        {
                          moves: '6...e5 7.Nb3 Be6 8.f3 Be7 9.Qd2 O-O 10.O-O-O Nbd7 11.g4',
                          weight: 2,
                        },
                        {
                          moves: '6...Ng4 7.Bg5 h6 8.Bh4 g5 9.Bg3 Bg7',
                          note: { comment: 'Chase the knight away; the bishop retreats to g3.' },
                        },
                      ],
                    },
                  ],
                },
                {
                  moves: '5...g6 6.Be3 Bg7 7.f3 O-O 8.Qd2 Nc6 9.Bc4 Bd7 10.O-O-O',
                  weight: 2,
                  note: {
                    name: 'Dragon Variation, Yugoslav Attack',
                    comment: 'Opposite-side castling: race to open the h-file.',
                  },
                },
                {
                  moves: '5...e6 6.Be2 Be7 7.O-O O-O 8.f4 Nc6 9.Be3',
                  note: { name: 'Scheveningen Variation' },
                },
                {
                  moves: '5...Nc6 6.Bg5 e6 7.Qd2 Be7 8.O-O-O O-O',
                  note: { name: 'Classical Variation, Richter-Rauzer Attack' },
                },
              ],
            },
            {
              moves: '2...Nc6 3.d4 cxd4 4.Nxd4',
              weight: 2,
              branches: [
                {
                  moves: '4...Nf6 5.Nc3 e5 6.Ndb5 d6 7.Bg5 a6 8.Na3 b5 9.Bxf6 gxf6 10.Nd5',
                  weight: 2,
                  note: {
                    name: 'Sveshnikov Variation',
                    comment: 'The d5 outpost is the point of the whole line.',
                  },
                },
                {
                  moves: '4...g6 5.c4 Bg7 6.Be3 Nf6 7.Nc3 O-O 8.Be2 d6 9.O-O',
                  note: { name: 'Accelerated Dragon, Maroczy Bind' },
                },
              ],
            },
            {
              moves: '2...e6 3.d4 cxd4 4.Nxd4',
              branches: [
                {
                  moves: '4...a6 5.Bd3 Nf6 6.O-O Qc7 7.Qe2 d6 8.c4',
                  note: { name: 'Kan Variation' },
                },
                {
                  moves: '4...Nc6 5.Nc3 Qc7 6.Be3 a6 7.Qd2 Nf6 8.O-O-O',
                  note: { name: 'Taimanov Variation' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
