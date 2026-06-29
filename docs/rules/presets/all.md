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

| Rule                                                                                                                                                     | Fix | This preset | Also enabled in                                                                                 |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :---------- | :---------------------------------------------------------------------------------------------- |
| [`tombi`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/tombi)                                                                             | 🔧  | 🟣 Enabled  | [🟡](./recommended.md) [🧪](./tombi-only.md) [🚦](./lint.md) [✅](./check.md) [🔧](./format.md) |
| [`require-tombi-config-file-naming-convention`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/require-tombi-config-file-naming-convention) |  —  | 🟣 Enabled  | [🟡](./recommended.md) [🔧](./configuration.md)                                                 |
| [`disallow-tombi-unknown-config-properties`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/disallow-tombi-unknown-config-properties)       |  —  | 🟣 Enabled  | [🟡](./recommended.md) [🔧](./configuration.md)                                                 |
| [`disallow-tombi-empty-files-include`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/disallow-tombi-empty-files-include)                   |  —  | 🟣 Enabled  | [🟡](./recommended.md) [🔧](./configuration.md)                                                 |
| [`disallow-tombi-empty-files-exclude`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/disallow-tombi-empty-files-exclude)                   |  —  | 🟣 Enabled  | [🟡](./recommended.md) [🔧](./configuration.md)                                                 |
| [`prefer-tombi-files-include-array`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/prefer-tombi-files-include-array)                       |  —  | 🟣 Enabled  | [🔧](./configuration.md)                                                                        |
| [`require-tombi-valid-lint-rule-levels`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/require-tombi-valid-lint-rule-levels)               |  —  | 🟣 Enabled  | [🟡](./recommended.md) [🔧](./configuration.md)                                                 |
| [`prefer-tombi-builtin-schema-catalog`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/prefer-tombi-builtin-schema-catalog)                 |  —  | 🟣 Enabled  | [🔧](./configuration.md)                                                                        |

<!-- GENERATED_PRESET_RULES_MATRIX_END -->
