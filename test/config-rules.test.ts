import { ESLint, type Linter } from "eslint";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import tombiPlugin from "../src/plugin";

const configRules = tombiPlugin.configs.configuration as Linter.Config;
const configFixturesDirectory = fileURLToPath(
    new URL("fixtures/config/", import.meta.url)
);
const readConfigFixture = (fixtureName: string): string =>
    readFileSync(new URL(`fixtures/config/${fixtureName}`, import.meta.url), {
        encoding: "utf8",
    });

const createConfigRuleEngine = (): ESLint =>
    new ESLint({
        overrideConfig: [
            {
                ...configRules,
                files: ["**/*.toml"],
            },
        ],
        overrideConfigFile: true,
    });

describe("tombi config rules", () => {
    it("reports config-authoring problems through the configuration preset", async () => {
        expect.assertions(7);

        const eslint = createConfigRuleEngine();
        const [result] = await eslint.lintText(
            [
                "[formats]",
                "[files]",
                "include = []",
                'exclude = [""]',
                "[lint.rules]",
                'array-values-order = "warning"',
                "[schema]",
                'catalog-path = "https://www.schemastore.org/api/json/catalog.json"',
                "",
            ].join("\n"),
            { filePath: "tombi.config.toml" }
        );
        const ruleIds = new Set(
            (result?.messages ?? []).map((message) => message.ruleId)
        );

        expect(ruleIds).toContain(
            "tombi/require-tombi-config-file-naming-convention"
        );
        expect(ruleIds).toContain(
            "tombi/disallow-tombi-unknown-config-properties"
        );
        expect(ruleIds).toContain("tombi/disallow-tombi-empty-files-include");
        expect(ruleIds).toContain("tombi/disallow-tombi-empty-files-exclude");
        expect(ruleIds).toContain("tombi/require-tombi-valid-lint-rule-levels");
        expect(ruleIds).toContain("tombi/prefer-tombi-builtin-schema-catalog");
        expect(
            result?.messages.map((message) => message.severity)
        ).toStrictEqual(expect.arrayContaining([1]));
    });

    it("accepts valid standalone Tombi config files", async () => {
        expect.assertions(1);

        const eslint = createConfigRuleEngine();
        const [result] = await eslint.lintText(
            readConfigFixture("standalone-valid.toml"),
            { filePath: `${configFixturesDirectory}/.config/tombi.toml` }
        );

        expect(result?.messages).toHaveLength(0);
    });

    it("keeps pyproject.toml out of the standalone config file glob", () => {
        expect.assertions(1);

        expect(configRules.files).toStrictEqual([
            "**/.config/tombi.toml",
            "**/.tombi.toml",
            "**/tombi.toml",
        ]);
    });

    it("reports missing files include only in the full configuration preset", async () => {
        expect.assertions(1);

        const eslint = createConfigRuleEngine();
        const [result] = await eslint.lintText("[format]\nindent-width = 4\n", {
            filePath: "tombi.toml",
        });

        expect(
            result?.messages.some(
                (message) =>
                    message.ruleId === "tombi/prefer-tombi-files-include-array"
            )
        ).toBe(true);
    });
});
