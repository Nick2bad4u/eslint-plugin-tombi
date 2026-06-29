import { describe, expect, it } from "vitest";

import {
    buildTombiArgumentsForTesting,
    createTombiEnvironmentForTesting,
    runTombiSynchronously,
} from "../src/_internal/tombi-runner";

describe("tombi runner environment", () => {
    it("defaults schema cache TTL to thirty days", () => {
        expect.assertions(3);

        const environment = createTombiEnvironmentForTesting({
            code: 'name = "demo"\n',
            codeFilename: "sample.toml",
            cwd: process.cwd(),
        });

        expect(
            environment["TOMBI_CACHE_HOME"]?.replaceAll("\\", "/")
        ).toContain(".cache/eslint-plugin-tombi/tombi");
        expect(environment["TOMBI_CACHE_TTL"]).toBe(String(60 ** 2 * 24 * 30));
        expect(environment).not.toHaveProperty("TOMBI_NO_CACHE");
    });

    it("forwards cache, offline, no-cache, and HTTP timeout options", () => {
        expect.assertions(5);

        const environment = createTombiEnvironmentForTesting({
            cache: {
                directory: "custom-cache",
                noCache: true,
                ttlSeconds: 42,
            },
            code: 'name = "demo"\n',
            codeFilename: "sample.toml",
            cwd: process.cwd(),
            httpTimeoutSeconds: 17,
            offline: true,
        });

        expect(environment["TOMBI_CACHE_HOME"]).toContain("custom-cache");
        expect(environment["TOMBI_CACHE_TTL"]).toBe("42");
        expect(environment["TOMBI_HTTP_TIMEOUT"]).toBe("17");
        expect(environment["TOMBI_NO_CACHE"]).toBe("true");
        expect(environment["TOMBI_OFFLINE"]).toBe("true");
    });

    it("passes bridge execution options as Tombi CLI flags", () => {
        expect.assertions(1);

        expect(
            buildTombiArgumentsForTesting("lint", {
                cache: {
                    noCache: true,
                },
                code: 'name = "demo"\n',
                codeFilename: "sample.toml",
                cwd: process.cwd(),
                errorOnWarnings: true,
                offline: true,
                verbose: 2,
            })
        ).toStrictEqual([
            "lint",
            "--stdin-filename",
            "sample.toml",
            "--quiet",
            "--offline",
            "--no-cache",
            "-vv",
            "--error-on-warnings",
            "-",
        ]);
    });

    it("omits quiet and no-cache flags when the user disables them", () => {
        expect.assertions(1);

        expect(
            buildTombiArgumentsForTesting("format", {
                code: 'name = "demo"\n',
                codeFilename: "sample.toml",
                cwd: process.cwd(),
                noCache: false,
                quiet: false,
                verbose: 1,
            })
        ).toStrictEqual([
            "format",
            "--stdin-filename",
            "sample.toml",
            "-v",
            "-",
        ]);
    });

    it("returns source text when both Tombi subprocesses are disabled", () => {
        expect.assertions(5);

        const result = runTombiSynchronously({
            code: 'name="demo"\n',
            codeFilename: "sample.toml",
            cwd: process.cwd(),
            runFormat: false,
            runLint: false,
        });

        expect(result.diagnostics).toHaveLength(0);
        expect(result.formattedText).toBe('name="demo"\n');
        expect(result.lintExitCode).toBe(0);
        expect(result.stderr).toBe("");
        expect(result.stdout).toBe('name="demo"\n');
    });

    it("throws subprocess errors from explicit Tombi executable paths", () => {
        expect.assertions(1);

        expect(() =>
            runTombiSynchronously({
                code: 'name = "demo"\n',
                codeFilename: "sample.toml",
                cwd: process.cwd(),
                tombiPath: "missing-tombi-executable-for-test",
            })
        ).toThrow("missing-tombi-executable-for-test");
    });
});
