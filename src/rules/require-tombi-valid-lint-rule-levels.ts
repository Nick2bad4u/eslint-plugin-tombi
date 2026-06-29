import {
    createValidLintRuleLevelsRule,
    type TombiConfigRuleModule,
} from "../_internal/config-rule-factories.js";

/**
 * Rule requiring supported Tombi lint rule levels.
 */
const requireTombiValidLintRuleLevelsRule: TombiConfigRuleModule =
    createValidLintRuleLevelsRule({
        configs: ["tombi.configs.configuration", "tombi.configs.all"],
        description:
            "require Tombi lint rule levels to be error, warn, or off.",
        name: "require-tombi-valid-lint-rule-levels",
        recommended: true,
    });

export default requireTombiValidLintRuleLevelsRule;
