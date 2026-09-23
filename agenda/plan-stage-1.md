# chessdrills — Stage 1 Development Plan

**chessdrills** is a personal chess training web app. **Goal of stage 1:** a mobile-friendly chessboard you can play on, plus a library of opening lines that the app plays against you, choosing a random branch at each opponent move.

**Constraints:** client-only, no engine, TypeScript + Preact + CSS Modules, no Tailwind. The code should be small, well separated, and readable without walls of comments.

---

## 0. Getting started

Create the repository on GitHub, clone it, and scaffold the app into it:

```sh
gh repo create chessdrills --public --clone \
  --description "Personal chess training: opening drills, positions and patterns"
cd chessdrills
npm create vite@latest . -- --template preact-ts
```

Swap `--public` for `--private` if you prefer. Vite accepts the cloned folder because it only contains `.git`.

**Naming.** The name `chessdrills` is used in these places:

| Where | Value |
|---|---|
| `package.json` `name` | `chessdrills` |
| `<title>` and header wordmark | `chessdrills` |
| Web app manifest | `name` and `short_name`: `chessdrills` |
| `localStorage` keys | prefixed `chessdrills:` (e.g. `chessdrills:theme`) |
| Vite `base` for GitHub Pages | `/chessdrills/` |

The storage prefix matters: every repo deployed at `<user>.github.io` shares one origin, and therefore one `localStorage`.

---

## 1. Stack

| Concern | Choice | Why |
|---|---|---|
| Build | Vite | Fast dev server, first-class Preact + TS + CSS Modules support |
| UI | Preact + hooks | Small, React-compatible, no magic |
| Language | TypeScript, `strict: true` | The types are the documentation |
| Styling | CSS Modules + custom properties | Scoped class names, plain CSS, design tokens in one place |
| Chess rules | `chess.js` behind our own adapter | Battle-tested move generation; we keep it swappable |
| Tests | Vitest | Same config as Vite; test the pure domain logic |
| Quality | Biome | One fast tool for linting and formatting TS, JSON and CSS (with CSS Modules support); formatting is never a review topic |

**The board is hand-built, not chessground.** It's about 200 lines of code, it teaches you CSS Grid, pointer events, and accessibility, and you control every pixel of styling. Tap-to-move comes first (it's the best interaction on phones), and dragging is added later as a separate PR.

---

## 2. Architecture

```
src/
  chess/          pure — adapter over chess.js (types + Position)
  openings/       pure — spec types, compiler, library data
  trainer/        pure — session reducer, weighted picker, selectors
  board/          Preact — Board, Square, Piece, PromotionPicker
  screens/        Preact — FreePlay, Library, Trainer
  ui/             Preact — Button, Panel, ThemeSwitcher, small shared pieces
  theme/          preference model + useTheme hook
  styles/         reset.css, tokens.css, global.css
  app/            App shell + router
  main.tsx
```

**Dependency rules**, enforced by Biome's `noRestrictedImports` rule, scoped per folder with `overrides`:

- `chess/`, `openings/` and `trainer/` never import Preact.
- Only `chess/` imports `chess.js`.
- Components hold no chess logic. They render state and dispatch intents.

```
screens ──► board, ui ──► chess
   │
   └──► trainer ──► openings ──► chess
```

---

## 3. Code conventions

- Named exports only. Each file covers one concept, and files stay short.
- Comments explain **why**, never **what**; the types and names carry the "what".
- Model state with discriminated unions, not boolean flags (`phase.kind`, not `isWaiting && !isDone`).
- Keep side effects (timers, randomness, storage) at the edges and inject them. `Math.random` is passed in, never called inside the domain code.
- CSS: components use only **semantic** tokens from `tokens.css`, never palette colors. Use logical properties (`padding-inline`), avoid magic numbers, and use semantic class names (`.square`, `.selected`, `.lastMove`).
- Accessibility: squares are `<button>`s with labels like `"e4, white knight"`, so the board works with a keyboard and screen reader for free.
- Commits follow Conventional Commits. **Every commit builds and passes the tests.** No PR is a single squash-sized commit.

---

## 4. Theming and dark mode

The page follows the system theme by default, and a switcher in the header lets you override it with **System / Light / Dark**. The board colors are separate tokens that stay the same in both themes for now, so you can tune them later. Their values come from the copper board style in `chess-style/` (see §4.4).

### 4.1 Two token layers

