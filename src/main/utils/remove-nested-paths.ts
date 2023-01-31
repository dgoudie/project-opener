import { dirname, sep } from 'path';

import { ProjectDatabaseType } from '../../constants/types';

export const determineNestedProjects = (paths: string[]): string[] => {
  const pathsWithoutFileNamesSet = new Set(paths.map((path) => dirname(path)));
  paths = paths.filter((path) => {
    let parentDirectoryPaths = getParentDirectoryPaths(path);
    const anyParentDirectoryExistsInMap = !!parentDirectoryPaths.find(
      (parentPath) => pathsWithoutFileNamesSet.has(parentPath)
    );
    return anyParentDirectoryExistsInMap;
  });
  return paths;
};

const getParentDirectoryPaths = (path: string) => {
  const parentDirectoryPaths = [];
  let dirSplit = dirname(path).split(sep);
  dirSplit.pop();

  while (dirSplit.length > 0) {
    const rejoined = dirSplit.join(sep);
    if (!!rejoined) {
      parentDirectoryPaths.push(rejoined);
    }
    dirSplit.pop();
  }
  return parentDirectoryPaths;
};
