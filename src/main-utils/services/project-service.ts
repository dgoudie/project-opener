import { Subject, forkJoin, of, timer } from 'rxjs';
import { catchError, debounce, map, switchMap, tap } from 'rxjs/operators';
import {
    countAllProjects as countAllProjectsFromRepository,
    getAllProjectsWithoutParent,
    getProjectById,
    incrementClickCount,
    removeProjectsByPath as removeProjectsByPathFromRepostitory,
    searchProjectsWithoutParent,
    setChildren as setChildrenRepository,
} from 'src/main-utils/repositories/project-repository';
import { dirname, normalize } from 'path';

import { Project } from 'src/types';
import { getIdeByProjectType } from 'src/main-utils/services/settings-service';
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

export const countAllProjects = () => {
    return countAllProjectsFromRepository().pipe(
        catchError((err) => {
            console.error(err);
            return of(0);
        })
    );
};

export const openProject = (id: string) => {
    return forkJoin([
        incrementClickCount(id),
        getProjectById(id).pipe(
            switchMap((project) =>
                getIdeByProjectType(project.type).pipe(
                    map((ide) => ({ ide, project }))
                )
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
        ),
    ]);
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
