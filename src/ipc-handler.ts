import { AppException, Ide } from 'src/types';
import {
    addException,
    setAvailableIdes,
    setScanPathComplete,
    setTheme,
    setWindowVisible,
} from 'src/redux/features/app/actions';

import { SettingsState } from 'src/redux/features/settings/reducer';
import { Store } from 'redux';
import { buildAndApplyTheme } from 'src/utils/build-and-apply-theme';
import { ipcRenderer } from 'electron';
import { registerHotkey } from 'src/utils/hotkey-tools';
import { setSettings } from 'src/redux/features/settings/actions';
import themes from 'src/themes';

export const initListeners = (store: Store) => {
    ipcRenderer.on('getAllSettingsResult', (_event, value: SettingsState) => {
        store.dispatch(setSettings(value));
        const fullTheme = buildAndApplyTheme(value.themeName);
        store.dispatch(setTheme(fullTheme));
        registerHotkey(value.hotkey, () =>
            store.dispatch(setWindowVisible(true))
        );
    });
    ipcRenderer.on('availableIdes', (_event, availableIdes: Ide[]) => {
        store.dispatch(setAvailableIdes(availableIdes));
    });
    ipcRenderer.on('scanPathComplete', (_event, path: string) => {
        store.dispatch(setScanPathComplete(path));
    });
    ipcRenderer.on('exception', (_event, exception: AppException) => {
        store.dispatch(addException(exception));
        store.dispatch(setWindowVisible(true));
    });
    ipcRenderer.on('showWindow', (_event) => {
        store.dispatch(setWindowVisible(true));
    });
};
export const requestSettings = () => {
    ipcRenderer.send('getAllSettings', {
        setupComplete: false,
        theme: themes[0].name,
        hotkey: 'CommandOrControl+Shift+o',
        ides: [],
        paths: [],
        filteredPatterns: [],
        reScanOvernight: true,
    });
};
