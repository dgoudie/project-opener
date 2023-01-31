import { BrowserWindow, app, globalShortcut, ipcMain } from 'electron';
import {
  CLOSE_APPLICATION,
  DETERMINE_NESTED_PROJECTS,
  DIRECTORIES_TO_FILE_WATCHER,
  ENABLE_FILE_WATCHING,
  FILTERED_PATTERNS_TO_FILE_WATCHER,
  HIDE_APPLICATION,
  INITIALIZE_FILE_WATCHER,
  NAVIGATE_HOME,
  OPEN_PROJECT_DIRECTORY,
  PROMPT_FOR_DIRECTORY,
  REGISTER_SHOW_APPLICATION_HOTKEY,
  REPORT_ACTIVE_ROUTE,
  SCAN_DIRECTORY,
} from '../constants/ipc-renderer-constants';
import {
  DirectoryDatabaseType,
  FilteredPatternDatabaseType,
} from '../constants/types';

import { DirectoryWatcherJob } from './jobs/directory-watcher-job';
import { determineNestedProjects } from './utils/remove-nested-paths';
import openProjectDirectory from './utils/open-project-directory';
import promptForDirectory from './utils/prompt-for-directory';
import { scanDirectory } from './utils/scan-directory';

let hide: () => void;

const hideOnBlurRoutes = new Set(['/']);

let directoryWatcherJob: DirectoryWatcherJob | null = null;

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

  ipcMain.on(
    REGISTER_SHOW_APPLICATION_HOTKEY,
    (_event, hotkey: string | undefined) => {
      globalShortcut.unregisterAll();
      !!hotkey && globalShortcut.register(hotkey, () => window.show());
    }
  );

  ipcMain.handle(
    INITIALIZE_FILE_WATCHER,
    (
      _event,
      directories: DirectoryDatabaseType[],
      filteredPatterns: FilteredPatternDatabaseType[],
      enabled: boolean
    ) => {
      if (!!directoryWatcherJob) {
        return;
      }
      directoryWatcherJob = new DirectoryWatcherJob(
        window,
        directories,
        filteredPatterns,
        enabled
      );
    }
  );

  ipcMain.on(ENABLE_FILE_WATCHING, (_event, enabled: boolean) => {
    if (enabled) {
      directoryWatcherJob?.start();
    } else {
      directoryWatcherJob?.stop();
    }
  });

  ipcMain.on(
    DIRECTORIES_TO_FILE_WATCHER,
    (_event, directories: DirectoryDatabaseType[]) => {
      directoryWatcherJob?.setDirectories(directories);
    }
  );

  ipcMain.on(
    FILTERED_PATTERNS_TO_FILE_WATCHER,
    (_event, filteredPatterns: FilteredPatternDatabaseType[]) => {
      directoryWatcherJob?.setFilteredPatterns(filteredPatterns);
    }
  );

  ipcMain.on(REPORT_ACTIVE_ROUTE, (_event, route: string) => {
    activeRoute = route;
  });

  ipcMain.on(OPEN_PROJECT_DIRECTORY, (_event, projectPath: string) =>
    openProjectDirectory(projectPath, window)
  );

  ipcMain.handle(PROMPT_FOR_DIRECTORY, promptForDirectory);

  ipcMain.handle(DETERMINE_NESTED_PROJECTS, (_event, paths: string[]) =>
    determineNestedProjects(paths)
  );

  ipcMain.handle(
    SCAN_DIRECTORY,
    (_event, path: string, filteredPatterns: string[]) =>
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
