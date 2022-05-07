import { BrowserWindow, app, globalShortcut, ipcMain } from 'electron';
import {
  CLOSE_APPLICATION,
  HIDE_APPLICATION,
  NAVIGATE_HOME,
  PROMPT_FOR_DIRECTORY,
  REGISTER_SHOW_APPLICATION_HOTKEY,
  REPORT_ACTIVE_ROUTE,
  SCAN_DIRECTORY,
} from '../constants/ipc-renderer-constants';

import promptForDirectory from './utils/prompt-for-directory';
import { scanDirectory } from './utils/scan-directory';

let hide: () => void;

const hideOnBlurRoutes = new Set(['/']);

export const setupServices = (isDev: boolean, window: BrowserWindow) => {
  let activeRoute: string;
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

  ipcMain.on(REPORT_ACTIVE_ROUTE, (_event, route: string) => {
    activeRoute = route;
  });

  ipcMain.handle(PROMPT_FOR_DIRECTORY, promptForDirectory);

  ipcMain.handle(SCAN_DIRECTORY, (_event, path, filteredPatterns) =>
    scanDirectory(path, filteredPatterns, window)
  );

  window.on('blur', () => {
    if (hideOnBlurRoutes.has(activeRoute)) {
      hide();
    }
  });
};

export const tearDownServices = (window: BrowserWindow) => {
  ipcMain.removeAllListeners(CLOSE_APPLICATION);
  ipcMain.removeAllListeners(HIDE_APPLICATION);
  ipcMain.removeAllListeners(REGISTER_SHOW_APPLICATION_HOTKEY);
  window.removeListener('blur', hide);
};
