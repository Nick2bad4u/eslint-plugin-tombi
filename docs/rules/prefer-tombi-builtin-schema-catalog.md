# prefer-tombi-builtin-schema-catalog

Prefer Tombi's embedded schema catalog when schema catalogs are configured.

> **Rule catalog ID:** R008

## Targeted pattern scope

This rule targets standalone Tombi config files visited by ESLint, normally through `tombi.configs.configuration` or `tombi.configs.all`.

## What this rule reports

The rule reports schema catalog settings that do not reference a `tombi://` catalog URL.

## Why this rule exists

The bridge defaults Tombi schema/catalog caching to 30 days. When a config points at a custom catalog path, `tombi://` keeps the common catalog path embedded and cache-friendly for editor and CI runs.

## ❌ Incorrect

```toml
[schema]
catalog-path = "https://www.schemastore.org/api/json/catalog.json"
```

## ✅ Correct

```toml
[schema]
catalog-path = "tombi://json.schemastore.org/catalog.json"
```

## Further reading

- [Tombi configuration](https://tombi-toml.github.io/tombi/docs/configuration)
- [Plugin README](https://github.com/Nick2bad4u/eslint-plugin-tombi#readme)
