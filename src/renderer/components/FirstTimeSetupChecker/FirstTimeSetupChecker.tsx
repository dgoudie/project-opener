import React, { useEffect } from 'react';

import { useIpcRequestResponse } from '../../hooks/use-ipc-two-way-request';
import { useNavigate } from 'react-router-dom';

export default function FirstTimeSetupChecker(): null {
    const navigate = useNavigate();

    const result = useIpcRequestResponse(
        'GET_SETTING',
        'SETUP_COMPLETE',
        'GET_SETTING_RESULT'
    );

    console.log(result);

    return null;
}
