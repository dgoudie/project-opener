import React, { useEffect, useState } from 'react';

import { useIpcRequestResponse } from '../../hooks/use-ipc-two-way-request';
import { useNavigate } from 'react-router-dom';

export default function FirstTimeSetupChecker(): null {
    const [date, setDate] = useState(Date.now());

    const navigate = useNavigate();

    const { result } = useIpcRequestResponse(
        'PROMPT_FOR_FILE',
        undefined,
        date
    );

    useEffect(() => {
        console.log(result);
    }, [result]);

    return null;
}
