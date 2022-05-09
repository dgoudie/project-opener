import { ElementOf, literals } from '../utils/oneof-array';

export const IdeTypes = literals('INTELLIJ', 'VSCODE', 'WEBSTORM', 'CUSTOM');

export type IdeType = ElementOf<typeof IdeTypes>;

export const ProjectTypes = literals('MAVEN', 'NPM', 'RUST', 'PYTHON', 'GO');

export type ProjectType = ElementOf<typeof ProjectTypes>;

export const ProjectTypeNameMap = new Map<ProjectType, string>([
  ['MAVEN', 'Maven'],
  ['NPM', 'NPM'],
  ['RUST', 'Rust'],
  ['PYTHON', 'Python'],
  ['GO', 'Go'],
]);

export const ProjectTypeFileNameMap = new Map<ProjectType, string>([
  ['MAVEN', 'pom.xml'],
  ['NPM', 'package.json'],
  ['RUST', 'cargo.toml'],
  ['PYTHON', 'pipfile'],
  ['GO', 'go.mod'],
]);

export interface Ide {
  name: string;
  type: IdeType;
  args: string[];
  path: string;
}

export interface IdeDatabaseType extends Ide {
  projectType: ProjectType;
}

export interface ProjectDatabaseType {
  path: string;
  name: string;
  type: ProjectType;
  createdAt: Date;
  lastOpenedAt: Date;
  openedCount: number;
}

export type FilteredPatternDatabaseType = {
  pattern: string;
  createdAt: Date;
};
export type DirectoryDatabaseType = {
  path: string;
  createdAt: Date;
};
