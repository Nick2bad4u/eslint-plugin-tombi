# disallow-tombi-empty-files-exclude

Disallow empty `files.exclude` pattern lists in standalone Tombi config files.

> **Rule catalog ID:** R006

## Targeted pattern scope

This rule targets standalone Tombi config files visited by ESLint, normally through `tombi.configs.configuration`, `tombi.configs.recommended`, or `tombi.configs.all`.

## What this rule reports

The rule reports `[files].exclude = []` and empty string patterns inside the `[files]` section.

## Why this rule exists

An empty exclude list is usually config noise. Removing it keeps the active Tombi policy easier to scan.

## ❌ Incorrect

```toml
[files]
exclude = []
```

## ✅ Correct

```toml
[files]
exclude = ["dist/**"]
```

## Further reading

- [Tombi configuration](https://tombi-toml.github.io/tombi/docs/configuration)
- [Plugin README](https://github.com/Nick2bad4u/eslint-plugin-tombi#readme)
