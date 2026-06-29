import {
    createNoEmptyFilesPatternRule,
    type TombiConfigRuleModule,
} from "../_internal/config-rule-factories.js";

/**
 * Rule disallowing empty Tombi file exclude pattern lists.
 */
const disallowTombiEmptyFilesExcludeRule: TombiConfigRuleModule =
    createNoEmptyFilesPatternRule({
        configs: ["tombi.configs.configuration", "tombi.configs.all"],
        description: "disallow empty Tombi [files].exclude pattern lists.",
        name: "disallow-tombi-empty-files-exclude",
        propertyName: "exclude",
        recommended: true,
    });

export default disallowTombiEmptyFilesExcludeRule;
