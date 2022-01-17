import Nedb from 'nedb';
import { Observable } from 'rxjs';
import { Settings } from '../../shared/types/settings';
import electron from 'electron';

const filename = `${electron.app.getPath('userData')}\\data\\settings.db`;

console.debug(`Settings DB path:`, filename);

const db: Nedb = new Nedb({
    filename,
    autoload: true,
    corruptAlertThreshold: 1,
    onload: (err: any) => !!err && db.persistence.compactDatafile(),
});
db.persistence.setAutocompactionInterval(14400000);

export function getSetting<SETTING_KEY extends keyof Settings>(
    key: SETTING_KEY
): Observable<Settings[SETTING_KEY] | undefined> {
    return new Observable<Settings[SETTING_KEY]>((observer) => {
        db.findOne<{ key: SETTING_KEY; value: Settings[SETTING_KEY] }>(
            { key },
            (err, doc) => {
                if (!!err) {
                    observer.error(err);
                } else {
                    observer.next(!!doc ? doc.value : undefined);
                }
                observer.complete();
            }
        );
    });
}

export function writeSetting<SETTING_KEY extends keyof Settings>(
    key: SETTING_KEY,
    value: Settings[SETTING_KEY]
) {
    return new Observable<{ key: SETTING_KEY; value: Settings[SETTING_KEY] }>(
        (o) => {
            db.update({ key }, { key, value }, { upsert: true }, (err) => {
                if (!!err) {
                    o.error(err);
                } else {
                    o.next({ key, value });
                }
                o.complete();
            });
        }
    );
}
