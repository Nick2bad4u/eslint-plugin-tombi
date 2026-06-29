# Getting started

Install `eslint-plugin-tombi`, add one flat-config preset, and run ESLint over TOML files.

## Install

```sh
npm install --save-dev eslint-plugin-tombi eslint
```

The plugin depends on `tombi` and `toml-eslint-parser`, so the native Tombi binary is installed with the package.

## Add the recommended preset

```js
import tombi from "eslint-plugin-tombi";

export default [tombi.configs.recommended];
```

The preset matches `**/*.toml` and `**/Cargo.lock`. It checks formatting, reports Tombi lint diagnostics, and can fix formatting with `eslint --fix`.

## Keep Tombi policy upstream

Use Tombi config for formatter and linter policy. For most repositories that means adding `tombi.toml`, `.tombi.toml`, `.config/tombi.toml`, or a `[tool.tombi]` table in `pyproject.toml`.

```toml
# tombi.toml
[format.rules]
indent-width = 4
indent-table-key-value-pairs = true
line-width = 100

[lint.rules]
dotted-keys-out-of-order = "warn"
key-empty = "error"
tables-out-of-order = "warn"
```

Tombi documents the discovery order and current options under [configuration search priority](https://tombi-toml.github.io/tombi/docs/configuration#search-priority), [format rules](https://tombi-toml.github.io/tombi/docs/configuration#format-rules), and [lint rules](https://tombi-toml.github.io/tombi/docs/configuration#lint-rules).

Use ESLint options for bridge execution:

```js
import tombi from "eslint-plugin-tombi";

export default [
 {
  ...tombi.configs.recommended,
  rules: {
   "tombi/tombi": [
    "error",
    {
     errorOnWarnings: true,
     offline: false,
     timeoutMs: 30_000,
    },
   ],
  },
 },
];
```

## Choose a narrower preset

- Use [`tombi.configs.lint`](./presets/lint.md) for lint diagnostics only.
- Use [`tombi.configs.check`](./presets/check.md) for format checks only.
- Use [`tombi.configs.format`](./presets/format.md) for `eslint --fix` formatting jobs.

Next, read the [Tombi bridge guide](./guides/tombi-bridge.md).
