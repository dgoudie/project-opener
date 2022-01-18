import { findAvailableIdes, promptForFile } from '../services/ide-service';

import { IpcChannel } from '../../shared/types/channel';
import { getSetting } from '../services/settings-service';
import { ipcMain } from 'electron';
import { settingsKeys } from '../../shared/types/settings';

const channels = [
    new IpcChannel('AVAILABLE_IDES', () => findAvailableIdes()),
    new IpcChannel('PROMPT_FOR_FILE', () => promptForFile()),
    ...settingsKeys.map(
        (settingKey) =>
            new IpcChannel(`GET_SETTING_${settingKey}`, (defaultValue) =>
                getSetting(settingKey, defaultValue)
            )
    ),
];

export const setupListeners = () => {
    channels.forEach((channel) => {
        ipcMain.on(channel.name, (event, payload) =>
            channel.handleIpcEvent(event, payload)
        );
    });
};

export const removeListeners = () => {
    channels.forEach((channel) => {
        ipcMain.removeAllListeners(channel.name);
    });
};
