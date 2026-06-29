import { isDefined } from "ts-extras";

import {
    runTombiSynchronously,
    type TombiBridgeCacheOptions,
    type TombiBridgeOptions,
} from "../_internal/tombi-runner.js";
import {
    createTypedRule,
    type RuleModuleWithDocs,
    toRuleListener,
} from "../_internal/typed-rule.js";

type MessageIds = "tombiExecutionError" | "tombiFormat" | "tombiProblem";
type Options = [TombiRuleOption?];
type ReportLocation = Readonly<{
    end: { column: number; line: number };
    start: { column: number; line: number };
}>;

type TombiRuleOption = Readonly<{
    cache?: TombiBridgeCacheOptions;
    check?: boolean;
    errorOnWarnings?: boolean;
    format?: boolean;
    httpTimeoutSeconds?: number;
    lint?: boolean;
    noCache?: boolean;
    offline?: boolean;
    quiet?: boolean;
    timeoutMs?: number;
    tombiPath?: string;
    verbose?: 0 | 1 | 2;
}>;

const toEslintLoc = (
    message: Readonly<{
        column: number;
        endColumn?: number;
        endLine?: number;
        line: number;
    }>
): ReportLocation => ({
    end: {
        column: Math.max((message.endColumn ?? message.column + 1) - 1, 0),
        line: message.endLine ?? message.line,
    },
    start: {
        column: Math.max(message.column - 1, 0),
        line: message.line,
    },
});

const toBridgeOptions = (
    rawOptions: TombiRuleOption,
    context: Parameters<RuleModuleWithDocs<MessageIds, Options>["create"]>[0],
    shouldLint: boolean,
    shouldRunFormat: boolean
): TombiBridgeOptions => ({
    code: context.sourceCode.text,
    codeFilename: context.physicalFilename,
    cwd: context.cwd,
    runFormat: shouldRunFormat,
    runLint: shouldLint,
    ...(isDefined(rawOptions.cache) && {
        cache: rawOptions.cache,
    }),
    ...(isDefined(rawOptions.errorOnWarnings) && {
        errorOnWarnings: rawOptions.errorOnWarnings,
    }),
    ...(isDefined(rawOptions.httpTimeoutSeconds) && {
        httpTimeoutSeconds: rawOptions.httpTimeoutSeconds,
    }),
    ...(isDefined(rawOptions.noCache) && {
        noCache: rawOptions.noCache,
    }),
    ...(isDefined(rawOptions.offline) && {
        offline: rawOptions.offline,
    }),
    ...(isDefined(rawOptions.quiet) && {
        quiet: rawOptions.quiet,
    }),
    ...(isDefined(rawOptions.timeoutMs) && {
        timeoutMs: rawOptions.timeoutMs,
    }),
    ...(isDefined(rawOptions.tombiPath) && {
        tombiPath: rawOptions.tombiPath,
    }),
    ...(isDefined(rawOptions.verbose) && {
        verbose: rawOptions.verbose,
    }),
});

/**
 * TombiRule ESLint bridge rule contract.
 */
const tombiRule: RuleModuleWithDocs<MessageIds, Options> = createTypedRule<
    MessageIds,
    Options
