# FAQ

## Does this replace Tombi?

No. The bridge delegates TOML linting, formatting, and schema behavior to Tombi. ESLint receives the results.

## Should I run Tombi separately in CI?

Usually no, if ESLint already runs `tombi/tombi` over the same files. Running both can help during migration, but long-term duplicate diagnostics add noise.

## Where should Tombi options live?

Keep formatter, lint, schema, override, and extension settings in Tombi config. Use ESLint config for file selection, severity, fix behavior, cache environment, offline mode, and timeout behavior.

## Why does the plugin set a cache directory?

Tombi can fetch remote schemas and catalogs. The bridge sets `TOMBI_CACHE_HOME` and a 30-day `TOMBI_CACHE_TTL` by default so repeated ESLint runs do not spam remote schema hosts. Installed packages use `node_modules/.cache/eslint-plugin-tombi/tombi`; source checkouts and unwritable package caches fall back to `.cache/eslint-plugin-tombi/tombi` under the ESLint working directory.

## Which preset should I use?

Use [`recommended`](../presets/recommended.md) for normal adoption. Use [`lint`](../presets/lint.md), [`check`](../presets/check.md), or [`format`](../presets/format.md) when CI splits linting and formatting into separate jobs.
