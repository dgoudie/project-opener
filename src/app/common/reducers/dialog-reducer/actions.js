import { ADD_DIALOG, ADD_SUCCESS_DIALOG, ADD_INFO_DIALOG, ADD_WARN_DIALOG, ADD_ERROR_DIALOG, SHIFT } from './index';

export const addDialog = (type, message) => dispatch => {
    dispatch({
        type: ADD_DIALOG,
        payload: {
            type,
            message
        }
    });
}
export const addSuccessDialog = message => dispatch => {
    dispatch({
        type: ADD_SUCCESS_DIALOG,
        payload: message
    });
}
export const addInfoDialog = message => dispatch => {
    dispatch({
        type: ADD_INFO_DIALOG,
        payload: message
    });
}
export const addWarnDialog = message => dispatch => {
    dispatch({
        type: ADD_WARN_DIALOG,
        payload: message
    });
}
export const addErrorDialog = message => dispatch => {
    dispatch({
        type: ADD_ERROR_DIALOG,
        payload: message
    });
}
export const shift = () => dispatch => {
    dispatch({
        type: SHIFT
    })
}