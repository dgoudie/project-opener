import Nedb from 'nedb';
import { Observable } from 'rxjs';
import { SettingsState } from 'src/redux/features/settings/reducer';
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

export function getSetting<T = any>(
    key: keyof SettingsState
): Observable<T | undefined> {
    return new Observable<T>((observer) => {
        db.findOne<{ key: keyof SettingsState; value: T }>(
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

export function writeSetting(key: keyof SettingsState, value: any) {
    return new Observable<{ key: typeof key; value: typeof value }>((o) => {
        db.update({ key }, { key, value }, { upsert: true }, (err) => {
            if (!!err) {
                o.error(err);
            } else {
                o.next({ key, value });
            }
            o.complete();
        });
    });
}
