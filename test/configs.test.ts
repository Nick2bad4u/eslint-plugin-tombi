import type { Linter } from "eslint";

import { describe, expect, it } from "vitest";

import tombiPlugin, {
    type TombiConfig,
    type TombiConfigName,
} from "../src/plugin";

const expectedConfigNames = [
    "all",
    "check",
    "configs",
    "configuration",
    "format",
    "lint",
    "recommended",
    "toml",
    "tombiOnly",
] satisfies readonly TombiConfigName[];

const toNameSet = (values: Iterable<string>): ReadonlySet<string> =>
    new Set(values);

const isConfigArray = (
    config: TombiConfig
): config is readonly Linter.Config[] => Array.isArray(config);

const firstConfig = (config: TombiConfig): Linter.Config =>
    isConfigArray(config) ? (config[0] ?? {}) : config;

describe("tombi plugin configs", () => {
    it("exports exactly the supported config keys", () => {
        expect.assertions(1);

        expect(toNameSet(Object.keys(tombiPlugin.configs))).toStrictEqual(
            toNameSet(expectedConfigNames)
        );
    });

    it("keeps primary aliases wired to the recommended bridge preset", () => {
        expect.assertions(3);

        expect(Array.isArray(tombiPlugin.configs.all)).toBe(true);
        expect(Array.isArray(tombiPlugin.configs.recommended)).toBe(true);
        expect(tombiPlugin.configs.toml).toBe(tombiPlugin.configs.tombiOnly);
    });

    it("targets TOML files and Cargo lockfiles", () => {
        expect.assertions(2);

        const config = firstConfig(tombiPlugin.configs.tombiOnly);

        expect(config.files).toStrictEqual(["**/*.toml", "**/Cargo.lock"]);
        expect(config.rules).toStrictEqual({ "tombi/tombi": "error" });
    });

    it("exposes mode presets for lint-only, check, and format runs", () => {
        expect.assertions(3);

        expect(firstConfig(tombiPlugin.configs.lint).rules).toStrictEqual({
            "tombi/tombi": ["error", { check: false, format: false }],
        });
        expect(firstConfig(tombiPlugin.configs.check).rules).toStrictEqual({
            "tombi/tombi": ["error", { lint: false }],
        });
        expect(firstConfig(tombiPlugin.configs.format).rules).toStrictEqual({
            "tombi/tombi": [
                "error",
                { check: true, format: true, lint: false },
            ],
        });
    });

    it("exposes a configuration preset alias for standalone Tombi configs", () => {
        expect.assertions(3);

        const config = firstConfig(tombiPlugin.configs.configuration);

        expect(tombiPlugin.configs.configs).toBe(
            tombiPlugin.configs.configuration
        );
        expect(config.files).toStrictEqual([
            "**/.config/tombi.toml",
            "**/.tombi.toml",
            "**/tombi.toml",
        ]);
        expect(config.rules).toHaveProperty(
            "tombi/require-tombi-config-file-naming-convention"
        );
    });
});
