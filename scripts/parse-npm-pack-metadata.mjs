import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

/**
 * @param {unknown} value Candidate value.
 *
 * @returns {value is Record<string, unknown>} Whether the value is a record.
 */
const isRecord = (value) =>
    typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Parse npm pack JSON and return the sole package filename.
 *
 * Npm 11 and older return an array. npm 12 returns an object keyed by package
 * name. Releases must reject ambiguous or malformed output in either shape.
 *
 * @param {string} text Raw `npm pack --json` output.
 * @param {string} expectedPackageName Expected package name.
 *
 * @returns {string} The nonblank tarball filename.
 */
export const parseNpmPackFilename = (text, expectedPackageName) => {
    /** @type {unknown} */
    let metadata;

    try {
        metadata = JSON.parse(text);
    } catch (error) {
        throw new Error("npm pack did not produce valid JSON.", {
            cause: error,
        });
    }

    /** @type {readonly [string | undefined, unknown][]} */
    const entries = Array.isArray(metadata)
        ? metadata.map((record) => [undefined, record])
        : isRecord(metadata)
          ? Object.entries(metadata)
          : [];

    if (entries.length !== 1) {
        throw new Error(
            `Expected exactly one npm pack record, received ${entries.length}.`
        );
    }

    const [objectKey, record] = entries[0] ?? [];

    if (!isRecord(record)) {
        throw new TypeError("The npm pack record must be an object.");
    }

    if (objectKey !== undefined && objectKey !== expectedPackageName) {
        throw new Error(
            `npm pack returned package key ${JSON.stringify(objectKey)}; expected ${JSON.stringify(expectedPackageName)}.`
        );
    }

    if (
        typeof record.name === "string" &&
        record.name !== expectedPackageName
    ) {
        throw new Error(
            `npm pack returned package ${JSON.stringify(record.name)}; expected ${JSON.stringify(expectedPackageName)}.`
        );
    }

    if (
        typeof record.filename !== "string" ||
        record.filename.trim().length === 0
    ) {
        throw new Error("The npm pack record has no nonblank filename.");
    }

    return record.filename;
};

const isMainModule =
    process.argv[1] !== undefined &&
    import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
    const [
        ,
        ,
        metadataPath,
        expectedPackageName,
    ] = process.argv;

    if (metadataPath === undefined || expectedPackageName === undefined) {
        console.error(
            "Usage: node scripts/parse-npm-pack-metadata.mjs <metadata-path> <package-name>"
        );
        process.exitCode = 1;
    } else {
        try {
            const text = readFileSync(metadataPath, "utf8");
            process.stdout.write(
                parseNpmPackFilename(text, expectedPackageName)
            );
        } catch (error) {
            console.error(error instanceof Error ? error.message : error);
            process.exitCode = 1;
        }
    }
}
