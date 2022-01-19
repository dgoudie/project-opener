import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IpcRequestResponseOutgoingPayload } from '../../shared/types/ipc';
import { Settings } from '../../shared/types/settings';

import { useIpcMainToRendererEventResult } from './use-ipc-main-to-renderer-event-result';

type MyType = {
    GET_SETTING: {
        outgoingPayload: keyof Settings,
        incomingPayload: 
    }
}


export const useIpcRequestResponse = <T, R>(
    outgoingEventName: string,
    outgoingEventPayload: T,
    date = Date.now()
): R => {

    const wrappedPayload = new IpcRequestResponseOutgoingPayload(outgoingEventPayload);

    const incomingEventPayload =
        useIpcMainToRendererEventResult(wrappedPayload.responseChannel);

    useEffect(() => {
        window.BRIDGE_APIS?.sendIpcEvent(
            outgoingEventName,
            wrappedPayload
        );
    }, [date]);

    return incomingEventPayload;
};
