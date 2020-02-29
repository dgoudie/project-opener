import { CronJob } from 'cron';
import { scanAllPaths } from '../path-reducer/actions';

const electronRemote = window.require('electron').remote;

let reScanAtMidnightCronJob;

export default {
    // Hotkey
    runtime_HandleNewHotkey: (dispatch, hotkey) => {
        electronRemote.globalShortcut.unregisterAll();
        electronRemote.globalShortcut.register(hotkey, () => electronRemote.getCurrentWindow().show());
    },
    runtime_HandleNewReScanDirectoriesOvernight: (dispatch, value) => {
        if (!reScanAtMidnightCronJob) {
            reScanAtMidnightCronJob = new CronJob('00 00 00 * * *', () => dispatch(scanAllPaths()));
        }
        if (value) {
            reScanAtMidnightCronJob.start();
        } else {
            reScanAtMidnightCronJob.stop();
        }
    }
}