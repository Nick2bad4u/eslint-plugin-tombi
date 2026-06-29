# Local Tombi config

Use a local Tombi config when a project needs TOML formatting, linting, schema,
or file-selection policy. Use ESLint config only for how the bridge runs Tombi
and reports results.

## Config files

Tombi discovers project config from:

- `tombi.toml`
- `.tombi.toml`
- `.config/tombi.toml`
- `[tool.tombi]` in `pyproject.toml`

The bridge passes `--stdin-filename` to Tombi, so this discovery still works
when ESLint sends file contents through standard input.

The `configuration` preset checks standalone Tombi config files. It does not
target every `pyproject.toml`, because those files usually contain other
tooling tables that are not Tombi policy.

## Formatter policy

Put formatting options under `[format.rules]`:

```toml
# tombi.toml
[format.rules]
indent-width = 4
line-width = 100
string-quote-style = "double"
```

Common formatter areas include indentation, line width, quote style, spacing,
table blank lines, trailing comments, inline table spacing, and date-time
delimiter style.

Use Tombi's upstream [format rule reference](https://tombi-toml.github.io/tombi/docs/configuration#format-rules)
for the complete current option list.

## Linter policy

Put lint rule levels under `[lint.rules]`:

```toml
[lint.rules]
dotted-keys-out-of-order = "warn"
key-empty = "error"
tables-out-of-order = "warn"
```

Lint rule levels should be `error`, `warn`, or `off`. The configuration preset
reports common misspellings such as `warning`.

Use Tombi's upstream [lint rule reference](https://tombi-toml.github.io/tombi/docs/configuration#lint-rules)
for the complete current option list.

## File and schema policy

Use `[files]` for Tombi-side include and exclude patterns:

```toml
[files]
include = ["**/*.toml", "Cargo.lock"]
exclude = ["dist/**", "node_modules/**", "target/**"]
```

Use `[schema]`, `[[schemas]]`, and `[[schemas.overrides]]` for schema behavior:

```toml
[schema]
enabled = true
strict = false
```

Remote schema and catalog fetches still use the bridge cache defaults, so
repeated ESLint runs do not refetch the same resources.

Use Tombi's upstream references for [file options](https://tombi-toml.github.io/tombi/docs/configuration#files)
and [schema options](https://tombi-toml.github.io/tombi/docs/configuration#schema).

## Pyproject example

When a repository already owns `pyproject.toml`, put the same policy under
`[tool.tombi]`:

```toml
[tool.tombi.format.rules]
indent-width = 4
string-quote-style = "single"

[tool.tombi.lint.rules]
key-empty = "error"
```

The bridge will respect those settings while linting TOML files in that
project. The config-authoring rules stay focused on standalone Tombi config
files, so they do not report unrelated `pyproject.toml` tables.

## ESLint bridge options

Keep these in ESLint config:

```js
import tombi from "eslint-plugin-tombi";

export default [
 {
  ...tombi.configs.recommended,
  rules: {
   "tombi/tombi": [
    "error",
    {
     cache: { ttlSeconds: 60 * 60 * 24 * 30 },
     errorOnWarnings: true,
     httpTimeoutSeconds: 10,
     offline: false,
     timeoutMs: 30_000,
    },
   ],
  },
 },
];
```

Bridge options control subprocess execution, cache environment, network mode,
and ESLint fix behavior. They should not duplicate Tombi formatter, linter, or
schema policy.

See the upstream [configuration search priority](https://tombi-toml.github.io/tombi/docs/configuration#search-priority)
when multiple config files are present.
