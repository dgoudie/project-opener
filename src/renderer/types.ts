import { ThemeProviderProps } from '@primer/react';

export interface AppNotification {
    text: string;
    dismissTimeMs: number | null;
    id: string;
    iconName: string;
    _displayStarted?: boolean;
}

export type IdeType = 'INTELLIJ' | 'VSCODE' | 'WEBSTORM' | 'CUSTOM';

export const ideTypes: IdeType[] = ['INTELLIJ', 'VSCODE', 'WEBSTORM'];

export const projectTypes = [
    { key: 'MAVEN', commonName: 'Maven', projectFileName: 'pom.xml' },
    { key: 'NPM', commonName: 'NPM', projectFileName: 'package.json' },
    { key: 'RUST', commonName: 'Rust', projectFileName: 'cargo.toml' },
    { key: 'PYTHON', commonName: 'Python', projectFileName: 'pipfile' },
];

export type ProjectType = typeof projectTypes[number]['key'];

export interface CurrentlyScanningPath {
    path: string;
    notificationId: string;
}

export interface ProjectIde<PROJECT_TYPE extends ProjectType> extends Ide {
    projectType: PROJECT_TYPE;
}

export interface Ide {
    name: string;
    type: IdeType;
    args: string[];
    path: string;
}

export interface Project<PROJECT_TYPE extends ProjectType> {
    _id?: string;
    name: string;
    path: string;
    clickCount: number;
    inside: string;
    type: PROJECT_TYPE;
    children: string[];
}

type AppExceptionType = 'ERROR' | 'WARNING';

export class AppException {
    message: string;
    type: AppExceptionType;
    stack? = Error().stack;
    constructor(message = '', stack = '', type: AppExceptionType = 'ERROR') {
        this.message = message;
        this.type = type;
        this.stack = !!stack ? stack : Error().stack;
    }
}
export type FilteredPatternDatabaseType = {
    pattern: string;
    createdAt: Date;
};
export type PathDatabaseType = {
    path: string;
    createdAt: Date;
};

export type SettingDatabaseType =
    | SetupCompleteSetting
    | HotkeySetting
    | ThemeSetting;

type SetupCompleteSetting = {
    key: 'SETUP_COMPLETE';
    value: boolean;
};

type HotkeySetting = {
    key: 'HOTKEY';
    value: string;
};

type ThemeSetting = {
    key: 'THEME';
    value: ThemeProviderProps['colorMode'];
};
