import { LOAD_FILTERED_PATTERNS, ADD_FILTERED_PATTERN, DELETE_FILTERED_PATTERN } from './index';

export const loadFilteredPatterns = () => async (dispatch, getState) => {
    const loadPromise = new Promise((resolve, reject) => {
        getState().databaseReducer.settingsDatabase.findOne({ key: 'filteredPatterns' }, (err, docs) => {
            if (err) {
                reject(err);
            }
            if(!docs) {
                resolve();
            }
            resolve(docs);
        });
    });
    let load = await loadPromise;
    if (!load) {
        load = {
            key: 'filteredPatterns',
            value: [
                '**/node_modules/**',
                '**/tags/**',
                '**/.git/**',
                '**/.idea/**',
                '**/target/**'
            ]
        }
        await new Promise((resolve, reject) => {
            getState().databaseReducer.settingsDatabase.insert(load, (err, docs) => {
                if (err) {
                    reject(err);
                }
                resolve(docs);
            });
        });
    }
    dispatch({
        type: LOAD_FILTERED_PATTERNS,
        payload: load.value
    });
}

export const addFilteredPattern = (pattern) => async (dispatch, getState) => {
    await new Promise((resolve, reject) => {
        getState().databaseReducer.settingsDatabase.update({ key: 'filteredPatterns' }, { $addToSet: { value: pattern } }, (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
    dispatch({
        type: ADD_FILTERED_PATTERN,
        payload: pattern
    });
}

export const deleteFilteredPattern = (pattern) => async (dispatch, getState) => {
    await new Promise((resolve, reject) => {
        getState().databaseReducer.settingsDatabase.update({ key: 'filteredPatterns' }, { $pull: { value: pattern } }, (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
    dispatch({
        type: DELETE_FILTERED_PATTERN,
        payload: pattern
    });
}