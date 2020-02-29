export const ADD_POMS = 'ADD_POMS';
export const LOAD_POMS = 'LOAD_POMS';
export const REMOVE_POMS_BY_PATH = 'REMOVE_POMS_BY_PATH';
export const FILTER_POMS = 'FILTER_POMS';
export const CLEAR_FILTERED_POMS = 'CLEAR_FILTERED_POMS'
export const SET_CURSOR = 'SET_CURSOR';

const initialState = {
    poms: [],
    filteredPoms: [],
    cursor: 0
}

export default (state = initialState, action) => {
    switch(action.type) {
        case ADD_POMS: return {
            ...state,
            poms: [...state.poms, action.payload]
        }
        case LOAD_POMS: return {
            ...state,
            poms: action.payload
        }
        case REMOVE_POMS_BY_PATH: return {
            ...state,
            poms: state.poms.filter(pom => pom.inside !== action.payload)
        }
        case FILTER_POMS: return {
            ...state,
            filteredPoms: action.payload
        }
        case CLEAR_FILTERED_POMS: return {
            ...state,
            filteredPoms: action.payload
        }
        case SET_CURSOR: return {
            ...state,
            cursor: action.payload
        }
        default: return state;
    }
}