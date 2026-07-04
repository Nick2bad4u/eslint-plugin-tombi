# disallow-tombi-empty-files-exclude

Disallow invalid `files.exclude` pattern lists in standalone Tombi config files.

> **Rule catalog ID:** R006

## Targeted pattern scope

This rule targets standalone Tombi config files visited by ESLint, normally through `tombi.configs.configuration`, `tombi.configs.recommended`, or `tombi.configs.all`.

## What this rule reports

The rule reports `files.exclude` values that are present but malformed: non-array values, empty arrays, and empty string patterns inside the `[files]` section. It does not require `files.exclude` to be configured.

## Why this rule exists

An invalid exclude list is usually config noise. Removing it keeps the active Tombi policy easier to scan.

## ❌ Incorrect

```toml
[files]
exclude = []
```

```toml
[files]
exclude = "dist/**"
```

## ✅ Correct

```toml
[format]
```

```toml
[files]
exclude = ["dist/**"]
```

## Further reading

- [Tombi configuration](https://tombi-toml.github.io/tombi/docs/configuration)
- [Plugin README](https://github.com/Nick2bad4u/eslint-plugin-tombi#readme)
