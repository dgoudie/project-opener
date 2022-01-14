import { Box, Link } from '@primer/react';

import FilteredPatternPicker from '../../components/FilteredPatternPicker/FilteredPatternPicker';
import React from 'react';
import SettingsHeader from '../../components/SettingsHeader/SettingsHeader';

// const shell = require('electron').shell;

const LINK = 'https://en.wikipedia.org/wiki/Glob_(programming)';

export default function Settings_FilteredPatterns() {
    return (
        <Box display='grid' gridTemplateRows='max-content auto' height='100%'>
            <SettingsHeader
                subHeading={
                    <>
                        Choose the glob patterns to ignore when scanning for
                        projects.{' '}
                        <Link href={LINK} target='_blank'>
                            {LINK}
                        </Link>
                    </>
                }
            >
                Filtered Patterns
            </SettingsHeader>
            <FilteredPatternPicker padding={'0 1rem 1rem 0'} />
        </Box>
    );
}
