import tombiRule from "../rules/tombi.js";

type TombiRulesRegistry = Readonly<{
    tombi: typeof tombiRule;
}>;

/**
 * TombiRules tombi rules contract.
 */
export const tombiRules: TombiRulesRegistry = {
    tombi: tombiRule,
} as const satisfies TombiRulesRegistry;

/**
 * TombiRuleNamePattern tombi rule name pattern contract.
 */
export type TombiRuleNamePattern = keyof typeof tombiRules;

export default tombiRules;
