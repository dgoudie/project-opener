import { Box, BoxProps, Button, TextInput, Tooltip } from '@primer/react';
import {
  CheckIcon,
  FileDirectoryIcon,
  SyncIcon,
  TrashIcon,
  XIcon,
} from '@primer/octicons-react';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { DirectoryContext } from '../../providers/DirectoryProvider';
import ListWithActions from '../ListWithActions/ListWithActions';
import { SnackbarContext } from '../../providers/SnackbarProvider';
import { directoriesTable } from '../../indexed-db';
import { useLiveQuery } from 'dexie-react-hooks';

interface Props extends BoxProps {}

export default function DirectoryPicker(props: Props) {
  const { directories, addDirectory, deleteDirectory, scanDirectory } =
    useContext(DirectoryContext);

  const { showNotification } = useContext(SnackbarContext);

  const textInputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState('');

  const [isPromptingForDirectory, setIsPromptingForDirectory] = useState(false);

  useEffect(() => {
    textInputRef.current.focus();
  }, [textInputRef]);

  const onSubmit = useCallback(async () => {
    try {
      await addDirectory(inputValue);
    } catch (e) {
      showNotification('warning', e.message, 5000);
    }
    setInputValue('');
    textInputRef.current.focus();
  }, [textInputRef, inputValue, setInputValue]);

  const promptForDirectory = useCallback(async () => {
    setIsPromptingForDirectory(true);
    const directory = await window.BRIDGE?.promptForDirectory();
    setIsPromptingForDirectory(false);
    if (typeof directory !== 'undefined') {
      setInputValue(directory);
    }
  }, []);

  return (
    <Box
      display='grid'
      gridTemplateRows='auto max-content'
      gridGap='1rem'
      minHeight={0}
      {...props}
    >
      <ListWithActions
        items={directories?.map(({ path, currentlyScanning }) => ({
          text: path,
          actions: [
            {
              icon: SyncIcon,
              hint: 'Scan Directory',
              onClick: () => scanDirectory(path),
              isDanger: false,
              disabled: currentlyScanning,
            },
            {
              icon: TrashIcon,
              hint: 'Delete Directory',
              onClick: () => deleteDirectory(path),
              isDanger: true,
            },
          ],
        }))}
      />
      <Box as='form' onSubmit={onSubmit} display='flex' gridGap='1rem'>
        <TextInput
          value={inputValue}
          ref={textInputRef}
          block
          leadingVisual='Add Directory:'
          onChange={(event) =>
            setInputValue((event.target as HTMLInputElement).value)
          }
          trailingAction={
            <TextInput.Action
              onClick={() => {
                setInputValue('');
              }}
              icon={XIcon}
              aria-label='Clear Input'
            />
          }
        />
        <Tooltip text='Select Directory...'>
          <Button
            type='button'
            onClick={promptForDirectory}
            disabled={isPromptingForDirectory}
          >
            <FileDirectoryIcon />
          </Button>
        </Tooltip>
        <Button variant='primary' type='submit' disabled={!inputValue.length}>
          <CheckIcon />
        </Button>
      </Box>
    </Box>
  );
}
