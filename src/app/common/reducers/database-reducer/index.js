const electron = window.require('electron');
const Nedb = electron.remote.require('nedb');

const settingsDatabase = new Nedb({ filename: `${(electron.app || electron.remote.app).getPath('userData')}\\settings.db`, autoload: true });
const pomDatabase = new Nedb({ filename: `${(electron.app || electron.remote.app).getPath('userData')}\\poms.db`, autoload: true });
settingsDatabase.persistence.setAutocompactionInterval(14400000);
pomDatabase.persistence.setAutocompactionInterval(14400000);

const initialState = {
    settingsDatabase,
    pomDatabase
}

export default (state = initialState) => {
    return state;
}