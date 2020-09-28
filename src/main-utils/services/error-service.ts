import { AppException } from 'src/types';

export const reportException = (
    event: Electron.IpcMainEvent,
    exception: AppException
) => {
    !!event && event.reply('exception', exception);
};
