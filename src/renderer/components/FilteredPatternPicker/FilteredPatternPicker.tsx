import { Box, BoxProps, Button, TextInput } from '@primer/react';
import { CheckIcon, TrashIcon, XIcon } from '@primer/octicons-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import ListWithActions from '../ListWithActions/ListWithActions';
import { filteredPatternsTable } from '../../indexed-db';
import { useLiveQuery } from 'dexie-react-hooks';

interface Props extends BoxProps {}

export default function FilteredPatternPicker(props: Props) {
  const [date, setDate] = useState(Date.now());

  const textInputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    textInputRef.current.focus();
  }, [textInputRef]);

  const filteredPatterns = useLiveQuery(
    () => filteredPatternsTable.orderBy('pattern').toArray(),
    [date]
  );

  const onSubmit = useCallback(async () => {
    if (
      !!filteredPatterns.find(({ pattern }) => inputValue.trim() === pattern)
    ) {
      alert('This pattern already exists.');
      return;
    }

    await filteredPatternsTable.add({
      pattern: inputValue,
      createdAt: new Date(),
    });
    setDate(Date.now());
    setInputValue('');
    textInputRef.current.focus();
  }, [textInputRef, setDate, inputValue, setInputValue]);

  const deletePattern = useCallback(
    async (pattern: string) => {
      await filteredPatternsTable.delete(pattern);
      setDate(Date.now());
    },
    [setDate]
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
              onClick: () => deletePattern(pattern),
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
