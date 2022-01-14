import {
    Box,
    ButtonInvisible,
    Dropdown,
    SelectMenu,
    Text,
    TextInput,
    Tooltip,
} from '@primer/react';
import {
    ChevronDownIcon,
    GearIcon,
    HorizontalRuleIcon,
    SyncIcon,
} from '@primer/octicons-react';

import React from 'react';

export default function TopBar() {
    return (
        <Box
            padding='.75em'
            style={{
                //@ts-ignore
                WebkitAppRegion: 'drag',
            }}
            display='grid'
            gridTemplateColumns='auto max-content max-content'
            alignItems='center'
            gridGap='1em'
        >
            <TextInput
                leadingVisual='Search 100 projects for:'
                autoFocus
                style={{
                    //@ts-ignore
                    WebkitAppRegion: 'no-drag',
                }}
            />
            <Box
                display='grid'
                alignItems='center'
                gridGap='.5em'
                gridAutoFlow='column'
                style={{ userSelect: 'none' }}
            >
                <Box height={20}>
                    <img src='/assets/logo.png' height={'100%'}></img>
                </Box>
                <Text fontFamily="'Roboto Slab', serif">project-opener</Text>
            </Box>
            <TopBarButtons />
        </Box>
    );
}

function TopBarButtons() {
    const buttonStyles: React.CSSProperties = {
        padding: 6,
        display: 'grid',
        gridAutoFlow: 'column',
        alignItems: 'center',
        gap: '.2em',
    };
    return (
        <>
            <Box
                style={{
                    //@ts-ignore
                    WebkitAppRegion: 'no-drag',
                }}
                display='grid'
                alignItems='center'
                gridGap='.25em'
                gridAutoFlow='column'
            >
                <Box position='relative'>
                    <SelectMenu>
                        <ButtonInvisible style={buttonStyles} as='summary'>
                            <SyncIcon size={18} />
                            <ChevronDownIcon size={16} verticalAlign='middle' />
                        </ButtonInvisible>
                        <SelectMenu.Modal align='right'>
                            <SelectMenu.Header>
                                Scan Directories
                            </SelectMenu.Header>
                            <SelectMenu.List>
                                <SelectMenu.Item href='#'>
                                    Primer React bugs
                                </SelectMenu.Item>
                                <SelectMenu.Item href='#'>
                                    Primer React roadmap
                                </SelectMenu.Item>
                                <SelectMenu.Item href='#'>
                                    {' '}
                                    Project 3
                                </SelectMenu.Item>
                                <SelectMenu.Item href='#'>
                                    Project 4
                                </SelectMenu.Item>
                            </SelectMenu.List>
                        </SelectMenu.Modal>
                    </SelectMenu>
                </Box>
                <Tooltip aria-label='Settings' direction='s'>
                    <ButtonInvisible
                        style={buttonStyles}
                        as='a'
                        href='#/settings/general'
                    >
                        <GearIcon size={18} />
                    </ButtonInvisible>
                </Tooltip>
                <Tooltip aria-label='Minimize' direction='sw'>
                    <ButtonInvisible style={buttonStyles}>
                        <HorizontalRuleIcon size={18} />
                    </ButtonInvisible>
                </Tooltip>
            </Box>
        </>
    );
}
