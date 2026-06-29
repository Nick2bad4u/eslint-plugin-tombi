# Tool behavior to rule map

Use this page to decide whether a setting belongs in Tombi or ESLint.

| Concern                           | Source of truth | ESLint surface                   |
| --------------------------------- | --------------- | -------------------------------- |
| TOML parsing                      | Tombi           | `tombi/tombi` reports output.    |
| Tombi lint diagnostics            | Tombi           | `lint` option controls running.  |
| Format drift                      | Tombi           | `check` option controls reports. |
| Formatting fixes                  | Tombi           | `format` option controls fixes.  |
| Schema/catalog cache directory    | Bridge          | `cache.directory`.               |
| Schema/catalog cache TTL          | Bridge          | `cache.ttlSeconds`.              |
| Offline and no-cache behavior     | Bridge          | `offline`, `noCache`.            |
| Formatter, schema, override rules | Tombi config    | Do not duplicate in ESLint.      |

If the issue changes TOML semantics, keep it in Tombi config. If it changes how ESLint invokes Tombi or displays results, configure `tombi/tombi`.
