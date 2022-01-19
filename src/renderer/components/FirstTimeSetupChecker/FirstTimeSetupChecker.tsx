import React, { useEffect } from 'react';

import { SettingDatabaseType } from '../../indexed-db/types';
import { db } from '../../indexed-db';
import { useNavigate } from 'react-router-dom';

export default function FirstTimeSetupChecker(): null {
    const navigate = useNavigate();

    useEffect(() => {
        const f = async () => {
            const setupCompleteSetting = await db
                .table<SettingDatabaseType>('settings')
                .get('SETUP_COMPLETE');
            if (!!setupCompleteSetting?.value) {
                return;
            }
            await populateDatabaseWithDefaultData();
            // navigate('/setup/welcome');
        };
        f();
    }, []);

    return null;
}

const populateDatabaseWithDefaultData = async () => {
    const settingsTable = db.table<SettingDatabaseType>('settings');
    const setupCompleteSetting = await settingsTable.get('SETUP_COMPLETE');
    if (!setupCompleteSetting) {
        await settingsTable.add({ key: 'SETUP_COMPLETE', value: false });
    }
    const hotkeySetting = await settingsTable.get('HOTKEY');
    if (!hotkeySetting) {
        await settingsTable.add({
            key: 'HOTKEY',
            value: 'CommandOrControl+Shift+O',
        });
    }
};
