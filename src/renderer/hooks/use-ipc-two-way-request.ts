import { IpcChannelType } from '../../shared/types/channel';
import { useAsync } from 'react-async-hook';

export const useIpcRequestResponse = <TYPE extends keyof IpcChannelType>(
    type: TYPE,
    request: IpcChannelType[TYPE]['request'],
    date: number
) => {
    if (!window.BRIDGE_APIS) {
        throw new Error('BRIDGE_APIS unavailable.');
    }

    return useAsync(
        () => window.BRIDGE_APIS.send(type, request),
        [type, request, date]
    );
};
