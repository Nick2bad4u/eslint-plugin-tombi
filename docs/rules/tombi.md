# tombi

Run Tombi from ESLint and report upstream TOML lint and format results.

> **Rule catalog ID:** R001

## Targeted pattern scope

This rule is intended for TOML files that ESLint visits, normally through `tombi.configs.recommended` or another exported preset. The built-in presets target `**/*.toml` and `**/Cargo.lock`.

## What this rule reports

The rule can report two kinds of findings:

- Tombi lint diagnostics from `tombi lint`.
- Format drift when `tombi format` would produce different text.

When formatting is enabled, the rule provides a full-file fixer powered by Tombi output.

## Why this rule exists

Tombi is the right source of truth for TOML parsing, linting, schema handling, and formatting. This rule exists so teams that already use ESLint as their editor and CI feedback channel can surface Tombi results in the same diagnostics stream.

## ❌ Incorrect

```js
export default [
 {
  files: ["**/*.toml"],
  rules: {
   "tombi/tombi": "off",
  },
 },
];
```

## ✅ Correct

```js
import tombi from "eslint-plugin-tombi";

export default [tombi.configs.recommended];
```

## Behavior and migration notes

The bridge invokes Tombi with `--stdin-filename`, so Tombi can still discover local configuration for the target file. Keep formatter, lint, schema, override, and extension settings in Tombi config files rather than copying them into ESLint.

### Options

```ts
type Options = [
 {
  cache?: {
   directory?: string;
   noCache?: boolean;
   ttlSeconds?: number;
  };
  check?: boolean;
  errorOnWarnings?: boolean;
  format?: boolean;
  httpTimeoutSeconds?: number;
  lint?: boolean;
  noCache?: boolean;
  offline?: boolean;
  quiet?: boolean;
  timeoutMs?: number;
  tombiPath?: string;
  verbose?: 0 | 1 | 2;
 }?,
];
```

| Option               | Default                            | Effect                                                |
| -------------------- | ---------------------------------- | ----------------------------------------------------- |
| `lint`               | `true`                             | Run `tombi lint` and report diagnostics.              |
| `check`              | `true`                             | Report when `tombi format` would change the file.     |
| `format`             | `true`                             | Provide an ESLint fixer using Tombi formatted output. |
| `errorOnWarnings`    | `false`                            | Pass `--error-on-warnings` to `tombi lint`.           |
| `quiet`              | `true`                             | Pass `--quiet` unless set to `false`.                 |
| `offline`            | `false`                            | Set `TOMBI_OFFLINE=true`.                             |
| `noCache`            | `false`                            | Set `TOMBI_NO_CACHE=true`.                            |
| `cache.directory`    | `.cache/eslint-plugin-tombi/tombi` | Set `TOMBI_CACHE_HOME`.                               |
| `cache.ttlSeconds`   | `2592000`                          | Set `TOMBI_CACHE_TTL`; default is 30 days.            |
| `cache.noCache`      | `false`                            | Rule-scoped alias for `noCache`.                      |
| `httpTimeoutSeconds` | `5`                                | Set `TOMBI_HTTP_TIMEOUT`.                             |
| `timeoutMs`          | `30000`                            | Kill a Tombi subprocess that runs too long.           |
| `tombiPath`          | bundled native binary              | Use a custom Tombi executable path.                   |
| `verbose`            | `0`                                | Pass `-v` or `-vv` to Tombi.                          |

## Additional examples

### Recommended

```js
import tombi from "eslint-plugin-tombi";

export default [tombi.configs.recommended];
```

### Lint only

```js
import tombi from "eslint-plugin-tombi";

export default [tombi.configs.lint];
```

### Formatting with custom cache settings

```js
import tombi from "eslint-plugin-tombi";

export default [
 {
  ...tombi.configs.format,
  rules: {
   "tombi/tombi": [
    "error",
    {
     cache: {
      directory: ".cache/tombi",
      ttlSeconds: 60 * 60 * 24 * 30,
     },
     httpTimeoutSeconds: 10,
    },
   ],
  },
 },
];
```

## ESLint flat config example

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
     timeoutMs: 30_000,
    },
   ],
  },
 },
];
```

## When not to use it

Do not enable this rule when a repository intentionally runs Tombi separately and duplicate editor or CI diagnostics would be noisy or too slow.

## Package documentation

- [Plugin README](https://github.com/Nick2bad4u/eslint-plugin-tombi#readme)
- [Rule source](https://github.com/Nick2bad4u/eslint-plugin-tombi/tree/main/src/rules)

## Further reading

- [Tombi configuration](https://tombi-toml.github.io/tombi/docs/configuration)
- [Tombi comment directives](https://tombi-toml.github.io/tombi/docs/comment-directive)
- [ESLint flat config](https://eslint.org/docs/latest/use/configure/configuration-files)

## Adoption resources

- Start with `tombi.configs.recommended`.
- Keep upstream TOML policy in Tombi config files.
- Use `cache.ttlSeconds`, `offline`, and `noCache` only for bridge execution behavior.
