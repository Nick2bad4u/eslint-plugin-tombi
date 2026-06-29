import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars = {
    rules: [
        {
            className: "sb-doc-overview",
            id: "overview",
            label: "🏁 Overview",
            type: "doc",
        },
        {
            className: "sb-cat-guides",
            collapsed: false,
            items: [
                "guides/intro",
                "guides/getting-started",
                "guides/tombi-bridge",
                "guides/config-authoring",
                "guides/tool-to-rule-map",
                "guides/faq",
            ],
            label: "📚 Guides",
            type: "category",
        },
        {
            className: "sb-cat-presets",
            collapsed: false,
            items: [
                {
                    className: "sb-preset-recommended",
                    id: "presets/recommended",
                    label: "🟡 Recommended",
                    type: "doc",
                },
                {
                    className: "sb-preset-only",
                    id: "presets/tombi-only",
                    label: "🧪 Tombi bridge only",
                    type: "doc",
                },
                {
                    className: "sb-preset-configuration",
                    id: "presets/configuration",
                    label: "🔧 Configuration",
                    type: "doc",
                },
                {
                    className: "sb-preset-lint",
                    id: "presets/lint",
                    label: "🚦 Lint",
                    type: "doc",
                },
                {
                    className: "sb-preset-check",
                    id: "presets/check",
                    label: "✅ Check",
                    type: "doc",
                },
                {
                    className: "sb-preset-format",
                    id: "presets/format",
                    label: "🔧 Format",
                    type: "doc",
                },
                {
                    className: "sb-preset-all",
                    id: "presets/all",
                    label: "🟣 All",
                    type: "doc",
                },
            ],
            label: "🛠️ Presets",
            link: { id: "presets/index", type: "doc" },
            type: "category",
        },
        {
            className: "sb-cat-rules",
            collapsed: false,
            items: [
                "tombi",
                "require-tombi-config-file-naming-convention",
                "disallow-tombi-unknown-config-properties",
                "disallow-tombi-empty-files-include",
                "disallow-tombi-empty-files-exclude",
                "prefer-tombi-files-include-array",
                "require-tombi-valid-lint-rule-levels",
                "prefer-tombi-builtin-schema-catalog",
            ],
            label: "📜 Rules",
            link: {
                slug: "/",
                title: "Rule Reference",
                type: "generated-index",
            },
            type: "category",
        },
    ],
} satisfies SidebarsConfig;

export default sidebars;
