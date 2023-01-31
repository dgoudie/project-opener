import {
  DirectoryDatabaseType,
  FilteredPatternDatabaseType,
  ProjectTypeFileNameMap,
} from '../../constants/types';
import {
  ON_PROJECT_ADDED,
  ON_PROJECT_CHANGED,
  ON_PROJECT_REMOVED,
} from '../../constants/ipc-renderer-constants';

import { BrowserWindow } from 'electron';
import { Job } from './job';
import chokidar from 'chokidar';
import { convertFileToProject } from '../utils/scan-directory';
import path from 'path';

export class DirectoryWatcherJob implements Job {
  #directories: string[];
  #filteredPatterns: string[];
  #watcher: chokidar.FSWatcher | null = null;
  #window: BrowserWindow;
  constructor(
    window: BrowserWindow,
    directories: DirectoryDatabaseType[],
    filteredPatterns: FilteredPatternDatabaseType[],
    enabled: boolean
  ) {
    this.#window = window;
    this.#directories = directories.map((d) => d.path);
    this.#filteredPatterns = filteredPatterns.map((fp) => fp.pattern);
    if (enabled) {
      this.start();
    }
  }
  start = () => {
    if (!!this.#watcher) {
      return;
    }
    const projectFileNamesCommaDelimited = Array.from(
      ProjectTypeFileNameMap.values()
    ).join(',');
    const directoryGlobsWithEachFileExtensionOnTheEnd = this.#directories.map(
      (directory) =>
        `${directory}${path.sep}**${path.sep}{${projectFileNamesCommaDelimited}}`
    );
    this.#watcher = chokidar.watch(
      directoryGlobsWithEachFileExtensionOnTheEnd,
      {
        ignored: this.#filteredPatterns,
        ignoreInitial: true,
        usePolling: true,
        interval: 5000,
        awaitWriteFinish: {
          stabilityThreshold: 500,
        },
      }
    );
    this.#watcher.on('add', async (path) => {
      const directoryPath = this.#directories.find((directory) =>
        path.startsWith(directory)
      );
      try {
        const project = await convertFileToProject(path, directoryPath);
        this.#window.webContents.send(ON_PROJECT_ADDED, project);
      } catch (e) {
        // if we're unable to convert / parse the file, just ignore the error for now, its probably malformed
      }
    });
    this.#watcher.on('change', async (path) => {
      const directoryPath = this.#directories.find((directory) =>
        path.startsWith(directory)
      );
      try {
        const project = await convertFileToProject(path, directoryPath);
        this.#window.webContents.send(ON_PROJECT_CHANGED, path, project.name);
      } catch (e) {
        // if we're unable to convert / parse the file, just ignore the error for now, its probably malformed
      }
    });
    this.#watcher.on('unlink', (path) => {
      this.#window.webContents.send(ON_PROJECT_REMOVED, path);
    });
  };
  stop = async () => {
    if (!!this.#watcher) {
      await this.#watcher.close();
      this.#watcher = null;
    }
  };

  setDirectories = async (directories: DirectoryDatabaseType[]) => {
    this.#directories = directories.map((d) => d.path);
    if (!!this.#watcher) {
      await this.stop();
      this.start();
    }
  };

  setFilteredPatterns = async (
    filteredPatterns: FilteredPatternDatabaseType[]
  ) => {
    this.#filteredPatterns = filteredPatterns.map((fp) => fp.pattern);
    if (!!this.#watcher) {
      await this.stop();
      this.start();
    }
  };
}
