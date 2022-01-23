import {
    FilteredPatternDatabaseType,
    PathDatabaseType,
    ProjectIde,
    ProjectType,
    SettingDatabaseType,
} from '../types';

import Dexie from 'dexie';

export const db = new Dexie('ProjectOpener');
db.version(1).stores({
    settings: 'key',
    ides: 'projectType',
    filteredPatterns: 'pattern',
    paths: 'path',
});

export const settingsTable = db.table<SettingDatabaseType>('settings');
export const idesTable = db.table<ProjectIde<ProjectType>>('ides');
export const filteredPatternsTable =
    db.table<FilteredPatternDatabaseType>('filteredPatterns');
export const pathsTable = db.table<PathDatabaseType>('paths');

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
