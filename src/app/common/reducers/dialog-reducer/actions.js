import { ADD_DIALOG } from './index';

export const addDialog = (type, message) => dispatch => {
    dispatch({
        type: ADD_DIALOG,
        payload: {
            type,
            message
        }
    });
}