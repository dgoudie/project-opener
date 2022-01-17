import { getSetting, writeSetting } from '../services/settings-service';

import { Settings } from '../../shared/types/settings';
import { ipcMain } from 'electron';
import { reportAndRethrowExceptions } from '../services/error-service';

const setupListeners = () => {
    ipcMain.on(
        'getSetting',
        <SETTINGS_KEY extends keyof Settings>(
            event: Electron.IpcMainEvent,
            key: SETTINGS_KEY,
            defaultValue: Settings[SETTINGS_KEY]
        ) => {
            getSetting(key, defaultValue)
                .pipe(reportAndRethrowExceptions(event))
                .subscribe((val) => event.reply('getSettingResult', key, val));
        }
    );

    ipcMain.on(
        'writeSetting',
        <SETTINGS_KEY extends keyof Settings>(
            event: Electron.IpcMainEvent,
            key: SETTINGS_KEY,
            value: Settings[SETTINGS_KEY]
        ) => {
            writeSetting(key, value)
                .pipe(reportAndRethrowExceptions(event))
                .subscribe();
        }
    );
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
