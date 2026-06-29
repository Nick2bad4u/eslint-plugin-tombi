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

| Rule                                                                                                                                                     | Fix | This preset | Also enabled in                                                                                |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :---------- | :--------------------------------------------------------------------------------------------- |
| [`tombi`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/tombi)                                                                             | 🔧  | 🚦 Enabled  | [🟡](./recommended.md) [🧪](./tombi-only.md) [✅](./check.md) [🔧](./format.md) [🟣](./all.md) |
| [`require-tombi-config-file-naming-convention`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/require-tombi-config-file-naming-convention) |  —  | —           | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md)                                 |
| [`disallow-tombi-unknown-config-properties`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/disallow-tombi-unknown-config-properties)       |  —  | —           | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md)                                 |
| [`disallow-tombi-empty-files-include`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/disallow-tombi-empty-files-include)                   |  —  | —           | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md)                                 |
| [`disallow-tombi-empty-files-exclude`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/disallow-tombi-empty-files-exclude)                   |  —  | —           | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md)                                 |
| [`prefer-tombi-files-include-array`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/prefer-tombi-files-include-array)                       |  —  | —           | [🔧](./configuration.md) [🟣](./all.md)                                                        |
| [`require-tombi-valid-lint-rule-levels`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/require-tombi-valid-lint-rule-levels)               |  —  | —           | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md)                                 |
| [`prefer-tombi-builtin-schema-catalog`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/prefer-tombi-builtin-schema-catalog)                 |  —  | —           | [🔧](./configuration.md) [🟣](./all.md)                                                        |

<!-- GENERATED_PRESET_RULES_MATRIX_END -->
