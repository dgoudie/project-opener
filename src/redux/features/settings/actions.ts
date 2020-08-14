import * as settingsActions from './constants';

import { Ide } from 'src/types';
import { SettingsState } from 'src/redux/features/settings/reducer';
import { action } from 'typesafe-actions';

export const setSettings = (value: SettingsState) =>
    action(settingsActions.SET_SETTINGS, value);
export const setSetupComplete = (value: boolean) =>
    action(settingsActions.SET_SETUP_COMPLETE, value);
export const setThemeName = (name: string) =>
    action(settingsActions.SET_THEME_NAME, name);
export const setReScanOvernight = (value: boolean) =>
    action(settingsActions.SET_RE_SCAN_OVERNIGHT, value);
export const setIdes = (ide: Ide[]) => action(settingsActions.SET_IDES, ide);
export const setHotkey = (hotkey: string) =>
    action(settingsActions.SET_HOTKEY, hotkey);
export const addPath = (path: string) => action(settingsActions.ADD_PATH, path);
export const deletePath = (path: string) =>
    action(settingsActions.DELETE_PATH, path);
export const addFilteredPattern = (pattern: string) =>
    action(settingsActions.ADD_FILTERED_PATTERN, pattern);
export const deleteFilteredPattern = (pattern: string) =>
    action(settingsActions.DELETE_FILTERED_PATTERN, pattern);
