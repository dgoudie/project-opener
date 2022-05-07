import { DirectoryDatabaseType } from '../constants/types';

export const validateDirectory = (
  newDirectory: string,
  currentDirectories: DirectoryDatabaseType[]
) => {
  const currentDirectoryPaths = currentDirectories.map(
    (directory) => directory.path
  );

  const sameDirectory = currentDirectoryPaths.find(
    (currentPath) => newDirectory === currentPath
  );
  if (!!sameDirectory) {
    throw new Error('This directory already exists.');
  }

  const parentDirectoryToNewDirectory = currentDirectoryPaths.find(
    (currentPath) => newDirectory.startsWith(currentPath)
  );
  if (!!parentDirectoryToNewDirectory) {
    throw new Error(
      'A directory already exists that contains the directory you provided.'
    );
  }

  const childDirectoryToNewDirectory = currentDirectoryPaths.find(
    (currentPath) => currentPath.startsWith(newDirectory)
  );
  if (!!childDirectoryToNewDirectory) {
    throw new Error(
      'A directory already exists that is a child directory of the one you provided. Please delete that directory first.'
    );
  }
};
