import { ProjectType } from './project';

export interface Ide {
    projectType?: ProjectType;
    name: string;
    type: IdeType;
    args: string[];
    path: string;
}

export type IdeType = 'INTELLIJ' | 'VSCODE' | 'WEBSTORM' | 'CUSTOM';

export const ideTypes: IdeType[] = ['INTELLIJ', 'VSCODE', 'WEBSTORM'];
