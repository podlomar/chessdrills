# chessdrills

Personal chess training web app: a mobile-friendly board plus opening drills
played against you. Client-only, Preact + TypeScript + CSS Modules.

The plan lives in [`agenda/plan-stage-1.md`](agenda/plan-stage-1.md). Follow
its PR list and rules, including the README and plan update before each PR.

## Status

- Done: PR 1 `chore/project-setup`, PR 2 `feat/dark-mode`, PR 3 `feat/chess-core`.
- Next: PR 4 `feat/board-rendering`. PR 7 `feat/opening-model` can also start
  now, in parallel with the board PRs.

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
- The repo sits in a shared directory. Some files may be owned by another user
  and not writable in place; replace them instead of editing.
- Push and open PRs as the GitHub account `podlomar`.
