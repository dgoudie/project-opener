import {
  ActionList,
  ActionMenu,
  Box,
  Button,
  Text,
  TextInput,
  Tooltip,
} from '@primer/react';
import {
  FileDirectoryIcon,
  GearIcon,
  HorizontalRuleIcon,
  HourglassIcon,
  SyncIcon,
} from '@primer/octicons-react';
import { Link, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { DirectoryContext } from '../../providers/DirectoryProvider';
import Logo from '../../../assets/logo.png';
import ReactFocusLock from 'react-focus-lock';
import { projectsTable } from '../../indexed-db';
import { useDebounce } from '@react-hook/debounce';
import { useLiveQuery } from 'dexie-react-hooks';

interface Props {
  searchTextChanged: (value: string) => void;
}

export default function TopBar({ searchTextChanged }: Props) {
  const { filter } = useParams();

  const textInputRef = useRef<HTMLInputElement>(null);

  const [searchText, setSearchText] = useDebounce('', 150);

  const [rescanMenuOpen, setRescanMenuOpen] = useState(false);

  const projectCount = useLiveQuery(
    () => projectsTable.count().then((count) => count.toString()),
    [],
    '...'
  );

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
      flexShrink={0}
    >
      <Box
        style={{
          //@ts-ignore
          WebkitAppRegion: 'no-drag',
        }}
      >
        <ReactFocusLock disabled={rescanMenuOpen} persistentFocus={true}>
          <TextInput
            type={'search'}
            block
            leadingVisual={`Search ${projectCount} projects for:`}
            onChange={(event) =>
              setSearchText((event.target as HTMLInputElement).value)
            }
            ref={textInputRef}
          />
        </ReactFocusLock>
      </Box>
      <Box
        display='grid'
        alignItems='center'
        gridGap='.5rem'
        gridAutoFlow='column'
        style={{ userSelect: 'none' }}
      >
        <Box height={20}>
          <img src={Logo} height={'100%'}></img>
        </Box>
        <Text fontFamily="'Roboto Slab', serif">project-opener</Text>
      </Box>
      <TopBarButtons
        rescanMenuOpen={rescanMenuOpen}
        onRescanMenuOpenChange={setRescanMenuOpen}
      />
    </Box>
  );
}

type TopBarButtonsProps = {
  rescanMenuOpen: boolean;
  onRescanMenuOpenChange: (open: boolean) => void;
};

function TopBarButtons({
  rescanMenuOpen,
  onRescanMenuOpenChange,
}: TopBarButtonsProps) {
  const { directories, scanDirectory } = useContext(DirectoryContext);

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
        <Tooltip aria-label='Scan Directories' direction='s'>
          <Box position='relative'>
            <ActionMenu
              open={rescanMenuOpen}
              onOpenChange={onRescanMenuOpenChange}
            >
              <ActionMenu.Button variant='invisible' style={buttonStyles}>
                <SyncIcon size={18} />
              </ActionMenu.Button>
              <ActionMenu.Overlay align='end' width='large'>
                <ActionList>
                  <ActionList.Group title='Scan Directories'>
                    {directories.map((directory) => (
                      <ActionList.Item
                        key={directory.path}
                        disabled={directory.currentlyScanning}
                        onSelect={(event) => scanDirectory(directory.path)}
                      >
                        <ActionList.LeadingVisual>
                          {directory.currentlyScanning ? (
                            <HourglassIcon />
                          ) : (
                            <FileDirectoryIcon />
                          )}
                        </ActionList.LeadingVisual>
                        {directory.path}
                      </ActionList.Item>
                    ))}
                    <ActionList.Divider />
                    <ActionList.Item>
                      <ActionList.LeadingVisual>
                        <SyncIcon />
                      </ActionList.LeadingVisual>
                      Scan All Directories
                    </ActionList.Item>
                  </ActionList.Group>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </Box>
        </Tooltip>
        <Tooltip aria-label='Settings' direction='s'>
          <Link to={'/settings/general'} tabIndex={-1}>
            <Button variant='invisible' style={buttonStyles}>
              <GearIcon size={18} />
            </Button>
          </Link>
        </Tooltip>
        <Tooltip aria-label='Minimize' direction='sw'>
          <Button
            variant='invisible'
            style={buttonStyles}
            onClick={window.BRIDGE?.hideApplication}
          >
            <HorizontalRuleIcon size={18} />
          </Button>
        </Tooltip>
      </Box>
    </>
  );
}
