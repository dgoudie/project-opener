import { EMPTY, Subject, forkJoin, of, throwError, timer } from 'rxjs';
import { catchError, debounce, map, switchMap, tap } from 'rxjs/operators';
import {
    countAllProjectsWithoutParent as countAllProjectsWithoutParentFromRepository,
    getAllProjectsWithoutParent,
    getProjectById,
    getProjectsByIdsAndSearchText as getProjectsByIdsAndSearchTextFromRepository,
    incrementClickCount,
    removeProjectsByPath as removeProjectsByPathFromRepostitory,
    searchProjectsWithoutParent,
    setChildren as setChildrenRepository,
} from 'src/main-utils/repositories/project-repository';
import { dirname, normalize } from 'path';

import { AppException } from 'src/types';
import { IpcMainEvent } from 'electron';
import { checkIfIdeExists } from 'src/main-utils/services/ide-service';
import { getIdeByProjectType } from 'src/main-utils/services/settings-service';
import { reportException } from 'src/main-utils/services/error-service';
import { spawn } from 'child_process';

const WAIT_INTERVAL = 150;

const filterTextChangeSubject = new Subject<{
    text: string;
    event: Electron.IpcMainEvent;
    returnEventName: string;
}>();

const filterTextChangeSubscription = filterTextChangeSubject
    .pipe(
        debounce((event) =>
            !!event.text
                ? timer(WAIT_INTERVAL).pipe(map(() => event))
                : of(event)
        ),
        switchMap(({ text, event, returnEventName }) => {
            let obs$ = getAllProjectsWithoutParent();
            if (!!text) {
                obs$ = searchProjectsWithoutParent(text);
            }
            return obs$.pipe(
                map((projects) => ({ projects, event, returnEventName }))
            );
        })
    )
    .subscribe(({ projects, event, returnEventName }) => {
        event.reply(returnEventName, projects);
    });

export const countAllProjectsWithoutParent = () => {
    return countAllProjectsWithoutParentFromRepository();
};

export const getProjectsByIdsAndSearchText = (ids: string[], text: string) =>
    getProjectsByIdsAndSearchTextFromRepository(ids, text);

export const openProject = (id: string, event: IpcMainEvent) => {
    return getProjectById(id).pipe(
        switchMap((project) =>
            getIdeByProjectType(project.type).pipe(
                switchMap((ide) => {
                    if (!ide) {
                        reportException(event, {
                            message: `An IDE for ${project.type.commonName} projects has not been specified. Go to Settings > IDEs to set one up.`,
                            type: 'WARNING',
                        });
                        return EMPTY;
                    }
                    return of({ ide, project });
                }),
                switchMap(({ ide, project }) =>
                    checkIfIdeExists(ide).pipe(
                        switchMap((exists) => {
                            if (!exists) {
                                reportException(event, {
                                    message: `The IDE for ${project.type.commonName} projects could not be found.`,
                                    type: 'WARNING',
                                });
                                return EMPTY;
                            }
                            return of({ ide, project });
                        })
                    )
                )
            )
        ),
        switchMap(({ ide, project }) =>
            incrementClickCount(id).pipe(map(() => ({ ide, project })))
        ),
        tap(({ ide, project }) => {
            if (!ide || !project) {
                return;
            }
            const ideExecutable = normalize(ide.path);
            const fileDirectory = normalize(dirname(project.path));
            const evaluatedArgs = ide.args.map((arg) =>
                arg
                    .replace(/{{file}}/g, project.path)
                    .replace(/{{directory}}/g, fileDirectory)
            );
            spawn(ideExecutable, evaluatedArgs, {
                detached: true,
                stdio: ['ignore', 'ignore', 'ignore'],
            });
        })
    );
};

export const removeProjectsByPath = (path: string) => {
    return removeProjectsByPathFromRepostitory(path).pipe(
        switchMap(() => setChildren())
    );
};

export const openDirectory = (id: string) => {
    return getProjectById(id).pipe(
        tap((project) => {
            if (!project) {
                return;
            }
            const fileDirectory = normalize(dirname(project.path));
            spawn(`c:\\windows\\explorer.exe`, [fileDirectory], {
                detached: true,
                stdio: ['ignore', 'ignore', 'ignore'],
            });
        })
    );
};

export const setChildren = () => {
    return setChildrenRepository();
};

export const filterTextChange = (
    event: Electron.IpcMainEvent,
    text: string,
    returnEventName: string
) => {
    filterTextChangeSubject.next({ text, event, returnEventName });
};

export const tearDownProjectService = () => {
    filterTextChangeSubscription.unsubscribe();
};
