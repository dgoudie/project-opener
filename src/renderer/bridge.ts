import {
  CLOSE_APPLICATION,
  HIDE_APPLICATION,
  NAVIGATE_HOME,
  PROMPT_FOR_DIRECTORY,
  REGISTER_SHOW_APPLICATION_HOTKEY,
  REPORT_ACTIVE_ROUTE,
  SCAN_DIRECTORY,
} from '../constants/ipc-renderer-constants';
import { contextBridge, ipcRenderer } from 'electron';

export const BRIDGE = {
  closeApplication: () => ipcRenderer.send(CLOSE_APPLICATION),
  hideApplication: () => ipcRenderer.send(HIDE_APPLICATION),
  registerShowApplicationHotkey: (hotkey: string) =>
    ipcRenderer.send(REGISTER_SHOW_APPLICATION_HOTKEY, hotkey),

  onNavigateHomeRequested: (callback: () => void) =>
    ipcRenderer.on(NAVIGATE_HOME, callback),

  removeNavigateHomeRequestedListener: (callback: () => void) =>
    ipcRenderer.removeListener(NAVIGATE_HOME, callback),

  reportActiveRoute: (route: string) =>
    ipcRenderer.send(REPORT_ACTIVE_ROUTE, route),

  promptForDirectory: (): Promise<string | undefined> =>
    ipcRenderer.invoke(PROMPT_FOR_DIRECTORY),

  scanDirectory: (path: string, filteredPatterns: string[]) =>
    ipcRenderer.invoke(SCAN_DIRECTORY, path, filteredPatterns),
};

contextBridge.exposeInMainWorld('BRIDGE', BRIDGE);
