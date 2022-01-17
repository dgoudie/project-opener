import {
    countAllProjectsWithoutParent,
    filterTextChange,
    getProjectsByIdsAndSearchText,
    openDirectory,
    openProject,
    tearDownProjectService,
} from '../services/project-service';

import { Project } from '../../shared/types/project';
import { catchError } from 'rxjs/operators';
import { ipcMain } from 'electron';
import { of } from 'rxjs';
import { reportAndRethrowExceptions } from '../services/error-service';

const setupListeners = () => {
    ipcMain.on('requestFilteredProjects', (event, text: string) => {
        filterTextChange(event, text, 'filteredProjects');
    });
    ipcMain.on('countAllProjectsWithoutParent', (event) => {
        countAllProjectsWithoutParent()
            .pipe(
                reportAndRethrowExceptions(event),
                catchError(() => of(0))
            )
            .subscribe((count) => {
                event.reply('countAllProjectsWithoutParentResult', count);
            });
    });
    ipcMain.on('openProject', (event, projectId) => {
        openProject(projectId, event)
            .pipe(reportAndRethrowExceptions(event))
            .subscribe();
    });
    ipcMain.on('openDirectory', (event, projectId) => {
        openDirectory(projectId)
            .pipe(reportAndRethrowExceptions(event))
            .subscribe();
    });
    ipcMain.on(
        'getProjectsByIds',
        (event, ids: string[], text = '', uuid: string) => {
            getProjectsByIdsAndSearchText(ids, text)
                .pipe(
                    reportAndRethrowExceptions(event),
                    catchError(() => of<Project[]>([]))
                )
                .subscribe((projects) => event.reply(uuid, projects));
        }
    );
};

const removeListeners = () => {
    ipcMain.removeAllListeners('requestFilteredProjects');
    ipcMain.removeAllListeners('requestProjectCount');
    ipcMain.removeAllListeners('openProject');
    ipcMain.removeAllListeners('openDirectory');
    ipcMain.removeAllListeners('getProjectsByIds');
};

export const setup = () => {
    setupListeners();
};

export const tearDown = () => {
    tearDownProjectService();
    removeListeners();
};
