import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useIpcRequestResponse } from '../../hooks/use-ipc-request-response';
import { useNavigate } from 'react-router-dom';

export default function FirstTimeSetupChecker(): null {
    const [date, setDate] = useState(Date.now());

    const navigate = useNavigate();

    const request = useMemo(
        () => ({ key: 'HOTKEY', defaultValue: 'CommandOrControl+Shift+O' }),
        []
    );

    const { result } = useIpcRequestResponse(
        'GET_SETTING',
        //@ts-ignore
        request,
        date
    );

    console.log(result);

    return null;
}