>({
    create: (context, [rawOptions = {}]) =>
        toRuleListener({
            Program() {
                const shouldLint = rawOptions.lint ?? true;
                const shouldCheckFormat = rawOptions.check ?? true;
                const shouldOfferFormatFix = rawOptions.format ?? true;
                if (
                    !shouldLint &&
                    !shouldCheckFormat &&
                    !shouldOfferFormatFix
                ) {
                    return;
                }

                const bridgeOptions = toBridgeOptions(
                    rawOptions,
                    context,
                    shouldLint,
                    shouldCheckFormat || shouldOfferFormatFix
                );
                let bridgeResult: ReturnType<typeof runTombiSynchronously>;
                try {
                    bridgeResult = runTombiSynchronously(bridgeOptions);
                } catch (error: unknown) {
                    context.report({
                        data: {
                            // eslint-disable-next-line canonical/no-use-extend-native -- unicorn/prefer-error-is-error requires the native Error.isError guard.
                            message: Error.isError(error)
                                ? error.message
                                : String(error),
                        },
                        loc: {
                            end: { column: 0, line: 1 },
                            start: { column: 0, line: 1 },
                        },
                        messageId: "tombiExecutionError",
                        node: context.sourceCode.ast,
                    });
                    return;
                }

                if (
                    (shouldCheckFormat || shouldOfferFormatFix) &&
                    bridgeResult.formattedText !== context.sourceCode.text
                ) {
                    context.report({
                        loc: {
                            end: { column: 0, line: 1 },
                            start: { column: 0, line: 1 },
                        },
                        messageId: "tombiFormat",
                        node: context.sourceCode.ast,
                        ...(shouldOfferFormatFix &&
                            bridgeResult.formattedText !== "" && {
                                fix: (fixer) =>
                                    fixer.replaceTextRange(
                                        [0, context.sourceCode.text.length],
                                        bridgeResult.formattedText
                                    ),
                            }),
                    });
                }

                if (shouldLint) {
                    for (const diagnostic of bridgeResult.diagnostics) {
                        context.report({
                            data: {
                                severity: diagnostic.severity,
                                text: diagnostic.message,
                            },
                            loc: toEslintLoc(diagnostic),
                            messageId: "tombiProblem",
                            node: context.sourceCode.ast,
                        });
                    }
                }
            },
        }),
    meta: {
        defaultOptions: [{}],
        deprecated: false,
        docs: {
            configs: [
                "tombi.configs.recommended",
                "tombi.configs.tombiOnly",
                "tombi.configs.all",
            ],
            description:
                "enforce Tombi lint and format checks against TOML files from ESLint.",
            recommended: true,
            requiresTypeChecking: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-tombi/docs/rules/tombi",
        },
        fixable: "whitespace",
        messages: {
            tombiExecutionError: "Tombi execution error: {{message}}",
            tombiFormat: "Tombi formatting differs from this file.",
            tombiProblem: "Tombi {{severity}}: {{text}}",
        },
        schema: [
            {
                additionalProperties: false,
                description: "Tombi bridge execution options.",
                properties: {
                    cache: {
                        additionalProperties: false,
                        description:
                            "Cache options forwarded to Tombi environment variables.",
                        properties: {
                            directory: {
                                description:
                                    "Directory used as TOMBI_CACHE_HOME.",
                                type: "string",
                            },
                            noCache: {
                                description:
                                    "Whether to set TOMBI_NO_CACHE for this rule.",
                                type: "boolean",
                            },
                            ttlSeconds: {
                                description:
                                    "Cache TTL in seconds forwarded as TOMBI_CACHE_TTL.",
                                minimum: 0,
                                type: "number",
                            },
                        },
                        type: "object",
                    },
                    check: {
                        description:
                            "Whether to report files whose Tombi formatted output differs.",
                        type: "boolean",
                    },
                    errorOnWarnings: {
                        description:
                            "Whether to pass --error-on-warnings to tombi lint.",
                        type: "boolean",
                    },
                    format: {
                        description:
                            "Whether to provide an ESLint fixer from Tombi formatted output.",
                        type: "boolean",
                    },
                    httpTimeoutSeconds: {
                        description:
                            "HTTP timeout in seconds forwarded as TOMBI_HTTP_TIMEOUT.",
                        minimum: 1,
                        type: "number",
                    },
                    lint: {
                        description:
                            "Whether to run tombi lint and report diagnostics.",
                        type: "boolean",
                    },
                    noCache: {
                        description: "Whether to set TOMBI_NO_CACHE.",
                        type: "boolean",
                    },
                    offline: {
                        description: "Whether to set TOMBI_OFFLINE.",
                        type: "boolean",
                    },
                    quiet: {
                        description:
                            "Whether to pass --quiet to Tombi commands.",
                        type: "boolean",
                    },
                    timeoutMs: {
                        description:
                            "Maximum milliseconds to wait for each Tombi subprocess.",
                        minimum: 1,
                        type: "number",
                    },
                    tombiPath: {
                        description:
                            "Optional path to a custom Tombi executable.",
                        type: "string",
                    },
                    verbose: {
                        description:
                            "Verbosity level mapped to no flag, -v, or -vv.",
                        enum: [
                            0,
                            1,
                            2,
                        ],
                        type: "number",
                    },
                },
                type: "object",
            },
        ],
        type: "layout",
    },
    name: "tombi",
});

export default tombiRule;
