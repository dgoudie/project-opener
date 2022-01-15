import { Ide, ProjectType } from 'src/types';
import { Observable, Subject, forkJoin, of } from 'rxjs';
import {
    getSetting as getSettingFromRepository,
    writeSetting as writeSettingToRepository,
} from 'src/main-utils/repositories/settings-repository';
import { map, mapTo, switchMap, tap } from 'rxjs/operators';

import { SettingsState } from 'src/redux/features/settings/reducer';

export function getSetting<T = any>(
    key: keyof SettingsState,
    defaultValue?: T
): Observable<T | undefined> {
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

export function getAllSettings(defaultSettings: any) {
    const obs$s = Object.keys(defaultSettings).map((key: keyof SettingsState) =>
        getSetting(key, defaultSettings[key]).pipe(
            map((value) => ({ key, value }))
        )
    );

    return forkJoin(obs$s).pipe(
        map((keyValuePairs) =>
            keyValuePairs.reduce(
                (accumulateMap, kvp) => ({
                    ...accumulateMap,
                    [kvp.key]: kvp.value,
                }),
                {} as SettingsState
            )
        )
    );
}

export function getIdeByProjectType(type: ProjectType) {
    return getSetting<Ide[]>('ides').pipe(
        map((ides) => ides.find((ide) => ide.projectType.key === type.key))
    );
}

export function writeSetting(key: keyof SettingsState, value: any) {
    console.debug(
        `writeSetting() value ${JSON.stringify(value)} for setting ${key}`
    );
    return writeSettingToRepository(key, value).pipe(
        tap(() => settingChanged$.next(key))
    );
}

const settingChanged$ = new Subject<keyof SettingsState>();

export const settingsChangedUpdates = () => settingChanged$;
