import { Box, Link } from '@primer/react';

import DirectoryPicker from '../../components/DirectoryPicker/DirectoryPicker';
import FilteredPatternPicker from '../../components/FilteredPatternPicker/FilteredPatternPicker';
import React from 'react';
import SettingsHeader from '../../components/SettingsHeader/SettingsHeader';

// const shell = require('electron').shell;

const LINK = 'https://en.wikipedia.org/wiki/Glob_(programming)';

export default function Settings_Directories() {
    return (
        <Box display='grid' gridTemplateRows='max-content auto' height='100%'>
            <SettingsHeader
                subHeading={
                    <>
                        Choose the directories to scan for projects. Nested
                        directories will be searched as well.
                    </>
                }
            >
                Directories
            </SettingsHeader>
            <DirectoryPicker paddingBottom='1rem' />
        </Box>
    );
}
