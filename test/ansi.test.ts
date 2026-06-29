import { describe, expect, it } from "vitest";

import { stripAnsi } from "../src/_internal/ansi";

describe(stripAnsi, () => {
    it.each([
        ["plain text", "plain text"],
        ["\u{1B}[31mred\u{1B}[0m", "red"],
        ["\u{1B}[1;33mWarning\u{1B}[0m", "Warning"],
        ["\u{1B}[38;2;255;0;0mtruecolor\u{1B}[0m", "truecolor"],
        ["\u{1B}[38;5;196mindexed\u{1B}[0m", "indexed"],
        ["\u{1B}[2K\u{1B}[1Gline", "line"],
        ["\u{9B}31mred\u{9B}0m", "red"],
        ["\u{1B}]0;window title\u{7}prompt", "prompt"],
        ["\u{1B}]8;;https://example.com\u{7}link\u{1B}]8;;\u{7}", "link"],
        ["\u{1B}]8;;https://example.com\u{1B}\\link\u{1B}]8;;\u{1B}\\", "link"],
        [
            "before \u{1B}[4munderlined\u{1B}[24m after",
            "before underlined after",
        ],
        ["\u{1B}[?25lhidden cursor\u{1B}[?25h", "hidden cursor"],
    ])("strips terminal escapes from %j", (input, expected) => {
        expect.assertions(1);

        expect(stripAnsi(input)).toBe(expected);
    });

    it("preserves incomplete escape-looking text instead of eating normal content", () => {
        expect.assertions(3);

        const stripped = stripAnsi(
            String.raw`value = "\u001B[not an ansi terminator"`
        );

        expect(stripped).toBe(
            String.raw`value = "\u001B[not an ansi terminator"`
        );
        expect(stripped).not.toBe('value = "');
        expect(stripAnsi("\u{1B}")).toBe("\u{1B}");
    });
});
