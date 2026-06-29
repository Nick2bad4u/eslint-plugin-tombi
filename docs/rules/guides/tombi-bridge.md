# Tombi bridge

The `tombi/tombi` rule runs Tombi subprocesses against the ESLint source text. ESLint owns file selection, ignore behavior, fix application, formatter output, and editor integration. Tombi owns TOML parsing, schema resolution, lint diagnostics, and formatting.

## What the bridge runs

By default, the rule runs both:

- `tombi format --stdin-filename <file> -`
- `tombi lint --stdin-filename <file> -`

The `lint`, `check`, and `format` options let presets or users narrow that work.

## Cache and network behavior

The bridge sets:

- `TOMBI_CACHE_HOME` to `.cache/eslint-plugin-tombi/tombi`.
- `TOMBI_CACHE_TTL` to `2592000` seconds.
- `TOMBI_HTTP_TIMEOUT` to `5` seconds.

That default keeps schema/catalog cache data for 30 days. Use `offline`, `noCache`, `cache.directory`, `cache.ttlSeconds`, and `httpTimeoutSeconds` when CI or local development needs tighter control.

## What stays upstream

Keep these in Tombi config:

- Formatter style.
- Lint and schema policy.
- Schema catalogs and schema-specific overrides.
- File include/exclude settings that should be shared with other Tombi tools.

Keep these in ESLint config:

- Which files ESLint visits.
- The ESLint severity for `tombi/tombi`.
- Whether this ESLint run is lint-only, check-only, or fix-capable.
- Bridge timeout, cache, offline, and custom executable settings.
