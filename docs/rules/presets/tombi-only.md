# Tombi bridge only

Enable the same bridge behavior as `recommended`.

This preset exists to match the naming style used by the other bridge plugins and to provide a clear "only the upstream tool" entry point.

## Flat config example

```ts
import tombi from "eslint-plugin-tombi";

export default [tombi.configs.tombiOnly];
```

## Rules in this preset

<!-- GENERATED_PRESET_RULES_MATRIX_START -->

This table is generated from runtime plugin metadata for `tombi.configs.tombiOnly`.

Fix legend:

- `🔧` = autofixable
- `—` = report only

| Rule                                                                         | Fix | This preset | Also enabled in                                                                          |
| ---------------------------------------------------------------------------- | :-: | :---------- | :--------------------------------------------------------------------------------------- |
| [`tombi`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/tombi) | 🔧  | 🧪 Enabled  | [🟡](./recommended.md) [🚦](./lint.md) [✅](./check.md) [🔧](./format.md) [🟣](./all.md) |

<!-- GENERATED_PRESET_RULES_MATRIX_END -->
