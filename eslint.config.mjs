import { createConfig } from "eslint-config-nick2bad4u";

import plugin from "./plugin.mjs";

const tombiPlugin = /** @type {import("./src/plugin").TombiPlugin} */ (plugin);
const tomlPreset = tombiPlugin.configs.toml;
if (Array.isArray(tomlPreset))
    throw new TypeError(
        "Expected tombi.configs.toml to be a flat config object."
    );
const localConfigurationPreset = /** @type {import("eslint").Linter.Config} */ (
    tomlPreset
);
const allowStripAnsiBanDependenciesRule =
    /** @type {import("eslint").Linter.RuleEntry} */ ([
        "error",
        { allowed: ["strip-ansi"] },
    ]);
const sharedConfig = createConfig({
    allowDefaultProjectFilePatterns: [
        ".remarkrc.mjs",
        "eslint.config.mjs",
        "knip.config.ts",
        "prettier.config.mjs",
        "stylelint.config.mjs",
    ],
    plugins: { tombi: false },
}).map((configEntry) => {
    if (configEntry.rules?.["depend/ban-dependencies"] === undefined)
        return configEntry;
    return {
        ...configEntry,
        rules: {
            ...configEntry.rules,
            "depend/ban-dependencies": allowStripAnsiBanDependenciesRule,
        },
    };
});

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...sharedConfig,
    {
        ignores: [
            ".github/workflows/**",
            "dist/**",
            "coverage/**",
            ".cache/**",
            "cliff.toml",
            "docs/docusaurus/.docusaurus/**",
            "docs/docusaurus/build/**",
            "docs/docusaurus/static/manifest.json",
            "docs/docusaurus/site-docs/**",
            "docs/docusaurus/static/*-inspector/**",
            "plugin.*",
            "test/**/*.test-d.ts",
        ],
    },
    {
        ...localConfigurationPreset,
        ignores: [...(localConfigurationPreset.ignores ?? [])],
        name: "Local Tombi TOML bridge",
    },
];

export default config;