- **Palette**: raw colors named by hue and step (`--gray-12`, `--blue-6`). They are defined once and never used by components.
- **Semantic**: colors named by role (`--color-surface`, `--color-text-muted`). These are the only color tokens components use, so a theme is just a different mapping from roles to palette colors.

Each semantic token is written once with `light-dark()`, and `color-scheme` on `:root` decides which side applies. Forcing a theme is therefore a single declaration. It also themes native scrollbars, form controls and focus rings for free.

```css
:root {
  color-scheme: light dark;

  --gray-0: #ffffff;
  --gray-1: #f6f7f9;
  --gray-2: #eceef2;
  --gray-3: #dde1e7;
  --gray-5: #9aa3ae;
  --gray-7: #5c6570;
  --gray-9: #2a2f36;
  --gray-10: #1d2127;
  --gray-11: #161a1f;
  --gray-12: #0f1215;
  --blue-4: #7aa7ff;
  --blue-6: #2f6fed;
  --green-4: #5fd08a;
  --green-6: #1f9d55;
  --red-4: #ff7b7b;
  --red-6: #d64545;

  --color-bg: light-dark(var(--gray-1), var(--gray-12));
  --color-surface: light-dark(var(--gray-0), var(--gray-11));
  --color-surface-raised: light-dark(var(--gray-0), var(--gray-10));
  --color-border: light-dark(var(--gray-3), var(--gray-9));
  --color-text: light-dark(var(--gray-12), var(--gray-2));
  --color-text-muted: light-dark(var(--gray-7), var(--gray-5));
  --color-accent: light-dark(var(--blue-6), var(--blue-4));
  --color-on-accent: light-dark(var(--gray-0), var(--gray-12));
  --color-success: light-dark(var(--green-6), var(--green-4));
  --color-danger: light-dark(var(--red-6), var(--red-4));
  --color-focus: var(--color-accent);

  --board-light: #ed8d8d;
  --board-dark: #8d6262;
  --board-frame: #4d4545;
  --board-coordinate: #f2b0b0;
  --board-last-move: rgb(255 200 90 / 0.45);
  --board-selected: rgb(255 236 170 / 0.55);
  --board-destination: rgb(45 20 20 / 0.35);
  --board-check: rgb(220 20 20 / 0.9);
  --board-hint: rgb(70 160 255 / 0.85);
}

:root[data-theme='light'] { color-scheme: light; }
:root[data-theme='dark']  { color-scheme: dark; }
```

`light-dark()` works in all current browsers (Chrome 123+, Firefox 120+, Safari 17.5+). That is fine for a personal app, so no fallback is needed.

### 4.2 Dark palette principles

- The background is a very dark blue-gray, not pure black. Pure black against white text causes glare and makes elevation impossible to show.
- Elevation is shown by **lighter surfaces**, not shadows: bg → surface → surface-raised get progressively lighter. Shadows are nearly invisible on dark backgrounds.
- Text is off-white (`--gray-2`), and accents use a lighter, less saturated step (`-4` instead of `-6`) so they don't vibrate on dark backgrounds.
- Every text/background pair must meet WCAG AA contrast (4.5:1). Check this with the browser devtools contrast picker during review.

### 4.3 Theme preference

```ts
export type ThemePreference = 'system' | 'light' | 'dark';

export function parsePreference(value: string | null): ThemePreference;
export function readPreference(storage: Storage | undefined): ThemePreference;
export function writePreference(storage: Storage | undefined, preference: ThemePreference): void;
export function applyPreference(root: HTMLElement, preference: ThemePreference): void;
```

- The preference is stored in `localStorage` under `chessdrills:theme`. This is the only thing stage 1 persists. Access is wrapped in `try/catch`, because storage can be unavailable in private mode, and falls back to `system`.
- `applyPreference` sets `data-theme` on `<html>`, or removes it for `system`.
- A few lines of inline script in `index.html` apply the saved theme **before first paint**, so a dark-mode user never sees a white flash:

```html
<meta name="color-scheme" content="light dark" />
<script>
  try {
    const theme = localStorage.getItem('chessdrills:theme');
    if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
  } catch {}
</script>
```

- The `useTheme()` hook returns `[preference, setPreference]` and keeps the attribute, the storage and the `theme-color` meta tag (the mobile browser bar color) in sync.
- `ThemeSwitcher` is a three-option segmented control built from native radio inputs. It gets keyboard support and screen-reader semantics without extra code.

### 4.4 Board style

The desired look lives in `chess-style/`. The images there are references only. PR 4 moved the piece SVGs and `README.txt` to `src/board/pieces/`.

