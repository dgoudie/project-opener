import { combineReducers } from 'redux';
import appReducer from './app-reducer'
import dialogReducer from './dialog-reducer';
import databaseReducer from './database-reducer';
import filteredPatternReducer from './filtered-pattern-reducer'
import settingsReducer from './settings-reducer'
import pathReducer from './path-reducer';
import pomReducer from './pom-reducer'

export default combineReducers({
    appReducer,
    databaseReducer,
    dialogReducer,
    filteredPatternReducer,
    settingsReducer,
    pathReducer,
    pomReducer
});