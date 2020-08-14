import * as ActionTypes from './constants';
import * as actions from './actions';

import { ActionType } from 'typesafe-actions';
import { Ide } from 'src/types';

export type SettingsAction = ActionType<typeof actions>;

export interface SettingsState {
    readonly setupComplete: boolean;
    readonly themeName: string;
    readonly hotkey: string;
    readonly ides: Ide[];
    readonly paths: string[];
    readonly filteredPatterns: string[];
    readonly reScanOvernight: boolean;
    readonly availableIdes: Ide[];
}

const initialState: SettingsState = null;

export default function (
    state = initialState,
    action: ActionType<typeof actions>
): SettingsState {
    switch (action.type) {
        case ActionTypes.SET_SETTINGS:
            return action.payload;
        case ActionTypes.SET_SETUP_COMPLETE:
            return { ...state, setupComplete: action.payload };
        case ActionTypes.SET_THEME_NAME:
            return { ...state, themeName: action.payload };

        case ActionTypes.SET_RE_SCAN_OVERNIGHT:
            return { ...state, reScanOvernight: action.payload };
        case ActionTypes.SET_IDES:
            return { ...state, ides: action.payload };
        case ActionTypes.SET_HOTKEY:
            return { ...state, hotkey: action.payload };
        case ActionTypes.ADD_PATH:
            return {
                ...state,
                paths: [...state.paths, action.payload],
            };
        case ActionTypes.DELETE_PATH:
            return {
                ...state,
                paths: state.paths.filter((p) => p !== action.payload),
            };
        case ActionTypes.ADD_FILTERED_PATTERN:
            return {
                ...state,
                filteredPatterns: [
                    ...state.filteredPatterns,
                    action.payload,
                ].sort(),
            };
        case ActionTypes.DELETE_FILTERED_PATTERN:
            return {
                ...state,
                filteredPatterns: state.filteredPatterns.filter(
                    (fp) => fp !== action.payload
                ),
            };
        default:
            return state;
    }
}
