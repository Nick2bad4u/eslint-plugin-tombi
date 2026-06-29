import { describe, expect, it } from "vitest";

import { parseTombiDiagnostics } from "../src/_internal/tombi-diagnostics";

describe(parseTombiDiagnostics, () => {
    it("parses ANSI-colored Tombi errors", () => {
        expect.assertions(1);

        expect(
            parseTombiDiagnostics(
                "\u{1B}[1;31m  Error\u{1B}[0m: \u{1B}[1mduplicate key: a\u{1B}[0m\n    \u{1B}[90mat\u{1B}[0m \u{1B}[36msample.toml:2:1\u{1B}[0m"
            )
        ).toStrictEqual([
            {
                column: 1,
                line: 2,
                message: "duplicate key: a",
                severity: "error",
            },
        ]);
    });

    it("parses Tombi warnings and Windows paths", () => {
        expect.assertions(1);

        expect(
            parseTombiDiagnostics(
                "Warning: An empty key is discouraged\n    at C:\\Repos\\demo\\sample.toml:12:9"
            )
        ).toStrictEqual([
            {
                column: 9,
                line: 12,
                message: "An empty key is discouraged",
                severity: "warning",
            },
        ]);
    });

    it("parses parser-style line and column diagnostics", () => {
        expect.assertions(1);

        expect(
            parseTombiDiagnostics(
                "  Error: invalid token\n    at line 1 column 4"
            )
        ).toStrictEqual([
            {
                column: 4,
                line: 1,
                message: "invalid token",
                severity: "error",
            },
        ]);
    });

    it("parses multiple diagnostics without inventing matches", () => {
        expect.assertions(1);

        expect(
            parseTombiDiagnostics(
                [
                    "Info: informational note",
                    "    at ./one.toml:3:4",
                    "not a diagnostic",
                    "Warning: An empty key is discouraged",
                    "    at ./two.toml:8:1",
                ].join("\n")
            )
        ).toStrictEqual([
            {
                column: 4,
                line: 3,
                message: "informational note",
                severity: "info",
            },
            {
                column: 1,
                line: 8,
                message: "An empty key is discouraged",
                severity: "warning",
            },
        ]);
    });

    it("returns no diagnostics for unrelated output", () => {
        expect.assertions(1);

        expect(parseTombiDiagnostics("Checked 2 files")).toStrictEqual([]);
    });
});
