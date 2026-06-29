import { ESLint, type Linter } from "eslint";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import tombiPlugin from "../src/plugin";

const bridgeConfig = tombiPlugin.configs.tombiOnly as Linter.Config;
const fixturesDirectory = fileURLToPath(
    new URL("fixtures/bridge/", import.meta.url)
);
const readConfigFixture = (fixtureName: string): string =>
    readFileSync(new URL(`fixtures/config/${fixtureName}`, import.meta.url), {
        encoding: "utf8",
    });

const usingTemporaryDirectory = async <Result>(
    prefix: string,
    callback: (temporaryDirectory: string) => Promise<Result>
): Promise<Result> => {
    const temporaryDirectory = mkdtempSync(path.join(tmpdir(), prefix));
    try {
        return await callback(temporaryDirectory);
    } finally {
        rmSync(temporaryDirectory, { force: true, recursive: true });
    }
};

const createEngine = (
    ruleOptions: Readonly<Record<string, unknown>> = {},
    options: Readonly<{ cwd?: string; fix?: boolean }> = {}
): ESLint =>
    new ESLint({
        ...(options.cwd !== undefined && { cwd: options.cwd }),
        ...(options.fix !== undefined && { fix: options.fix }),
        overrideConfig: [
            {
                ...bridgeConfig,
                rules: {
                    "tombi/tombi": ["error", ruleOptions],
                },
            },
        ],
        overrideConfigFile: true,
    });

describe("tombi bridge rule", () => {
    it("accepts already formatted valid TOML files without diagnostics", async () => {
        expect.assertions(1);

        const eslint = createEngine();
        const [result] = await eslint.lintText('name = "demo"\n', {
            filePath: "sample.toml",
        });

        expect(result?.messages).toHaveLength(0);
    }, 30_000);

    it("lints TOML fixture files from disk", async () => {
        expect.assertions(4);

        const eslint = createEngine(
            { check: false, format: false, timeoutMs: 30_000 },
            { cwd: fixturesDirectory }
        );
        const results = await eslint.lintFiles(["invalid.toml", "valid.toml"]);
        const messagesByBasename = new Map(
            results.map((result) => [
                path.basename(result.filePath),
                result.messages,
            ])
        );
        const invalidMessages = messagesByBasename.get("invalid.toml") ?? [];

        expect(messagesByBasename.get("valid.toml")).toHaveLength(0);
        expect(invalidMessages.length).toBeGreaterThan(0);
        expect(invalidMessages[0]?.ruleId).toBe("tombi/tombi");
        expect(
            invalidMessages.some((message) =>
                message.message.includes("An empty key is discouraged")
            )
        ).toBe(true);
    }, 30_000);

    it("reports Tombi warnings through ESLint", async () => {
        expect.assertions(3);

        const eslint = createEngine({ check: false, format: false });
        const [result] = await eslint.lintText('"" = "discouraged"\n', {
            filePath: "sample.toml",
        });

        expect(result?.messages).toHaveLength(1);
        expect(result?.messages[0]?.ruleId).toBe("tombi/tombi");
        expect(result?.messages[0]?.message).toContain(
            "Tombi warning: An empty key is discouraged"
        );
    }, 30_000);

    it("reports Tombi formatting differences and applies fixes", async () => {
        expect.assertions(3);

        const unformattedText = "[package]\nname='demo'\n";

        const lintingEslint = createEngine({ lint: false });
        const [lintResult] = await lintingEslint.lintText(unformattedText, {
            filePath: "Cargo.toml",
        });
        const fixingEslint = createEngine({ lint: false }, { fix: true });
        const [fixResult] = await fixingEslint.lintText(unformattedText, {
            filePath: "Cargo.toml",
        });

        expect(lintResult?.messages).toHaveLength(1);
        expect(fixResult?.output).not.toBe(unformattedText);
        expect(fixResult?.output).toContain('name = "demo"');
    }, 30_000);

    it("can report formatting differences without offering a fixer", async () => {
        expect.assertions(2);

        const eslint = createEngine(
            { format: false, lint: false },
            { fix: true }
        );
        const [result] = await eslint.lintText("[package]\nname='demo'\n", {
            filePath: "Cargo.toml",
        });

        expect(result?.messages).toHaveLength(1);
        expect(result?.output).toBeUndefined();
    }, 30_000);

    it("does nothing when all bridge modes are disabled", async () => {
        expect.assertions(1);

        const eslint = createEngine({
            check: false,
            format: false,
            lint: false,
        });
        const [result] = await eslint.lintText("[package]\nname='demo'\n", {
            filePath: "Cargo.toml",
        });

        expect(result?.messages).toHaveLength(0);
    }, 30_000);

    it("reports Tombi execution failures as ESLint diagnostics", async () => {
        expect.assertions(2);

        const eslint = createEngine({
            tombiPath: "missing-tombi-executable-for-test",
        });
        const [result] = await eslint.lintText('name = "demo"\n', {
            filePath: "sample.toml",
        });

        expect(result?.messages).toHaveLength(1);
        expect(result?.messages[0]?.message).toContain(
            "Tombi execution error:"
        );
    }, 30_000);

    it("lets native Tombi discover local tombi.toml configuration", async () => {
        expect.assertions(1);

        await usingTemporaryDirectory(
            "tombi-bridge-config-",
            async (temporaryDirectory) => {
                writeFileSync(
                    path.join(temporaryDirectory, "tombi.toml"),
                    readConfigFixture("standalone-valid.toml")
                );
                const eslint = createEngine(
                    { lint: false },
                    { cwd: temporaryDirectory, fix: true }
                );
                const [result] = await eslint.lintText(
                    '[package]\nname = "demo"\n',
                    { filePath: path.join(temporaryDirectory, "Cargo.toml") }
                );

                expect(result?.output).toBe("[package]\nname = 'demo'\n");
            }
        );
    }, 30_000);

    it("lets native Tombi discover pyproject tool.tombi configuration", async () => {
        expect.assertions(1);

        await usingTemporaryDirectory(
            "tombi-bridge-pyproject-",
            async (temporaryDirectory) => {
                writeFileSync(
                    path.join(temporaryDirectory, "pyproject.toml"),
                    readConfigFixture("pyproject.toml")
                );
                const eslint = createEngine(
                    { lint: false },
                    { cwd: temporaryDirectory, fix: true }
                );
                const [result] = await eslint.lintText('name = "demo"\n', {
                    filePath: path.join(temporaryDirectory, "sample.toml"),
                });

                expect(result?.output).toBe("name = 'demo'\n");
            }
        );
    }, 30_000);
});
