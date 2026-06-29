# Lint

Run Tombi lint diagnostics without format checks or fixes.

## Flat config example

```ts
import tombi from "eslint-plugin-tombi";

export default [tombi.configs.lint];
```

## Best fit

- CI jobs that separate linting from formatting.
- Repositories that already run Tombi formatting elsewhere.

## Rules in this preset

<!-- GENERATED_PRESET_RULES_MATRIX_START -->

This table is generated from runtime plugin metadata for `tombi.configs.lint`.

Fix legend:

- `🔧` = autofixable
- `—` = report only

| Rule                                                                         | Fix | This preset | Also enabled in                                                                                |
| ---------------------------------------------------------------------------- | :-: | :---------- | :--------------------------------------------------------------------------------------------- |
| [`tombi`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/tombi) | 🔧  | 🚦 Enabled  | [🟡](./recommended.md) [🧪](./tombi-only.md) [✅](./check.md) [🔧](./format.md) [🟣](./all.md) |

<!-- GENERATED_PRESET_RULES_MATRIX_END -->
