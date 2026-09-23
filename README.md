# chessdrills

Personal chess training web app: a mobile-friendly board plus opening drills
played against you. Client-only, Preact + TypeScript + CSS Modules.

The plan lives in [`agenda/plan-stage-1.md`](agenda/plan-stage-1.md). Follow
its PR list and rules, including the README and plan update before each PR.

## Status

- Done: PR 1 `chore/project-setup` (tooling, tokens, empty app shell).
- Next: PR 2 `feat/dark-mode`.

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

## Notes

- The `@/` alias is defined only in `tsconfig.app.json`; Vite reads it via
  `resolve.tsconfigPaths`.
- Layer folders (`chess/`, `openings/`, `trainer/`, ...) do not exist yet; the
  import rules in `biome.json` already target them.
- The repo sits in a shared directory. Some files may be owned by another user
  and not writable in place; replace them instead of editing.
- Push and open PRs as the GitHub account `podlomar`.
