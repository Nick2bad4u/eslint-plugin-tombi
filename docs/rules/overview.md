# Rule overview

`eslint-plugin-tombi` is a bridge plugin. It lets ESLint run the native Tombi CLI over TOML files, then turns Tombi lint and format output into ESLint reports.

## What belongs here

Use this plugin when ESLint is the feedback surface for editors, CI, and pull-request annotations, but Tombi should remain the source of truth for TOML parsing, schema validation, formatting, and TOML-specific policy.

The plugin does not reimplement Tombi configuration. Put TOML behavior in `tombi.toml`, `.tombi.toml`, `.config/tombi.toml`, or `[tool.tombi]` in `pyproject.toml`; use ESLint options for bridge execution details.

## Rule groups

| Group            | Use it for                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Bridge linting   | Surface `tombi lint` diagnostics in ESLint output.                                                            |
| Format checks    | Report when `tombi format` would change a file.                                                               |
| Fixes            | Apply Tombi formatting through `eslint --fix`.                                                                |
| Config authoring | Catch common standalone `tombi.toml` setup mistakes.                                                          |
| Cache control    | Keep Tombi schema/catalog cache data local with package-cache defaults, workspace fallback, and a 30-day TTL. |

## Recommended path

Start with `tombi.configs.recommended`. It enables `tombi/tombi` for `**/*.toml` and `**/Cargo.lock`, checks formatting, reports lint diagnostics, can apply formatting fixes, and applies low-noise Tombi config checks to standalone config files.

Use `tombi.configs.lint`, `tombi.configs.check`, `tombi.configs.format`, or `tombi.configs.configuration` only when a repository needs a narrower job split.
