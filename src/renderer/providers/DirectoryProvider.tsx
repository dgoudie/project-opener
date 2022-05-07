import { createContext, useCallback, useEffect, useState } from 'react';
import { directoriesTable, filteredPatternsTable } from '../indexed-db';

import { DirectoryDatabaseType } from '../../constants/types';
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
      };
      return addAsync();
    },
    [directories]
  );

  const deleteDirectory = useCallback((path: string) => {
    const deleteAsync = async () => {
      await directoriesTable.delete(path);
      await syncStateWithDatabase();
    };
    return deleteAsync();
  }, []);

  const scanDirectory = useCallback((path: string) => {
    const scanAsync = async () => {
      setDirectories(
        produce((draft) => {
          draft.find((directory) => directory.path === path).currentlyScanning =
            true;
        })
      );
      const filteredPatterns = (await filteredPatternsTable.toArray()).map(
        ({ pattern }) => pattern
      );
      const result = await window.BRIDGE?.scanDirectory(path, filteredPatterns);
      console.log('result', result);
      setDirectories(
        produce((draft) => {
          draft.find((directory) => directory.path === path).currentlyScanning =
            false;
        })
      );
    };
    return scanAsync();
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
