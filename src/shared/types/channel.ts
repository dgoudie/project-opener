import { Observable, take } from 'rxjs';
import {
    reportAndRethrowExceptions,
    reportException,
} from '../../main/services/error-service';

import { AppException } from './app-exception';
import { Ide } from './ide';
import { Settings } from './settings';

// export type Settings = {
//     A: boolean;
//     B: string;
//     C: number[];
//     D: string[];
// };

// type MyType = {
//     [SETTING_KEY in keyof Settings as 'GET_SETTING']: {
//         key: SETTING_KEY;
//         value: Settings[SETTING_KEY];
//     };
// };

// const a: MyType = {
//     GET_SETTING: {
//         key: 'A',
//         value: 1,
//     },
// };

// type SettingsIpcChannelType = {
//     [SETTING_KEY in keyof Settings as 'GET_SETTING']: {
//         request: { key: SETTING_KEY; defaultValue?: Settings[SETTING_KEY] };
//         response: Settings[SETTING_KEY];
//     };
// };

export type IpcChannelType = {
    [SETTING_KEY in keyof Settings as 'GET_SETTING']: {
        request: { key: SETTING_KEY; defaultValue?: Settings[SETTING_KEY] };
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

export class IpcChannel<
    TYPE extends keyof IpcChannelType,
    REQUEST_TYPE = IpcChannelType[TYPE]['request'],
    RESPONSE_TYPE = IpcChannelType[TYPE]['response']
> {
    constructor(
        public name: TYPE,
        public onChannelRequest: (
            request: REQUEST_TYPE
        ) => RESPONSE_TYPE | Observable<RESPONSE_TYPE>
    ) {}

    readonly handleIpcEvent = (
        event: Electron.IpcMainEvent,
        payload: {
            request: REQUEST_TYPE;
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
