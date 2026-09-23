# chessdrills

Personal chess training web app: a mobile-friendly board plus opening drills
played against you. Client-only, Preact + TypeScript + CSS Modules.

The plan lives in [`agenda/plan-stage-1.md`](agenda/plan-stage-1.md). Follow
its PR list and rules, including the README and plan update before each PR.

## Status

- Done: PR 1 `chore/project-setup`, PR 2 `feat/dark-mode`, PR 3
  `feat/chess-core`, PR 4 `feat/board-rendering`, PR 5
  `feat/board-tap-to-move`, plus the board style in plan §4.4.
- Next: PR 7 `feat/opening-model`. PR 6 `feat/board-drag` is optional and can
  land any time.

## Commands

```sh
npm run dev        # dev server
npm run build      # typecheck + production build
npm test           # Vitest
npm run check      # Biome lint + format check
npm run fix        # Biome with --write
npm run typecheck  # tsc -b
```

## Deviations

- The plan's scaffold commit is the existing `init` commit; PR 1 adds a commit
  removing the Vite demo files, because they fail Biome's a11y lint.
- CI also runs on pushes to `master`, not only on pull requests.
- The light side of accent, success and danger uses new `-7` palette steps
  instead of `-6`: the plan's `-6` values fail AA (4.5:1) as text on
  `--color-bg`. The `-6` steps are not defined.
- Commit 3 of PR 2 touches only global styles and the shell; the reset has no
  colors to replace.
- PR 4 adds a `fix:` commit that fits the header at 320px wide. Before it, the
  theme switcher widened the page on small phones.
- PR 4 first drew coordinates inside the edge squares, as the plan said. A
  later commit moved them onto the frame at the user's request, and another
  widened the frame from 1/30 to 1/20 of the board. The plan now describes
  this version.
- PR 5 commit 3 also adds the `hintSquares` highlight, because it belongs to
  the same Board API as `lastMove`.
- In PR 5, `FreePlay` puts its controls beside the board on short landscape
  screens (height under 36rem), so the board keeps the full height.
- The board sits in `<fieldset aria-label="Chessboard">`, not a `div` with
  `role="group"`, because Biome's `useSemanticElements` requires it.

## Notes

- The `@/` alias is defined only in `tsconfig.app.json`; Vite reads it via
  `resolve.tsconfigPaths`.
- Folders `openings/` and `trainer/` do not exist yet; the import rules in
  `biome.json` already target them.
- `Position` rebuilds chess.js from the FEN on every move, so `isGameOver`
  never detects threefold repetition. The fifty-move rule still works.
- `play` returns `undefined` for a promotion move without a `promotion` piece;
  the board needs to ask for one. `playSan` accepts `+`, `#` and `!`
  suffixes but not move numbers; stripping those is the opening parser's job.
- `useTheme` sets the `theme-color` meta from the body's computed background,
  because `light-dark()` custom properties do not resolve to a color value.
- `App` renders `FreePlay` directly until PR 11 adds the router.
- Tap handling is the pure `resolveTap` in `board/tap.ts`. The Board keeps its
  selection and pending promotion tagged with the `Position` they belong to,
  so a new position clears them without an effect.
- The promotion picker is a modal `<dialog>`. It carries one
  `biome-ignore` for `useKeyWithClickEvents`: its backdrop click has a
  keyboard equivalent in the native Escape `cancel` event.
- Known gaps: every square is a tab stop (64 of them; a roving tabindex would
  fix it), and focus drops to the page after the picker closes.
- The board is a size container: the frame (`--rim-size`, `100cqi / 20`) and
  the coordinate font scale with it. Coordinates are about 13px on a 390px
  phone. `--chrome-block-size` is defined on the app shell,
  because it measures the shell's header and padding. A screen that puts
  something under the board sets `--board-reserved-block-size` so the board
  shrinks to leave room for it, as `FreePlay` does.
- The repo sits in a shared directory. Some files may be owned by another user
  and not writable in place; replace them instead of editing.
- Push and open PRs as the GitHub account `podlomar`.
