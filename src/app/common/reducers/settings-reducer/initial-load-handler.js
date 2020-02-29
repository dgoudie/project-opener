import runtimeChangeHandler from './runtime-change-handler';

export default (dispatch, payload) => {
    runtimeChangeHandler.runtime_HandleNewHotkey(dispatch, payload.hotkey);
    runtimeChangeHandler.runtime_HandleNewReScanDirectoriesOvernight(dispatch, payload.reScanDirectoriesOvernight);
}