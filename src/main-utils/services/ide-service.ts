import { Observable, forkJoin, from, merge, throwError } from 'rxjs';
import { concatMap, filter, map, reduce, tap } from 'rxjs/operators';
import electron, { dialog } from 'electron';

import { Ide } from 'src/types';
import { exists } from 'fs';
import globby from 'globby';
import unixify from 'unixify';

let scanning = false;

export const findAvailableIdes = () => {
    if (scanning) {
        return throwError('Scanning already in progress.');
    }
    scanning = true;
    return merge(findIntellijIdes(), findVsCodeIdes(), findWebStormIdes()).pipe(
        map((ide) => ({
            ...ide,
            path: `C:${ide.path.replace(/\//g, '\\')}`,
        })),
        reduce((acc, ide) => [...acc, ide], [] as Ide[]),
        tap(() => (scanning = false))
    );
};

export function promptForFile(): Observable<string> {
    return from(
        dialog.showOpenDialog({
            defaultPath: electron.app.getPath('home'),
            properties: ['openFile'],
        })
    ).pipe(
        filter(({ canceled }) => !canceled),
        map(({ filePaths }) => filePaths[0])
    );
}

const findIntellijIdes: () => Observable<Ide> = () => {
    const ext = `/**/jetbrains/**/bin/idea64.exe`;
    const patterns = [
        `${unixify(process.env.LOCALAPPDATA)}${ext}`,
        `${unixify(process.env.APPDATA)}${ext}`,
        `${unixify(process.env.ProgramFiles)}${ext}`,
        `${unixify(process.env['ProgramFiles(x86)'])}${ext}`,
    ];
    const foundFiles$: Observable<string> = forkJoin(
        patterns.map((pattern) =>
            from(
                globby(pattern, {
                    caseSensitiveMatch: false,
                    suppressErrors: true,
                })
            )
        )
    ).pipe(
        concatMap((listOfLists) => from(listOfLists)),
        concatMap((list) => from(list))
    );
    return foundFiles$.pipe(
        map((path) => ({
            type: 'INTELLIJ',
            args: [`{{directory}}`],
            path,
            name: 'IntelliJ IDEA',
        }))
    );
};

const findVsCodeIdes: () => Observable<Ide> = () => {
    const ext = `/**/*vs*code/code.exe`;
    const patterns = [
        `${unixify(process.env.LOCALAPPDATA)}${ext}`,
        `${unixify(process.env.APPDATA)}${ext}`,
        `${unixify(process.env.ProgramFiles)}${ext}`,
        `${unixify(process.env['ProgramFiles(x86)'])}${ext}`,
    ];
    const foundFiles$: Observable<string> = forkJoin(
        patterns.map((pattern) =>
            from(
                globby(pattern, {
                    caseSensitiveMatch: false,
                    suppressErrors: true,
                })
            )
        )
    ).pipe(
        concatMap((listOfLists) => from(listOfLists)),
        concatMap((list) => from(list))
    );
    return foundFiles$.pipe(
        map((path) => ({
            type: 'VSCODE',
            args: [`{{directory}}`],
            path,
            name: 'Visual Studio Code',
        }))
    );
};

const findWebStormIdes: () => Observable<Ide> = () => {
    const ext = `/**/jetBrains/**/bin/webstorm64.exe`;
    const patterns = [
        `${unixify(process.env.LOCALAPPDATA)}${ext}`,
        `${unixify(process.env.APPDATA)}${ext}`,
        `${unixify(process.env.ProgramFiles)}${ext}`,
        `${unixify(process.env['ProgramFiles(x86)'])}${ext}`,
    ];
    const foundFiles$: Observable<string> = forkJoin(
        patterns.map((pattern) =>
            from(
                globby(pattern, {
                    caseSensitiveMatch: false,
                    suppressErrors: true,
                })
            )
        )
    ).pipe(
        concatMap((listOfLists) => from(listOfLists)),
        concatMap((list) => from(list))
    );
    return foundFiles$.pipe(
        map((path) => ({
            type: 'WEBSTORM',
            args: [`{{directory}}`],
            path,
            name: 'WebStorm',
        }))
    );
};

export const checkIfIdeExists = (ide: Ide) => {
    return new Observable<boolean>((o) => {
        exists(ide.path, (exists) => {
            o.next(exists);
            o.complete();
        });
    });
};
