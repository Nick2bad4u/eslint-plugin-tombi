import {
    createPreferBuiltinSchemaCatalogRule,
    type TombiConfigRuleModule,
} from "../_internal/config-rule-factories.js";

/**
 * Rule preferring Tombi embedded schema catalog references.
 */
const preferTombiBuiltinSchemaCatalogRule: TombiConfigRuleModule =
    createPreferBuiltinSchemaCatalogRule({
        configs: ["tombi.configs.configuration", "tombi.configs.all"],
        description:
            "prefer Tombi's embedded schema catalog when schema catalogs are configured.",
        name: "prefer-tombi-builtin-schema-catalog",
        recommended: false,
    });

export default preferTombiBuiltinSchemaCatalogRule;
