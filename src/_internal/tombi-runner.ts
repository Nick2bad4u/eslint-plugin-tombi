/* eslint-disable n/no-sync -- ESLint rule execution is synchronous, so the bridge must use synchronous filesystem and subprocess APIs. */
/* eslint-disable n/no-process-env -- Tombi is configured through documented environment variables. */

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import * as path from "node:path";
import { isDefined } from "ts-extras";

import {
    parseTombiDiagnostics,
    type TombiDiagnostic,
} from "./tombi-diagnostics.js";

const DEFAULT_TIMEOUT_IN_MILLISECONDS = 30_000 as const;
const DEFAULT_CACHE_TTL_SECONDS = 60 ** 2 * 24 * 30;
const DEFAULT_HTTP_TIMEOUT_SECONDS = 5;
const packageRequire = createRequire(import.meta.url);
const resultCache = new Map<string, TombiBridgeResult>();

/**
 * Cache-related options forwarded to Tombi environment variables.
 */
export type TombiBridgeCacheOptions = Readonly<{
    directory?: string;
    noCache?: boolean;
    ttlSeconds?: number;
}>;

/**
 * Execution options for one Tombi bridge run.
 */
export type TombiBridgeOptions = Readonly<{
    cache?: TombiBridgeCacheOptions;
    code: string;
    codeFilename: string;
    cwd: string;
    errorOnWarnings?: boolean;
    httpTimeoutSeconds?: number;
    noCache?: boolean;
    offline?: boolean;
    quiet?: boolean;
    runFormat?: boolean;
    runLint?: boolean;
    timeoutMs?: number;
    tombiPath?: string;
    verbose?: 0 | 1 | 2;
}>;

/**
 * Captured result from Tombi lint and format subprocesses.
 */
export type TombiBridgeResult = Readonly<{
    diagnostics: readonly TombiDiagnostic[];
    formattedText: string;
    lintExitCode: null | number;
    stderr: string;
    stdout: string;
}>;

type PlatformBinaryMap = Readonly<
    Record<string, Readonly<Record<string, string>>>
>;

const platformBinaries: PlatformBinaryMap = {
    darwin: {
        arm64: "@tombi-toml/cli-darwin-arm64/tombi",
        x64: "@tombi-toml/cli-darwin-x64/tombi",
    },
    linux: {
        arm64: "@tombi-toml/cli-linux-arm64/tombi",
        x64: "@tombi-toml/cli-linux-x64/tombi",
    },
    "linux-musl": {
        arm64: "@tombi-toml/cli-linux-arm64-musl/tombi",
        x64: "@tombi-toml/cli-linux-x64-musl/tombi",
    },
    win32: {
        arm64: "@tombi-toml/cli-win32-arm64/tombi.exe",
        x64: "@tombi-toml/cli-win32-x64/tombi.exe",
    },
};

const isLinuxMusl = (): boolean => {
    if (process.platform !== "linux") return false;

    let lddCommand: string | undefined;
    if (existsSync("/bin/ldd")) {
        lddCommand = "/bin/ldd";
    } else if (existsSync("/usr/bin/ldd")) {
        lddCommand = "/usr/bin/ldd";
    }

    if (!isDefined(lddCommand)) return false;

    const result = spawnSync(lddCommand, ["--version"], {
        encoding: "utf8",
        shell: false,
    });
    return `${result.stdout}${result.stderr}`.includes("musl");
};

const resolveTombiBinary = (explicitPath: string | undefined): string => {
    if (isDefined(explicitPath) && explicitPath !== "") return explicitPath;
    const platformKey =
        process.platform === "linux" && isLinuxMusl()
            ? "linux-musl"
            : process.platform;
    const packageSpecifier = platformBinaries[platformKey]?.[process.arch];
    if (!isDefined(packageSpecifier)) {
        throw new Error(
            `Tombi does not publish a native binary for ${platformKey}/${process.arch}.`
        );
    }
    try {
        return packageRequire.resolve(packageSpecifier);
    } catch (error: unknown) {
        throw new Error(
            `Unable to resolve the bundled Tombi binary "${packageSpecifier}". Reinstall eslint-plugin-tombi with optional dependencies enabled.`,
            { cause: error }
        );
    }
};

const resolveCacheDirectory = (
    cacheDirectory: string | undefined,
    cwd: string
): string => {
    const directory =
        isDefined(cacheDirectory) && cacheDirectory !== ""
            ? cacheDirectory
            : path.join(".cache", "eslint-plugin-tombi", "tombi");
    return path.isAbsolute(directory)
        ? directory
        : path.resolve(cwd, directory);
};

