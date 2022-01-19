import {
    CLOSE_APPLICATION,
    HIDE_APPLICATION,
    NAVIGATE_HOME,
    REGISTER_SHOW_APPLICATION_HOTKEY,
} from '../constants/ipc-renderer-constants';
import { contextBridge, ipcRenderer } from 'electron';

export const BRIDGE = {
    closeApplication: () => ipcRenderer.send(CLOSE_APPLICATION),
    hideApplication: () => ipcRenderer.send(HIDE_APPLICATION),
    registerShowApplicationHotkey: (hotkey: string) =>
        ipcRenderer.send(REGISTER_SHOW_APPLICATION_HOTKEY, hotkey),

    onNavigateHomeRequested: (_: () => void) =>
        ipcRenderer.on(NAVIGATE_HOME, _),

    removeNavigateHomeRequestedListener: (_: () => void) =>
        ipcRenderer.removeListener(NAVIGATE_HOME, _),
};

contextBridge.exposeInMainWorld('BRIDGE', BRIDGE);
