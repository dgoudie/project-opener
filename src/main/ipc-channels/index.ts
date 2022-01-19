import {
    setup as setupIdeListeners,
    tearDown as tearDownIdeListeners,
} from './ide-listeners';
import {
    setup as setupPathListeners,
    tearDown as tearDownPathListeners,
} from './path-listeners';
import {
    setup as setupProjectListeners,
    tearDown as tearDownProjectListeners,
} from './project-listeners';
import {
    setup as setupSettingsListeners,
    tearDown as tearDownSettingsListeners,
} from './settings-listeners';

export const setupServices = () => {
    setupProjectListeners();
    setupSettingsListeners();
    setupIdeListeners();
    setupPathListeners();
};

export const tearDownServices = () => {
    tearDownProjectListeners();
    tearDownSettingsListeners();
    tearDownIdeListeners();
    tearDownPathListeners();
};
