import { createServer } from 'ionbeam';
import { HomePage } from './pages/HomePage/index.js';
import { SVGBoard } from './chessboard/SVGBoard/index.js';
import { fenToChessBoard } from './chessboard/fen.js';

const app = createServer();

app.get('/', async (req, res) => {
  await req.ionbeam.renderPage("Home", <HomePage />);
});

app.get('/board', async (req, res) => {
  const fen = req.query.fen || 'rn1qkbnr/pppb1ppp/4p3/3p4/3P4/4P3/PPPB1PPP/RN1QKBNR';

  const board = fenToChessBoard(fen as string);
  res.setHeader('Content-Type', 'image/svg+xml');
  await req.ionbeam.renderElement(<SVGBoard board={board} />);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
