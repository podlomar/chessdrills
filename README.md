# chessdrills

Personal chess training web app: a mobile-friendly board plus opening drills
played against you. Client-only, Preact + TypeScript + CSS Modules.

The plan lives in [`agenda/plan-stage-1.md`](agenda/plan-stage-1.md). Follow
its PR list and rules, including the README and plan update before each PR.

## Assets

The chessboard style is using the Merida pieces set from https://sharechess.github.io

## Status

- Done: PR 1 `chore/project-setup`, PR 2 `feat/dark-mode`, PR 3
  `feat/chess-core`, PR 4 `feat/board-rendering`, PR 5
  `feat/board-tap-to-move`, PR 7 `feat/opening-model`, PR 8
  `feat/opening-library`, PR 9 `feat/trainer-logic`, PR 10
  `feat/trainer-screen`, PR 11 `feat/opening-picker`, plus the board style in
  plan §4.4, and PR 12 `chore/deploy`. PR 6 (drag-to-move) is dropped.
  Stage 1 is complete.
- Next: the one-time deployment setup below (not done yet), then replacing
  the placeholder repertoires with the user's own lines.

## Commands

```sh
npm run dev        # dev server
npm run build      # typecheck + production build
npm test           # Vitest
npm run check      # Biome lint + format check
npm run fix        # Biome with --write
npm run typecheck  # tsc -b
```

## Deployment

The app runs at <https://chessdrills.podlomar.me> as the uncloud service
`chessdrills` from [`compose.yaml`](compose.yaml). The image built from
[`Dockerfile`](Dockerfile) serves `dist/` with Caddy on port `8000`
([`Caddyfile`](Caddyfile)); uncloud's own Caddy terminates TLS in front of it.
Every push to `master` deploys through
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

The steps below set this up once. `USER@HOST` is the SSH login used for
`uc machine init`, and `SERVER_IP` is the server's public IP. Until step 5 is
done, the deploy workflow fails on every push to `master`.

### 1. Point the domain at the server

The cluster was initialised with `--no-dns`, so uncloud manages no DNS. At the
DNS provider, create an `A` record for `chessdrills.podlomar.me` pointing at
`SERVER_IP`.

```sh
dig +short chessdrills.podlomar.me
```

Check: it prints `SERVER_IP`. If it prints nothing, wait for the record to
propagate; Caddy cannot get a certificate before it resolves.

### 2. Check the cluster

On a machine with the cluster context:

```sh
uc machine ls
uc ls
```

Check: the server is listed and `uc ls` shows the `caddy` service. If `caddy`
is missing (the cluster was initialised with `--no-caddy`), run
`uc caddy deploy`.

### 3. Deploy once by hand

From the repo root, on the same machine, with Docker running:

```sh
uc deploy
```

It prints the deployment plan and asks for confirmation. It builds the image
locally, tags it `chessdrills/chessdrills:<git date>.<short sha>` and pushes it
to the server over SSH, with no registry.

```sh
curl -sI https://chessdrills.podlomar.me
```

Check: the status line is `HTTP/2 200`. If TLS fails, `uc caddy logs` shows
the certificate error; it is almost always the DNS record from step 1.

### 4. Create a deploy key

```sh
ssh-keygen -t ed25519 -N '' -C chessdrills-deploy -f chessdrills-deploy
ssh-copy-id -i chessdrills-deploy.pub USER@HOST
```

```sh
ssh -i chessdrills-deploy -o IdentitiesOnly=yes USER@HOST true
```

Check: it exits without asking for a password. If it asks, the public key is
not in the server's `~/.ssh/authorized_keys` for `USER`.

### 5. Create the `production` environment and its secrets

The environment only accepts deployments from `master`:

```sh
gh api -X PUT repos/podlomar/chessdrills/environments/production \
  -F 'deployment_branch_policy[protected_branches]=false' \
  -F 'deployment_branch_policy[custom_branch_policies]=true'
gh api -X POST \
  repos/podlomar/chessdrills/environments/production/deployment-branch-policies \
  -f name=master
```

```sh
gh secret set DEPLOY_SSH_KEY --env production < chessdrills-deploy
ssh-keyscan HOST | gh secret set DEPLOY_KNOWN_HOSTS --env production
gh secret set DEPLOY_TARGET --env production --body USER@HOST
gh secret list --env production
```

Check: the list shows all three secrets. Compare the scanned host key with
`ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub` run on the server; a
mismatch means the scan did not reach the real server. Then delete the local
key files: `rm chessdrills-deploy chessdrills-deploy.pub`.

### 6. Run the workflow

```sh
gh workflow run deploy.yml --ref master
gh run watch
```

Check: the run succeeds and `uc ls` shows `chessdrills`. If the Deploy step
fails:

