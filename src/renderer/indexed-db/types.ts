export type FilteredPatternDatabaseType = {
    pattern: string;
    createdAt: Date;
};

export type SettingDatabaseType = SetupCompleteSetting | HotkeySetting;

type SetupCompleteSetting = {
    key: 'SETUP_COMPLETE';
    value: boolean;
};

type HotkeySetting = {
    key: 'HOTKEY';
    value: string;
};
