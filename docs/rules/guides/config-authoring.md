# Config authoring

Use Tombi config for TOML behavior and ESLint config for bridge execution.

## Standalone configs

The `configuration` preset targets standalone project config files that Tombi discovers:

- `tombi.toml`
- `.tombi.toml`
- `.config/tombi.toml`

It does not target arbitrary `pyproject.toml` files. Those often contain tool-specific non-Tombi tables, so broad config-shape rules would create noise.

Tombi also supports `[tool.tombi]` in `pyproject.toml`. The bridge still respects that when linting TOML files because it passes the real file path through `--stdin-filename`; the ESLint config-authoring rules just avoid linting every `pyproject.toml` as if it were only a Tombi config.

## Formatting and linting policy

Put Tombi's own policy in one of the local config files:

```toml
[format.rules]
indent-width = 4
line-width = 100
string-quote-style = "double"

[lint.rules]
dotted-keys-out-of-order = "warn"
key-empty = "error"
tables-out-of-order = "warn"
```

Use Tombi's upstream documentation as the option source of truth:

- [Configuration search priority](https://tombi-toml.github.io/tombi/docs/configuration#search-priority)
- [Formatter rule options](https://tombi-toml.github.io/tombi/docs/configuration#format-rules)
- [Linter rule options](https://tombi-toml.github.io/tombi/docs/configuration#lint-rules)

For a broader setup walkthrough, see [Local Tombi config](./local-tombi-config.md).

## Recommended split

Keep these in Tombi config:

- Formatting policy.
- Lint rule levels.
- Schema and catalog policy.
- File include and exclude patterns.

Keep these in ESLint config:

- Which files ESLint visits.
- Whether this run is lint-only, check-only, or fix-capable.
- Bridge timeout, cache, offline, and custom executable settings.
