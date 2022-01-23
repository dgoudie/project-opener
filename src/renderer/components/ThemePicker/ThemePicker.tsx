import { DropdownButton, DropdownMenu } from '@primer/react';
import React, { useMemo, useState } from 'react';

import { settingsTable } from '../../indexed-db';
import { useLiveQuery } from 'dexie-react-hooks';

export default function ThemePicker() {
    const items = useMemo(
        () => [
            { text: 'Light', key: 'day' },
            { text: 'Dark', key: 'night' },
            { text: 'Use System Setting', key: 'auto' },
        ],
        []
    );
    const selectedItemKey = useLiveQuery(
        () =>
            settingsTable
                .get('THEME')
                .then((response) => response.value as string),
        []
    );

    const selectedItem = useMemo(
        () => items.find((item) => item.key === selectedItemKey),
        [items, selectedItemKey]
    );

    return (
        <DropdownMenu
            renderAnchor={({
                children,
                'aria-labelledby': ariaLabelledBy,
                ...anchorProps
            }) => (
                <DropdownButton
                    aria-labelledby={`favorite-color-label ${ariaLabelledBy}`}
                    {...anchorProps}
                >
                    {children}
                </DropdownButton>
            )}
            items={items}
            selectedItem={selectedItem}
            onChange={(selectedItem) =>
                !!selectedItem &&
                settingsTable.update('THEME', { value: selectedItem.key })
            }
        />
    );
}
