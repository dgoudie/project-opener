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
        )
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
                        path.includes(pt.projectFileName)
                    );
                    switch (matchingProjectType.key) {
                        case 'MAVEN':
                            return parsePomFile(fileContents, path, event).pipe(
                                map<PomFile, Project>((pomFile) => ({
                                    path,
                                    name: pomFile.project.artifactId[0],
                                    clickCount: 0,
                                    inside,
                                    type: matchingProjectType,
                                    children: [],
                                }))
                            );
                        case 'NPM':
                            return parsePackageJsonFile(
                                fileContents,
                                path,
                                event
                            ).pipe(
                                map<PackageJsonFile, Project>(
                                    (packageJsonFile) => ({
                                        path,
                                        name: packageJsonFile.name,
                                        clickCount: 0,
                                        inside,
                                        type: matchingProjectType,
                                        children: [],
                                    })
                                )
                            );
                    }
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

const parsePomFile = (
    data: string,
    path: string,
    event: Electron.IpcMainEvent
): Observable<PomFile> => {
    return from(
        new Observable<PomFile>((observer) =>
            parseString(data, (err, result: PomFile) => {
                !!err ? observer.error(err) : observer.next(result);
                observer.complete();
            })
        ).pipe(
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
            })
        )
    );
};

const parsePackageJsonFile = (
    data: string,
    path: string,
    event: Electron.IpcMainEvent
): Observable<PackageJsonFile> => {
    try {
        return of(JSON.parse(data));
    } catch (err) {
        reportException(
            event,
            new AppException(
                `An error occurred when attempting to parse the file ${path}: ${err.message}`,
                err.stack,
                'WARNING'
            )
        );
        return EMPTY;
    }
};

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
