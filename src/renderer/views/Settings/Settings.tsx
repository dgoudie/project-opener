import { Box, ButtonInvisible, SideNav, Text } from '@primer/react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { ArrowLeftIcon } from '@primer/octicons-react';
import React from 'react';

const settingsRoutes = [
    {
        name: 'General',
        pathname: '/settings/general',
    },
    {
        name: 'Filtered Patterns',
        pathname: '/settings/filtered-patterns',
    },
    {
        name: 'Directories',
        pathname: '/settings/directories',
    },
    {
        name: 'IDEs',
        pathname: '/settings/ides',
    },
];

export default function Settings() {
    return (
        <Box display='grid' gridTemplateColumns='15em auto'>
            <SettingsNav />
            <Routes>
                {settingsRoutes.map((route) => (
                    <Route key={route.pathname} path={route.pathname}>
                        {route.name}
                    </Route>
                ))}
            </Routes>
        </Box>
    );
}

function SettingsNav() {
    const { pathname } = useLocation();
    const routes = [];
    return (
        <Box
            display='grid'
            gridTemplateRows='max-content auto'
            gridGap='.75em'
            padding='1em'
        >
            <ButtonInvisible
                as='a'
                href='#/'
                style={{ justifySelf: 'start', cursor: 'pointer' }}
            >
                <Box
                    display='grid'
                    gridGap='.5em'
                    gridAutoFlow='column'
                    alignItems='center'
                >
                    <ArrowLeftIcon />
                    <span>Home</span>
                </Box>
            </ButtonInvisible>
            <SideNav bordered aria-label='Main'>
                {settingsRoutes.map((route) => (
                    <SideNav.Link
                        key={route.pathname}
                        href={`#${route.pathname}`}
                        selected={route.pathname === pathname}
                    >
                        {route.name}
                    </SideNav.Link>
                ))}
            </SideNav>
        </Box>
    );
}
