import { Project } from 'src/types';
import { ipcRenderer } from 'electron';
import { setWindowVisible } from 'src/redux/features/app/actions';
import store from 'src/redux/store';

export const openProject = (project: Project) => {
    ipcRenderer.send('openProject', project._id);
    store.dispatch(setWindowVisible(false));
};

export const openDirectory = (project: Project) => {
    ipcRenderer.send('openDirectory', project._id);
    store.dispatch(setWindowVisible(false));
};
