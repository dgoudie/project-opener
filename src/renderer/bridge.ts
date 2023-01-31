import {
  CLOSE_APPLICATION,
  DETERMINE_NESTED_PROJECTS,
  DIRECTORIES_TO_FILE_WATCHER,
  ENABLE_FILE_WATCHING,
  FILTERED_PATTERNS_TO_FILE_WATCHER,
  HIDE_APPLICATION,
  INITIALIZE_FILE_WATCHER,
  NAVIGATE_HOME,
  ON_PROJECT_ADDED,
  ON_PROJECT_CHANGED,
  ON_PROJECT_REMOVED,
  OPEN_PROJECT_DIRECTORY,
  PROMPT_FOR_DIRECTORY,
  REGISTER_SHOW_APPLICATION_HOTKEY,
  REPORT_ACTIVE_ROUTE,
  REPORT_EXCEPTION,
  SCAN_DIRECTORY,
} from '../constants/ipc-renderer-constants';
import {
  DirectoryDatabaseType,
  FilteredPatternDatabaseType,
  ProjectDatabaseType,
} from '../constants/types';
import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';

import { NotificationType } from './providers/SnackbarProvider';

export const BRIDGE = {
  closeApplication: () => ipcRenderer.send(CLOSE_APPLICATION),
  hideApplication: () => ipcRenderer.send(HIDE_APPLICATION),
  registerShowApplicationHotkey: (hotkey?: string) =>
    ipcRenderer.send(REGISTER_SHOW_APPLICATION_HOTKEY, hotkey),

  removeNavigateHomeRequestedListener: (callback: () => void) =>
    ipcRenderer.removeListener(NAVIGATE_HOME, callback),

  reportActiveRoute: (route: string) =>
    ipcRenderer.send(REPORT_ACTIVE_ROUTE, route),

  promptForDirectory: (): Promise<string | undefined> =>
    ipcRenderer.invoke(PROMPT_FOR_DIRECTORY),

  openProjectDirectory: (projectPath: string) =>
    ipcRenderer.send(OPEN_PROJECT_DIRECTORY, projectPath),

  scanDirectory: (
    path: string,
    filteredPatterns: string[]
  ): Promise<ProjectDatabaseType[]> =>
    ipcRenderer.invoke(SCAN_DIRECTORY, path, filteredPatterns),

  determineNestedProjects: (paths: string[]): Promise<string[]> =>
    ipcRenderer.invoke(DETERMINE_NESTED_PROJECTS, paths),

  initializeDirectoryWatcherJob: (
    directories: DirectoryDatabaseType[],
    filteredPatterns: FilteredPatternDatabaseType[],
    enabled: boolean
  ) => {
    ipcRenderer.invoke(
      INITIALIZE_FILE_WATCHER,
      directories,
      filteredPatterns,
      enabled
    );
  },

  enableFileWatching: (enabled: boolean) => {
    ipcRenderer.send(ENABLE_FILE_WATCHING, enabled);
  },

  sendDirectoriesToFileWatcher: (directories: DirectoryDatabaseType[]) => {
    ipcRenderer.send(DIRECTORIES_TO_FILE_WATCHER, directories);
  },

  sendFilteredPatternsToFileWatcher: (
    filteredPatterns: FilteredPatternDatabaseType[]
  ) => {
    ipcRenderer.send(FILTERED_PATTERNS_TO_FILE_WATCHER, filteredPatterns);
  },

  onProjectAdded: (
    callback: (_event: IpcRendererEvent, project: ProjectDatabaseType) => void
  ) => ipcRenderer.on(ON_PROJECT_ADDED, callback),

  onProjectChanged: (
    callback: (
      _event: IpcRendererEvent,
      path: string,
      newProjectName: string
    ) => void
  ) => ipcRenderer.on(ON_PROJECT_CHANGED, callback),

  onProjectRemoved: (
    callback: (_event: IpcRendererEvent, path: string) => void
  ) => ipcRenderer.on(ON_PROJECT_REMOVED, callback),

  onNavigateHomeRequested: (callback: () => void) =>
    ipcRenderer.on(NAVIGATE_HOME, callback),

  onExceptionReceived: (
    callback: (
      _event: IpcRendererEvent,
      type: NotificationType,
      message: string
    ) => void
  ) => ipcRenderer.on(REPORT_EXCEPTION, callback),
};

contextBridge.exposeInMainWorld('BRIDGE', BRIDGE);
