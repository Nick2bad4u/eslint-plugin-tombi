# Configuration

Enable Tombi config-authoring checks for standalone Tombi config files.

## Flat config example

```ts
import tombi from "eslint-plugin-tombi";

export default [tombi.configs.configuration];
```

## Best fit

- Repositories with `tombi.toml` or `.tombi.toml` checked in.
- Teams that want ESLint to catch obvious Tombi config mistakes.
- CI jobs that already use ESLint as the review annotation surface.

## What this preset includes

- Tombi config filename checks.
- Unknown top-level Tombi config property checks.
- File pattern sanity checks.
- Lint rule level validation.
- Schema catalog cache guidance.

## Rules in this preset

<!-- GENERATED_PRESET_RULES_MATRIX_START -->

This table is generated from runtime plugin metadata for `tombi.configs.configuration`.

Fix legend:

- `🔧` = autofixable
- `—` = report only

| Rule                                                                                                                                                     | Fix | This preset | Also enabled in                                                                                                |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :---------- | :------------------------------------------------------------------------------------------------------------- |
| [`tombi`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/tombi)                                                                             | 🔧  | —           | [🟡](./recommended.md) [🧪](./tombi-only.md) [🚦](./lint.md) [✅](./check.md) [🔧](./format.md) [🟣](./all.md) |
| [`require-tombi-config-file-naming-convention`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/require-tombi-config-file-naming-convention) |  —  | 🔧 Enabled  | [🟡](./recommended.md) [🟣](./all.md)                                                                          |
| [`disallow-tombi-unknown-config-properties`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/disallow-tombi-unknown-config-properties)       |  —  | 🔧 Enabled  | [🟡](./recommended.md) [🟣](./all.md)                                                                          |
| [`disallow-tombi-empty-files-include`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/disallow-tombi-empty-files-include)                   |  —  | 🔧 Enabled  | [🟡](./recommended.md) [🟣](./all.md)                                                                          |
| [`disallow-tombi-empty-files-exclude`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/disallow-tombi-empty-files-exclude)                   |  —  | 🔧 Enabled  | [🟡](./recommended.md) [🟣](./all.md)                                                                          |
| [`prefer-tombi-files-include-array`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/prefer-tombi-files-include-array)                       |  —  | 🔧 Enabled  | [🟣](./all.md)                                                                                                 |
| [`require-tombi-valid-lint-rule-levels`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/require-tombi-valid-lint-rule-levels)               |  —  | 🔧 Enabled  | [🟡](./recommended.md) [🟣](./all.md)                                                                          |
| [`prefer-tombi-builtin-schema-catalog`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/prefer-tombi-builtin-schema-catalog)                 |  —  | 🔧 Enabled  | [🟣](./all.md)                                                                                                 |

<!-- GENERATED_PRESET_RULES_MATRIX_END -->
