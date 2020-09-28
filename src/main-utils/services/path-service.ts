import { AppException, Project, projectTypes } from 'src/types';
import {
    EMPTY,
    Observable,
    concat,
    forkJoin,
    from,
    of,
    throwError,
} from 'rxjs';
import {
    catchError,
    filter,
    map,
    mergeMap,
    reduce,
    switchMap,
    switchMapTo,
    tap,
} from 'rxjs/operators';
import {
    findProjectsByPath,
    insertProjects,
    removeProjects,
} from 'src/main-utils/repositories/project-repository';

import { dialog } from 'electron';
import { getSetting } from 'src/main-utils/services/settings-service';
import globby from 'globby';
import { normalize } from 'path';
import { parseString } from 'xml2js';
import { readFile } from 'fs';
import { reportException } from 'src/main-utils/services/error-service';
import { setChildren } from 'src/main-utils/services/project-service';
import toml from 'toml';

export function promptForDirectory(): Observable<string> {
    return from(
        dialog.showOpenDialog({
            properties: ['openDirectory'],
        })
    ).pipe(
        filter(({ canceled }) => !canceled),
        map(({ filePaths }) => filePaths[0])
    );
}

export function scanPathAndUpdateDatabase(
    path: string,
    event: Electron.IpcMainEvent
) {
    const filteredPatterns$ = getSetting<string[]>('filteredPatterns');
    const existingProjectsForPath$ = findProjectsByPath(path);
    return forkJoin([filteredPatterns$, existingProjectsForPath$]).pipe(
        switchMap(([filteredPatterns, existingProjectsForPath]) =>
            findFiles(path, filteredPatterns).pipe(
                map((files) => files.map((file) => normalize(file))),
                switchMap((files) =>
                    convertFilesToProjects(files, path, event)
                ),
                map((newProjects) =>
                    getAddedAndRemovedProjects(
                        existingProjectsForPath,
                        newProjects
                    )
                )
            )
        ),
        switchMap(([addedProjects, removedProjects]) =>
            concat(
                forkJoin([
                    insertProjects(addedProjects),
                    removeProjects(removedProjects),
                ]),
                setChildren()
            )
        ),
        switchMapTo(of(null))
    );
}

const findFiles = (
    path: string,
    filteredPatterns: string[]
): Observable<string[]> => {
    const pattern = `${path}/**/{${projectTypes
        .map((pt) => pt.projectFileName)
        .join(',')}}`.replace(/\\/g, '/');
    const pathPromise = globby(pattern, {
        caseSensitiveMatch: false,
        ignore: filteredPatterns,
        suppressErrors: true,
        onlyFiles: true,
    });
    return from(pathPromise);
};

const convertFilesToProjects = (
    files: string[],
    inside: string,
    event: Electron.IpcMainEvent
): Observable<Project[]> => {
    return from(files).pipe(
        mergeMap((path) =>
            read(path, event).pipe(
                mergeMap((fileContents) => {
                    const matchingProjectType = projectTypes.find((pt) =>
                        path.toLowerCase().includes(pt.projectFileName)
                    );
                    let project: Project = {
                        path,
                        name: null,
                        clickCount: 0,
                        inside,
                        type: matchingProjectType,
                        children: [],
                    };
                    let name$: Observable<string>;
                    switch (matchingProjectType.key) {
                        case 'MAVEN':
                            name$ = getNameFromPomFile(fileContents);
                            break;
                        case 'NPM':
                            name$ = getNameFromPackageJsonFile(fileContents);
                            break;
                        case 'RUST':
                            name$ = getNameFromCargoTomlFile(fileContents);
                            break;
                        case 'PYTHON':
                            name$ = getNameFromPipfile(fileContents);
                            break;
                    }
                    if (!name$) {
                        return throwError(
                            `Unable to determine project file for project type ${matchingProjectType.key}`
                        );
                    }
                    return name$.pipe(
                        catchError((err: Error) => {
                            reportException(
                                event,
                                new AppException(
                                    `An error occurred when attempting to parse the file ${path}: ${err.message}`,
                                    err.stack,
                                    'WARNING'
                                )
                            );
                            return EMPTY;
                        }),
                        map((name) => ({ ...project, name }))
                    );
                })
            )
        ),
        reduce((acc, project) => [...acc, project], [])
    );
};

const read = (
    file: string,
    event: Electron.IpcMainEvent
): Observable<string> => {
    const promise = new Promise<string>((resolve, reject) =>
        readFile(file, 'utf-8', (err, result) =>
            !!err ? reject(err) : resolve(result)
        )
    );
    return from(promise).pipe(
        catchError((err: Error) => {
            reportException(
                event,
                new AppException(
                    `An error occurred when attempting to read the file ${file}: ${err.message}`,
                    err.stack,
                    'WARNING'
                )
            );
            return EMPTY;
        })
    );
};

const getNameFromPomFile = (data: string): Observable<string> => {
    return from(
        new Observable<PomFile>((observer) =>
            parseString(data, (err, result: PomFile) => {
                !!err ? observer.error(err) : observer.next(result);
                observer.complete();
            })
        )
    ).pipe(
        switchMap((pomXmlFile) =>
            !!pomXmlFile?.project?.artifactId[0]
                ? of(pomXmlFile.project.artifactId[0])
                : throwError(new Error('Malformed pom.xml'))
        )
    );
};

const getNameFromPackageJsonFile = (data: string): Observable<string> =>
    of(data).pipe(
        map<string, PackageJsonFile>((d) => JSON.parse(d)),
        switchMap((packageJsonFile) =>
            !!packageJsonFile?.name
                ? of(packageJsonFile.name)
                : throwError(new Error('Malformed package.json'))
        )
    );

const getNameFromCargoTomlFile = (data: string): Observable<string> =>
    of(data).pipe(
        map<string, CargoTomlFile>((d) => toml.parse(d)),
        switchMap((cargoTomlFile) =>
            !!cargoTomlFile?.package?.name
                ? of(cargoTomlFile.package?.name)
                : throwError(new Error('Malformed Cargo.toml'))
        )
    );

const getNameFromPipfile = (data: string): Observable<string> =>
    of(data).pipe(
        map<string, Pipfile>((d) => toml.parse(d)),
        switchMap((cargoTomlFile) =>
            !!cargoTomlFile?.source[0]?.name
                ? of(cargoTomlFile.source[0].name)
                : throwError(new Error('Malformed Pipfile'))
        )
    );

const getAddedAndRemovedProjects = (
    oldProjects: Project[],
    newProjects: Project[]
) => {
    const addedProjects = findProjectsDifference(newProjects, oldProjects);
    const removedProjects = findProjectsDifference(oldProjects, newProjects);
    return [addedProjects, removedProjects];
};

const findProjectsDifference = (
    list1: Project[],
    list2: Project[]
): Project[] => {
    const list2Map: Set<string> = list2.reduce(
        (set: Set<string>, project: Project) => set.add(project.path),
        new Set()
    );
    return list1.filter((newProj) => !list2Map.has(newProj.path));
};

interface PomFile {
    project: { artifactId: string[] };
}

interface PackageJsonFile {
    name: string;
}

interface CargoTomlFile {
    package: { name: string };
}

interface Pipfile {
    source: { name: string }[];
}
