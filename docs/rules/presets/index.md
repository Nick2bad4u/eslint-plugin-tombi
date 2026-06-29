# Presets

`eslint-plugin-tombi` exposes flat-config presets for common TOML bridge workflows.

- `🟡` [`tombi.configs.recommended`](./recommended.md) — lint, format-check, and fix-capable bridge preset.
- `🧪` [`tombi.configs.tombiOnly`](./tombi-only.md) — compatibility alias for the same bridge preset.
- `🚦` [`tombi.configs.lint`](./lint.md) — run Tombi lint diagnostics only.
- `✅` [`tombi.configs.check`](./check.md) — check formatting only.
- `🔧` [`tombi.configs.format`](./format.md) — formatting-only preset for `eslint --fix`.
- `🟣` [`tombi.configs.all`](./all.md) — compatibility alias for the bridge preset.

## Rule matrix

Fix legend:

- `🔧` = autofixable
- `—` = report only

Preset key legend:

- [`🟡`](./recommended.md) — [`tombi.configs.recommended`](./recommended.md)
- [`🧪`](./tombi-only.md) — [`tombi.configs.tombiOnly`](./tombi-only.md)
- [`🚦`](./lint.md) — [`tombi.configs.lint`](./lint.md)
- [`✅`](./check.md) — [`tombi.configs.check`](./check.md)
- [`🔧`](./format.md) — [`tombi.configs.format`](./format.md)
- [`🟣`](./all.md) — [`tombi.configs.all`](./all.md)

| Rule                                                                         | Fix | Preset key                                                                                                     |
| ---------------------------------------------------------------------------- | :-: | :------------------------------------------------------------------------------------------------------------- |
| [`tombi`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/tombi) | 🔧  | [🟡](./recommended.md) [🧪](./tombi-only.md) [🚦](./lint.md) [✅](./check.md) [🔧](./format.md) [🟣](./all.md) |
