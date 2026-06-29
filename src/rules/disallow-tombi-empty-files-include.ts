import {
    createNoEmptyFilesPatternRule,
    type TombiConfigRuleModule,
} from "../_internal/config-rule-factories.js";

/**
 * Rule disallowing empty Tombi file include pattern lists.
 */
const disallowTombiEmptyFilesIncludeRule: TombiConfigRuleModule =
    createNoEmptyFilesPatternRule({
        configs: ["tombi.configs.configuration", "tombi.configs.all"],
        description: "disallow empty Tombi [files].include pattern lists.",
        name: "disallow-tombi-empty-files-include",
        propertyName: "include",
        recommended: true,
    });

export default disallowTombiEmptyFilesIncludeRule;
