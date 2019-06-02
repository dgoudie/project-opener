import { ADD_PATH, DELETE_PATH, LOAD_PATHS, SET_SCANNING } from './index';

import { updatePomsForPath, removePomsByPath } from '../pom-reducer/actions';

const electron = window.require('electron');
const dialog = electron.remote.dialog;
const findPoms = electron.remote.require('./utils/pom/pom-scanner-caller').findPoms;

export const loadPaths = () => async (dispatch, getState) => {
    const loadPromise = new Promise((resolve, reject) => {
        getState().databaseReducer.settingsDatabase.findOne({ key: 'paths' }, (err, docs) => {
            if (err) {
                reject(err);
            }
            resolve(docs);
        });
    });
    let paths = await loadPromise;
    if (!paths) {
        paths = {
            key: 'paths',
            value: []
        };
        await new Promise((resolve, reject) => {
            getState().databaseReducer.settingsDatabase.insert(paths, (err, docs) => {
                if (err) {
                    reject(err);
                }
                resolve(docs);
            });
        });
    }
    dispatch({
        type: LOAD_PATHS,
        payload: paths.value.map(path => {
            return {
                path,
                currentlyScanning: false
            }
        })
    });
}

export const addPath = () => async (dispatch, getState) => {
    const pathPromise = new Promise((resolve, reject) => {
        dialog.showOpenDialog({
            properties: ['openDirectory']
        }, (selectedPath) => {
            if (!selectedPath || !selectedPath[0]) {
                reject();
            } else {
                resolve(selectedPath[0].replace(/\\/g, '/'));
            }
        });
    });
    const path = await pathPromise;
    await new Promise((resolve, reject) => {
        getState().databaseReducer.settingsDatabase.update({ key: "paths" }, { $addToSet: { value: path } }, (err, numReplaced) => {
            if (err) {
                reject(err);
            }
            resolve(numReplaced);
        });
    });
    if (getState().pathReducer.paths.map(path => path.path).indexOf(path) < 0) {
        const pathPayload = {
            path,
            currentlyScanning: false
        }
        dispatch({
            type: ADD_PATH,
            payload: pathPayload
        });
        dispatch(scanPath(pathPayload));
    }
}

export const deletePath = (path) => async (dispatch, getState) => {
    const commitPromise = new Promise((resolve, reject) => {
        getState().databaseReducer.settingsDatabase.update({ key: "paths" }, { $pull: { value: path.path } }, (err, numReplaced) => {
            if (err) {
                reject(err);
            }
            resolve(numReplaced);
        });
    });
    await commitPromise;
    dispatch(removePomsByPath(path));
    dispatch({
        type: DELETE_PATH,
        payload: path
    });
}

export const setCurrentlyScanning = (path, value) => (dispatch) => {
    dispatch({
        type: SET_SCANNING,
        payload: { path, value }
    });
}

export const scanPath = (path) => async (dispatch, getState) => {
    dispatch(setCurrentlyScanning(path, true));
    let poms;
    try {
        poms = await findPoms(path.path, getState().filteredPatternReducer.filteredPatterns);
        poms = poms
            .map(pom => {
                try {
                    return {
                        artifactId: pom.artifactId ? pom.artifactId : 'N/A',
                        path: pom.path,
                        inside: path.path,
                        clickCount: 0
                    };
                } catch (e) {
                    console.warn(e);
                    // Nulls filtered out below
                    return null;
                }
            })
            .filter(pom => !!pom);

        dispatch(updatePomsForPath(path, poms))
    } catch (e) {
        console.warn(e);
        dispatch(setCurrentlyScanning(path, false))
    }
}

export const scanAllPaths = () => (dispatch, getState) => {
    getState().pathReducer.paths.forEach(path => {
        dispatch(scanPath(path));
    });
}