const createEnvironment = (options: TombiBridgeOptions): NodeJS.ProcessEnv => {
    const cacheDirectory = resolveCacheDirectory(
        options.cache?.directory,
        options.cwd
    );
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- The cache directory is resolved under cwd by default and user-configurable by design.
    mkdirSync(cacheDirectory, { recursive: true });
    return {
        ...process.env,
        JS_RUNTIME_NAME: process.release.name,
        JS_RUNTIME_VERSION: process.version,
        TOMBI_CACHE_HOME: cacheDirectory,
        TOMBI_CACHE_TTL: String(
            options.cache?.ttlSeconds ?? DEFAULT_CACHE_TTL_SECONDS
        ),
        TOMBI_HTTP_TIMEOUT: String(
            options.httpTimeoutSeconds ?? DEFAULT_HTTP_TIMEOUT_SECONDS
        ),
        ...((options.cache?.noCache === true || options.noCache === true) && {
            TOMBI_NO_CACHE: "true",
        }),
        ...(options.offline === true && { TOMBI_OFFLINE: "true" }),
    };
};

/**
 * Build the Tombi subprocess environment for unit tests.
 *
 * @internal
 */
export const createTombiEnvironmentForTesting = (
    options: TombiBridgeOptions
): NodeJS.ProcessEnv => createEnvironment(options);

const verbosityArguments = (
    verbose: TombiBridgeOptions["verbose"]
): string[] => {
    if (verbose === 2) return ["-vv"];
    if (verbose === 1) return ["-v"];
    return [];
};

/**
 * Build Tombi CLI arguments for one subprocess.
 *
 * @internal
 */
export const buildTombiArgumentsForTesting = (
    command: "format" | "lint",
    options: TombiBridgeOptions
): readonly string[] => [
    command,
    "--stdin-filename",
    options.codeFilename,
    ...(options.quiet === false ? [] : ["--quiet"]),
    ...(options.offline === true ? ["--offline"] : []),
    ...(options.cache?.noCache === true || options.noCache === true
        ? ["--no-cache"]
        : []),
    ...verbosityArguments(options.verbose),
    ...(command === "lint" && options.errorOnWarnings === true
        ? ["--error-on-warnings"]
        : []),
    "-",
];

const runTombiCommand = (
    command: "format" | "lint",
    options: TombiBridgeOptions
): { status: null | number; stderr: string; stdout: string } => {
    const binaryPath = resolveTombiBinary(options.tombiPath);
    const args = buildTombiArgumentsForTesting(command, options);
    const result = spawnSync(binaryPath, args, {
        cwd: options.cwd,
        encoding: "utf8",
        env: createEnvironment(options),
        input: options.code,
        maxBuffer: 1024 ** 2 * 20,
        shell: false,
        timeout: options.timeoutMs ?? DEFAULT_TIMEOUT_IN_MILLISECONDS,
        windowsHide: true,
    });
    if (isDefined(result.error)) throw result.error;
    return {
        status: result.status,
        stderr: result.stderr,
        stdout: result.stdout,
    };
};

/**
 * Run Tombi lint and format against one ESLint source text synchronously.
 */
export const runTombiSynchronously = (
    options: TombiBridgeOptions
): TombiBridgeResult => {
    const cacheKey = JSON.stringify(options);
    const cachedResult = resultCache.get(cacheKey);
    if (isDefined(cachedResult)) return cachedResult;

    const shouldRunFormat = options.runFormat ?? true;
    const shouldRunLint = options.runLint ?? true;
    const formatResult = shouldRunFormat
        ? runTombiCommand("format", options)
        : { status: 0, stderr: "", stdout: options.code };
    const lintResult = shouldRunLint
        ? runTombiCommand("lint", options)
        : { status: 0, stderr: "", stdout: "" };
    const stderr = `${formatResult.stderr}${lintResult.stderr}`;
    const stdout = `${formatResult.stdout}${lintResult.stdout}`;
    const result: TombiBridgeResult = {
        diagnostics: parseTombiDiagnostics(`${stderr}${stdout}`),
        formattedText:
            formatResult.status === 0 && formatResult.stdout !== ""
                ? formatResult.stdout
                : options.code,
        lintExitCode: lintResult.status,
        stderr,
        stdout,
    };
    resultCache.set(cacheKey, result);
    return result;
};

/* eslint-enable n/no-sync -- Re-enable after synchronous ESLint bridge helpers. */
/* eslint-enable n/no-process-env -- Re-enable after Tombi environment helpers. */
