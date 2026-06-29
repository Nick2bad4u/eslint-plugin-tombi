import {
    createRequireFilesIncludeArrayRule,
    type TombiConfigRuleModule,
} from "../_internal/config-rule-factories.js";

/**
 * Rule preferring explicit Tombi file include patterns.
 */
const preferTombiFilesIncludeArrayRule: TombiConfigRuleModule =
    createRequireFilesIncludeArrayRule({
        configs: ["tombi.configs.configuration", "tombi.configs.all"],
        description:
            "prefer an explicit [files].include array in standalone Tombi configs.",
        name: "prefer-tombi-files-include-array",
        recommended: false,
    });

export default preferTombiFilesIncludeArrayRule;
