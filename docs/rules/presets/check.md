# Check

Check Tombi formatting without reporting Tombi lint diagnostics.

## Flat config example

```ts
import tombi from "eslint-plugin-tombi";

export default [tombi.configs.check];
```

## Best fit

- CI jobs that should fail when TOML formatting drifts.
- Repositories that want lint diagnostics from another Tombi job during migration.

## Rules in this preset

<!-- GENERATED_PRESET_RULES_MATRIX_START -->

This table is generated from runtime plugin metadata for `tombi.configs.check`.

Fix legend:

- `🔧` = autofixable
- `—` = report only

| Rule                                                                         | Fix | This preset | Also enabled in                                                                               |
| ---------------------------------------------------------------------------- | :-: | :---------- | :-------------------------------------------------------------------------------------------- |
| [`tombi`](https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/tombi) | 🔧  | ✅ Enabled  | [🟡](./recommended.md) [🧪](./tombi-only.md) [🚦](./lint.md) [🔧](./format.md) [🟣](./all.md) |

<!-- GENERATED_PRESET_RULES_MATRIX_END -->
