export const ADD_DIALOG = 'ADD_DIALOG';
export const ADD_SUCCESS_DIALOG = 'ADD_SUCCESS_DIALOG';
export const ADD_INFO_DIALOG = 'ADD_INFO_DIALOG';
export const ADD_WARN_DIALOG = 'ADD_WARN_DIALOG';
export const ADD_ERROR_DIALOG = 'ADD_ERROR_DIALOG';
export const SHIFT = 'SHIFT';

const initialState = {
    dialogQueue: []
}

export default (state = initialState, action) => {
    switch(action.type) {
        case ADD_DIALOG: return {
            ...state,
            dialogQueue: [...state.dialogQueue, action.payload]
        }
        case ADD_SUCCESS_DIALOG: return {
            ...state,
            dialogQueue: [...state.dialogQueue, {type: 'SUCCESS', text: action.payload}]
        }
        case ADD_INFO_DIALOG: return {
            ...state,
            dialogQueue: [...state.dialogQueue, {type: 'INFO', text: action.payload}]
        }
        case ADD_WARN_DIALOG: return {
            ...state,
            dialogQueue: [...state.dialogQueue, {type: 'WARN', text: action.payload}]
        }
        case ADD_ERROR_DIALOG: return {
            ...state,
            dialogQueue: [...state.dialogQueue, {type: 'ERROR', text: action.payload}]
        }
        case SHIFT: return {
            ...state,
            dialogQueue: state.dialogQueue.length ? state.dialogQueue.slice(1) : state.dialogQueue
        }
        default: return state;
    }
}