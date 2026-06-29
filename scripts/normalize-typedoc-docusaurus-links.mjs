#!/usr/bin/env node

import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const typedocDirectory = resolve(
    repositoryRoot,
    "docs",
    "docusaurus",
    "site-docs",
    "developer",
    "api"
);

const sameDirectoryMarkdownLinkPattern =
    /(\]\(\.\/(?:[^)\s]+?))\.md((?:#[^)]+)?\))/giu;

/**
 * Recursively collect Markdown files under a generated TypeDoc directory.
 *
 * @param {string} directory
 *
 * @returns {Promise<string[]>}
 */
async function collectMarkdownFiles(directory) {
    const markdownFiles = [];
    const entries = await readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
        const entryPath = join(directory, entry.name);
        if (entry.isDirectory()) {
            markdownFiles.push(...(await collectMarkdownFiles(entryPath)));
        } else if (entry.isFile() && extname(entry.name) === ".md") {
            markdownFiles.push(entryPath);
        }
    }

    return markdownFiles;
}

const markdownFiles = await collectMarkdownFiles(typedocDirectory);
let changedFileCount = 0;

for (const markdownFile of markdownFiles) {
    const originalContent = await readFile(markdownFile, "utf8");
    const normalizedContent = originalContent.replaceAll(
        sameDirectoryMarkdownLinkPattern,
        "$1$2"
    );

    if (normalizedContent !== originalContent) {
        await writeFile(markdownFile, normalizedContent, "utf8");
        changedFileCount += 1;
    }
}

console.log(
    `Normalized TypeDoc Docusaurus links in ${changedFileCount} file(s).`
);
