# require-tombi-valid-lint-rule-levels

Require Tombi lint rule levels to be `error`, `warn`, or `off`.

> **Rule catalog ID:** R007

## Targeted pattern scope

This rule targets standalone Tombi config files visited by ESLint, normally through `tombi.configs.configuration`, `tombi.configs.recommended`, or `tombi.configs.all`.

## What this rule reports

The rule reports string values under `[lint.rules]` that are not `error`, `warn`, or `off`.

## Why this rule exists

Tombi lint rule configuration should use explicit severity levels. This catches common misspellings such as `warning` before they become confusing config drift.

## ❌ Incorrect

```toml
[lint.rules]
array-values-order = "warning"
```

## ✅ Correct

```toml
[lint.rules]
array-values-order = "warn"
```

## Further reading

- [Tombi configuration](https://tombi-toml.github.io/tombi/docs/configuration)
- [Plugin README](https://github.com/Nick2bad4u/eslint-plugin-tombi#readme)
