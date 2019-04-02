export const compactPomsDatabase = () => (dispatch, getState) => {
    getState().databaseReducer.pomDatabase.persistence.compactDatafile();
}
export const compactSettingsDatabase = () => (dispatch, getState) => {
    getState().databaseReducer.settingsDatabase.persistence.compactDatafile();
}