import {
    Box,
    BoxProps,
    ButtonDanger,
    ButtonPrimary,
    Text,
    TextInput,
    Tooltip,
    useTheme,
} from '@primer/react';
import { CheckIcon, TrashIcon } from '@primer/octicons-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { db, filteredPatternsTable } from '../../indexed-db';

import ListWithActions from '../ListWithActions/ListWithActions';
import { useLiveQuery } from 'dexie-react-hooks';

interface Props extends BoxProps {}

export default function FilteredPatternPicker(props: Props) {
    const [date, setDate] = useState(Date.now());

    const textInputRef = useRef<HTMLInputElement>(null);

    const [inputValue, setInputValue] = useState('');

    const [inputValid, setInputValid] = useState(false);

    useEffect(() => {
        textInputRef.current.focus();
    }, [textInputRef]);

    const filteredPatterns = useLiveQuery(
        () => filteredPatternsTable.orderBy('pattern').toArray(),
        [date]
    );

    useEffect(() => {
        if (!filteredPatterns || !inputValue) {
            setInputValid(false);
        } else {
            setInputValid(
                !filteredPatterns.find(
                    ({ pattern }) => inputValue.trim() === pattern
                )
            );
        }
    }, [inputValue, filteredPatterns, setInputValid]);

    const onSubmit = useCallback(async () => {
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
            <Box
                as='form'
                onSubmit={onSubmit}
                display='grid'
                gridTemplateColumns='auto max-content'
                gridGap='1rem'
            >
                <TextInput
                    value={inputValue}
                    ref={textInputRef}
                    block
                    leadingVisual='Add Pattern:'
                    onChange={(event: InputEvent) =>
                        setInputValue((event.target as HTMLInputElement).value)
                    }
                />
                <ButtonPrimary type='submit' disabled={!inputValid}>
                    <CheckIcon />
                </ButtonPrimary>
            </Box>
        </Box>
    );
}
