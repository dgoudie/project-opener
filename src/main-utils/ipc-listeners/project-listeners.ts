import {
    countAllProjectsWithoutParent,
    filterTextChange,
    getProjectsByIdsAndSearchText,
    openDirectory,
    openProject,
    tearDownProjectService,
} from 'src/main-utils/services/project-service';

import { AppException } from 'src/types';
import { catchError } from 'rxjs/operators';
import { ipcMain } from 'electron';
import { of } from 'rxjs';
import { reportException } from 'src/main-utils/services/error-service';

const setupListeners = () => {
    ipcMain.on('requestFilteredProjects', (event, text: string) => {
        filterTextChange(event, text, 'filteredProjects');
    });
    ipcMain.on('countAllProjectsWithoutParent', (event) => {
        countAllProjectsWithoutParent()
            .pipe(
                catchError((err) => {
                    reportException(
                        event,
                        new AppException(err.message, err.stack)
                    );
                    return of(0);
                })
            )
            .subscribe((count) => {
                event.reply('countAllProjectsWithoutParentResult', count);
            });
    });
    ipcMain.on('openProject', (event, projectId) => {
        openProject(projectId, event).subscribe(null, (err: Error) =>
            reportException(event, new AppException(err.message, err.stack))
        );
    });
    ipcMain.on('openDirectory', (event, projectId) => {
        openDirectory(projectId).subscribe(null, (err: Error) =>
            reportException(event, new AppException(err.message, err.stack))
        );
    });
    ipcMain.on('getProjectsByIds', (event, ids, text = '') => {
        getProjectsByIdsAndSearchText(ids, text)
            .pipe(
                catchError((err: Error) => {
                    reportException(
                        event,
                        new AppException(err.message, err.stack)
                    );
                    return of([]);
                })
            )
            .subscribe((projects) =>
                event.reply('getProjectsByIdsResult', projects)
            );
    });
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
