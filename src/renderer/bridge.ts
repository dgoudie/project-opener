import { contextBridge, ipcRenderer } from 'electron';

import { CLOSE_APPLICATION } from '../constants/ipc-renderer-constants';

export const bridgeApis = {
    closeApplication: () => ipcRenderer.send(CLOSE_APPLICATION),
};

contextBridge.exposeInMainWorld('bridgeApis', bridgeApis);
