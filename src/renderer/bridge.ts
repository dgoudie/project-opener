import { contextBridge, ipcRenderer } from 'electron';

export const BRIDGE_APIS = {
    sendIpcEvent: <T = any>(eventName: string, payload: T) =>
        ipcRenderer.send(eventName, payload),

    addIpcEventListener: <T = any>(
        eventName: string,
        handler: (event: Electron.IpcRendererEvent, payload: T) => void
    ) => ipcRenderer.on(eventName, handler),

    removeIpcEventListener: <T = any>(
        eventName: string,
        handler: (event: Electron.IpcRendererEvent, payload: T) => void
    ) => ipcRenderer.removeListener(eventName, handler),
};

contextBridge.exposeInMainWorld('BRIDGE_APIS', BRIDGE_APIS);
