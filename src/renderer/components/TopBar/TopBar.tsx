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
import React, { useEffect, useRef } from 'react';

import { useDebounce } from '@react-hook/debounce';
import { useParams } from 'react-router-dom';

interface Props {
    searchTextChanged: (value: string) => void;
}

export default function TopBar({ searchTextChanged }: Props) {
    const { filter } = useParams();

    const textInputRef = useRef<HTMLInputElement>(null);

    const [searchText, setSearchText] = useDebounce('', 300);

    useEffect(() => {
        searchTextChanged(searchText);
    }, [searchText]);

    useEffect(() => {
        textInputRef.current.focus();
    }, [filter, textInputRef]);

    return (
        <Box
            padding='.75rem'
            style={{
                //@ts-ignore
                WebkitAppRegion: 'drag',
            }}
            display='grid'
            gridTemplateColumns='1fr max-content max-content'
            alignItems='center'
            gridGap='1rem'
        >
            <Box
                style={{
                    //@ts-ignore
                    WebkitAppRegion: 'no-drag',
                }}
            >
                <TextInput
                    block
                    leadingVisual='Search 100 projects for:'
                    onChange={(event: InputEvent) =>
                        setSearchText((event.target as HTMLInputElement).value)
                    }
                    ref={textInputRef}
                />
            </Box>
            <Box
                display='grid'
                alignItems='center'
                gridGap='.5rem'
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
        gap: '.2rem',
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
                gridGap='.25rem'
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
                    <ButtonInvisible
                        style={buttonStyles}
                        // onClick={window.bridgeApis?.hideApplication}
                    >
                        <HorizontalRuleIcon size={18} />
                    </ButtonInvisible>
                </Tooltip>
            </Box>
        </>
    );
}
