import {
    findAvailableIdes,
    promptForFile,
} from 'src/main-utils/services/ide-service';

import { AppException } from 'src/types';
import { ipcMain } from 'electron';
import { reportException } from 'src/main-utils/services/error-service';

const setupListeners = () => {
    ipcMain.on('requestAvailableIdes', (event) => {
        findAvailableIdes().subscribe(
            (ides) => event.reply('availableIdes', ides),
            (err: Error) =>
                reportException(event, new AppException(err.message, err.stack))
        );
    });
    ipcMain.on('requestSelectedFile', (event) => {
        promptForFile().subscribe(
            (executable) => event.reply('selectedFile', executable),
            (err: Error) =>
                reportException(event, new AppException(err.message, err.stack))
        );
    });
};

const removeListeners = () => {
    ipcMain.removeAllListeners('requestAvailableIdes');
    ipcMain.removeAllListeners('requestSelectedFile');
};

export const setup = () => {
    setupListeners();
};

export const tearDown = () => {
    removeListeners();
};
