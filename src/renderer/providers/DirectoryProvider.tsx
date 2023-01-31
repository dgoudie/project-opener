import {
  DirectoryDatabaseType,
  ProjectDatabaseType,
} from '../../constants/types';
import { createContext, useCallback, useEffect, useState } from 'react';
import {
  db,
  directoriesTable,
  filteredPatternsTable,
  projectsTable,
} from '../indexed-db';

import Dexie from 'dexie';
import React from 'react';
import produce from 'immer';
import { validateDirectory } from '../../utils/validate-directory';

export type Directory = DirectoryDatabaseType & {
  currentlyScanning: boolean;
};

type DirectoryContextType = {
  directories: Directory[];
  addDirectory: (path: string) => Promise<void>;
  deleteDirectory: (path: string) => Promise<void>;
  scanDirectory: (path: string) => Promise<void>;
};

export const DirectoryContext = createContext<DirectoryContextType | undefined>(
  undefined
);

export default function DirectoryProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [directories, setDirectories] = useState<Directory[]>(undefined);

  const syncStateWithDatabase = useCallback(
    () =>
      directoriesTable
        .orderBy('path')
        .toArray()
        .then((directories) =>
          directories.map((directory) => ({
            ...directory,
            currentlyScanning: false,
          }))
        )
        .then((directories) => setDirectories(directories)),
    []
  );

  useEffect(() => {
    syncStateWithDatabase();
  }, []);

  useEffect(() => {
    window.BRIDGE.onProjectAdded(async (_event, project) => {
      db.transaction('rw', projectsTable, async () => {
        await projectsTable.add(project);
        await removeNestedPaths();
      });
    });
    window.BRIDGE.onProjectChanged(async (_event, path, newProjectName) => {
      await projectsTable
        .where('path')
        .equals(path)
        .modify({ name: newProjectName });
    });
    window.BRIDGE.onProjectRemoved(async (_event, path) => {
      await projectsTable.delete(path);
    });
  }, []);

  useEffect(() => {
    if (typeof directories !== 'undefined') {
      window.BRIDGE.sendDirectoriesToFileWatcher(directories);
    }
  }, [directories]);

  const scanDirectory = useCallback((directoryPath: string) => {
    const scanAsync = async () => {
      setDirectories(
        produce((draft) => {
          draft.find(
            (directory) => directory.path === directoryPath
          ).currentlyScanning = true;
        })
      );
      const filteredPatterns = (await filteredPatternsTable.toArray()).map(
        ({ pattern }) => pattern
      );
      let foundProjects = await window.BRIDGE?.scanDirectory(
        directoryPath,
        filteredPatterns
      );
      const currentProjectsForPath = await projectsTable
        .where('directory')
        .equals(directoryPath)
        .toArray();
      const foundProjectPaths = new Set(
        foundProjects.map((project) => project.path)
      );
      const foundProjectsPathToNameMap = new Map(
        foundProjects.map((project) => [project.path, project.name])
      );
      const currentProjectPaths = new Set(
        currentProjectsForPath.map((project) => project.path)
      );
      const projectsToAdd: ProjectDatabaseType[] = foundProjects.filter(
        (project) => !currentProjectPaths.has(project.path)
      );
      const projectsToRemove: string[] = Array.from(currentProjectPaths).filter(
        (projectPath) => !foundProjectPaths.has(projectPath)
      );
      db.transaction('rw', projectsTable, async () => {
        await projectsTable.bulkAdd(projectsToAdd);
        await projectsTable.bulkDelete(projectsToRemove);
        await removeNestedPaths();
        await projectsTable
          .where('directory')
          .equals(directoryPath)
          .modify(
            (project) =>
              (project.name = foundProjectsPathToNameMap.get(project.path))
          );
      });

      setDirectories(
        produce((draft) => {
          draft.find(
            (directory) => directory.path === directoryPath
          ).currentlyScanning = false;
        })
      );
    };
    return scanAsync();
  }, []);

  const addDirectory = useCallback(
    (path: string) => {
      const addAsync = async () => {
        validateDirectory(path, directories);
        const newDirectory: DirectoryDatabaseType = {
          path,
          createdAt: new Date(),
        };
        await directoriesTable
          .add(newDirectory)
          .catch('ConstraintError', (constraintError: Error) => {
            console.error(constraintError);
            constraintError.message = 'This directory has already been added.';
            throw constraintError;
          });
        await syncStateWithDatabase();
        scanDirectory(path);
      };
      return addAsync();
    },
    [directories, scanDirectory]
  );

  const deleteDirectory = useCallback((path: string) => {
    const deleteAsync = async () => {
      await projectsTable.where('path').startsWith(path).delete();
      await directoriesTable.delete(path);
      await syncStateWithDatabase();
    };
    return deleteAsync();
  }, []);

  if (typeof directories === 'undefined') {
    return null;
  }

  return (
    <DirectoryContext.Provider
      value={{ directories, addDirectory, deleteDirectory, scanDirectory }}
    >
      {children}
    </DirectoryContext.Provider>
  );
}

const removeNestedPaths = async () => {
  db.transaction('rw', projectsTable, async () => {
    const allProjectPaths = (await projectsTable
      .toCollection()
      .primaryKeys()) as string[];
    const nestedPaths = await Dexie.waitFor(
      window.BRIDGE.determineNestedProjects(allProjectPaths)
    );
    await projectsTable.bulkDelete(nestedPaths);
  });
};
