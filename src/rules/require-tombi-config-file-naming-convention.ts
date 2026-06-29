import {
    createFilenameRule,
    type TombiConfigRuleModule,
} from "../_internal/config-rule-factories.js";

/**
 * Rule requiring standalone Tombi config files to use Tombi-discovered names.
 */
const requireTombiConfigFileNamingConventionRule: TombiConfigRuleModule =
    createFilenameRule({
        configs: ["tombi.configs.configuration", "tombi.configs.all"],
        description:
            "require standalone Tombi config files to use a filename Tombi discovers.",
        name: "require-tombi-config-file-naming-convention",
        recommended: true,
    });

export default requireTombiConfigFileNamingConventionRule;
