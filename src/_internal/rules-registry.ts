import disallowTombiEmptyFilesExcludeRule from "../rules/disallow-tombi-empty-files-exclude.js";
import disallowTombiEmptyFilesIncludeRule from "../rules/disallow-tombi-empty-files-include.js";
import disallowTombiUnknownConfigPropertiesRule from "../rules/disallow-tombi-unknown-config-properties.js";
import preferTombiBuiltinSchemaCatalogRule from "../rules/prefer-tombi-builtin-schema-catalog.js";
import preferTombiFilesIncludeArrayRule from "../rules/prefer-tombi-files-include-array.js";
import requireTombiConfigFileNamingConventionRule from "../rules/require-tombi-config-file-naming-convention.js";
import requireTombiValidLintRuleLevelsRule from "../rules/require-tombi-valid-lint-rule-levels.js";
import tombiRule from "../rules/tombi.js";

type TombiRulesRegistry = Readonly<{
    "disallow-tombi-empty-files-exclude": typeof disallowTombiEmptyFilesExcludeRule;
    "disallow-tombi-empty-files-include": typeof disallowTombiEmptyFilesIncludeRule;
    "disallow-tombi-unknown-config-properties": typeof disallowTombiUnknownConfigPropertiesRule;
    "prefer-tombi-builtin-schema-catalog": typeof preferTombiBuiltinSchemaCatalogRule;
    "prefer-tombi-files-include-array": typeof preferTombiFilesIncludeArrayRule;
    "require-tombi-config-file-naming-convention": typeof requireTombiConfigFileNamingConventionRule;
    "require-tombi-valid-lint-rule-levels": typeof requireTombiValidLintRuleLevelsRule;
    tombi: typeof tombiRule;
}>;

/**
 * TombiRules tombi rules contract.
 */
export const tombiRules: TombiRulesRegistry = {
    "disallow-tombi-empty-files-exclude": disallowTombiEmptyFilesExcludeRule,
    "disallow-tombi-empty-files-include": disallowTombiEmptyFilesIncludeRule,
    "disallow-tombi-unknown-config-properties":
        disallowTombiUnknownConfigPropertiesRule,
    "prefer-tombi-builtin-schema-catalog": preferTombiBuiltinSchemaCatalogRule,
    "prefer-tombi-files-include-array": preferTombiFilesIncludeArrayRule,
    "require-tombi-config-file-naming-convention":
        requireTombiConfigFileNamingConventionRule,
    "require-tombi-valid-lint-rule-levels": requireTombiValidLintRuleLevelsRule,
    tombi: tombiRule,
} as const satisfies TombiRulesRegistry;

/**
 * TombiRuleNamePattern tombi rule name pattern contract.
 */
export type TombiRuleNamePattern = keyof typeof tombiRules;

export default tombiRules;
