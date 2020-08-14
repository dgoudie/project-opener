import * as ActionTypes from './constants';
import * as actions from './actions';

import { AppException, AppNotification, AppTheme, Ide } from 'src/types';

import { ActionType } from 'typesafe-actions';

export type AppAction = ActionType<typeof actions>;

export type AppState = {
    readonly windowVisible: boolean;
    readonly notifications: AppNotification[];
    readonly exceptions: AppException[];
    readonly currentlyScanningPaths: Set<string>;
    readonly theme: AppTheme;
    readonly availableIdes: Ide[];
};

const initialState: AppState = {
    windowVisible: true,
    notifications: [],
    exceptions: [],
    currentlyScanningPaths: new Set(),
    theme: null,
    availableIdes: null,
};

export default function (
    state = initialState,
    action: ActionType<typeof actions>
): AppState {
    switch (action.type) {
        case ActionTypes.ADD_NOTIFICATION:
            return {
                ...state,
                notifications: [...state.notifications, action.payload],
            };
        case ActionTypes.DISMISS_NOTIFICATION:
            return {
                ...state,
                notifications: state.notifications.filter(
                    (n) => n.id !== action.payload
                ),
            };
        case ActionTypes.ADD_EXCEPTION:
            return {
                ...state,
                exceptions: [...state.exceptions, action.payload],
            };
        case ActionTypes.DISMISS_EXCEPTION:
            return {
                ...state,
                exceptions: state.exceptions.filter(
                    (exception) => exception !== action.payload
                ),
            };
        case ActionTypes.SCAN_PATH:
            return {
                ...state,
                currentlyScanningPaths: new Set([
                    ...Array.from(state.currentlyScanningPaths),
                    action.payload,
                ]),
            };
        case ActionTypes.SCAN_PATH_COMPLETE:
            return {
                ...state,
                currentlyScanningPaths: new Set(
                    Array.from(state.currentlyScanningPaths).filter(
                        (csp) => csp !== action.payload
                    )
                ),
            };
        case ActionTypes.SET_WINDOW_VISIBLE:
            return {
                ...state,
                windowVisible: action.payload,
            };
        case ActionTypes.SET_THEME:
            return {
                ...state,
                theme: action.payload,
            };
        case ActionTypes.SET_AVAILABLE_IDES:
            return { ...state, availableIdes: action.payload };
        case ActionTypes.CLEAR_AND_RESCAN_AVAILABLE_IDES:
            return {
                ...state,
                availableIdes: null,
            };
        default:
            return state;
    }
}
