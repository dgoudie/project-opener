import * as appActions from './constants';

import { AppException, AppNotification, AppTheme, Ide } from 'src/types';

import { action } from 'typesafe-actions';

export const addException = (value: AppException) =>
    action(appActions.ADD_EXCEPTION, value);
export const dismissException = (value: AppException) =>
    action(appActions.DISMISS_EXCEPTION, value);
export const addNotification = (value: AppNotification) =>
    action(appActions.ADD_NOTIFICATION, value);
export const dismissNotification = (value: string) =>
    action(appActions.DISMISS_NOTIFICATION, value);
export const scanPath = (value: string) => action(appActions.SCAN_PATH, value);
export const setScanPathComplete = (value: string) =>
    action(appActions.SCAN_PATH_COMPLETE, value);
export const setWindowVisible = (value: boolean) =>
    action(appActions.SET_WINDOW_VISIBLE, value);
export const setTheme = (theme: AppTheme) =>
    action(appActions.SET_THEME, theme);
export const clearAvailableIdes = () => action(appActions.CLEAR_AVAILABLE_IDES);
export const setAvailableIdes = (ides: Ide[]) =>
    action(appActions.SET_AVAILABLE_IDES, ides);
