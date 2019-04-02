import { LOAD_SETTINGS, SET_THEME, SET_HOTKEY, SET_MAVEN_IDE, SET_NPM_IDE, SET_RE_SCAN_DIRECTORIES_OVERNIGHT } from './index';
import handleInitialLoad from './initial-load-handler';
import runtimeChangeHandler from './runtime-change-handler';

export const loadSettings = () => async (dispatch, getState) => {
  let mavenIde = await getSettingSetIfNull(getState, 'mavenIde', {});
  let npmIde = await getSettingSetIfNull(getState, 'npmIde', {});
  let reScanDirectoriesOvernight = await getSettingSetIfNull(getState, 'reScanDirectoriesOvernight', true);
  let theme = await getSettingSetIfNull(getState, 'theme', 'edge');
  let hotkey = await getSettingSetIfNull(getState, 'hotkey', 'CommandOrControl+Shift+o');

  const payload = {
    mavenIde,
    npmIde,
    reScanDirectoriesOvernight,
    theme,
    hotkey
  }

  handleInitialLoad(dispatch, payload);

  dispatch({
    type: LOAD_SETTINGS,
    payload
  });
}

export const setHotkey = (hk) => (dispatch, getState) => {
  runtimeChangeHandler.runtime_HandleNewHotkey(dispatch, hk);
  setSetting(getState, 'hotkey', hk);
    dispatch({
        type: SET_HOTKEY,
        payload: hk
    })
};

export const setTheme = (theme) => (dispatch, getState) => {
  setSetting(getState, 'theme', theme);
    dispatch({
        type: SET_THEME,
        payload: theme
    })
};

export const setMavenIde = (ide) => (dispatch, getState) => {
  setSetting(getState, 'mavenIde', ide);
  dispatch({
    type: SET_MAVEN_IDE,
    payload: ide
  })
}

export const setNpmIde = (ide) => (dispatch, getState) => {
  setSetting(getState, 'npmIde', ide);
  dispatch({
    type: SET_NPM_IDE,
    payload: ide
  })
}

export const setReScanDirectoriesOvernight = (value) => (dispatch, getState) => {
  setSetting(getState, 'reScanDirectoriesOvernight', value);
  dispatch({
    type: SET_RE_SCAN_DIRECTORIES_OVERNIGHT,
    payload: value
  })
}

const getSetting = async (getState, key) => {
  const promise = new Promise((resolve, reject) => {
    getState().databaseReducer.settingsDatabase.findOne({ key }, (err, docs) => {
      if (err) {
        reject(err);
      }
      resolve(docs);
    });
  });
  const dbResult = await promise;
  return dbResult ? dbResult.value : null
}

const getSettingSetIfNull = async (getState, key, setIfNull) => {
  const result = await getSetting(getState, key);
  if (result === null) {
    setSetting(getState, key, setIfNull);
    return setIfNull;
  }
  return result;
}

// const setSettingSync = async (getState, key, value) => {
//   await new Promise((resolve, reject) => {
//     getState().databaseReducer.settingsDatabase.update({key}, { key, value }, { upsert: true }, (err) => {
//       if (!!err) {
//         reject(err);
//       }
//       resolve();
//     });
//   });
// }

const setSetting = (getState, key, value) => {
  getState().databaseReducer.settingsDatabase.update({key}, { key, value }, { upsert: true });
}