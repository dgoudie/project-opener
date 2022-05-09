import {
  DirectoryDatabaseType,
  FilteredPatternDatabaseType,
  IdeDatabaseType,
  ProjectDatabaseType,
} from '../../constants/types';

import Dexie from 'dexie';

export const db = new Dexie('ProjectOpener');
db.version(1).stores({
  projects: '[&path+name],type,openedCount',
  settings: 'key',
  ides: 'projectType',
  filteredPatterns: 'pattern',
  directories: '&path',
});

export const projectsTable = db.table<ProjectDatabaseType>('projects');
export const settingsTable = db.table<{ key: string; value: any }>('settings');
export const idesTable = db.table<IdeDatabaseType>('ides');
export const filteredPatternsTable =
  db.table<FilteredPatternDatabaseType>('filteredPatterns');
export const directoriesTable = db.table<DirectoryDatabaseType>('directories');

db.on('populate', () => {
  const createdAt = new Date();
  settingsTable.bulkAdd([
    { key: 'SETUP_COMPLETE', value: false },
    { key: 'THEME', value: 'auto' },
    { key: 'HOTKEY', value: 'CommandOrControl+Shift+O' },
  ]);
  filteredPatternsTable.bulkAdd([
    { pattern: '**/.git/**', createdAt },
    { pattern: '**/.idea/**', createdAt },
    { pattern: '**/build/**', createdAt },
    { pattern: '**/dist/**', createdAt },
    { pattern: '**/node_modules/**', createdAt },
    { pattern: '**/tags/**', createdAt },
    { pattern: '**/target/**', createdAt },
  ]);
});
