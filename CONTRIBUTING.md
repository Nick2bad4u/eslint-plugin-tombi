# Contributing to eslint-plugin-tombi

Thanks for your interest in contributing.

This repository contains an ESLint plugin focused on integrating Tombi into
ESLint and enforcing Tombi configuration best practices.

## Prerequisites

- Node.js `>=22.0.0` (see `package.json#engines`)
- npm `>=11`
- Git

## Local setup

1. Fork and clone the repository.

2. Install dependencies from the repository root:

   ```bash
   npm ci --force
   ```

3. Run the main quality gate:

   ```bash
   npm run release:verify
   ```

## Recommended development workflow

1. Create a branch from `main`.
2. Make focused changes.
3. Add or update tests in `test/` when behavior changes.
4. Update relevant documentation in `docs/` and root docs when needed.
5. Run validation commands before opening a pull request.

## Debugging and logging policy

To keep runtime plugin behavior predictable, this repository enforces strict
rules for logging and debugger usage in source code.

- `src/**` and `plugin.mjs`: do **not** commit `console.*` or `debugger`
  statements.
- `scripts/**`: `console.log`/`console.warn`/`console.error` are allowed for
  CLI progress and diagnostics.
- `test/**`: avoid noisy logging by default; only keep it when a test is
  explicitly validating logging behavior.

When adding script output, prefer this severity split:

- `console.log`: normal progress
- `console.warn`: recoverable issue or fallback behavior
- `console.error`: failure path (typically followed by a non-zero exit code)

## Project layout

```text
.
├── src/                  # Plugin source and rule implementations
├── test/                 # Rule tests and test helpers
├── docs/                 # Rule docs and Docusaurus docs app
├── scripts/              # Repository scripts
├── .github/              # Workflows and automation configs
└── package.json          # Scripts, dependencies, metadata
```

## Validation commands

Use these commands locally before submitting a pull request:

- `npm run release:verify`
- `npm run lint:all`
- `npm run typecheck`
- `npm test`

## Testing Guidance

This repository uses Vitest tests for the bridge runner, diagnostic parsing,
config presets, config-authoring rules, and plugin entrypoints.

Use focused test commands while iterating:

- `npx vitest run test/bridge.test.ts`
- `npx vitest run test/config-rules.test.ts`
- `npx vitest run test/tombi-runner.test.ts`

For examples of explicit fixture and rule-doc sync policy, refer to
[`docs/rules/getting-started.md`](./docs/rules/getting-started.md) and
[`docs/rules/presets/index.md`](./docs/rules/presets/index.md).
Optional focused checks:

- `npm run test:coverage` for coverage reporting
- `npm run changelog:preview` to preview unreleased changelog output

## Commit guidance

Gitmoji + Conventional type commits are recommended because release notes and
changelog tooling are commit-message aware.

Format:

- `:gitmoji: type(scope?): subject`

Examples:

- `:sparkles: feat(rule): add prefer-tombi-files-include-array`
- `:bug: fix(rule): avoid false positive in union type handling`
- `:memo: docs: clarify tombi bridge configuration`

## Pull request expectations

- Keep pull requests scoped and reviewable.
- Include tests for behavior changes.
- Keep docs in sync with implementation changes.
- Do not include generated lockfile churn unrelated to the change.

## Security

Do not open public issues for potential vulnerabilities.
Use the process described in [SECURITY.md](./SECURITY.md).

## License

By contributing, you agree your contributions are licensed under the
[MIT License](./LICENSE).
