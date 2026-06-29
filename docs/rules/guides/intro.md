# Guide overview

`eslint-plugin-tombi` is a bridge plugin. It lets ESLint run Tombi and report TOML lint and format findings through normal ESLint output.

## Use the guides in this order

1. Start with [Getting started](../getting-started.md) to add the recommended preset.
2. Read [Tombi bridge](./tombi-bridge.md) to understand what the bridge delegates to Tombi.
3. Use [Local Tombi config](./local-tombi-config.md) to add formatter, linter, file, and schema policy.
4. Use [Tool behavior to rule map](./tool-to-rule-map.md) when deciding whether a setting belongs in Tombi config or ESLint config.

## Boundary

This plugin should not become a second Tombi implementation. TOML lint, format, schema, and override policy belongs in Tombi config. ESLint config should control file selection, rule severity, and bridge execution options.

When a project needs formatting or lint-rule choices, add them to a local Tombi config and keep ESLint focused on running the bridge. The upstream Tombi reference has the current [configuration search priority](https://tombi-toml.github.io/tombi/docs/configuration#search-priority), [format rule options](https://tombi-toml.github.io/tombi/docs/configuration#format-rules), and [lint rule options](https://tombi-toml.github.io/tombi/docs/configuration#lint-rules).
