import { UseAsyncReturn, useAsync } from 'react-async-hook';

import { IpcChannelType } from '../../shared/types/channel';

export const useIpcRequestResponse = <
    TYPE extends keyof IpcChannelType,
    REQUEST_TYPE = IpcChannelType[TYPE]['request'],
    RESPONSE_TYPE = IpcChannelType[TYPE]['response']
>(
    type: TYPE,
    request: REQUEST_TYPE,
    date: number
): UseAsyncReturn<RESPONSE_TYPE> => {
    if (!window.BRIDGE_APIS) {
        throw new Error('BRIDGE_APIS unavailable.');
    }

    return useAsync(
        () => window.BRIDGE_APIS.send(type, request),
        [type, request, date]
    );
};
