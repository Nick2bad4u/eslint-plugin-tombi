# Guide overview

`eslint-plugin-tombi` is a bridge plugin. It lets ESLint run Tombi and report TOML lint and format findings through normal ESLint output.

## Use the guides in this order

1. Start with [Getting started](../getting-started.md) to add the recommended preset.
2. Read [Tombi bridge](./tombi-bridge.md) to understand what the bridge delegates to Tombi.
3. Use [Tool behavior to rule map](./tool-to-rule-map.md) when deciding whether a setting belongs in Tombi config or ESLint config.

## Boundary

This plugin should not become a second Tombi implementation. TOML lint, format, schema, and override policy belongs in Tombi config. ESLint config should control file selection, rule severity, and bridge execution options.
