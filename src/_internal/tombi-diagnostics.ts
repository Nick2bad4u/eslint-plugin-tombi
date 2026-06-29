import type { ArrayValues } from "type-fest";

import { isDefined, isSafeInteger, stringSplit } from "ts-extras";

import { stripAnsi } from "./ansi.js";

/**
 * Parsed Tombi diagnostic that can be reported by ESLint.
 */
export interface TombiDiagnostic {
    readonly column: number;
    readonly line: number;
    readonly message: string;
    readonly severity: TombiDiagnosticSeverity;
}

/**
 * Parsed Tombi diagnostic severity.
 */
export type TombiDiagnosticSeverity = "error" | "info" | "warning";

const severityLabels = [
    "Error:",
    "Info:",
    "Warning:",
] as const;

const severityFromLabel = (
    label: ArrayValues<typeof severityLabels>
): TombiDiagnosticSeverity => {
    switch (label) {
        case "Error:": {
            return "error";
        }
        case "Info:": {
            return "info";
        }
        case "Warning:": {
            return "warning";
        }
        default: {
            throw new Error("Unsupported Tombi severity label.");
        }
    }
};

const parseLocation = (
    rawLocation: string
): Pick<TombiDiagnostic, "column" | "line"> | undefined => {
    const location = rawLocation.trim();
    if (location.startsWith("line ")) {
        const [
            ,
            lineText,
            columnLabel,
            columnText,
        ] = stringSplit(location, " ").filter((part) => part !== "");
        if (columnLabel !== "column") return undefined;
        const line = Number(lineText);
        const column = Number(columnText);
        return isSafeInteger(line) && isSafeInteger(column)
            ? { column, line }
            : undefined;
    }

    const lastColon = location.lastIndexOf(":");
    const nextToLastColon = location.lastIndexOf(":", lastColon - 1);
    if (lastColon === -1 || nextToLastColon === -1) return undefined;
    const line = Number(location.slice(nextToLastColon + 1, lastColon));
    const column = Number(location.slice(lastColon + 1));
    return isSafeInteger(line) && isSafeInteger(column)
        ? { column, line }
        : undefined;
};

const parseDiagnosticPair = (
    messageLine: string,
    locationLine: string | undefined
): TombiDiagnostic | undefined => {
    if (!isDefined(locationLine)) return undefined;
    const severityLabel = severityLabels.find((label) =>
        messageLine.trimStart().startsWith(label)
    );
    if (!isDefined(severityLabel)) return undefined;
    const message = messageLine.trimStart().slice(severityLabel.length).trim();
    const locationMarker = "at ";
    const markerIndex = locationLine.indexOf(locationMarker);
    if (message === "" || markerIndex === -1) return undefined;
    const parsedLocation = parseLocation(
        locationLine.slice(markerIndex + locationMarker.length)
    );
    if (!isDefined(parsedLocation)) return undefined;
    return {
        ...parsedLocation,
        message,
        severity: severityFromLabel(severityLabel),
    };
};

/**
 * Parse Tombi's human diagnostics into ESLint-reportable diagnostics.
 */
export const parseTombiDiagnostics = (output: string): TombiDiagnostic[] => {
    const lines = stringSplit(stripAnsi(output).replaceAll("\r\n", "\n"), "\n");
    const diagnostics: TombiDiagnostic[] = [];
    for (let index = 0; index < lines.length; index += 1) {
        const diagnostic = parseDiagnosticPair(
            lines[index] ?? "",
            lines[index + 1]
        );
        if (isDefined(diagnostic)) {
            diagnostics.push(diagnostic);
            index += 1;
        }
    }
    return diagnostics;
};
