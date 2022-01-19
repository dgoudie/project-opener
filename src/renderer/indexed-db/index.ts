import Dexie from 'dexie';

export const db = new Dexie('ProjectOpener');
db.version(1).stores({
    settings: 'key',
});
db.on('populate', () => {
    db.table('settings').bulkAdd([
        { key: 'SETUP_COMPLETE', value: false },
        { key: 'HOTKEY', value: 'CommandOrControl+Shift+o' },
        { key: 'IDES', value: [] },
        {
            key: 'FILTERED_PATTERNS',
            value: [
                '**/.git/**',
                '**/.idea/**',
                '**/build/**',
                '**/dist/**',
                '**/node_modules/**',
                '**/tags/**',
                '**/target/**',
            ],
        },
        { key: 'PATHS', value: [] },
    ]);
});
