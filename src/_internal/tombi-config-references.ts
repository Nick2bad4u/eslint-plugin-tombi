import { objectKeys, setHas } from "ts-extras";

/**
 * TombiConfigMetadata tombi config metadata contract.
 */
export type TombiConfigMetadata = Readonly<{
    docsPath: string;
    icon: string;
    presetName: string;
    publicName: string;
}>;

/**
 * TombiConfigName tombi config name contract.
 */
export type TombiConfigName =
    | "all"
    | "check"
    | "configs"
    | "configuration"
    | "format"
    | "lint"
    | "recommended"
    | "tombiOnly"
    | "toml";

/**
 * TombiConfigReference tombi config reference contract.
 */
export type TombiConfigReference = `tombi.configs.${TombiConfigName}`;

/**
 * TombiConfigMetadataByName tombi config metadata by name contract.
 */
export const tombiConfigMetadataByName: Record<
    TombiConfigName,
    TombiConfigMetadata
> = {
    all: {
        docsPath: "presets/all",
        icon: "🟣",
        presetName: "tombi:all",
        publicName: "tombi.configs.all",
    },
    check: {
        docsPath: "presets/check",
        icon: "✅",
        presetName: "tombi:check",
        publicName: "tombi.configs.check",
    },
    configs: {
        docsPath: "presets/configuration",
        icon: "🔧",
        presetName: "tombi:configuration",
        publicName: "tombi.configs.configs",
    },
    configuration: {
        docsPath: "presets/configuration",
        icon: "🔧",
        presetName: "tombi:configuration",
        publicName: "tombi.configs.configuration",
    },
    format: {
        docsPath: "presets/format",
        icon: "🔧",
        presetName: "tombi:format",
        publicName: "tombi.configs.format",
    },
    lint: {
        docsPath: "presets/lint",
        icon: "🚦",
        presetName: "tombi:lint",
        publicName: "tombi.configs.lint",
    },
    recommended: {
        docsPath: "presets/recommended",
        icon: "🟡",
        presetName: "tombi:recommended",
        publicName: "tombi.configs.recommended",
    },
    tombiOnly: {
        docsPath: "presets/tombi-only",
        icon: "🧪",
        presetName: "tombi:tombiOnly",
        publicName: "tombi.configs.tombiOnly",
    },
    toml: {
        docsPath: "presets/tombi-only",
        icon: "🧪",
        presetName: "tombi:tombiOnly",
        publicName: "tombi.configs.toml",
    },
} as const satisfies Record<TombiConfigName, TombiConfigMetadata>;

/**
 * TombiConfigNames tombi config names contract.
 */
export const tombiConfigNames: TombiConfigName[] = objectKeys(
    tombiConfigMetadataByName
);

const tombiConfigReferences = new Set<string>(
    tombiConfigNames.map(
        (name): TombiConfigReference => `tombi.configs.${name}`
    )
);

/**
 * IsTombiConfigReference checks whether a value is a public Tombi config
 * reference.
 */
export const isTombiConfigReference = (
    value: string
): value is TombiConfigReference => setHas(tombiConfigReferences, value);
