import { Ide } from './ide';

export type Settings = {
    SETUP_COMPLETE: boolean;
    HOTKEY: string;
    IDES: Ide[];
    FILTERED_PATTERNS: string[];
};

export const settingsKeys: (keyof Settings)[] = [
    'SETUP_COMPLETE',
    'HOTKEY',
    'IDES',
    'FILTERED_PATTERNS',
];

// export type Settings = [
//     { key: 'SETUP_COMPLETE'; valueType: boolean },
//     { key: 'HOTKEY'; valueType: string },
//     { key: 'IDES'; valueType: Ide[] },
//     { key: 'FILTERED_PATTERNS'; valueType: string[] }
// ];
