import {
    getAllSettings,
    getSetting,
    writeSetting,
} from 'src/main-utils/services/settings-service';

import { AppException } from 'src/types';
import { ipcMain } from 'electron';
import { reportException } from 'src/main-utils/services/error-service';

const setupListeners = () => {
    ipcMain.on('getSetting', (event, key, defaultValue) => {
        getSetting(key, defaultValue).subscribe(
            (val) => event.reply('getSettingResult', key, val),
            (err: Error) =>
                reportException(event, new AppException(err.message, err.stack))
        );
    });
    ipcMain.on('getAllSettings', (event, defaultSettings) => {
        getAllSettings(defaultSettings).subscribe(
            (val) => event.reply('getAllSettingsResult', val),
            (err: Error) =>
                reportException(event, new AppException(err.message, err.stack))
        );
    });

    ipcMain.on('writeSetting', (event, key, value) => {
        writeSetting(key, value).subscribe(null, (err: Error) =>
            reportException(event, new AppException(err.message, err.stack))
        );
    });
};

const removeListeners = () => {
    ipcMain.removeAllListeners('getSetting');
    ipcMain.removeAllListeners('getAllSettings');
    ipcMain.removeAllListeners('writeSetting');
};

export const setup = () => {
    setupListeners();
};

export const tearDown = () => {
    removeListeners();
};
