import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars = {
    docs: [
        {
            className: "sb-doc-overview",
            id: "index",
            type: "doc",
        },
        {
            className: "sb-cat-developer",
            collapsed: false,
            items: ["developer/api/interfaces/TombiPlugin"],
            label: "Developer",
            type: "category",
        },
    ],
} satisfies SidebarsConfig;

export default sidebars;
