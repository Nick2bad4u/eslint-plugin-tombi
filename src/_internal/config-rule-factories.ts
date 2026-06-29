import type { Except } from "type-fest";

import * as path from "node:path";
import {
    arrayFirst,
    arrayIncludes,
    arrayJoin,
    isDefined,
    setHas,
    stringSplit,
} from "ts-extras";

import type { TombiConfigReference } from "./tombi-config-references.js";

import { createRuleDocsUrl } from "./rule-docs-url.js";
import {
    createTypedRule,
    type RuleModuleWithDocs,
    toRuleListener,
} from "./typed-rule.js";

/**
 * TombiConfigRuleModule tombi config rule module contract.
 */
export type TombiConfigRuleModule = RuleModuleWithDocs<MessageIds, Options>;
type ConfigRuleDefinition = Readonly<{
    check: (sourceText: string, fileName: string) => string | undefined;
    configs: readonly TombiConfigReference[];
    description: string;
    name: string;
    recommended: boolean;
}>;
type MessageIds = "configProblem";
type Options = [];

const allowedLintRuleLevels = [
    "error",
    "off",
    "warn",
] as const;
const allowedLintRuleLevelSet = new Set<string>(allowedLintRuleLevels);
const allowedTopLevelProperties = [
    "default",
    "files",
    "format",
    "lint",
    "schema",
    "schemas",
    "server",
    "table",
    "toml-version",
] as const;

const normalizePath = (fileName: string): string =>
    fileName.replaceAll("\\", "/");

const getLines = (sourceText: string): string[] =>
    stringSplit(
        sourceText.replaceAll("\r\n", "\n").replaceAll("\r", "\n"),
        "\n"
    );

const removeInlineComment = (line: string): string =>
    arrayFirst(stringSplit(line, "#")) ?? "";

const getTableName = (line: string): string | undefined => {
    const trimmed = removeInlineComment(line).trim();
    if (trimmed.startsWith("[[") && trimmed.endsWith("]]")) {
        return trimmed.slice(2, -2).trim();
    }
    return trimmed.startsWith("[") && trimmed.endsWith("]")
        ? trimmed.slice(1, -1).trim()
        : undefined;
};

const getTopLevelTableName = (line: string): string | undefined => {
    const tableName = getTableName(line);
    if (!isDefined(tableName) || tableName === "") return undefined;
    return arrayFirst(stringSplit(tableName, "."));
};

const getProperty = (
    line: string
): undefined | { key: string; value: string } => {
    const statement = removeInlineComment(line).trim();
    const equalsIndex = statement.indexOf("=");
    if (equalsIndex < 1) return undefined;

    const key = statement.slice(0, equalsIndex).trim();
    const value = statement.slice(equalsIndex + 1).trim();
    return key === "" ? undefined : { key, value };
};

const isStandaloneTombiConfigFile = (fileName: string): boolean => {
    const normalized = normalizePath(fileName);
    const baseName = path.posix.basename(normalized);
    return baseName === ".tombi.toml" || baseName === "tombi.toml";
};

const collectRootProperties = (sourceText: string): string[] => {
    const properties = new Set<string>();
    let isInsideTable = false;
    for (const line of getLines(sourceText)) {
        const tableName = getTopLevelTableName(line);
        if (isDefined(tableName)) {
            isInsideTable = true;
            properties.add(tableName);
            continue;
        }
        if (isInsideTable) continue;

        const property = getProperty(line);
        if (isDefined(property)) properties.add(property.key);
    }
    return [...properties];
};

const getSectionText = (
    sourceText: string,
    sectionName: string
): string | undefined => {
    const sectionLines: string[] = [];
    let isInsideTarget = false;

    for (const line of getLines(sourceText)) {
        const tableName = getTableName(line);
        if (isDefined(tableName)) {
            if (isInsideTarget) break;
            isInsideTarget = tableName === sectionName;
            continue;
        }
        if (isInsideTarget) sectionLines.push(line);
    }

    return sectionLines.length > 0 ? arrayJoin(sectionLines, "\n") : undefined;
};

const hasFilesConfig = (sourceText: string): boolean => {
    for (const line of getLines(sourceText)) {
        if (getTableName(line) === "files") return true;
        const property = getProperty(line);
        if (property?.key === "files" && property.value.startsWith("{")) {
            return true;
        }
    }
    return false;
};

const hasArrayProperty = (
    sourceText: string,
    propertyName: "exclude" | "include"
): boolean =>
    getLines(sourceText).some((line) => {
        const property = getProperty(line);
        return property?.key === propertyName && property.value.startsWith("[");
    });

const hasEmptyArrayProperty = (
    sourceText: string,
    propertyName: "exclude" | "include"
): boolean =>
    getLines(sourceText).some((line) => {
        const property = getProperty(line);
        return (
            property?.key === propertyName &&
            property.value.replaceAll(/[\t ]/gv, "").startsWith("[]")
        );
    });

const hasEmptyQuotedString = (sourceText: string): boolean =>
    sourceText.includes('""') || sourceText.includes("''");

const hasSchemaCatalogPath = (sourceText: string): boolean =>
    getLines(sourceText).some((line) => {
        const property = getProperty(line);
        return (
            property?.key === "catalog-path" ||
            (property?.key === "catalog" && property.value.startsWith("{"))
        );
    });

const getQuotedValue = (value: string): string | undefined => {
    if (value.length < 2) return undefined;
    if (value.startsWith('"')) {
        const closingQuoteIndex = value.indexOf('"', 1);
        return closingQuoteIndex > 0
            ? value.slice(1, closingQuoteIndex)
            : undefined;
    }
    if (value.startsWith("'")) {
        const closingQuoteIndex = value.indexOf("'", 1);
        return closingQuoteIndex > 0
            ? value.slice(1, closingQuoteIndex)
            : undefined;
    }
    return undefined;
};

