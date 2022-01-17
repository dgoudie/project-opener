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

import { useLiveQuery } from 'dexie-react-hooks';

interface Props extends BoxProps {}

export default function FilteredPatternPicker(props: Props) {
    const { theme } = useTheme();

    const [date, setDate] = useState(Date.now());

    const textInputRef = useRef<HTMLInputElement>(null);

    const [inputValue, setInputValue] = useState('');

    const [inputValid, setInputValid] = useState(false);

    useEffect(() => {
        textInputRef.current.focus();
    }, [textInputRef]);

    const filteredPatterns: any[] = [];

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
        // await db.table<FilteredPatternDatabaseType>('filteredPatterns').add({
        //     pattern: inputValue,
        //     createdAt: new Date(),
        // });
        setDate(Date.now());
        setInputValue('');
        textInputRef.current.focus();
    }, [textInputRef, setDate, inputValue, setInputValue]);

    const deletePattern = useCallback(
        async (pattern: string) => {
            // await db
            //     .table<FilteredPatternDatabaseType>('filteredPatterns')
            //     .delete(pattern);
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
            <Box
                sx={{ bg: 'canvas.overlay' }}
                padding='0 1rem .5rem'
                overflowY='auto'
            >
                {filteredPatterns?.map(({ pattern }) => (
                    <Box
                        key={pattern}
                        borderBottom='1px solid'
                        borderBottomColor={theme.colors.border.default}
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                        paddingY='.75rem'
                    >
                        <Text>{pattern}</Text>
                        <Tooltip text='Delete Pattern' direction='w'>
                            <ButtonDanger
                                onClick={() => deletePattern(pattern)}
                            >
                                <TrashIcon />
                            </ButtonDanger>
                        </Tooltip>
                    </Box>
                ))}
            </Box>
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
