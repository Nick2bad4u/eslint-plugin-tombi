# require-tombi-config-file-naming-convention

Require standalone Tombi config files to use a filename Tombi discovers.

> **Rule catalog ID:** R002

## Targeted pattern scope

This rule targets standalone Tombi config files visited by ESLint, normally through `tombi.configs.configuration` or `tombi.configs.all`.

## What this rule reports

The rule reports config files whose names are not discovered by Tombi as standalone project config files.

## Why this rule exists

Tombi discovers `tombi.toml`, `.tombi.toml`, and `.config/tombi.toml`. A nearby file such as `tombi.config.toml` can look intentional while never affecting Tombi.

## ❌ Incorrect

```txt
configs/tombi.config.toml
```

## ✅ Correct

```txt
.config/tombi.toml
.tombi.toml
tombi.toml
```

## Further reading

- [Tombi configuration](https://tombi-toml.github.io/tombi/docs/configuration)
- [Plugin README](https://github.com/Nick2bad4u/eslint-plugin-tombi#readme)
