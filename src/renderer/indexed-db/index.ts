import Dexie from 'dexie';

export const db = new Dexie('ProjectOpener');
db.version(1).stores({
    filteredPatterns: 'pattern',
    directories: 'path',
    settings: 'key',
});