- `Permission denied (publickey)`: redo step 4, then `DEPLOY_SSH_KEY`.
- `Host key verification failed`: redo `DEPLOY_KNOWN_HOSTS`.
- `permission denied` on the uncloud or Docker socket: `USER` is not the
  `uc machine init` user; use that one in `DEPLOY_TARGET`.

### Operations

- Logs: `uc logs chessdrills`.
- Redeploy the current `master`: `gh workflow run deploy.yml --ref master`.
- Roll back: check out an earlier commit and run `uc deploy` from it.

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
- PR 7 returns compile errors as `neverthrow` Results rather than throwing,
  per the user's coding style; the plan's §5.3 now shows this API. It also
  added `Position.moveNumber` and `isValidFen` so errors can number moves and
  reject a bad `startFen` without chess.js throwing.
- PR 10's "restart" button is **Repeat line**, which replays the same
  opponent choices; **Next line** starts a new random line. That needs the
  `replay` option described in plan PR 10.
- The board sits in `<fieldset aria-label="Chessboard">`, not a `div` with
  `role="group"`, because Biome's `useSemanticElements` requires it.

## Notes

- The `@/` alias is defined only in `tsconfig.app.json`; Vite reads it via
  `resolve.tsconfigPaths`.
- `pickWeighted` returns `T | undefined` (empty list) instead of the plan's
  `T`. The session only asks for an opponent move when the node has children.
- The reducer matches a player move against the tree by SAN. `session.ts`
  uses `currentNode` from `selectors.ts`; the reverse import is type-only.
- Tests get repeatable randomness from `src/testing/seededRandom.ts`
  (mulberry32). The trainer screen should pass `Math.random` as its `Random`.
- `compileOpening` returns `Result<Opening, OpeningError>`. The PR 8 library
  index has to unwrap it; `error.message` is written for humans and names the
  opening and the numbered path. Tests use `_unsafeUnwrap` and
  `_unsafeUnwrapErr`.
- The library (`openings/library/`) holds placeholder repertoires: Open
  Sicilian for White and Caro-Kann for Black. The user will replace them with
  their own lines later. `compileLibrary()` compiles all of `openingSpecs` in
  index order.
- Weights go on the opponent's choices. A segment that starts with the
  player's move shared by several lines must not carry a weight; split the
  shared move into its own segment and weight the replies instead.
- The compiler does not check that weights are positive; the library test
  does.
- `Position` rebuilds chess.js from the FEN on every move, so `isGameOver`
  never detects threefold repetition. The fifty-move rule still works.
- `play` returns `undefined` for a promotion move without a `promotion` piece;
  the board needs to ask for one. `playSan` accepts `+`, `#` and `!`
  suffixes but not move numbers; stripping those is the opening parser's job.
- `useTheme` sets the `theme-color` meta from the body's computed background,
  because `light-dark()` custom properties do not resolve to a color value.
- Routing: `app/route.ts` holds the pure `parseRoute` and `routeHref`, and
  `app/useRoute.ts` listens to `hashchange`. Unknown hashes fall back to the
  library; an unknown opening id shows an alert. `Trainer` is keyed by
  opening id, so switching openings starts a fresh session.
- `App` compiles the whole library once at module load. A compile error
  renders as an alert with the compiler's message instead of any screen.
- The header wordmark links to the library; the library links to free play,
  and the trainer has an "All openings" link. Library cards are one link each
  (the heading's link stretches over the card).
- The line count on a card is the number of leaves (`openings/stats.ts`).
- `ui/BoardLayout` is the shared board-plus-side-panel layout of `FreePlay`
  and `Trainer`. It reserves room under the board in portrait and puts the
  panel beside the board on short landscape screens.
- `Trainer` memoizes the current `Position` per node. The Board tags its
  selection with the `Position` object, so a fresh one on every render would
  drop the selection.
- The hint (expected from-squares) is UI state in `Trainer`, tied to the node
  it was asked for. "Show hint" also dismisses the mistake.
- Browser checks drive the preview build with puppeteer and pin
  `Math.random` in the page to get a known opponent line.
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
- The deploy workflow has not run yet: it needs the secrets from step 5 of
  the deployment setup. `ssh://` in `uc --connect` uses the system `ssh`
  client (checked in uncloud's source), so the workflow's ssh-agent key and
  `known_hosts` apply.
- The app icon (`public/icon.svg`) is the Merida white knight on a 2×2
  copper board. `public/icon-maskable.svg` is the full-bleed variant. The
  PNGs were rendered from these two SVGs with headless Chrome; re-render them
  after changing either.
- A local image built from uncommitted changes gets a `.dirty` tag suffix.
- SSH to `github.com` hung on this machine at the end of stage 1; git over
  HTTPS with `gh`'s credential helper worked.
- The repo sits in a shared directory. Some files may be owned by another user
  and not writable in place; replace them instead of editing.
- Push and open PRs as the GitHub account `podlomar`.
