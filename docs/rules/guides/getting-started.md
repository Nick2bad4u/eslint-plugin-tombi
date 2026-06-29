# Adoption checklist

Use this checklist when adding the plugin to an existing repository.

## Start small

- Enable [`tombi.configs.recommended`](../presets/recommended.md) for TOML files that should be linted and formatted.
- Exclude generated TOML, vendored manifests, and fixtures that intentionally violate style.
- Keep native Tombi config as the source of truth for TOML behavior. See [Local Tombi config](./local-tombi-config.md) for formatter, linter, file, and schema settings.

## Split jobs only when needed

- Use [`tombi.configs.lint`](../presets/lint.md) when CI should report lint diagnostics without format drift.
- Use [`tombi.configs.check`](../presets/check.md) when CI should fail on format drift without applying fixes.
- Use [`tombi.configs.format`](../presets/format.md) in local or bot-driven `eslint --fix` workflows.

## CI rollout

Run ESLint in the same job that already checks TypeScript, Markdown, package metadata, and workflows. The value of the bridge is one diagnostics stream, not another standalone command that developers forget to run.
