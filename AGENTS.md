---
name: "Copilot-Instructions-ESLint-Tombi-Plugin"
description: "Instructions for maintaining eslint-plugin-tombi."
applyTo: "**"
---

# eslint-plugin-tombi Instructions

## Project Role

This repository is `eslint-plugin-tombi`: an ESLint Flat Config plugin that runs the native Tombi CLI through ESLint for TOML linting, format checks, and fix output.

## Engineering Priorities

- Preserve the modern TypeScript, ESLint, Vitest, Docusaurus, package-validation, and sync-script infrastructure.
- Keep rule metadata, docs, tests, README tables, and preset matrices synchronized.
- Prefer surgical edits over replacing mature config or docs infrastructure.
- Do not reintroduce copied Remark or Stylelint content as filler.
- Do not invent new rules unless the user explicitly requests them or they are clearly part of Tombi bridge work.

## Rule Implementation Standards

- Put rules in `src/rules/` and shared helpers in `src/_internal/`.
- Use `@typescript-eslint/utils` and repository helper types for strict rule definitions.
- No `any`; use `unknown`, type guards, precise generics, and existing utility types.
- Use specific AST selectors where possible.
- Every rule needs static metadata, actionable messages, schema, docs URL, tests, and a matching docs page.
- Autofix when the transformation is deterministic and safe; otherwise report only or provide suggestions.

## Tombi Bridge Constraints

- The `tombi/tombi` rule delegates TOML diagnostics and formatting to Tombi.
- Keep Tombi execution isolated in synchronous runner helpers so ESLint rule execution remains predictable.
- Treat Tombi config loading as a runtime boundary and fail gracefully with ESLint diagnostics.
- Keep Tombi lint, format, schema, and override policy in Tombi config; use ESLint options only for bridge execution behavior.

## Verification

Before claiming the repo is ready, run the relevant gate for the change. For broad migration work, prefer the aggregate release gate:

```bash
npm run release:verify
```

If a command produces large output, redirect it under `temp/` and inspect the relevant lines from there.
