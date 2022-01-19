import { contextBridge, ipcRenderer } from 'electron';

import { IpcChannelType } from '../shared/types/channel';
import { v4 as uuidV4 } from 'uuid';

export const BRIDGE_APIS = {
    send: <
        TYPE extends keyof IpcChannelType,
        REQUEST_TYPE = IpcChannelType[TYPE]['request'],
        RESPONSE_TYPE = IpcChannelType[TYPE]['response']
    >(
        type: TYPE,
        request: REQUEST_TYPE
    ): Promise<RESPONSE_TYPE> => {
        const responseChannel = uuidV4();
        const requestWithResponseChannel = {
            request,
            responseChannel,
        };
        return new Promise<RESPONSE_TYPE>((resolve) => {
            ipcRenderer.once(responseChannel, (_event, response) =>
                resolve(response)
            );
            ipcRenderer.send(type, requestWithResponseChannel);
        });
    },
};

contextBridge.exposeInMainWorld('BRIDGE_APIS', BRIDGE_APIS);
