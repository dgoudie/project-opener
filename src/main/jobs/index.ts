import { concatMap, filter, from } from 'rxjs';

import { Job } from './job';
import { Settings } from '../../shared/types/settings';
import { settingChanged$ } from '../services/settings-service';

export const setupJobs = () => {
    // setupJob('reScanOvernight', new ReScanOvernightJob());
};

const setupJob = (job: Job, restartOnSettingsChanged: (keyof Settings)[]) => {
    job.start();
    settingChanged$
        .pipe(
            filter((key) => restartOnSettingsChanged.includes(key)),
            concatMap(async () => {
                await Promise.resolve(job.stop());
                await Promise.resolve(job.start());
            })
        )
        .subscribe();
};
