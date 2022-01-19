import { BrowserWindow, app, globalShortcut, ipcMain } from 'electron';
import {
    CLOSE_APPLICATION,
    HIDE_APPLICATION,
    NAVIGATE_HOME,
    REGISTER_SHOW_APPLICATION_HOTKEY,
} from '../constants/ipc-renderer-constants';

let hide: () => void;

export const setupServices = (isDev: boolean, window: BrowserWindow) => {
    hide = () => {
        if (!isDev) {
            window.webContents.send(NAVIGATE_HOME);
            window.hide();
        }
    };

    ipcMain.on(CLOSE_APPLICATION, () => app.quit());

    ipcMain.on(HIDE_APPLICATION, hide);

    ipcMain.on(REGISTER_SHOW_APPLICATION_HOTKEY, (_event, hotkey: string) => {
        globalShortcut.unregisterAll();
        globalShortcut.register(hotkey, () => window.show());
    });

    window.on('blur', hide);
};

export const tearDownServices = (window: BrowserWindow) => {
    ipcMain.removeAllListeners(CLOSE_APPLICATION);
    ipcMain.removeAllListeners(HIDE_APPLICATION);
    ipcMain.removeAllListeners(REGISTER_SHOW_APPLICATION_HOTKEY);
    window.removeListener('blur', hide);
};
