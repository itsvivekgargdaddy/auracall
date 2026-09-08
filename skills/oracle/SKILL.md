---
name: auracall
description: Use the locally installed AuraCall CLI to bundle a prompt plus selected files for provider, refactoring, design review, or cross-validation with another model.
---

# AuraCall CLI

AuraCall assembles a prompt and a bounded set of repository files into one
request. Treat every returned answer as advice and verify it against the local
code and tests.

## Safety gate

- Start with `auracall --help` once per session and preview every new file set.
- Dry-run and render operations are provider-free. API and browser runs can
  spend quota, upload files, create provider history, or operate a browser; get
  explicit user authorization immediately before starting one.
- Never attach `.env` files, credentials, browser profiles, tokens, or unrelated
  user data. Redact secrets and select the smallest sufficient file set.
- Do not assume that a timeout means the request failed. Inspect the stored
  session and reattach rather than submitting the same prompt again.

## Provider-free workflow

1. Select the smallest files that contain the relevant contract and behavior.
2. Preview the bundle and exclusions:

   ```bash
   auracall --dry-run summary --files-report \
     -p "<task and desired output>" \
     --file "src/**" \
     --file "!src/**/*.test.ts"
   ```

3. Expand to the full rendered bundle only when useful:

   ```bash
   auracall --dry-run full -p "<task and desired output>" --file "src/**"
   auracall --render -p "<task and desired output>" --file "src/**"
   ```

`--file` accepts files, directories, and globs and can be repeated. Prefix an
entry with `!` to exclude it. AuraCall honors `.gitignore`, does not follow
symlinks during glob expansion, and rejects files larger than its safety cap.

## Authorized execution examples

Only after the user authorizes the provider effect:

```bash
# API path; requires the matching provider credentials.
auracall --engine api --model openai:frontier \
  -p "<task and desired output>" --file "src/**"

# Browser path; requires completed browser/profile setup.
auracall --engine browser --model chatgpt:reasoning-high \
  -p "<task and desired output>" --file "src/**"
```

AuraCall browser adapters support ChatGPT, Gemini, and Grok. Prefer semantic
selectors such as `chatgpt:fast`, `chatgpt:reasoning-high`, and
`chatgpt:premium` over provider-version labels when the workflow should survive
model renames.

## Sessions

Sessions live under `~/.auracall/sessions` unless the runtime home is
overridden. Use these read paths before considering a retry:

```bash
auracall status --hours 72
auracall session <id> --render
```

Use `--slug "<3-5 words>"` for recognizable session IDs. Use `--force` only
when the user explicitly wants a separate duplicate run.

## Prompt quality

Include the project stack, important entrypoints, exact error or decision,
constraints, what has already been tried, and the desired answer shape. A
smaller well-explained bundle is usually more useful than an unexplained whole
repository.

For additional flags, run `auracall --help --verbose`.
