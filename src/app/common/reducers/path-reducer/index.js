export const LOAD_PATHS = 'LOAD_PATHS';
export const ADD_PATH = 'ADD_PATH';
export const DELETE_PATH = 'DELETE_PATH';
export const SET_SCANNING = 'SET_SCANNING';

const initialState = {
    paths: [],
}

export default (state = initialState, action) => {
    switch (action.type) {
        case LOAD_PATHS: return {
            ...state,
            paths: action.payload
        }
        case ADD_PATH: return {
            ...state,
            paths: [...state.paths, action.payload]
        }
        case DELETE_PATH:
            return {
                ...state,
                paths: state.paths.filter(path => path !== action.payload)
            }
        case SET_SCANNING:
            return {
                ...state,
                paths: state.paths.map(path => {
                    if (path.path === action.payload.path.path) {
                        path.currentlyScanning = action.payload.value
                    }
                    return path;
                })
            }
        default: return state;
    }
}