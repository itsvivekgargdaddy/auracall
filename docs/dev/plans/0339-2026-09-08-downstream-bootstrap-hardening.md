# Downstream Bootstrap Hardening | 0339-2026-09-08

State: OPEN
Lane: P32
Branch: fix/plan0339-downstream-bootstrap-hardening
Target: main
Integration: merge
Revision: 7 | 2026-09-08

## Stable Objective

Make the newly created `itsvivekgargdaddy/auracall` fork safe to install and
use as a local, prompt-gated Codex MCP server without modifying the source
repository or activating provider/browser effects.

## Current State

- The fork was created from `ecochran76/auracall` at
  `3861d28104e8a731ae172d637f299e0c50664152` and cloned locally.
- `origin` points only to the owned fork. `upstream` fetches Eric Cochran's
  repository and has a deliberately disabled push URL.
- Production and development audits now report zero advisories after bounded
  dependency upgrades. The license, owned-fork metadata, active examples,
  fail-closed service default, WSL bootstrap, CI minimum Node version, MCP
  examples, and bundled Codex skill are repaired.
- The downstream contract passes 3/3 tests, MCP coverage passes 73 tests with
  3 skips, and typecheck/build/lint pass. Two inherited host-coupled fixtures
  were made portable, and the repository's documented single-worker release
  suite now passes all 3,113 tests with 65 skips.
- Owned-fork CI keeps that complete suite as the Ubuntu/WSL acceptance gate.
  macOS and Windows run the portable downstream-bootstrap and MCP contracts:
  the inherited complete suite contains WSL simulations that are invalid on
  macOS and Windows-native runtime IDs with colons that cannot be directory
  names on Windows. The portable subset excludes the one MCP API-operations
  status test that creates the same unsupported Windows runtime directory.
- The first packaged user install exposed that `tokentally` releases after
  0.1.1 require Node 24 despite AuraCall declaring Node 22 support. The runtime
  now pins 0.1.1, whose engine is Node 20+, imports on Node 22, retains a
  zero-advisory audit, and passes the complete release suite.
- Owned-fork review/integration, user-scoped CLI installation, narrow Codex MCP
  registration, installed smoke checks, and final closeout remain.

## Execution Graph

The primary agent owns all serialized implementation and host changes; no
subagents and no provider effects.

1. Preserve fork custody with a downstream branch, fetch-only upstream, and an
   owned-fork sync-point reference.
2. Repair production dependency advisories, license and repository metadata,
   generic runtime defaults, supported-Node WSL bootstrap behavior, CI Node
   alignment, and the bundled local CLI skill/config examples.
3. Add or update the cheapest deterministic tests for changed installer and
   bootstrap contracts; run focused checks, audit, typecheck, lint, build, the
   complete provider-free suite on the target Linux/WSL platform, and portable
   bootstrap/MCP contracts on macOS and Windows.
4. Publish the validated branch, integrate it into owned `main`, verify remote
   parity, install only the user-scoped CLI runtime, and smoke-test help,
   version, dry-run, and MCP schema without login, browser launch, or prompt.
5. Register the installed stdio MCP server in Codex with a narrow read-oriented
   tool allowlist and prompt-on-use approval, then verify persisted config and
   CLI discovery. Close the plan and record exact residual risks.

## Acceptance Criteria

- DH1: no push-capable remote targets `ecochran76/auracall`; an owned-fork
  reference preserves the exact pre-hardening source commit.
- DH2: production and complete dependency audits have zero advisories.
- DH3: repository/license metadata is valid, active runtime defaults and
  examples are operator-neutral, and the bundled Codex skill invokes the
  installed `auracall` CLI rather than `@steipete/oracle` or unpublished npm.
- DH4: WSL bootstrap accepts every supported Node major at or above 22,
  installs the native build prerequisites, and performs a frozen-lockfile
  install; CI tests the declared minimum Node major, and the production
  dependency graph does not declare a higher minimum.
- DH5: focused tests, the complete provider-free single-worker Linux/WSL
  release suite, portable macOS/Windows bootstrap and MCP contracts, typecheck,
  lint, build, planning audit, and diff hygiene pass from the frozen lockfile.
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

## Pre-Integration Evidence

- DH1: owned tag `upstream/ecochran76-main-2026-09-08` points to
  `3861d28104e8a731ae172d637f299e0c50664152`; `upstream` push is `DISABLED`.
- DH2: `pnpm audit` and `pnpm audit --prod` both report zero at every severity;
  the untouched production baseline was 1 critical, 29 high, 39 moderate, and
  5 low advisories.
- DH3-DH4: `tests/downstreamBootstrap.contract.test.ts` passes all three tests;
  `bash -n scripts/bootstrap-wsl.sh` passes. Pinned `tokentally@0.1.1` declares
  Node 20+ and imports successfully under Node 22.23.2.
- DH5: MCP tests pass 73 with 3 skips; typecheck, build, and lint pass. The exact
  documented release suite (`--maxWorkers 1 --testTimeout 15000`) passes 3,113
  tests with 65 skips across 330 passing and 21 skipped files. CI uses that
  deterministic full gate on Ubuntu and the portable downstream-bootstrap/MCP
  contracts on macOS and Windows. This scope follows observed platform facts:
  WSL simulation tests do not apply on a Darwin kernel, while Windows rejects
  inherited colon-bearing runner directory names. The Windows lane is pinned to
  `windows-2022` because the current `windows-latest` Visual Studio 18 image is
  not detectable by node-gyp 11. Accepted implementation checkpoint:
  `52e218df438d279784b38e4db99eb05ce78b5040`.
- Durable detail: `docs/dev/notes/2026-09-08-plan0339-validation.json`.
- DH6-DH8 remain open until owned-fork integration and the provider-free local
  install/configuration checks complete.

## Definition Of Done

The hardened code is published on the owned fork's `main`, the provider-free
local runtime and restricted Codex MCP entry are installed and verified, all
acceptance evidence is durable, and the branch/plan/lane closeout is truthful.
