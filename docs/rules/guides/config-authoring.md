# Config authoring

Use Tombi config for TOML behavior and ESLint config for bridge execution.

## Standalone configs

The `configuration` preset targets standalone config files that Tombi discovers:

- `tombi.toml`
- `.tombi.toml`
- `.config/tombi.toml`

It does not target arbitrary `pyproject.toml` files. Those often contain tool-specific non-Tombi tables, so broad config-shape rules would create noise.

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
