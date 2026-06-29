import type { Linter } from "eslint";

import { describe, expect, it } from "vitest";

import tombiPlugin, {
    type TombiConfig,
    type TombiConfigName,
} from "../src/plugin";

const expectedConfigNames = [
    "all",
    "check",
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
        expect.assertions(2);

        expect(toNameSet(Object.keys(tombiPlugin.configs))).toStrictEqual(
            toNameSet(expectedConfigNames)
        );
        expect(tombiPlugin.configs).not.toHaveProperty("configuration");
    });

    it("keeps primary aliases wired to the recommended bridge preset", () => {
        expect.assertions(3);

        expect(tombiPlugin.configs.all).toBe(tombiPlugin.configs.tombiOnly);
        expect(tombiPlugin.configs.recommended).toBe(
            tombiPlugin.configs.tombiOnly
        );
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
});
