import { useCallback, useEffect, useState } from 'react';

import { usePrevious } from './use-previous';

export const useIpcMainToRendererEventResult = <T = any>(
    eventName: string
): T => {
    const [latestMessagePayload, setLatestMessagePayload] = useState<
        undefined | T
    >(undefined);

    const eventHandler = useCallback(
        (_event: Electron.IpcRendererEvent, payload: T) =>
            setLatestMessagePayload(payload),
        [setLatestMessagePayload]
    );

    const previousEventName = usePrevious(eventName);
    const previousHandler = usePrevious(eventHandler);

    useEffect(() => {
        !!previousHandler &&
            window.BRIDGE_APIS?.removeIpcEventListener(
                previousEventName,
                previousHandler
            );
        window.BRIDGE_APIS?.addIpcEventListener(eventName, eventHandler);
        return () => {
            window.BRIDGE_APIS?.removeIpcEventListener(eventName, eventHandler);
        };
    }, [eventName, eventHandler]);

    return latestMessagePayload;
};
