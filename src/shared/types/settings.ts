import { Ide } from './ide';

export type Settings = {
    SETUP_COMPLETE: boolean;
    HOTKEY: string;
    IDES: Ide[];
    FILTERED_PATTERNS: string[];
};
