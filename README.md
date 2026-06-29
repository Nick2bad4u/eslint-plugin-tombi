# eslint-plugin-tombi

[![npm license.](https://flat.badgen.net/npm/license/eslint-plugin-tombi?color=purple)](https://github.com/Nick2bad4u/eslint-plugin-tombi/blob/main/LICENSE) [![npm total downloads.](https://flat.badgen.net/npm/dt/eslint-plugin-tombi?color=pink)](https://www.npmjs.com/package/eslint-plugin-tombi) [![latest GitHub release.](https://flat.badgen.net/github/release/Nick2bad4u/eslint-plugin-tombi?color=cyan)](https://github.com/Nick2bad4u/eslint-plugin-tombi/releases) [![GitHub stars.](https://flat.badgen.net/github/stars/Nick2bad4u/eslint-plugin-tombi?color=yellow)](https://github.com/Nick2bad4u/eslint-plugin-tombi/stargazers)

`eslint-plugin-tombi` runs the native Tombi CLI from ESLint, then reports TOML lint and format findings through normal ESLint formatters, editors, and CI annotations.

## Installation

```sh
npm install --save-dev eslint-plugin-tombi eslint
```

The package depends on `tombi` and `toml-eslint-parser`, so consumers do not need a separate Rust, Python, or system-level Tombi install.

## Compatibility

- **Supported ESLint versions:** `9.x` and `10.x`
- **Config system:** Flat Config only
- **Node.js runtime:** `>=22.0.0`
- **Bundled Tombi:** `tombi` npm package with native optional binaries

## Quick start

```ts
import tombi from "eslint-plugin-tombi";

export default [tombi.configs.recommended];
```

The recommended preset targets `**/*.toml` and `**/Cargo.lock`, wires `toml-eslint-parser`, and enables `tombi/tombi`.

## Presets

| Preset                                                             | Purpose                                                       |
| ------------------------------------------------------------------ | ------------------------------------------------------------- |
| [`tombi.configs.recommended`](./docs/rules/presets/recommended.md) | Default lint, format-check, and fix-capable bridge preset.    |
| [`tombi.configs.tombiOnly`](./docs/rules/presets/tombi-only.md)    | Alias of the recommended bridge preset.                       |
| [`tombi.configs.lint`](./docs/rules/presets/lint.md)               | Run Tombi lint diagnostics only.                              |
| [`tombi.configs.check`](./docs/rules/presets/check.md)             | Check formatting only; do not report Tombi lint diagnostics.  |
| [`tombi.configs.format`](./docs/rules/presets/format.md)           | Formatting-only preset intended for `eslint --fix` workflows. |
| [`tombi.configs.all`](./docs/rules/presets/all.md)                 | Alias of the recommended bridge preset for consistency.       |

## Local Tombi config

Keep Tombi policy in Tombi config files. The bridge invokes Tombi with `--stdin-filename`, so native config discovery still applies for files such as `tombi.toml`, `.tombi.toml`, `.config/tombi.toml`, and `[tool.tombi]` in `pyproject.toml`.

Use ESLint rule options only for bridge behavior:

```ts
import tombi from "eslint-plugin-tombi";

export default [
 {
  ...tombi.configs.recommended,
  rules: {
   "tombi/tombi": [
    "error",
    {
     cache: {
      directory: ".cache/eslint-plugin-tombi/tombi",
      ttlSeconds: 60 * 60 * 24 * 30,
     },
     errorOnWarnings: true,
     httpTimeoutSeconds: 10,
     offline: false,
     timeoutMs: 30_000,
    },
   ],
  },
 },
];
```

## Cache behavior

The bridge sets `TOMBI_CACHE_HOME` by default to `.cache/eslint-plugin-tombi/tombi` under the ESLint working directory and sets `TOMBI_CACHE_TTL` to 30 days. This keeps remote JSON schema and TOML schema fetches from being repeated on every ESLint run.

Set `cache.directory`, `cache.ttlSeconds`, `offline`, `noCache`, or `httpTimeoutSeconds` when CI or local development needs different network behavior.

## Rules

Fix legend:

- `🔧` = autofixable
- `—` = report only

Preset key legend:

- [`🟡`](./docs/rules/presets/recommended.md) — [`tombi.configs.recommended`](./docs/rules/presets/recommended.md)
- [`🧪`](./docs/rules/presets/tombi-only.md) — [`tombi.configs.tombiOnly`](./docs/rules/presets/tombi-only.md)
- [`🚦`](./docs/rules/presets/lint.md) — [`tombi.configs.lint`](./docs/rules/presets/lint.md)
- [`✅`](./docs/rules/presets/check.md) — [`tombi.configs.check`](./docs/rules/presets/check.md)
- [`🔧`](./docs/rules/presets/format.md) — [`tombi.configs.format`](./docs/rules/presets/format.md)
- [`🟣`](./docs/rules/presets/all.md) — [`tombi.configs.all`](./docs/rules/presets/all.md)

| Rule                                                                         | Fix | Preset key                                                                                                                                                                                                                       |
| ---------------------------------------------------------------------------- | :-: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`tombi`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/tombi) | 🔧  | [🟡](./docs/rules/presets/recommended.md) [🧪](./docs/rules/presets/tombi-only.md) [🚦](./docs/rules/presets/lint.md) [✅](./docs/rules/presets/check.md) [🔧](./docs/rules/presets/format.md) [🟣](./docs/rules/presets/all.md) |
