import {
    promptForDirectory,
    scanPathAndUpdateDatabase,
} from '../services/path-service';

import { ipcMain } from 'electron';
import { removeProjectsByPath } from '../services/project-service';
import { reportAndRethrowExceptions } from '../services/error-service';

const setupListeners = () => {
    ipcMain.on('requestSelectedDirectory', (event) => {
        promptForDirectory()
            .pipe(reportAndRethrowExceptions(event))
            .subscribe((dir) => event.reply('selectedDirectory', dir));
    });
    ipcMain.on('scanPath', (event, path: string) => {
        scanPathAndUpdateDatabase(path, event)
            .pipe(reportAndRethrowExceptions(event))
            .subscribe(event.reply('scanPathComplete', path));
    });
    ipcMain.on('removeProjectsByPath', (event, path: string) =>
        removeProjectsByPath(path)
            .pipe(reportAndRethrowExceptions(event))
            .subscribe()
    );
};

const removeListeners = () => {
    ipcMain.removeAllListeners('requestSelectedDirectory');
    ipcMain.removeAllListeners('scanPath');
    ipcMain.removeAllListeners('removeProjectsByPath');
};

export const setup = () => {
    setupListeners();
};

export const tearDown = () => {
    removeListeners();
};
