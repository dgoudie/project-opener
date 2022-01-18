import { findAvailableIdes, promptForFile } from '../services/ide-service';

import { IpcChannel } from '../../shared/types/channel';
import { getSetting } from '../services/settings-service';
import { ipcMain } from 'electron';

const channels = [
    new IpcChannel('AVAILABLE_IDES', () => findAvailableIdes()),
    new IpcChannel('PROMPT_FOR_FILE', () => promptForFile()),
    new IpcChannel('GET_SETTING', ({ key, defaultValue }) =>
        getSetting(key, defaultValue)
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
