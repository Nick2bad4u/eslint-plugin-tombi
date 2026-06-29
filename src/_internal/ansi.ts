import { arrayIncludes, isDefined } from "ts-extras";

const ESCAPE = 0x1b;
const C1_DCS = 0x90;
const C1_CSI = 0x9b;
const C1_OSC = 0x9d;
const C1_PM = 0x9e;
const C1_APC = 0x9f;
const BEL = 0x07;
const CSI_FINAL_START = 0x40;
const CSI_FINAL_END = 0x7e;
const ESCAPE_STRING_CONTROL_INTRODUCERS = [
    "^",
    "_",
    "P",
    "X",
] as const;
const C1_STRING_CONTROLS = [
    C1_APC,
    C1_DCS,
    C1_OSC,
    C1_PM,
] as const;

const isStringTerminator = (value: string, index: number): boolean =>
    value.codePointAt(index) === ESCAPE && value[index + 1] === "\\";

const findStringControlEnd = (
    value: string,
    startIndex: number,
    supportsBelTerminator: boolean
): number => {
    for (let index = startIndex; index < value.length; index += 1) {
        const code = value.codePointAt(index);
        if (supportsBelTerminator && code === BEL) return index + 1;
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
    if (introducer === "]") {
        return findStringControlEnd(value, startIndex + 2, true);
    }
    if (arrayIncludes(ESCAPE_STRING_CONTROL_INTRODUCERS, introducer ?? "")) {
        return findStringControlEnd(value, startIndex + 2, false);
    }
    if (introducer === "[") return findCsiEnd(value, startIndex + 2);
    if (!isDefined(introducer)) return startIndex;
    return startIndex + 2;
};

const findAnsiSequenceEnd = (
    value: string,
    index: number
): number | undefined => {
    const code = value.codePointAt(index);
    if (code === ESCAPE) {
        const escapeEnd = findEscapeEnd(value, index);
        return escapeEnd > index ? escapeEnd : undefined;
    }
    if (code === C1_CSI) {
        const csiEnd = findCsiEnd(value, index + 1);
        return csiEnd > index ? csiEnd : undefined;
    }
    if (arrayIncludes(C1_STRING_CONTROLS, code)) {
        const stringControlEnd = findStringControlEnd(
            value,
            index + 1,
            code === C1_OSC
        );
        return stringControlEnd > index ? stringControlEnd : undefined;
    }
    return undefined;
};

/**
 * Remove ANSI SGR, cursor, OSC, and related terminal escape sequences.
 */
export const stripAnsi = (value: string): string => {
    let output = "";
    let index = 0;

    while (index < value.length) {
        const sequenceEnd = findAnsiSequenceEnd(value, index);
        if (isDefined(sequenceEnd)) {
            index = sequenceEnd;
            continue;
        }
        output += value[index] ?? "";
        index += 1;
    }
    return output;
};
