import { LOAD_POMS, REMOVE_POMS_BY_PATH, FILTER_POMS, CLEAR_FILTERED_POMS, SET_CURSOR } from "./index";

import { hideWindow, setFilterText } from "../app-reducer/actions";
import { compactPomsDatabase } from '../database-reducer/actions'
import { setCurrentlyScanning } from '../path-reducer/actions';
import { addWarnDialog, addErrorDialog } from "app/common/reducers/dialog-reducer/actions";

const electron = window.require("electron");
const Runner = electron.remote.require("./utils/run/runner.js");

export const loadPoms = () => async (dispatch, getState) => {
  const loadPromise = new Promise((resolve, reject) => {
    getState().databaseReducer.pomDatabase.find({}).sort({ clickCount: -1, artifactId: 1, path: 1 }).exec((err, docs) => {
      if (err) {
        reject(err);
      }
      resolve(docs);
    });
  });
  const pomList = await loadPromise;
  dispatch({
    type: LOAD_POMS,
    payload: pomList
  });
  dispatch(filterPoms(""));
};

export const updatePomsForPath = (path, updatedPomList) => async (dispatch, getState) => {

  const existingPomListReduced = getState().pomReducer.poms.reduce((map, pom) => {
    map[pom.path] = pom.clickCount;
    return map;
  }, {});
  updatedPomList.forEach(updatedPom => {
    updatedPom.clickCount = existingPomListReduced[updatedPom.path] ? existingPomListReduced[updatedPom.path] : 0;
  });
  await new Promise((resolve, reject) => {
    getState().databaseReducer.pomDatabase.remove({ inside: path.path }, { multi: true }, (err) => {
      if (err) {
        reject(err);
        dispatch(setCurrentlyScanning(path, false))
      }
      resolve();
    });
  });
  await new Promise((resolve, reject) => {
    getState().databaseReducer.pomDatabase.insert(updatedPomList, (err) => {
      if (err) {
        reject(err);
        dispatch(setCurrentlyScanning(path, false))
      }
      resolve();
    });
  });
  dispatch(loadPoms());
  dispatch(setCurrentlyScanning(path, false))
  dispatch(compactPomsDatabase());
};

export const removePomsByPath = (path) => async (dispatch, getState) => {
  await new Promise((resolve, reject) => {
    getState().databaseReducer.pomDatabase.remove({ inside: path.path }, { multi: true }, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
  dispatch({
    type: REMOVE_POMS_BY_PATH,
    payload: path.path
  });
  dispatch(loadPoms());
};

export const filterPoms = filterText => (dispatch, getState) => {
  const filterArray = filterText.split(' ');
  if (!filterArray[0].length) {
    dispatch({
      type: FILTER_POMS,
      payload: getState().pomReducer.poms
    });
    return;
  }
  const filteredPoms = getState().pomReducer.poms.filter(pom => {
    return !!filterArray.every(filter => {
      return (
        pom.artifactId.toLowerCase().indexOf(filter.toLowerCase()) >= 0 ||
        pom.path.toLowerCase().indexOf(filter.toLowerCase()) >= 0
      );
    });
  });
  dispatch({
    type: FILTER_POMS,
    payload: filteredPoms
  });
  dispatch(setCursor(0));
};

export const clearFilteredPoms = () => (dispatch, getState) => {
  dispatch({
    type: CLEAR_FILTERED_POMS,
    payload: getState().pomReducer.poms
  });
  dispatch(setCursor(0));
};

export const setCursor = value => dispatch => {
  dispatch({
    type: SET_CURSOR,
    payload: value
  });
};

export const openPom = pom => async (dispatch, getState) => {

  pom.clickCount += 1;

  let ide;

  if (pom.path.indexOf("pom.xml") >= 0) {
    ide = getState().settingsReducer.mavenIde;
    if (!ide.path) {
      dispatch(addWarnDialog('Maven IDE is not set up. Please go to Settings -> IDEs and set one up for Maven projects.'));
      return;
    }
  }

  else if (pom.path.indexOf("package.json") >= 0) {
    ide = getState().settingsReducer.npmIde;
    if (!ide.path) {
      dispatch(addWarnDialog('NPM IDE is not set up. Please go to Settings -> IDEs and set one up for NPM projects.'));
      return;
    }
  }
  
  dispatch(setFilterText(''));
  dispatch(setCursor(0));
  dispatch(incrementPomClickCount(pom));
  dispatch(hideWindow());

  const error = await Runner.run(ide, pom.path);
  if (error) {
    switch (true) {
      case !!error.message.match(/ENOENT/): {
        dispatch(addErrorDialog(`Unable to find executable '${error.message.replace(/(ENOENT|spawn|\s)/g, '')}' Go to Settings -> IDEs and verify all configuration is valid.`));
        break;
      }
      default: {
        dispatch(addErrorDialog(error.message));
        break;
      }
    }
  }
};

export const incrementPomClickCount = pom => async (dispatch, getState) => {
  await new Promise((resolve, reject) => {
    getState().databaseReducer.pomDatabase.update({ path: pom.path }, { $inc: { clickCount: 1 } }, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
  dispatch(loadPoms());
};

export const openDirectory = pom => {
  Runner.openDir(pom.path);
}