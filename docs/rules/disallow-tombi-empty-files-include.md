# disallow-tombi-empty-files-include

Disallow empty `files.include` pattern lists in standalone Tombi config files.

> **Rule catalog ID:** R005

## Targeted pattern scope

This rule targets standalone Tombi config files visited by ESLint, normally through `tombi.configs.configuration`, `tombi.configs.recommended`, or `tombi.configs.all`.

## What this rule reports

The rule reports `[files].include = []` and empty string patterns inside the `[files]` section.

## Why this rule exists

An empty include list usually means the config was scaffolded but never finished. That can make a Tombi-backed ESLint run look clean while no project TOML files are intended.

## ❌ Incorrect

```toml
[files]
include = []
```

## ✅ Correct

```toml
[files]
include = ["**/*.toml"]
```

## Further reading

- [Tombi configuration](https://tombi-toml.github.io/tombi/docs/configuration)
- [Plugin README](https://github.com/Nick2bad4u/eslint-plugin-tombi#readme)
