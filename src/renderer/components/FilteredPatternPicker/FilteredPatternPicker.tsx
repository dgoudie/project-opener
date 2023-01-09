import { Box, BoxProps, Button, TextInput } from '@primer/react';
import { CheckIcon, TrashIcon, XIcon } from '@primer/octicons-react';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { FilteredPatternContext } from '../../providers/FilteredPatternProvider';
import ListWithActions from '../ListWithActions/ListWithActions';
import { SnackbarContext } from '../../providers/SnackbarProvider';

interface Props extends BoxProps {}

export default function FilteredPatternPicker(props: Props) {
  const { filteredPatterns, deleteFilteredPattern, addFilteredPattern } =
    useContext(FilteredPatternContext);

  const { showNotification } = useContext(SnackbarContext);

  const textInputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    textInputRef.current.focus();
  }, [textInputRef]);

  const onSubmit = useCallback<
    React.FormEventHandler<HTMLDivElement> &
      React.FormEventHandler<HTMLFormElement>
  >(
    async (event) => {
      event.preventDefault();
      try {
        await addFilteredPattern(inputValue);
      } catch (e) {
        showNotification('warning', e.message, 5000);
      }
      setInputValue('');
      textInputRef.current.focus();
    },
    [textInputRef, inputValue, setInputValue]
  );

  return (
    <Box
      display='grid'
      gridTemplateRows='auto max-content'
      gridGap='1rem'
      minHeight={0}
      {...props}
    >
      <ListWithActions
        items={filteredPatterns?.map(({ pattern }) => ({
          text: pattern,
          actions: [
            {
              icon: TrashIcon,
              hint: 'Delete Pattern',
              onClick: () => deleteFilteredPattern(pattern),
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
          leadingVisual='Add Pattern:'
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
        <Button variant='primary' type='submit' disabled={!inputValue.length}>
          <CheckIcon />
        </Button>
      </Box>
    </Box>
  );
}
