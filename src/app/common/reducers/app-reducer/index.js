export const SET_VISIBLE = 'SET_VISIBLE';
export const SET_ACTIVE_VIEW = 'SET_ACTIVE_VIEW';
export const SET_FILTER_TEXT = 'SET_FILTER_TEXT';
export const SET_VIEW_SPECIFIC_KEY_HANDLER = 'SET_VIEW_SPECIFIC_KEY_HANDLER';
export const SET_SETTINGS_HANDLER_INIT_READY = 'SET_SETTINGS_HANDLER_INIT_READY';

const initialState = {
    visible: true,
    activeView: '',
    filterText: '',
    viewSpecificKeyHandler: () => {},
    settingsHandlerInitReady: false
}

export default (state = initialState, action) => {
    switch(action.type) {
        case SET_VISIBLE: return {
            ...state,
            visible: action.payload
        }
        case SET_ACTIVE_VIEW: return {
            ...state,
            activeView: action.payload
        }
        case SET_FILTER_TEXT: return {
            ...state,
            filterText: action.payload
        }
        case SET_VIEW_SPECIFIC_KEY_HANDLER: return {
            ...state,
            viewSpecificKeyHandler: action.payload
        }
        case SET_SETTINGS_HANDLER_INIT_READY: return {
            ...state,
            settingsHandlerInitReady: action.payload
        }
        default: return state;
    }
}