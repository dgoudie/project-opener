import { appReducer } from 'src/redux/features/app';
import { combineReducers } from 'redux';
import { settingsReducer } from 'src/redux/features/settings';

const rootReducer = () =>
    combineReducers({
        app: appReducer,
        settings: settingsReducer,
    });

export default rootReducer;
