# prefer-tombi-files-include-array

Prefer an explicit `[files].include` array in standalone Tombi config files.

> **Rule catalog ID:** R004

## Targeted pattern scope

This rule targets standalone Tombi config files visited by ESLint, normally through `tombi.configs.configuration` or `tombi.configs.all`.

## What this rule reports

The rule reports config files that do not define a `[files]` table with an `include` array.

## Why this rule exists

An explicit include list makes it clear which TOML files Tombi should consider, especially in repositories with generated files, vendored TOML, or nonstandard TOML-like inputs.

## ❌ Incorrect

```toml
[format]
```

## ✅ Correct

```toml
[files]
include = ["**/*.toml"]
```

## Further reading

- [Tombi configuration](https://tombi-toml.github.io/tombi/docs/configuration)
- [Plugin README](https://github.com/Nick2bad4u/eslint-plugin-tombi#readme)