| File | What it shows |
|---|---|
| `kw.svg`, `qb.svg`, … | The **Merida** piece set: `{k,q,r,b,n,p}{w,b}.svg`, each with a `0 0 50 50` viewBox |
| `README.txt` | Merida attribution: Armando Hernandez Marroquin, GPLv2+, via sharechess.github.io |
| `copper.png` | Squares only: light `#ed8d8d`, dark `#8d6262`, a1 dark |
| `copper_border.png` | The same squares inside a `#4d4545` frame |
| `copper_bg.png` | The frame color alone |

- In the 1200px image the frame is 40px on each side, which is 1/30 of the board's outer size. The app widens it to **1/20** so the coordinates on it stay readable on phones. It scales with the board, so derive it from the board's size, not from a fixed spacing token.
- Rank and file coordinates sit **on the frame**: ranks down the left side and files along the bottom, each centered on its rank or file. They use `--board-coordinate`, a lighter step of the copper pink at 5.15:1 against the frame. The text is 3/4 of the frame's thickness, about 13px on a 390px phone.
- PR 5 tuned the overlays for the copper squares: a warm orange tint for the last move, pale cream for the selection, dark dots and rings for destinations, a red glow for a checked king and a blue inset ring for hints.

---

## 5. Data structures

### 5.1 Chess primitives (`chess/types.ts`)

We use our own vocabulary and translate to and from chess.js inside the adapter.

```ts
export type Color = 'white' | 'black';

export type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
export type Rank = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export type Square = `${File}${Rank}`;

export type PieceKind = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
export type PromotionKind = Exclude<PieceKind, 'pawn' | 'king'>;

export interface Piece {
  color: Color;
  kind: PieceKind;
}

export interface MoveIntent {
  from: Square;
  to: Square;
  promotion?: PromotionKind;
}

export interface Move extends MoveIntent {
  san: string;
  piece: Piece;
  captured?: PieceKind;
  givesCheck: boolean;
}

export type Fen = string;
```

### 5.2 Position (`chess/position.ts`)

`Position` is **immutable**: playing a move returns a new position. Internally chess.js is mutable, so the adapter clones it. The cost is negligible, and in return Preact state updates become trivial and undo is just "keep the previous value".

```ts
export interface Position {
  readonly fen: Fen;
  readonly turn: Color;
  readonly inCheck: boolean;
  readonly isGameOver: boolean;
  pieceAt(square: Square): Piece | undefined;
  legalMovesFrom(square: Square): readonly Move[];
  play(intent: MoveIntent): PlayResult | undefined;
  playSan(san: string): PlayResult | undefined;
}

export interface PlayResult {
  position: Position;
  move: Move;
}

export function positionFromFen(fen?: Fen): Position;
```

### 5.3 Opening lines — two representations

Openings exist in two forms, and a compiler connects them:

1. **`OpeningSpec`**: the *authoring* format, optimized for you to write by hand. It's compact, nested, and uses SAN strings.
2. **`Opening`**: the *runtime* tree, optimized for the program. It has one node per position, with the move, FEN, and children pre-computed.

The compiler replays every move through `Position`. Illegal moves or typos fail loudly at test time, never at training time.

#### Authoring format (`openings/spec.ts`)

A **line spec** is a *segment*: a run of moves with no choices in it, optionally followed by branches. This is basically a radix tree, and it keeps long forced sequences on a single line.

```ts
export interface ResourceLink {
  kind: 'video' | 'article' | 'study';
  label: string;
  url: string;
}

export interface Annotation {
  name?: string;
  comment?: string;
  links?: readonly ResourceLink[];
}

export interface LineSpec {
  moves: string;
  note?: Annotation;
  weight?: number;
  branches?: readonly LineSpec[];
}

export interface OpeningSpec {
  id: string;
  name: string;
  side: Color;
  startFen?: Fen;
  description?: string;
  lines: readonly LineSpec[];
}
```

