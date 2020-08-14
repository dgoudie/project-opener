import {
    ADD_FILTERED_PATTERN,
    ADD_PATH,
    DELETE_FILTERED_PATTERN,
    DELETE_PATH,
    SET_HOTKEY,
    SET_IDES,
    SET_RE_SCAN_OVERNIGHT,
    SET_SETUP_COMPLETE,
    SET_THEME_NAME,
} from 'src/redux/features/settings/constants';
import {
    ADD_NOTIFICATION,
    DISMISS_NOTIFICATION,
    SCAN_PATH,
    SCAN_PATH_COMPLETE,
    SET_THEME,
    SET_WINDOW_VISIBLE,
} from 'src/redux/features/app/constants';
import {
    addNotification,
    dismissNotification,
    scanPath,
    setScanPathComplete,
    setTheme,
    setWindowVisible,
} from 'src/redux/features/app/actions';
import {
    addPath,
    setHotkey,
    setIdes,
    setReScanOvernight,
    setThemeName,
} from 'src/redux/features/settings/actions';
import { all, put, select, take, takeEvery } from 'redux-saga/effects';
import { hideWindow, showWindow } from 'src/utils/show-hide';
import {
    selectFilteredPatterns,
    selectPaths,
} from 'src/redux/features/settings/selectors';

import { AppNotification } from 'src/types';
import { SettingsState } from 'src/redux/features/settings/reducer';
import { buildAndApplyTheme } from 'src/utils/build-and-apply-theme';
import { createUUIDv4 } from 'src/utils/create-uuid';
import { ipcRenderer } from 'electron';
import { isType } from 'src/utils/is-type';
import { registerHotkey } from 'src/utils/hotkey-tools';
import store from 'src/redux/store';

const currentlyScanningPathNotificationMap = new Map<string, string>();

function setSetupCompleteHandler() {
    ipcRenderer.send(
        'writeSetting',
        isType<keyof SettingsState>('setupComplete'),
        true
    );
}
function* setThemeNameHandler({ payload }: ReturnType<typeof setThemeName>) {
    ipcRenderer.send(
        'writeSetting',
        isType<keyof SettingsState>('themeName'),
        payload
    );
    const fullTheme = buildAndApplyTheme(payload);
    yield put<ReturnType<typeof setTheme>>({
        type: SET_THEME,
        payload: fullTheme,
    });
}
function setReScanOvernightHandler({
    payload,
}: ReturnType<typeof setReScanOvernight>) {
    ipcRenderer.send(
        'writeSetting',
        isType<keyof SettingsState>('reScanOvernight'),
        payload
    );
}
function setIdesHandler({ payload }: ReturnType<typeof setIdes>) {
    ipcRenderer.send(
        'writeSetting',
        isType<keyof SettingsState>('ides'),
        payload
    );
}
function setHotkeyHandler({ payload }: ReturnType<typeof setHotkey>) {
    ipcRenderer.send(
        'writeSetting',
        isType<keyof SettingsState>('hotkey'),
        payload
    );
    registerHotkey(payload, () => store.dispatch(setWindowVisible(true)));
}
function setPathsHandler(paths: string[]) {
    ipcRenderer.send(
        'writeSetting',
        isType<keyof SettingsState>('paths'),
        paths
    );
}

function* addPathHandler({ payload }: ReturnType<typeof addPath>) {
    yield put<ReturnType<typeof scanPath>>({ type: SCAN_PATH, payload });
}

function deletePathHandler({ payload }: ReturnType<typeof addPath>) {
    ipcRenderer.send('removeProjectsByPath', payload);
}

function setFilteredPatternsHandler(filteredPatterns: string[]) {
    ipcRenderer.send(
        'writeSetting',
        isType<keyof SettingsState>('filteredPatterns'),
        filteredPatterns
    );
}

function setWindowVisibleHandler({
    payload,
}: ReturnType<typeof setWindowVisible>) {
    !!payload ? showWindow() : hideWindow();
}

function* scanPathHandler({ payload }: ReturnType<typeof scanPath>) {
    const id = createUUIDv4();
    const notification: AppNotification = {
        id,
        text: `Scanning {{highlight:${payload}}}...`,
        iconName: 'SyncFolder',
        dismissTimeMs: null,
    };
    currentlyScanningPathNotificationMap.set(payload, id);
    ipcRenderer.send('scanPath', payload);
    yield put<ReturnType<typeof addNotification>>({
        type: ADD_NOTIFICATION,
        payload: notification,
    });
}

function* scanPathCompleteHandler({
    payload,
}: ReturnType<typeof setScanPathComplete>) {
    if (currentlyScanningPathNotificationMap.has(payload)) {
        yield put<ReturnType<typeof dismissNotification>>({
            type: DISMISS_NOTIFICATION,
            payload: currentlyScanningPathNotificationMap.get(payload),
        });
    }
    const notification: AppNotification = {
        id: createUUIDv4(),
        text: `{{highlight:${payload}}} scanned successfully.`,
        iconName: 'CheckMark',
        dismissTimeMs: 3000,
    };
    yield put<ReturnType<typeof addNotification>>({
        type: ADD_NOTIFICATION,
        payload: notification,
    });
}

function* setSetupCompleteListener() {
    yield takeEvery(SET_SETUP_COMPLETE, setSetupCompleteHandler);
}
function* setThemeNameListener() {
    yield takeEvery(SET_THEME_NAME, setThemeNameHandler);
}
function* setReScanOvernightListener() {
    yield takeEvery(SET_RE_SCAN_OVERNIGHT, setReScanOvernightHandler);
}
function* setIdesListener() {
    yield takeEvery(SET_IDES, setIdesHandler);
}
function* setHotkeyListener() {
    yield takeEvery(SET_HOTKEY, setHotkeyHandler);
}
function* addPathListener() {
    yield takeEvery(ADD_PATH, addPathHandler);
}
function* deletePathListener() {
    yield takeEvery(DELETE_PATH, deletePathHandler);
}
function* addPathListener2() {
    while (true) {
        yield take(ADD_PATH);
        const paths = yield select(selectPaths);
        yield setPathsHandler(paths);
    }
}
function* deletePathListener2() {
    while (true) {
        yield take(DELETE_PATH);
        const paths = yield select(selectPaths);
        yield setPathsHandler(paths);
    }
}
function* addFilteredPatternListener() {
    while (true) {
        yield take(ADD_FILTERED_PATTERN);
        const filteredPatterns = yield select(selectFilteredPatterns);
        yield setFilteredPatternsHandler(filteredPatterns);
    }
}
function* deleteFilteredPatternListener() {
    while (true) {
        yield take(DELETE_FILTERED_PATTERN);
        const filteredPatterns = yield select(selectFilteredPatterns);
        yield setFilteredPatternsHandler(filteredPatterns);
    }
}

function* setWindowVisibleListener() {
    yield takeEvery(SET_WINDOW_VISIBLE, setWindowVisibleHandler);
}

function* scanPathListener() {
    yield takeEvery(SCAN_PATH, scanPathHandler);
}

function* scanPathCompleteListener() {
    yield takeEvery(SCAN_PATH_COMPLETE, scanPathCompleteHandler);
}

export default function* root() {
    yield all([
        setSetupCompleteListener(),
        setThemeNameListener(),
        setReScanOvernightListener(),
        setIdesListener(),
        setHotkeyListener(),
        addPathListener(),
        addPathListener2(),
        deletePathListener(),
        deletePathListener2(),
        addFilteredPatternListener(),
        deleteFilteredPatternListener(),
        setWindowVisibleListener(),
        scanPathListener(),
        scanPathCompleteListener(),
    ]);
}
