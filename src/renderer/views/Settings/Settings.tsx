import {
    Box,
    ButtonDanger,
    ButtonInvisible,
    Details,
    Heading,
    Popover,
    SideNav,
    StyledOcticon,
    Text,
    useDetails,
} from '@primer/react';
import {
    ChevronLeftIcon,
    CodeIcon,
    FileDirectoryFillIcon,
    FilterIcon,
    GearIcon,
    InfoIcon,
    XIcon,
} from '@primer/octicons-react';
import { Route, Routes, useLocation } from 'react-router-dom';

import React from 'react';
import Settings_FilteredPatterns from './Settings_FilteredPatterns';
import Settings_General from './Settings_General';

const settingsRoutes = [
    {
        name: 'General',
        pathname: '/general',
        element: <Settings_General />,
        icon: GearIcon,
    },
    {
        name: 'Filtered Patterns',
        pathname: '/filtered-patterns',
        element: <Settings_FilteredPatterns />,
        icon: FilterIcon,
    },
    {
        name: 'Directories',
        pathname: '/directories',
        icon: FileDirectoryFillIcon,
    },
    {
        name: 'IDEs',
        pathname: '/ides',
        icon: CodeIcon,
    },
    {
        name: 'About',
        pathname: '/about',
        icon: InfoIcon,
    },
];

export default function Settings() {
    return (
        <Box display='grid' gridTemplateRows='max-content auto' height='100%'>
            <Box
                bg='canvas.subtle'
                padding='.5rem'
                style={{
                    //@ts-ignore
                    WebkitAppRegion: 'drag',
                }}
            >
                <ButtonInvisible
                    as='a'
                    href='#/'
                    style={{
                        justifySelf: 'start',
                        cursor: 'pointer',
                        //@ts-ignore
                        WebkitAppRegion: 'no-drag',
                    }}
                >
                    <Box
                        display='grid'
                        gridGap='.25rem'
                        gridAutoFlow='column'
                        alignItems='center'
                    >
                        <ChevronLeftIcon />
                        <span>Home</span>
                    </Box>
                </ButtonInvisible>
            </Box>
            <Box display='grid' gridTemplateColumns='15rem auto' minHeight={0}>
                <SettingsNav />
                <Box minHeight={0}>
                    <Routes>
                        {settingsRoutes.map((route) => (
                            <Route
                                key={route.pathname}
                                path={route.pathname}
                                element={route.element}
                            >
                                {route.name}
                            </Route>
                        ))}
                    </Routes>
                </Box>
            </Box>
        </Box>
    );
}

function SettingsNav() {
    const { pathname } = useLocation();
    return (
        <Box
            display='grid'
            gridTemplateRows='max-content max-content'
            padding='1rem'
            alignContent='space-between'
        >
            <SideNav bordered aria-label='Main'>
                {settingsRoutes.map((route) => {
                    return (
                        <SideNav.Link
                            key={route.pathname}
                            href={`#/settings${route.pathname}`}
                            selected={`/settings${route.pathname}` === pathname}
                        >
                            <StyledOcticon
                                sx={{ mr: 2 }}
                                size={16}
                                icon={route.icon}
                            />
                            <Text>{route.name}</Text>
                        </SideNav.Link>
                    );
                })}
            </SideNav>
            <ExitApplicationButton />
        </Box>
    );
}

function ExitApplicationButton() {
    const { getDetailsProps, setOpen } = useDetails({
        closeOnOutsideClick: true,
    });
    return (
        <Box position='relative'>
            <SideNav bordered aria-label='Main'>
                <SideNav.Link
                    style={{ cursor: 'pointer' }}
                    onClick={() => setOpen(true)}
                >
                    <StyledOcticon sx={{ mr: 2 }} size={16} icon={XIcon} />
                    <Text>Exit Application</Text>
                </SideNav.Link>
            </SideNav>
            <Details {...getDetailsProps()}>
                <summary></summary>
                <Popover
                    open={true}
                    caret='left-bottom'
                    sx={{ bottom: 0, left: `calc(100% + 1rem)` }}
                >
                    <Popover.Content sx={{ mt: 2 }}>
                        <Text as='p' sx={{ marginTop: 0 }}>
                            Are you sure you'd like to exit?
                        </Text>
                        <ButtonDanger
                            onClick={window.bridgeApis?.closeApplication}
                        >
                            Yes
                        </ButtonDanger>
                    </Popover.Content>
                </Popover>
            </Details>
        </Box>
    );
}
