import { CronJob } from 'cron';
import { Job } from 'src/main-utils/jobs/job';
import { forkJoin } from 'rxjs';
import { getSetting } from 'src/main-utils/services/settings-service';
import { scanPathAndUpdateDatabase } from 'src/main-utils/services/path-service';
import { switchMap } from 'rxjs/operators';

export class ReScanOvernightJob implements Job {
    private fn = () => {
        const allPaths$ = getSetting<string[]>('paths', []);
        allPaths$
            .pipe(
                switchMap((paths) =>
                    forkJoin(
                        paths.map((path) =>
                            scanPathAndUpdateDatabase(path, null)
                        )
                    )
                )
            )
            .subscribe();
    };
    private reScanAtMidnightCronJob = new CronJob('00 00 00 * * *', this.fn);
    start = () => this.reScanAtMidnightCronJob.start();
    stop = () => this.reScanAtMidnightCronJob.stop();
}
