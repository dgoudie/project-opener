import { app, ipcMain } from 'electron';

import { CLOSE_APPLICATION } from '../constants/ipc-renderer-constants';

export const setupServices = () => {
    ipcMain.on(CLOSE_APPLICATION, () => app.quit());
};

export const tearDownServices = () => {
    ipcMain.removeAllListeners(CLOSE_APPLICATION);
};
