---
name: commit
description: >
  Create a git commit following unified commit format.
  Use when the user wants to commit changes, asks for a commit message,
  or types /commit. Analyzes staged changes and proposes an appropriate
  emoji + type + message.
allowed-tools:
  - Bash(git status:*)
  - Bash(git diff:*)
  - Bash(git add:*)
  - Bash(git commit:*)
argument-hint: "[optional message or scope hint]"
---

# Commit Skill

Create a git commit following the unified commit format.

## Format

```
<emoji> <type>: <message>
```

Scope is optional. Message is lowercase, imperative mood, no trailing period.

## Type → Emoji Map

| Type       | Emoji | Use when...                                         |
|------------|-------|-----------------------------------------------------|
| `setup`    | 🏗️    | Project or module setup                             |
| `feat`     | ✨    | New feature or capability                           |
| `fix`      | 🐛    | Bug fix                                             |
| `refactor` | ♻️    | Code restructuring without behavior change          |
| `perf`     | ⚡    | Performance improvement                             |
| `test`     | 🧪    | Adding or updating tests                            |
| `docs`     | 📝    | Documentation only                                  |
| `style`    | 💄    | Formatting, whitespace, naming (no logic change)    |
| `chore`    | 🔧    | Build, tooling, dependencies, CI/CD                 |
| `ci`       | 👷    | CI/CD pipeline changes                              |
| `revert`   | ⏪    | Reverting a previous commit                         |
| `wip`      | 🚧    | Work in progress (avoid on main branch)             |

## Procedure

1. Run `git status` to see what's staged and unstaged
2. Run `git diff --cached` to read the staged diff in detail
3. If nothing is staged, run `git diff HEAD` to see all changes, then ask the user whether to stage everything or let them choose
4. Determine the best type from the table above based on the diff
5. Infer scope from the changed files/modules (e.g. `auth`, `api`, `transcription`, `ui`, `deps`) — omit if changes span many areas
6. Write a message in imperative mood: "add", "fix", "remove", not "added", "fixes", "removing"
7. Run `git commit -m "<message>"`
9. If the user passed $ARGUMENTS, treat them as a scope or message hint and incorporate accordingly

## Good Examples

```
✨ feat: add SSO login via Keycloak
🐛 fix: handle empty audio segments gracefully
♻️ refactor: extract token validation into middleware
🔧 chore: upgrade MailerSend SDK to v3
📝 docs: update WebSocket protocol documentation
🧪 test: add coverage for concurrent session handling
⚡ perf: reduce model inference latency on short segments
🏗️ setup: scaffold Newton Workflow service
```

## Bad Examples (never do these)

```
# ❌ No emoji
feat: add login

# ❌ Past tense
✨ feat: added SSO support

# ❌ Vague message
🔧 chore: updates

# ❌ Trailing period
🐛 fix: handle null response.

# ❌ Uppercase message
✨ feat(ui): Add Dark Mode
```

## Edge Cases

- **Multiple unrelated changes staged**: point it out and suggest
  splitting into separate commits before proceeding
- **Revert commit**: use `⏪ revert:` and reference the original
  commit SHA in the body
- **Breaking change**: append `!` after type, e.g. `✨ feat(api)!:`,
  and add a `BREAKING CHANGE:` footer in the commit body
- **WIP commits**: allow them but warn if the target branch is `main`
  or `master`
