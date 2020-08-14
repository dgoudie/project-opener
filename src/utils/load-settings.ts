import themes from 'src/themes';
import { SettingsState } from 'src/redux/features/settings/reducer';
import { ipcRenderer } from 'electron';

export const requestSettingsFromMainProcess = () => {
    ipcRenderer.send('getAllSettings', <SettingsState>{
        setupComplete: false,
        themeName: themes[0].name,
        hotkey: 'CommandOrControl+Shift+o',
        ides: [],
        filteredPatterns: [
            '**/.git/**',
            '**/.idea/**',
            '**/build/**',
            '**/dist/**',
            '**/node_modules/**',
            '**/tags/**',
            '**/target/**',
        ],
        paths: [],
        reScanOvernight: true,
    });
};
