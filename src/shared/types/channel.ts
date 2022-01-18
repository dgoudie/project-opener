import { Observable, take } from 'rxjs';
import {
    reportAndRethrowExceptions,
    reportException,
} from '../../main/services/error-service';

import { AppException } from './app-exception';
import { Ide } from './ide';
import { Settings } from './settings';

export type IpcChannelType = {
    [SETTING_KEY in keyof Settings as `GET_SETTING_${SETTING_KEY}`]: {
        request: Settings[SETTING_KEY] | undefined;
        response: Settings[SETTING_KEY];
    };
} & {
    AVAILABLE_IDES: {
        request: void;
        response: Ide[];
    };
    PROMPT_FOR_FILE: {
        request: void;
        response: string;
    };
};

export class IpcChannel<TYPE extends keyof IpcChannelType> {
    constructor(
        public name: TYPE,
        public onChannelRequest: (
            request: IpcChannelType[TYPE]['request']
        ) =>
            | IpcChannelType[TYPE]['response']
            | Observable<IpcChannelType[TYPE]['response']>
    ) {}

    readonly handleIpcEvent = (
        event: Electron.IpcMainEvent,
        payload: {
            request: IpcChannelType[TYPE]['request'];
            responseChannel: string;
        }
    ) => {
        const { responseChannel, request } = payload;
        let response: ReturnType<typeof this.onChannelRequest>;
        try {
            response = this.onChannelRequest(request);
        } catch (err) {
            reportException(event, new AppException(err.message, err.stack));
            throw err;
        }
        if (response instanceof Observable) {
            response
                .pipe(reportAndRethrowExceptions(event), take(1))
                .subscribe((response) =>
                    event.reply(responseChannel, response)
                );
        } else {
            event.reply(responseChannel, response);
        }
    };
}
