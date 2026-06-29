import {
    createUnknownPropertiesRule,
    type TombiConfigRuleModule,
} from "../_internal/config-rule-factories.js";

/**
 * Rule disallowing unsupported top-level Tombi config properties.
 */
const disallowTombiUnknownConfigPropertiesRule: TombiConfigRuleModule =
    createUnknownPropertiesRule({
        configs: [
            "tombi.configs.configuration",
            "tombi.configs.recommended",
            "tombi.configs.all",
        ],
        description: "disallow unsupported top-level Tombi config properties.",
        name: "disallow-tombi-unknown-config-properties",
        recommended: true,
    });

export default disallowTombiUnknownConfigPropertiesRule;
