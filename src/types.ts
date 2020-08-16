import { ITheme } from '@fluentui/react';

export interface AppNotification {
    text: string;
    dismissTimeMs: number | null;
    id: string;
    iconName: string;
    _displayStarted?: boolean;
}

export type AppTheme = { name: string } & ITheme;

export type IdeType = 'INTELLIJ' | 'VSCODE' | 'WEBSTORM' | 'CUSTOM';

export const ideTypes: IdeType[] = ['INTELLIJ', 'VSCODE', 'WEBSTORM'];

export type ProjectType = {
    key: string;
    commonName: string;
    projectFileName: string;
};

export const projectTypes: ProjectType[] = [
    { key: 'MAVEN', commonName: 'Maven', projectFileName: 'pom.xml' },
    { key: 'NPM', commonName: 'NPM', projectFileName: 'package.json' },
];

export interface CurrentlyScanningPath {
    path: string;
    notificationId: string;
}

export interface Ide {
    projectType?: ProjectType;
    name: string;
    type: IdeType;
    args: string[];
    path: string;
}

export interface Project {
    _id?: string;
    name: string;
    path: string;
    clickCount: number;
    inside: string;
    type: ProjectType;
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
