import { applyMiddleware, createStore } from 'redux';

import createSagaMiddleware from 'redux-saga';
import rootReducer from './root-reducer';
import sagas from './sagas';

const sagaMiddleware = createSagaMiddleware();

// rehydrate state on app start
const initialState = {};

// create store
const store = createStore(
    rootReducer(),
    initialState,
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(sagas);

// export store singleton instance
export default store;
