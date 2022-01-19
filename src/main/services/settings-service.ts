import { Observable, Subject, of } from 'rxjs';
import {
    getSetting as getSettingFromRepository,
    writeSetting as writeSettingToRepository,
} from '../repositories/settings-repository';
import { map, switchMap, tap } from 'rxjs/operators';

import { ProjectType } from '../../shared/types/project';
import { Settings } from '../../shared/types/settings';

export function getSetting<SETTING_KEY extends keyof Settings>(
    key: SETTING_KEY,
    defaultValue?: Settings[SETTING_KEY]
): Observable<Settings[SETTING_KEY] | undefined> {
    return getSettingFromRepository(key).pipe(
        switchMap((value) => {
            if (value !== undefined) {
                return of(value);
            } else {
                if (typeof defaultValue !== 'undefined') {
                    return writeSetting(key, defaultValue).pipe(
                        map(() => defaultValue)
                    );
                } else {
                    console.warn(`Setting with key ${key} is undefined.`);
                    return of(undefined);
                }
            }
        }),
        tap((settingValue) =>
            console.debug(
                `getSetting() got ${JSON.stringify(
                    settingValue
                )} for setting ${key}`
            )
        )
    );
}

export function getIdeByProjectType(type: ProjectType) {
    return getSetting('IDES').pipe(
        map((ides) => ides.find((ide) => ide.projectType.key === type.key))
    );
}

export function writeSetting<SETTING_KEY extends keyof Settings>(
    key: SETTING_KEY,
    value: Settings[SETTING_KEY]
) {
    console.debug(
        `writeSetting() value ${JSON.stringify(value)} for setting ${key}`
    );
    return writeSettingToRepository(key, value).pipe(
        tap(() => settingChanged$.next(key))
    );
}

export const settingChanged$ = new Subject<keyof Settings>();
