import stripAnsiPackage from "strip-ansi";

/**
 * Remove ANSI SGR, cursor, OSC, and related terminal escape sequences.
 */
export const stripAnsi = (value: string): string => stripAnsiPackage(value);
