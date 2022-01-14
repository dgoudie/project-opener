import { Heading, Text, useTheme } from '@primer/react';

import React from 'react';

interface Props {
    children: string;
    subHeading?: string | JSX.Element;
}

export default function SettingsHeader({ children, subHeading }: Props) {
    const { theme } = useTheme();
    return (
        <Heading
            sx={{
                fontSize: 4,
                fontWeight: 400,
                borderBottomWidth: 1,
                borderBottomStyle: 'solid',
                padding: '.5rem 0 .25rem',
                marginBottom: '.5rem',
                marginRight: '1rem',
                borderBottomColor: theme.colors.border.default,
                display: 'grid',
                gridAutoFlow: 'row',
            }}
        >
            <div>{children}</div>
            <Text sx={{ color: theme.colors.fg.muted, fontSize: 2 }}>
                {!!subHeading &&
                    (typeof subHeading === 'string'
                        ? { subHeading }
                        : subHeading)}
            </Text>
        </Heading>
    );
}
