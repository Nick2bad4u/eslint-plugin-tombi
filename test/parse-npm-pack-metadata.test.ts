import { describe, expect, it } from "vitest";

import { parseNpmPackFilename } from "../scripts/parse-npm-pack-metadata.mjs";

const packageName = "eslint-plugin-tombi";

describe(parseNpmPackFilename, () => {
    it("accepts the npm 11 array shape", () => {
        expect.assertions(1);

        expect(
            parseNpmPackFilename(
                JSON.stringify([
                    {
                        filename: "eslint-plugin-tombi-2.0.2.tgz",
                        name: packageName,
                    },
                ]),
                packageName
            )
        ).toBe("eslint-plugin-tombi-2.0.2.tgz");
    });

    it("accepts the npm 12 package-name-keyed object shape", () => {
        expect.assertions(1);

        expect(
            parseNpmPackFilename(
                JSON.stringify({
                    [packageName]: {
                        filename: "eslint-plugin-tombi-2.0.2.tgz",
                        name: packageName,
                    },
                }),
                packageName
            )
        ).toBe("eslint-plugin-tombi-2.0.2.tgz");
    });

    it("throws for invalid JSON", () => {
        expect.assertions(1);

        expect(() => parseNpmPackFilename("not JSON", packageName)).toThrow(
            "valid JSON"
        );
    });

    it.each([
        [
            "no records",
            "{}",
            "exactly one npm pack record",
        ],
        [
            "multiple records",
            JSON.stringify([
                { filename: "first.tgz" },
                { filename: "second.tgz" },
            ]),
            "exactly one npm pack record",
        ],
        [
            "a mismatched package",
            JSON.stringify({ other: { filename: "other.tgz" } }),
            'expected "eslint-plugin-tombi"',
        ],
        [
            "a blank filename",
            JSON.stringify({
                [packageName]: {
                    filename: " ".repeat(3),
                    name: packageName,
                },
            }),
            "no nonblank filename",
        ],
    ])("rejects %s", (_label, input, expectedMessage) => {
        expect.assertions(1);

        expect(() => parseNpmPackFilename(input, packageName)).toThrow(
            expectedMessage
        );
    });
});
