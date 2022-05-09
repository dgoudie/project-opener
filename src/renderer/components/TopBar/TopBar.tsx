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
  ChevronDownIcon,
  FileDirectoryIcon,
  GearIcon,
  HorizontalRuleIcon,
  SyncIcon,
  XIcon,
} from '@primer/octicons-react';
import { Link, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useRef } from 'react';

import { DirectoryContext } from '../../providers/DirectoryProvider';
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
    >
      <Box
        style={{
          //@ts-ignore
          WebkitAppRegion: 'no-drag',
        }}
      >
        <TextInput
          type={'search'}
          block
          leadingVisual={`Search ${projectCount} projects for:`}
          onChange={(event) =>
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
  const { directories } = useContext(DirectoryContext);

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
            <ActionMenu>
              <ActionMenu.Button variant='invisible' style={buttonStyles}>
                <SyncIcon size={18} />
              </ActionMenu.Button>
              <ActionMenu.Overlay align='end' width='large'>
                <ActionList>
                  <ActionList.Group title='Scan Directories'>
                    {directories.map((directory) => (
                      <ActionList.Item
                        key={directory.path}
                        onSelect={(event) => console.log('New file')}
                      >
                        <ActionList.LeadingVisual>
                          <FileDirectoryIcon />
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
