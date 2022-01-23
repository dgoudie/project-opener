import React, { useEffect } from 'react';
import { db, settingsTable } from '../../indexed-db';

import { useNavigate } from 'react-router-dom';

export default function FirstTimeSetupChecker(): null {
    const navigate = useNavigate();

    useEffect(() => {
        const f = async () => {
            const setupCompleteSetting = await settingsTable.get(
                'SETUP_COMPLETE'
            );
            if (!!setupCompleteSetting?.value) {
                return;
            }
            // navigate('/setup/welcome');
        };
        f();
    }, []);

    return null;
}