/**
 * CreateConfigTextRule create config text rule contract.
 */
export function createConfigTextRule(
    definition: ConfigRuleDefinition
): TombiConfigRuleModule {
    return createTypedRule<MessageIds, Options>({
        create: (context) =>
            toRuleListener({
                Program() {
                    const message = definition.check(
                        context.sourceCode.text,
                        context.physicalFilename
                    );
                    if (typeof message !== "string") return;
                    context.report({
                        data: { message },
                        loc: {
                            end: { column: 0, line: 1 },
                            start: { column: 0, line: 1 },
                        },
                        messageId: "configProblem",
                        node: context.sourceCode.ast,
                    });
                },
            }),
        meta: {
            defaultOptions: [],
            deprecated: false,
            docs: {
                configs: definition.configs,
                description: definition.description,
                recommended: definition.recommended,
                requiresTypeChecking: false,
                url: createRuleDocsUrl(definition.name),
            },
            messages: { configProblem: "Tombi config: {{message}}" },
            schema: [],
            type: "problem",
        },
        name: definition.name,
    });
}

/**
 * CreateFilenameRule create filename rule contract.
 */
export const createFilenameRule = (
    definition: Except<ConfigRuleDefinition, "check">
): TombiConfigRuleModule =>
    createConfigTextRule({
        ...definition,
        check: (_sourceText, fileName) =>
            isStandaloneTombiConfigFile(path.basename(fileName)) ||
            isStandaloneTombiConfigFile(fileName)
                ? undefined
                : "Expected this config file to be named tombi.toml or .tombi.toml.",
    });

/**
 * CreateUnknownPropertiesRule create unknown properties rule contract.
 */
export const createUnknownPropertiesRule = (
    definition: Except<ConfigRuleDefinition, "check">
): TombiConfigRuleModule =>
    createConfigTextRule({
        ...definition,
        check: (sourceText) => {
            const unknown = collectRootProperties(sourceText).find(
                (propertyName) =>
                    !arrayIncludes(allowedTopLevelProperties, propertyName)
            );
            return typeof unknown === "string"
                ? `Unexpected top-level config property '${unknown}'.`
                : undefined;
        },
    });

/**
 * CreateRequireFilesIncludeArrayRule create require files include array rule
 * contract.
 */
export const createRequireFilesIncludeArrayRule = (
    definition: Except<ConfigRuleDefinition, "check">
): TombiConfigRuleModule =>
    createConfigTextRule({
        ...definition,
        check: (sourceText) => {
            if (!hasFilesConfig(sourceText)) {
                return "Expected this config to define a [files] table with include patterns.";
            }
            const filesSection = getSectionText(sourceText, "files");
            if (
                isDefined(filesSection) &&
                hasArrayProperty(filesSection, "include")
            ) {
                return undefined;
            }
            return "Expected [files].include to be an array of TOML file patterns.";
        },
    });

/**
 * CreateNoEmptyFilesPatternRule create no empty files pattern rule contract.
 */
export const createNoEmptyFilesPatternRule = (
    definition: Except<ConfigRuleDefinition, "check"> &
        Readonly<{ propertyName: "exclude" | "include" }>
): TombiConfigRuleModule =>
    createConfigTextRule({
        ...definition,
        check: (sourceText) => {
            const filesSection = getSectionText(sourceText, "files");
            if (!isDefined(filesSection)) return undefined;
            if (hasEmptyArrayProperty(filesSection, definition.propertyName)) {
                return `Expected [files].${definition.propertyName} to include at least one pattern.`;
            }
            return hasEmptyQuotedString(filesSection)
                ? "Expected [files] patterns to be non-empty strings."
                : undefined;
        },
    });

/**
 * CreateValidLintRuleLevelsRule create valid lint rule levels rule contract.
 */
export const createValidLintRuleLevelsRule = (
    definition: Except<ConfigRuleDefinition, "check">
): TombiConfigRuleModule =>
    createConfigTextRule({
        ...definition,
        check: (sourceText) => {
            const lintRulesSection = getSectionText(sourceText, "lint.rules");
            if (!isDefined(lintRulesSection)) return undefined;

            for (const line of getLines(lintRulesSection)) {
                const property = getProperty(line);
                const level = isDefined(property)
                    ? getQuotedValue(property.value)
                    : undefined;
                if (!isDefined(level)) continue;
                if (setHas(allowedLintRuleLevelSet, level)) continue;

                const unexpectedLevel: string = level;
                return `Unexpected Tombi lint rule level '${unexpectedLevel}'. Expected error, warn, or off.`;
            }
            return undefined;
        },
    });

/**
 * CreatePreferBuiltinSchemaCatalogRule create prefer builtin schema catalog
 * rule contract.
 */
export const createPreferBuiltinSchemaCatalogRule = (
    definition: Except<ConfigRuleDefinition, "check">
): TombiConfigRuleModule =>
    createConfigTextRule({
        ...definition,
        check: (sourceText) => {
            const schemaSection = getSectionText(sourceText, "schema");
            if (
                !isDefined(schemaSection) ||
                !hasSchemaCatalogPath(schemaSection)
            ) {
                return undefined;
            }
            return schemaSection.includes("tombi://")
                ? undefined
                : "Prefer Tombi's embedded schema catalog with tombi:// when possible so ESLint runs stay cache-friendly.";
        },
    });
