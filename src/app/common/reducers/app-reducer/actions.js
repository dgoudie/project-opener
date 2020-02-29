import { SET_VISIBLE, SET_ACTIVE_VIEW, SET_FILTER_TEXT, SET_VIEW_SPECIFIC_KEY_HANDLER, SET_SETTINGS_HANDLER_INIT_READY } from './index';

import { loadPaths } from '../path-reducer/actions';
import { loadPoms } from '../pom-reducer/actions';
import { loadSettings } from '../settings-reducer/actions';
import { loadFilteredPatterns } from '../filtered-pattern-reducer/actions';

const electronWindow = window.require('electron').remote.getCurrentWindow();

export const initializeApp = () => (dispatch) => {
    dispatch(loadFilteredPatterns());
    dispatch(loadPaths());
    dispatch(loadPoms());
    dispatch(loadSettings());
    dispatch(setSettingsHandlerInitReady(true));
};

export const hideWindow = () => dispatch => {
    electronWindow.hide();
    dispatch(setWindowVisible(false));
};

export const exitApplication = () => {
    electronWindow.close();
};

export const setWindowVisible = (value) => dispatch => {
    dispatch({
        type: SET_VISIBLE,
        payload: value
    });
};

export const setActiveView = (value) => dispatch => {
    dispatch({
        type: SET_ACTIVE_VIEW,
        payload: value
    });
};

export const setFilterText = (value) => dispatch => {
    dispatch({
        type: SET_FILTER_TEXT,
        payload: value
    });
};

export const setViewSpecificKeyHandler = (value) => dispatch => {
    dispatch({
        type: SET_VIEW_SPECIFIC_KEY_HANDLER,
        payload: value
    });
};

export const setSettingsHandlerInitReady = (value) => dispatch => {
    dispatch({
        type: SET_SETTINGS_HANDLER_INIT_READY,
        payload: value
    });
}

export const isSetupComplete = () => async (dispatch, getState) => {
    return await new Promise((resolve, reject) => getState().databaseReducer.settingsDatabase.findOne({ key: 'setupComplete' }, (err, doc) => {
        if (err) {
            reject(err);
        }
        resolve(!!doc);
    }));
}

export const markSetupComplete = () => (dispatch, getState) => {
    getState().databaseReducer.settingsDatabase.insert({ key: 'setupComplete' });
}