import { Box, Checkbox, ChoiceInputField, Text } from '@primer/react';

import React from 'react';
import SettingsHeader from '../../components/SettingsHeader/SettingsHeader';
import ThemePicker from '../../components/ThemePicker/ThemePicker';

export default function Settings_General() {
    return (
        <>
            <SettingsHeader>General</SettingsHeader>
            <Box paddingY='.5em'>
                <Box display={'grid'} justifyItems={'start'} gridGap='.5em'>
                    <Text fontSize={3}>Theme</Text>
                    <ThemePicker />
                </Box>
            </Box>
        </>
    );
}