Semantics (put these in the compiler's tests, not in comments):

- `moves` is space-separated SAN. Move numbers like `5.` or `5...` are stripped, so you can paste lines from books or Lichess.
- `note` describes the **position at the end of the segment**. If you want to annotate a position in the middle of a segment, split it there. Notes belong to positions, not to typing convenience.
- `weight` applies to the **first move** of the segment (that's where the choice happens). It is used only when the opponent picks among siblings. The default is `1`.
- `side` is the color *you* play. All moves of the other color are opponent choices.
- If siblings start with the same move, they are **merged**, so you can write lines flat or nested as you prefer. If the merged nodes have conflicting annotations, compilation fails.

#### Example (`openings/library/open-sicilian.ts`)

```ts
export const openSicilian: OpeningSpec = {
  id: 'open-sicilian',
  name: 'Open Sicilian',
  side: 'white',
  lines: [
    {
      moves: 'e4 c5',
      note: { name: 'Sicilian Defence' },
      branches: [
        {
          moves: 'Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3',
          note: { name: 'Open Sicilian' },
          branches: [
            {
              moves: 'a6',
              weight: 3,
              note: {
                name: 'Najdorf Variation',
                links: [{ kind: 'video', label: 'Najdorf explained', url: 'https://www.youtube.com/watch?v=…' }],
              },
              branches: [{ moves: 'Be3 e5 Nb3', note: { name: 'English Attack' } }],
            },
            {
              moves: 'g6',
              note: { name: 'Dragon Variation' },
              branches: [{ moves: 'Be3 Bg7 f3 O-O Qd2 Nc6', note: { name: 'Yugoslav Attack' } }],
            },
            { moves: 'e6', note: { name: 'Scheveningen Variation' } },
          ],
        },
      ],
    },
  ],
};
```

#### Runtime tree (`openings/tree.ts`)

The tree is made of **nodes that represent positions**. The root is the starting position. Every other node is "the position reached by a move".

```ts
export type NodeId = string;

export interface PositionNode {
  id: NodeId;
  fen: Fen;
  ply: number;
  annotation?: Annotation;
  children: readonly MoveNode[];
}

export interface MoveNode extends PositionNode {
  parentId: NodeId;
  move: Move;
  weight: number;
}

export interface Opening {
  id: string;
  name: string;
  side: Color;
  description?: string;
  root: PositionNode;
  nodes: ReadonlyMap<NodeId, PositionNode>;
}

export function compileOpening(spec: OpeningSpec): Opening;
```

**Why a `NodeId` equal to the SAN path** (`""`, `"e4"`, `"e4 c5 Nf3"`)? It's human-readable in tests and debugging, and it's **stable**. When stage 2 adds progress tracking or spaced repetition, you can store stats keyed by `openingId + nodeId` without any migration.

**Deliberately out of scope for now:** transpositions (the same FEN reached by different move orders). Later, an index `Map<normalizedFen, NodeId[]>` built by the compiler can handle them, and the tree itself doesn't need to change.

### 5.4 Trainer session (`trainer/session.ts`)

This is a pure reducer. The opponent's random choice is made *outside* it and dispatched as an action, so the reducer stays deterministic and easy to test.

```ts
export type Phase =
  | { kind: 'playerToMove' }
  | { kind: 'opponentToMove' }
  | { kind: 'mistake'; attempted: Move }
  | { kind: 'lineComplete' };

export interface Session {
  opening: Opening;
  path: readonly MoveNode[];
  phase: Phase;
  mistakes: number;
}

export type SessionAction =
  | { type: 'playerMoved'; move: Move }
  | { type: 'opponentMoved'; node: MoveNode }
  | { type: 'dismissMistake' }
  | { type: 'restart' };

export function startSession(opening: Opening): Session;
export function sessionReducer(session: Session, action: SessionAction): Session;
```

Selectors (`trainer/selectors.ts`):

```ts
export function currentNode(session: Session): PositionNode;
export function currentPosition(session: Session): Position;
export function expectedMoves(session: Session): readonly MoveNode[];
export function breadcrumb(session: Session): readonly string[];
export function visibleNotes(session: Session): readonly Annotation[];
```

Here, `breadcrumb` collects the `name`s along the path, for example `Sicilian Defence › Open Sicilian › Najdorf Variation`.

Weighted picker (`trainer/pick.ts`):

```ts
export type Random = () => number;
export function pickWeighted<T extends { weight: number }>(items: readonly T[], random: Random): T;
```

Rules:

- If a player move matches any child, it's accepted. When your repertoire has several valid moves at a node, any of them counts.
- If a player move is not in the tree, the phase becomes `mistake`. The move is *not* added to the path, the board snaps back, and a hint (highlighting the expected from-squares) is UI-only state.
- If a node has no children, the phase becomes `lineComplete`, whichever side moved last.
- If you play Black, the session starts in the `opponentToMove` phase.

---

## 6. Pull requests

**The last commit of every PR is `docs: update README and plan with project state`.** It marks the PR as done in this plan by appending `— **done**` to its heading, and rewrites the README. The README is the handoff: someone (or an agent) with no prior context should be able to read it and continue with the next PR. Keep it terse and use these sections:

- **Status**: the PRs that are done, and the next PR to do.
- **Commands**: how to run dev, build, test and check.
- **Deviations**: anywhere the code differs from this plan, and why. Keep entries until the plan itself is updated.
- **Notes**: only facts the next PR needs that aren't in the plan or the code (environment quirks, open questions).

Rewrite the README each time; don't append history to it.

**Every PR is opened on GitHub** with `gh pr create`, from its branch against `master`. The description is short and straightforward: a few sentences or bullets saying what was done, plus anything that differs from this plan. Don't restate the commit list or the plan.

Dependency order: **1 → 2 → 3 → 4 → 5**. After PR 3, the model work (**7 → 8 → 9**) can proceed in parallel with the board PRs. **10** needs 5, 8 and 9, and **11** comes after 10. PR 6 (drag) can land any time after 5.

### PR 1 — `chore/project-setup` — **done**

Project skeleton, tooling, design tokens, and an empty app shell.

1. `chore: scaffold Vite + Preact + TypeScript`
2. `chore: enable strict TypeScript and @/ path alias`
3. `chore: add Biome for linting and formatting`
4. `chore: enforce layer boundaries with restricted imports`
5. `test: add Vitest with a smoke test`
6. `ci: run Biome, typecheck and tests on pull requests`
7. `style: add reset, spacing/type/radius tokens and global styles`
8. `feat: add app shell with chessdrills header and main area`

*Review focus:* the non-color token set in `tokens.css` (spacing scale, radii, type scale) and the viewport meta tag. Colors arrive in PR 2.
*Done when:* `npm run dev`, `build`, `test` and `check` (Biome) all pass, importing `preact` from `chess/` fails the check, and the shell looks right on a phone.

### PR 2 — `feat/dark-mode` — **done**

Color tokens, dark mode, and the theme switcher.

1. `style(theme): add palette color tokens`
2. `style(theme): define semantic colors with light-dark()`
3. `style: use semantic colors in reset, global styles and app shell`
4. `feat(theme): add theme preference model with injectable storage`
5. `feat(theme): apply saved theme before first paint`
6. `feat(theme): add useTheme hook and header theme switcher`
7. `test(theme): cover preference parsing and storage fallbacks`

*Review focus:* no component references a palette token, and all text/background pairs meet AA contrast in both themes. Also check that reloading in dark mode shows no flash.
*Done when:* the shell looks right in both themes, follows the OS setting live, and remembers a manual override.

### PR 3 — `feat/chess-core` — **done**

Our own chess vocabulary and an immutable `Position` over chess.js.

1. `feat(chess): define square, piece and move types`
2. `feat(chess): add color and piece mapping to and from chess.js`
3. `feat(chess): wrap chess.js in an immutable Position`
4. `test(chess): cover legal moves, promotion, check and SAN playback`

*Review focus:* the size of the public API. Nothing outside `chess/` should need chess.js types.

### PR 4 — `feat/board-rendering` — **done**

A static board that renders any `Position`.

1. `feat(board): add Merida piece set and Piece component`
2. `feat(board): render 8×8 grid of squares from a Position`
3. `style(board): add copper square colors and frame`
4. `feat(board): add rank and file coordinates` (on the squares first; commit 7 moved them onto the frame)
5. `feat(board): support flipped orientation`
6. `style(board): size board to the viewport`
7. `feat(board): move coordinates onto the board frame`
8. `style(board): widen the frame to fit readable coordinates`

Notes:
- Pieces are the Merida set from `chess-style/` (§4.4). Move the twelve SVGs to `src/board/pieces/` with their names unchanged, and keep `README.txt` next to them as the attribution and license file.
- Render each piece as an `<img alt="">` of the imported SVG URL, not inline SVG. The files reuse gradient ids like `a`, so inlining 32 pieces would make them collide. The square's label already names the piece, so the image stays decorative.
- Lay out the board with CSS Grid and `aspect-ratio: 1`. Size it with `inline-size: min(100%, 100svh - var(--chrome-block-size))` so it fits both portrait and landscape.
- Put square and frame colors in tokens (`--board-light`, `--board-dark`, `--board-frame`) so themes come for free later. PR 2 added the board tokens with placeholder green values; commit 3 replaces them with the copper values from §4.1.

*Review focus:* the component split (Board → Square → Piece) and the semantic button markup.

### PR 5 — `feat/board-tap-to-move` — **done**

An interactive board plus a free-play screen.

1. `feat(board): select a piece and show legal destinations`
2. `feat(board): emit a move intent when a destination is tapped`
3. `feat(board): highlight last move and king in check`
4. `feat(board): add promotion picker`
5. `feat(board): add touch-action and focus styles for mobile and keyboard`
6. `feat: add free-play screen with undo and reset`

Board API (it's controlled; only the selection is internal state):

```ts
interface BoardProps {
  position: Position;
  orientation: Color;
  movable: Color | 'both' | 'none';
  lastMove?: Pick<Move, 'from' | 'to'>;
  hintSquares?: readonly Square[];
  onMove: (intent: MoveIntent) => void;
}
```

*Review focus:* the Board contains no game logic. It asks `position.legalMovesFrom` and emits intents.

### PR 6 — `feat/board-drag` (optional)

Drag pieces in addition to tap-to-move.

1. `feat(board): drag pieces with pointer events`
2. `feat(board): show dragged piece under the pointer and highlight target`
3. `fix(board): cancel drag on escape or release outside the board`

*Review focus:* pointer capture, and making sure tap-to-move still works unchanged.

### PR 7 — `feat/opening-model`

Spec types, the runtime tree, and the compiler.

1. `feat(openings): define annotation, spec and tree types`
2. `feat(openings): parse move strings and strip move numbers`
3. `feat(openings): compile line specs into a position tree`
4. `feat(openings): merge shared prefixes and reject conflicting notes`
5. `feat(openings): report illegal moves with opening id and path`
6. `test(openings): cover compilation, merging, weights and errors`

*Review focus:* error messages. A typo in move 14 of a deep line should tell you exactly where it is.

### PR 8 — `feat/opening-library`

Real content, validated in CI.

1. `feat(openings): add a White repertoire (e.g. Open Sicilian)`
2. `feat(openings): add a Black repertoire (e.g. Caro-Kann vs 1.e4)`
3. `feat(openings): add library index`
4. `test(openings): compile every library entry`

*Review focus:* commit 4 is the safety net, since any illegal or mistyped line fails the build. Write your own repertoire here. The examples in this document are placeholders.

### PR 9 — `feat/trainer-logic`

A pure session model, fully tested.

1. `feat(trainer): add weighted random picker with injectable RNG`
2. `feat(trainer): define session state, phases and actions`
3. `feat(trainer): handle player moves, mistakes and line end`
4. `feat(trainer): add selectors for position, breadcrumb and notes`
5. `test(trainer): play through lines with a seeded RNG`

*Review focus:* the reducer has no side effects; randomness and timing live in the UI layer.

### PR 10 — `feat/trainer-screen`

Train against a hard-coded opening.

1. `feat(trainer): wire session reducer to the board`
2. `feat(trainer): play opponent moves after a short delay`
3. `feat(trainer): show breadcrumb, notes and resource links`
4. `feat(trainer): show mistake feedback with a hint`
5. `feat(trainer): add line-complete panel with next line and restart`

The opponent move is handled by a `useOpponentMove(session, dispatch, { delayMs, random })` hook. It starts a timeout when `phase.kind === 'opponentToMove'` and cleans it up on unmount.

*Review focus:* the screen is only glue. Every decision should already exist in `trainer/`.

### PR 11 — `feat/opening-picker`

Choose what to train.

1. `feat(app): add a small hash router for screens`
2. `feat(library): list openings with side and line count`
3. `feat(library): start training from an opening`
4. `style(library): responsive card layout`

The router is hash-based and about 30 lines of your own code, so it works on any static host with no server config. You can swap in `preact-iso` later if you outgrow it.

### PR 12 — `chore/deploy` (optional)

Make it live and installable on a phone.

1. `chore: add chessdrills web app manifest, icons and theme color`
2. `chore: set Vite base to /chessdrills/ for GitHub Pages`
3. `ci: build and deploy main to GitHub Pages`

---

## 7. Out of scope for stage 1

These are stage 2+ candidates, and the data model above already leaves room for each:

- **Stockfish (WASM):** the `Position` adapter is where analysis would hook in.
- **Progress and spaced repetition:** store stats keyed by `openingId + NodeId` in IndexedDB.
- **Smarter opponent:** prefer lines you know worst by combining the weights with your error stats.
- **Transpositions:** add a FEN index built by the compiler.
- **PGN import:** Lichess study exports (with variations and comments) would compile into the same `Opening` tree.
- **Tactics and pattern puzzles:** the Lichess puzzle DB can reuse the board and session ideas.