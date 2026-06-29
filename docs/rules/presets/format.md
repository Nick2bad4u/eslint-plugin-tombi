# Format

Run the formatting side of the Tombi bridge without Tombi lint diagnostics.

## Flat config example

```ts
import tombi from "eslint-plugin-tombi";

export default [tombi.configs.format];
```

Use this preset with `eslint --fix` when the job is meant to rewrite TOML files.

## Best fit

- Local formatting scripts.
- Bot-driven formatting pull requests.
- CI checks that intentionally ignore lint diagnostics.

## Rules in this preset

<!-- GENERATED_PRESET_RULES_MATRIX_START -->

This table is generated from runtime plugin metadata for `tombi.configs.format`.

Fix legend:

- `🔧` = autofixable
- `—` = report only

| Rule                                                                         | Fix | This preset | Also enabled in                                                                              |
| ---------------------------------------------------------------------------- | :-: | :---------- | :------------------------------------------------------------------------------------------- |
| [`tombi`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/tombi) | 🔧  | 🔧 Enabled  | [🟡](./recommended.md) [🧪](./tombi-only.md) [🚦](./lint.md) [✅](./check.md) [🟣](./all.md) |

<!-- GENERATED_PRESET_RULES_MATRIX_END -->
