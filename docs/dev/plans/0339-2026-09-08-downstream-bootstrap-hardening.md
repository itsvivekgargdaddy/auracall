# Downstream Bootstrap Hardening | 0339-2026-09-08

State: OPEN
Lane: P32
Branch: fix/plan0339-downstream-bootstrap-hardening
Target: main
Integration: merge
Revision: 1 | 2026-09-08

## Stable Objective

Make the newly created `itsvivekgargdaddy/auracall` fork safe to install and
use as a local, prompt-gated Codex MCP server without modifying the source
repository or activating provider/browser effects.

## Current State

- The fork was created from `ecochran76/auracall` at
  `3861d28104e8a731ae172d637f299e0c50664152` and cloned locally.
- `origin` points only to the owned fork. `upstream` fetches Eric Cochran's
  repository and has a deliberately disabled push URL.
- Provider-free typecheck, build, selected CLI/MCP tests, and dry-run behavior
  passed during the pre-change audit.
- Production dependency audit reported one critical and 29 high advisories;
  the WSL bootstrap script rejects supported Node 24 and omits native build
  tools; current install metadata and defaults contain source-operator IDs;
  the bundled Codex skill invokes the unrelated upstream npm package.
- Source hardening, full provider-free validation, owned-fork publication,
  CLI-only installation, and prompt-gated Codex MCP registration remain.

## Execution Graph

The primary agent owns all serialized implementation and host changes; no
subagents and no provider effects.

1. Preserve fork custody with a downstream branch, fetch-only upstream, and an
   owned-fork sync-point reference.
2. Repair production dependency advisories, license and repository metadata,
   generic runtime defaults, supported-Node WSL bootstrap behavior, CI Node
   alignment, and the bundled local CLI skill/config examples.
3. Add or update the cheapest deterministic tests for changed installer and
   bootstrap contracts; run focused checks, audit, typecheck, lint, build, and
   the complete provider-free test suite.
4. Publish the validated branch, integrate it into owned `main`, verify remote
   parity, install only the user-scoped CLI runtime, and smoke-test help,
   version, dry-run, and MCP schema without login, browser launch, or prompt.
5. Register the installed stdio MCP server in Codex with a narrow read-oriented
   tool allowlist and prompt-on-use approval, then verify persisted config and
   CLI discovery. Close the plan and record exact residual risks.

## Acceptance Criteria

- DH1: no push-capable remote targets `ecochran76/auracall`; an owned-fork
  reference preserves the exact pre-hardening source commit.
- DH2: production audit has no critical or high advisory, and any unavoidable
  lower-severity advisory is explicitly evidenced and dispositioned.
- DH3: repository/license metadata is valid, active runtime defaults and
  examples are operator-neutral, and the bundled Codex skill invokes the
  installed `auracall` CLI rather than `@steipete/oracle` or unpublished npm.
- DH4: WSL bootstrap accepts every supported Node major at or above 22,
  installs the native build prerequisites, and performs a frozen-lockfile
  install; CI tests the declared minimum Node major.
- DH5: focused tests, complete provider-free suite, typecheck, lint, build,
  planning audit, and diff hygiene pass from the frozen lockfile.
- DH6: owned remote `main` contains the accepted changes and matches the local
  integration commit; Eric's repository remains unchanged.
- DH7: `~/.local/bin/auracall` and `auracall-mcp` resolve to the installed
  user runtime and pass provider-free smoke checks.
- DH8: Codex lists one enabled AuraCall stdio MCP server whose exposed tools
  are narrowly allowlisted and whose default approval mode is `prompt`.

## Bounds

No source-repository write, pull request, issue, release, package publication,
background AuraCall API service, browser automation, provider login, prompt
submission, API-key use, or migration of Eric's historical evidence. Do not
alter unrelated open lanes. One dependency-remediation approach plus one
evidence-driven correction is allowed before local replanning.

## Definition Of Done

The hardened code is published on the owned fork's `main`, the provider-free
local runtime and restricted Codex MCP entry are installed and verified, all
acceptance evidence is durable, and the branch/plan/lane closeout is truthful.
