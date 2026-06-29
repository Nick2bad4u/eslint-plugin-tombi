# All

Enable every rule currently shipped by the plugin.

Because this package is intentionally bridge-only, `all` currently matches `recommended` and `tombiOnly`.

## Flat config example

```ts
import tombi from "eslint-plugin-tombi";

export default [tombi.configs.all];
```

## Rules in this preset

<!-- GENERATED_PRESET_RULES_MATRIX_START -->

This table is generated from runtime plugin metadata for `tombi.configs.all`.

Fix legend:

- `🔧` = autofixable
- `—` = report only

| Rule                                                                         | Fix | This preset | Also enabled in                                                                                 |
| ---------------------------------------------------------------------------- | :-: | :---------- | :---------------------------------------------------------------------------------------------- |
| [`tombi`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/tombi) | 🔧  | 🟣 Enabled  | [🟡](./recommended.md) [🧪](./tombi-only.md) [🚦](./lint.md) [✅](./check.md) [🔧](./format.md) |

<!-- GENERATED_PRESET_RULES_MATRIX_END -->
