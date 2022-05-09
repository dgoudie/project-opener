import { BrowserWindow, ipcMain } from 'electron';
import {
  ProjectDatabaseType,
  ProjectTypeFileNameMap,
} from '../../constants/types';
import { dirname, normalize, sep } from 'path';

import { REPORT_EXCEPTION } from '../../constants/ipc-renderer-constants';
import { globby } from 'globby';
import { parseStringPromise } from 'xml2js';
import { readFile } from 'fs-extra';
import toml from 'toml';

export const scanDirectory = async (
  path: string,
  filteredPatterns: string[],
  window: BrowserWindow
): Promise<ProjectDatabaseType[]> => {
  const projectFileNamesCommaDelimited = Array.from(
    ProjectTypeFileNameMap.values()
  ).join(',');
  const pattern = `${path}/**/{${projectFileNamesCommaDelimited}}`.replace(
    /\\/g,
    '/'
  );
  let paths = await globby(pattern, {
    caseSensitiveMatch: false,
    ignore: filteredPatterns,
    suppressErrors: true,
    onlyFiles: true,
  });

  paths = paths.map((path) => normalize(path));

  paths = removeNestedPaths(paths);

  return convertFilesToProjects(paths, window);
};

const removeNestedPaths = (paths: string[]): string[] => {
  const pathWithoutFileNamesSet = new Set(paths.map((path) => dirname(path)));
  paths = paths.filter((path) => {
    let parentDirectoryPaths = getParentDirectoryPaths(path);
    const anyParentDirectoryExistsInMap = !!parentDirectoryPaths.find(
      (parentPath) => pathWithoutFileNamesSet.has(parentPath)
    );
    return !anyParentDirectoryExistsInMap;
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

const convertFilesToProjects = (paths: string[], window: BrowserWindow) => {
  return Promise.all(
    paths.map(async (path) => {
      try {
        const file = await readFile(path, 'utf-8');
        const type = Array.from(ProjectTypeFileNameMap.entries()).find(
          ([_projectType, fileName]) => path.toLowerCase().includes(fileName)
        )[0];
        let name: Promise<string>;
        switch (type) {
          case 'MAVEN':
            name = getNameFromPomFile(file);
            break;
          case 'NPM':
            name = getNameFromPackageJsonFile(file);
            break;
          case 'RUST':
            name = getNameFromCargoTomlFile(file);
            break;
          case 'PYTHON':
            name = getNameFromPipfile(file);
            break;
        }
        if (!name) {
          throw new Error(
            `Unable to determine project file for project type ${type}`
          );
        }
        let project: ProjectDatabaseType = {
          path,
          name: await name,
          type,
          createdAt: new Date(),
          lastOpenedAt: undefined,
          openedCount: 0,
        };
        return project;
      } catch (e) {
        const message = `Unable to scan ${path}. (${e.message})`;
        window.webContents.send(REPORT_EXCEPTION, 'warning', message);
      }
    })
  ).then((projects) => projects.filter((project) => !!project));
};

const getNameFromPomFile = async (data: string): Promise<string> => {
  const pomXmlFile = await parseStringPromise(data);
  if (!pomXmlFile?.project?.artifactId[0]) {
    throw new Error('Malformed pom.xml');
  }
  return pomXmlFile.project.artifactId[0];
};

const getNameFromPackageJsonFile = (data: string): Promise<string> => {
  const packageJsonFile = JSON.parse(data);
  if (!packageJsonFile?.name) {
    throw new Error('Malformed package.json');
  }
  return packageJsonFile.name;
};

const getNameFromCargoTomlFile = async (data: string): Promise<string> => {
  const tomlFile = toml.parse(data);
  if (!tomlFile?.package?.name) {
    throw new Error('Malformed Cargo.toml');
  }
  return tomlFile.package.name;
};

const getNameFromPipfile = async (data: string): Promise<string> => {
  const tomlFile = toml.parse(data);
  if (!tomlFile?.source[0]?.name) {
    throw new Error('Malformed Pipfile');
  }
  return tomlFile.source[0].name;
};
