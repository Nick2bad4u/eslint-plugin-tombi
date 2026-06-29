# disallow-tombi-unknown-config-properties

Disallow unsupported top-level properties in standalone Tombi config files.

> **Rule catalog ID:** R003

## Targeted pattern scope

This rule targets standalone Tombi config files visited by ESLint, normally through `tombi.configs.configuration`, `tombi.configs.recommended`, or `tombi.configs.all`.

## What this rule reports

The rule reports top-level config keys and tables that are not part of the supported Tombi config shape.

## Why this rule exists

Misspelled root keys silently make a config harder to reason about. This rule catches unknown top-level TOML keys and tables before Tombi falls back to defaults.

## ❌ Incorrect

```toml
[formats]
```

## ✅ Correct

```toml
[format]
```

## Further reading

- [Tombi configuration](https://tombi-toml.github.io/tombi/docs/configuration)
- [Plugin README](https://github.com/Nick2bad4u/eslint-plugin-tombi#readme)
