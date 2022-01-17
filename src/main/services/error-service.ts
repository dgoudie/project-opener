import { OperatorFunction, catchError, throwError } from 'rxjs';

import { AppException } from '../../shared/types/app-exception';

export const reportException = (
    event: Electron.IpcMainEvent,
    exception: AppException
) => {
    !!event && event.reply('exception', exception);
};

export const reportAndRethrowExceptions = <T>(
    event: Electron.IpcMainEvent
): OperatorFunction<T, T> =>
    catchError((err) => {
        reportException(event, new AppException(err.message, err.stack));
        return throwError(() => err);
    });
