# Recommended

Enable the default Tombi bridge for TOML files and Cargo lockfiles.

## Flat config example

```ts
import tombi from "eslint-plugin-tombi";

export default [tombi.configs.recommended];
```

## Best fit

- Repositories that want one ESLint command to report TOML lint and format findings.
- Projects that want `eslint --fix` to apply Tombi formatting.
- Teams migrating from a standalone `tombi lint` or `tombi format --check` step.

## What this preset includes

- `tombi/tombi`
- TOML parser wiring.
- File patterns for `**/*.toml` and `**/Cargo.lock`.

## Rules in this preset

<!-- GENERATED_PRESET_RULES_MATRIX_START -->

This table is generated from runtime plugin metadata for `tombi.configs.recommended`.

Fix legend:

- `🔧` = autofixable
- `—` = report only

| Rule                                                                                                                                                     | Fix | This preset | Also enabled in                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :---------- | :-------------------------------------------------------------------------------------- |
| [`tombi`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/tombi)                                                                             | 🔧  | 🟡 Enabled  | [🧪](./tombi-only.md) [🚦](./lint.md) [✅](./check.md) [🔧](./format.md) [🟣](./all.md) |
| [`require-tombi-config-file-naming-convention`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/require-tombi-config-file-naming-convention) |  —  | 🟡 Enabled  | [🔧](./configuration.md) [🟣](./all.md)                                                 |
| [`disallow-tombi-unknown-config-properties`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/disallow-tombi-unknown-config-properties)       |  —  | 🟡 Enabled  | [🔧](./configuration.md) [🟣](./all.md)                                                 |
| [`disallow-tombi-empty-files-include`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/disallow-tombi-empty-files-include)                   |  —  | 🟡 Enabled  | [🔧](./configuration.md) [🟣](./all.md)                                                 |
| [`disallow-tombi-empty-files-exclude`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/disallow-tombi-empty-files-exclude)                   |  —  | 🟡 Enabled  | [🔧](./configuration.md) [🟣](./all.md)                                                 |
| [`prefer-tombi-files-include-array`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/prefer-tombi-files-include-array)                       |  —  | —           | [🔧](./configuration.md) [🟣](./all.md)                                                 |
| [`require-tombi-valid-lint-rule-levels`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/require-tombi-valid-lint-rule-levels)               |  —  | 🟡 Enabled  | [🔧](./configuration.md) [🟣](./all.md)                                                 |
| [`prefer-tombi-builtin-schema-catalog`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/prefer-tombi-builtin-schema-catalog)                 |  —  | —           | [🔧](./configuration.md) [🟣](./all.md)                                                 |

<!-- GENERATED_PRESET_RULES_MATRIX_END -->
