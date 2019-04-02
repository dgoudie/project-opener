export const LOAD_FILTERED_PATTERNS = 'LOAD_FILTERED_PATTERNS';
export const ADD_FILTERED_PATTERN = 'ADD_FILTERED_PATTERN';
export const DELETE_FILTERED_PATTERN = 'DELETE_FILTERED_PATTERN';

const initialState = {
    filteredPatterns: [],
}

export default (state = initialState, action) => {
    switch (action.type) {
        case LOAD_FILTERED_PATTERNS: return {
            ...state,
            filteredPatterns: action.payload
        }
        case ADD_FILTERED_PATTERN: return {
            ...state,
            filteredPatterns: [...state.filteredPatterns, action.payload]
        }
        case DELETE_FILTERED_PATTERN:
            return {
                ...state,
                filteredPatterns: state.filteredPatterns.filter(path => path !== action.payload)
            }
        default: return state;
    }
}