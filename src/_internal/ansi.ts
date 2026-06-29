import { isDefined } from "ts-extras";

const ESCAPE = 0x1b;
const C1_CSI = 0x9b;
const BEL = 0x07;
const CSI_FINAL_START = 0x40;
const CSI_FINAL_END = 0x7e;

const isStringTerminator = (value: string, index: number): boolean =>
    value.codePointAt(index) === ESCAPE && value[index + 1] === "\\";

const findOscEnd = (value: string, startIndex: number): number => {
    for (let index = startIndex; index < value.length; index += 1) {
        const code = value.codePointAt(index);
        if (code === BEL) return index + 1;
        if (isStringTerminator(value, index)) return index + 2;
    }
    return startIndex;
};

const findCsiEnd = (value: string, startIndex: number): number => {
    for (let index = startIndex; index < value.length; index += 1) {
        const code = value.codePointAt(index);
        if (
            isDefined(code) &&
            code >= CSI_FINAL_START &&
            code <= CSI_FINAL_END
        ) {
            return index + 1;
        }
    }
    return startIndex;
};

const findEscapeEnd = (value: string, startIndex: number): number => {
    const introducer = value[startIndex + 1];
    if (introducer === "]") return findOscEnd(value, startIndex + 2);
    if (introducer === "[") return findCsiEnd(value, startIndex + 2);
    if (!isDefined(introducer)) return startIndex;
    return startIndex + 2;
};

/**
 * Remove ANSI SGR, cursor, OSC, and related terminal escape sequences.
 */
export const stripAnsi = (value: string): string => {
    let output = "";
    for (let index = 0; index < value.length; index += 1) {
        const code = value.codePointAt(index);
        if (code === ESCAPE) {
            const escapeEnd = findEscapeEnd(value, index);
            if (escapeEnd > index) {
                index = escapeEnd - 1;
                continue;
            }
        }
        if (code === C1_CSI) {
            const csiEnd = findCsiEnd(value, index + 1);
            if (csiEnd > index) {
                index = csiEnd - 1;
                continue;
            }
        }
        output += value[index] ?? "";
    }
    return output;
};
