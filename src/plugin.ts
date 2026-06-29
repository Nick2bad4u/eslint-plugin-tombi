import type { ESLint, Linter } from "eslint";

import * as tomlParser from "toml-eslint-parser";

// eslint-disable-next-line import-x/extensions -- Node JSON import attributes require the file extension at runtime.
import packageJson from "../package.json" with { type: "json" };
import { tombiRules } from "./_internal/rules-registry.js";

/**
 * TombiConfigName tombi config name contract.
 */
export type TombiConfigName =
    "all" | "check" | "format" | "lint" | "recommended" | "tombiOnly" | "toml";

const pluginName = "eslint-plugin-tombi" as const;
const pluginNamespace = "tombi" as const;
const bridgeFiles = ["**/*.toml", "**/Cargo.lock"] as const;

/**
 * TombiConfig tombi config contract.
 */
export type TombiConfig = Linter.Config | readonly Linter.Config[];
/**
 * TombiConfigs tombi configs contract.
 */
export type TombiConfigs = Record<TombiConfigName, TombiConfig>;
/**
 * TombiRuleId tombi rule id contract.
 */
export type TombiRuleId = `tombi/${TombiRuleName}`;
/**
 * TombiRuleName tombi rule name contract.
 */
export type TombiRuleName = keyof typeof tombiRules;

const eslintPluginRules: typeof tombiRules = tombiRules;
const version =
    typeof packageJson.version === "string" ? packageJson.version : "0.0.0";

/**
 * ESLint plugin object exported by `eslint-plugin-tombi`.
 */
const tombiPlugin: {
    configs: TombiConfigs;
    meta: { name: string; namespace: string; version: string };
    processors: NonNullable<ESLint.Plugin["processors"]>;
    rules: typeof eslintPluginRules;
} = {
    configs: {
        all: [],
        check: {},
        format: {},
        lint: {},
        recommended: [],
        tombiOnly: {},
        toml: {},
    },
    meta: { name: pluginName, namespace: pluginNamespace, version },
    processors: {},
    rules: eslintPluginRules,
};
const tombiPluginForEslint =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- ESLint's public Plugin type requires mutable option/config arrays, while this package exposes readonly typed rule metadata internally.
    tombiPlugin as unknown as ESLint.Plugin;

const tombiOnlyPreset: Linter.Config = {
    files: [...bridgeFiles],

    languageOptions: { parser: tomlParser },
    name: "tombi:tombiOnly",
    plugins: { [pluginNamespace]: tombiPluginForEslint },
    rules: { "tombi/tombi": "error" },
};

const lintPreset: Linter.Config = {
    ...tombiOnlyPreset,
    name: "tombi:lint",
    rules: { "tombi/tombi": ["error", { check: false, format: false }] },
};

const checkPreset: Linter.Config = {
    ...tombiOnlyPreset,
    name: "tombi:check",
    rules: { "tombi/tombi": ["error", { lint: false }] },
};

const formatPreset: Linter.Config = {
    ...tombiOnlyPreset,
    name: "tombi:format",
    rules: {
        "tombi/tombi": ["error", { check: true, format: true, lint: false }],
    },
};

tombiPlugin.configs = {
    all: tombiOnlyPreset,
    check: checkPreset,
    format: formatPreset,
    lint: lintPreset,
    recommended: tombiOnlyPreset,
    tombiOnly: tombiOnlyPreset,
    toml: tombiOnlyPreset,
};

/**
 * TombiPlugin tombi plugin contract.
 */
export type TombiPlugin = typeof tombiPlugin;
export default tombiPlugin;
