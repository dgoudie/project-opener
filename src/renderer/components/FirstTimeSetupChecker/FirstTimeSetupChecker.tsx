import { useIpcRequestResponse } from '../../hooks/use-ipc-request-response';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function FirstTimeSetupChecker(): null {
    const [date, setDate] = useState(Date.now());

    const navigate = useNavigate();

    const { result } = useIpcRequestResponse(
        'GET_SETTING_HOTKEY',
        'CommandOrControl+Shift+O',
        date
    );

    console.log(result);

    return null;
}
