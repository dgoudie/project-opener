import {
    countAllProjects,
    filterTextChange,
    openDirectory,
    openProject,
    tearDownProjectService,
} from 'src/main-utils/services/project-service';

import { AppException } from 'src/types';
import { ipcMain } from 'electron';
import { reportException } from 'src/main-utils/services/error-service';

const setupListeners = () => {
    ipcMain.on('requestFilteredProjects', (event, text: string) => {
        filterTextChange(event, text, 'filteredProjects');
    });
    ipcMain.on('requestProjectCount', (event) => {
        countAllProjects().subscribe(
            (count) => event.reply('projectCount', count),
            (err: Error) =>
                reportException(event, new AppException(err.message, err.stack))
        );
    });
    ipcMain.on('openProject', (event, projectId) => {
        openProject(projectId).subscribe(null, (err: Error) =>
            reportException(event, new AppException(err.message, err.stack))
        );
    });
    ipcMain.on('openDirectory', (event, projectId) => {
        openDirectory(projectId).subscribe(null, (err: Error) =>
            reportException(event, new AppException(err.message, err.stack))
        );
    });
};

const removeListeners = () => {
    ipcMain.removeAllListeners('requestFilteredProjects');
    ipcMain.removeAllListeners('requestProjectCount');
    ipcMain.removeAllListeners('openProject');
    ipcMain.removeAllListeners('openDirectory');
};

export const setup = () => {
    setupListeners();
};

export const tearDown = () => {
    tearDownProjectService();
    removeListeners();
};
