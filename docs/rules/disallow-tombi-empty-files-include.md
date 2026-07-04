# disallow-tombi-empty-files-include

Disallow invalid `files.include` pattern lists in standalone Tombi config files.

> **Rule catalog ID:** R005

## Targeted pattern scope

This rule targets standalone Tombi config files visited by ESLint, normally through `tombi.configs.configuration`, `tombi.configs.recommended`, or `tombi.configs.all`.

## What this rule reports

The rule reports `files.include` values that are present but malformed: non-array values, empty arrays, and empty string patterns inside the `[files]` section. It does not require `files.include` to be configured because Tombi provides a default include pattern.

## Why this rule exists

An invalid include list usually means the config was scaffolded but never finished. That can make a Tombi-backed ESLint run look clean while no project TOML files are intended.

## ❌ Incorrect

```toml
[files]
include = []
```

```toml
[files]
include = "**/*.toml"
```

## ✅ Correct

```toml
[format]
```

```toml
[files]
include = ["**/*.toml"]
```

## Further reading

- [Tombi configuration](https://tombi-toml.github.io/tombi/docs/configuration)
- [Plugin README](https://github.com/Nick2bad4u/eslint-plugin-tombi#readme)
