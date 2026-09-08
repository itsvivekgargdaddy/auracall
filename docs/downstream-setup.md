# Downstream Setup

This fork is maintained at
[`itsvivekgargdaddy/auracall`](https://github.com/itsvivekgargdaddy/auracall).
It was forked from `ecochran76/auracall` at commit
`3861d28104e8a731ae172d637f299e0c50664152`. The annotated tag
`upstream/ecochran76-main-2026-09-08` preserves that exact sync point.

## What AuraCall does

AuraCall is an orchestration layer, not an AI model. It selects local files,
assembles them with a prompt, sends the resulting context to an explicitly
selected API or browser-backed provider, and stores durable session/run
records for inspection and reattachment.

```text
files + prompt
      |
      v
 AuraCall CLI -----> API or managed browser -----> model provider
      |
      +-----------> ~/.auracall session/run archive
                         ^
                         |
                 AuraCall MCP tools
```

The repository also contains optional local OpenAI-compatible HTTP surfaces,
team and batch orchestration, provider-project management, media workflows,
and extensive browser automation for ChatGPT, Gemini, and Grok. Those broader
surfaces are powerful and should be enabled only for a specific workflow.

## Recommended local posture

Install the CLI as a user-scoped runtime and expose only read-oriented MCP
tools to Codex initially:

```bash
pnpm run install:user-runtime
auracall --version
auracall --help
```

The installer writes the packaged runtime below
`~/.auracall/user-runtime` and two wrappers under `~/.local/bin`:

- `auracall` for CLI operations
- `auracall-mcp` for the stdio MCP server

The narrow Codex MCP profile should expose only:

- `sessions`
- `run_status`
- `runtime_runs_recent`
- `runtime_inspect`
- `run_archive_search`
- `run_archive_item`
- `run_archive_asset_lookup`

These tools inspect local durable state. Keep Codex's default approval mode at
`prompt`. Do not initially allow execution tools such as `consult`,
`response_create`, `team_run`, provider project setup, media generation, or
history materialization.

## Provider-free first use

A dry run expands and measures files without sending a prompt to a provider:

```bash
auracall --dry-run summary --files-report \
  --prompt "Review this file for maintainability risks" \
  --file README.md
```

To create a manual bundle for review without provider automation:

```bash
auracall --render --prompt "Explain the architecture" --file "src/**/*.ts"
```

Do not attach credentials, `.env` files, browser profiles, or unrelated user
data. Always preview a new glob before authorizing a real run.

## Explicit opt-in paths

API execution requires provider credentials and an intentional non-dry-run
command. Browser execution additionally requires a compatible browser,
profile setup, account verification, and permission to upload the selected
files. Neither is part of the base installation.

The local HTTP API is a separate deployment mode. Installing the CLI does not
create or start `auracall-api.service`; use the service installer only when a
specific local-client integration requires it and after configuring a real,
scoped `agent:<id>` model. The generated service environment intentionally
uses the fail-closed placeholder `agent:replace-me`.

## Maintaining the fork

The local remotes deliberately separate ownership:

- `origin` fetches and pushes the owned fork.
- `upstream` fetches `ecochran76/auracall`, while its push URL is disabled.

Review upstream changes without writing to the source repository:

```bash
git fetch upstream
git log --oneline --left-right main...upstream/main
```

Apply upstream updates on a dedicated branch, rerun the frozen-lockfile audit
and tests, and merge only into the owned fork after review. Never change the
disabled upstream push URL as part of routine synchronization.
