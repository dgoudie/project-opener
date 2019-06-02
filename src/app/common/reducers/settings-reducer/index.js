export const SET_THEME = 'SET_THEME';
export const LOAD_SETTINGS = 'LOAD_IDES';
export const SET_RE_SCAN_DIRECTORIES_OVERNIGHT = 'SET_RE_SCAN_DIRECTORIES_OVERNIGHT';
export const SET_MAVEN_IDE = 'SET_MAVEN_IDE';
export const SET_NPM_IDE = 'SET_NPM_IDE';
export const SET_HOTKEY = 'SET_HOTKEY';

const initialState = {
    reScanDirectoriesOvernight: false,
    mavenIde: {},
    npmIde: {},
    theme: '',
    hotkey: ''
}

export default (state = initialState, action) => {
    switch(action.type) {
        case SET_THEME: return {
            ...state,
            theme: action.payload
        }
        case LOAD_SETTINGS: return {
            ...state,
            mavenIde: action.payload.mavenIde,
            npmIde: action.payload.npmIde,
            reScanDirectoriesOvernight: action.payload.reScanDirectoriesOvernight,
            theme: action.payload.theme,
            hotkey: action.payload.hotkey
        }
        case SET_MAVEN_IDE: return {
            ...state,
            mavenIde: action.payload,
        }
        case SET_RE_SCAN_DIRECTORIES_OVERNIGHT: return {
            ...state,
            reScanDirectoriesOvernight: action.payload,
        }
        case SET_NPM_IDE: return {
            ...state,
            npmIde: action.payload
        }
        case SET_HOTKEY: return {
            ...state,
            hotkey: action.payload
        }
        default: return state;
    }
}