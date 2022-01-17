
// export class ReScanOvernightJob implements Job {
//     private fn = () => {
//         const allPaths$ = getSetting<string[]>('paths', []);
//         allPaths$
//             .pipe(
//                 switchMap((paths) =>
//                     forkJoin(
//                         paths.map((path) =>
//                             scanPathAndUpdateDatabase(path, null)
//                         )
//                     )
//                 )
//             )
//             .subscribe();
//     };
//     private reScanAtMidnightCronJob = new CronJob('00 00 00 * * *', this.fn);
//     start = () => this.reScanAtMidnightCronJob.start();
//     stop = () => this.reScanAtMidnightCronJob.stop();
}
