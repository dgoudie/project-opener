import { contextBridge, ipcRenderer } from 'electron';

import { IpcChannelType } from '../shared/types/channel';
import { v4 as uuidV4 } from 'uuid';

export const BRIDGE_APIS = {
    send: <TYPE extends keyof IpcChannelType>(
        type: TYPE,
        request: IpcChannelType[TYPE]['request']
    ): Promise<IpcChannelType[TYPE]['response']> => {
        const responseChannel = uuidV4();
        const requestWithResponseChannel = {
            request,
            responseChannel,
        };
        return new Promise<IpcChannelType[TYPE]['response']>((resolve) => {
            ipcRenderer.once(responseChannel, (_event, response) =>
                resolve(response)
            );
            ipcRenderer.send(type, requestWithResponseChannel);
        });
    },
};

contextBridge.exposeInMainWorld('BRIDGE_APIS', BRIDGE_APIS);
