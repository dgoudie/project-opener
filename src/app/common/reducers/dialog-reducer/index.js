export const ADD_DIALOG = 'ADD_DIALOG';

const initialState = {
    dialogQueue: []
}

export default (state = initialState, action) => {
    switch(action.type) {
        case ADD_DIALOG: return {
            ...state,
            dialogQueue: [...state.dialogQueue, action.payload]
        }
        default: return state;
    }
}