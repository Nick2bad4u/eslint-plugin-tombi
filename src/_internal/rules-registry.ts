import emptyFilesExcludeRule from "../rules/disallow-tombi-empty-files-exclude.js";
import emptyFilesIncludeRule from "../rules/disallow-tombi-empty-files-include.js";
import unknownConfigPropertiesRule from "../rules/disallow-tombi-unknown-config-properties.js";
import preferTombiBuiltinSchemaCatalogRule from "../rules/prefer-tombi-builtin-schema-catalog.js";
import preferTombiFilesIncludeArrayRule from "../rules/prefer-tombi-files-include-array.js";
import configFileNamingConventionRule from "../rules/require-tombi-config-file-naming-convention.js";
import validLintRuleLevelsRule from "../rules/require-tombi-valid-lint-rule-levels.js";
import tombiRule from "../rules/tombi.js";

type TombiRulesRegistry = Readonly<{
    "disallow-tombi-empty-files-exclude": typeof emptyFilesExcludeRule;
    "disallow-tombi-empty-files-include": typeof emptyFilesIncludeRule;
    "disallow-tombi-unknown-config-properties": typeof unknownConfigPropertiesRule;
    "prefer-tombi-builtin-schema-catalog": typeof preferTombiBuiltinSchemaCatalogRule;
    "prefer-tombi-files-include-array": typeof preferTombiFilesIncludeArrayRule;
    "require-tombi-config-file-naming-convention": typeof configFileNamingConventionRule;
    "require-tombi-valid-lint-rule-levels": typeof validLintRuleLevelsRule;
    tombi: typeof tombiRule;
}>;

/**
 * TombiRules tombi rules contract.
 */
export const tombiRules: TombiRulesRegistry = {
    "disallow-tombi-empty-files-exclude": emptyFilesExcludeRule,
    "disallow-tombi-empty-files-include": emptyFilesIncludeRule,
    "disallow-tombi-unknown-config-properties": unknownConfigPropertiesRule,
    "prefer-tombi-builtin-schema-catalog": preferTombiBuiltinSchemaCatalogRule,
    "prefer-tombi-files-include-array": preferTombiFilesIncludeArrayRule,
    "require-tombi-config-file-naming-convention":
        configFileNamingConventionRule,
    "require-tombi-valid-lint-rule-levels": validLintRuleLevelsRule,
    tombi: tombiRule,
} as const satisfies TombiRulesRegistry;

/**
 * TombiRuleNamePattern tombi rule name pattern contract.
 */
export type TombiRuleNamePattern = keyof typeof tombiRules;

export default tombiRules;
