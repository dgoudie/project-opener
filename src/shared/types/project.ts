export type ProjectType = {
    key: string;
    commonName: string;
    projectFileName: string;
};

export const projectTypes: ProjectType[] = [
    { key: 'MAVEN', commonName: 'Maven', projectFileName: 'pom.xml' },
    { key: 'NPM', commonName: 'NPM', projectFileName: 'package.json' },
    { key: 'RUST', commonName: 'Rust', projectFileName: 'cargo.toml' },
    { key: 'PYTHON', commonName: 'Python', projectFileName: 'pipfile' },
];

export interface Project {
    _id?: string;
    name: string;
    path: string;
    clickCount: number;
    inside: string;
    type: ProjectType;
    children: string[];
}
