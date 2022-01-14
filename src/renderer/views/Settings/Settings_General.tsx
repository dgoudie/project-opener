import { Checkbox, ChoiceInputField } from '@primer/react';

import React from 'react';
import SettingsHeader from '../../components/SettingsHeader/SettingsHeader';

export default function Settings_General() {
    return (
        <>
            <SettingsHeader>General</SettingsHeader>
            <ChoiceInputField>
                <ChoiceInputField.Label>
                    Re-scan Overnight
                </ChoiceInputField.Label>
                <Checkbox />
                <ChoiceInputField.Caption>
                    Automatically re-scan directories overnight
                </ChoiceInputField.Caption>
            </ChoiceInputField>
        </>
    );
}
