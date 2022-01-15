import { Spinner, SpinnerSize, Stack } from '@fluentui/react';

import React from 'react';

export default function LoadingPage() {
    return (
        <Stack verticalFill verticalAlign='center'>
            <Spinner size={SpinnerSize.large} label='Loading...' />
        </Stack>
    );
}
