import {
    getSetting,
    settingsChangedUpdates,
} from 'src/main-utils/services/settings-service';

import { Job } from 'src/main-utils/jobs/job';
import { ReScanOvernightJob } from 'src/main-utils/jobs/rescan-overnight-job';
import { SettingsState } from 'src/redux/features/settings/reducer';
import { filter } from 'rxjs/operators';

export const setupJobs = () => {
    setupJob('reScanOvernight', new ReScanOvernightJob());
};

const setupJob = (settingsKey: keyof SettingsState, job: Job) => {
    const startOrStopJob = () => {
        const shouldStart$ = getSetting<boolean>(settingsKey);
        shouldStart$.subscribe((shouldStart) =>
            !!shouldStart ? job.start() : job.stop()
        );
    };
    startOrStopJob();
    settingsChangedUpdates()
        .pipe(filter((key) => key === settingsKey))
        .subscribe(startOrStopJob);
};
