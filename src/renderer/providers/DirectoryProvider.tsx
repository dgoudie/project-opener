import { createContext, useCallback, useEffect, useState } from 'react';

import { DirectoryDatabaseType } from '../types';
import React from 'react';
import { directoriesTable } from '../indexed-db';

export type Directory = DirectoryDatabaseType & {
  currentlyScanning: boolean;
};

type DirectoryContextType = {
  directories: Directory[];
  addDirectory: (path: string) => Promise<void>;
  deleteDirectory: (path: string) => Promise<void>;
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

  const addDirectory = useCallback((path: string) => {
    const addAsync = async () => {
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
  }, []);

  const deleteDirectory = useCallback((path: string) => {
    const deleteAsync = async () => {
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
      value={{ directories, addDirectory, deleteDirectory }}
    >
      {children}
    </DirectoryContext.Provider>
  );
}
