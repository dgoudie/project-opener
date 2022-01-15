import {
    promptForDirectory,
    scanPathAndUpdateDatabase,
} from 'src/main-utils/services/path-service';

import { AppException } from 'src/types';
import { ipcMain } from 'electron';
import { removeProjectsByPath } from 'src/main-utils/services/project-service';
import { reportException } from 'src/main-utils/services/error-service';

const setupListeners = () => {
    ipcMain.on('requestSelectedDirectory', (event) => {
        promptForDirectory().subscribe(
            (dir) => event.reply('selectedDirectory', dir),
            (err: Error) =>
                reportException(event, new AppException(err.message, err.stack))
        );
    });
    ipcMain.on('scanPath', (event, path: string) => {
        scanPathAndUpdateDatabase(path, event).subscribe({
            error: (err: Error) =>
                reportException(
                    event,
                    new AppException(err.message, err.stack)
                ),
            complete: () => {
                event.reply('scanPathComplete', path);
            },
        });
    });
    ipcMain.on('removeProjectsByPath', (event, path: string) => {
        removeProjectsByPath(path).subscribe(
            () => null,
            (err: Error) =>
                reportException(event, new AppException(err.message, err.stack))
        );
    });
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
