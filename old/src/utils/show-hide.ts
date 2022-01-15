const remote = window.require('electron').remote;

export function showWindow() {
    remote.getCurrentWindow().show();
}
export function hideWindow() {
    remote.getCurrentWindow().hide();
}
export function exitApplication() {
    remote.getCurrentWindow().close();
}
