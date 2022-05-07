import { ActionList, ActionMenu, ThemeProviderProps } from '@primer/react';
import {
  DeviceDesktopIcon,
  Icon,
  MoonIcon,
  SunIcon,
} from '@primer/octicons-react';
import React, { useCallback, useContext, useMemo } from 'react';

import { SettingsContext } from '../../providers/SettingsProvider';

type Item = { text: string; key: ThemeProviderProps['colorMode']; icon: Icon };

export default function ThemePicker() {
  const items = useMemo<Item[]>(
    () => [
      { text: 'Light', key: 'day', icon: SunIcon },
      { text: 'Dark', key: 'night', icon: MoonIcon },
      { text: 'Use System Setting', key: 'auto', icon: DeviceDesktopIcon },
    ],
    []
  );
  const { THEME: selectedItemKey, setTheme } = useContext(SettingsContext);

  const onSelect = useCallback(
    async (selectedItem: ThemeProviderProps['colorMode']) => {
      if (!selectedItem) {
        return;
      }
      await setTheme(selectedItem);
      location.reload();
    },
    [setTheme]
  );

  const selectedItem = useMemo(
    () => items.find((item) => item.key === selectedItemKey),
    [items, selectedItemKey]
  );

  if (!selectedItemKey) {
    return null;
  }

  return (
    <ActionMenu>
      <ActionMenu.Button
        aria-label='select theme mode'
        leadingIcon={selectedItem.icon}
      >
        {selectedItem.text}
      </ActionMenu.Button>
      <ActionMenu.Overlay width='medium'>
        <ActionList selectionVariant='single'>
          {items.map(({ text, key, icon: Icon }, index) => (
            <ActionList.Item
              key={index}
              selected={key === selectedItem.key}
              onSelect={() => onSelect(key)}
            >
              <ActionList.LeadingVisual>
                <Icon />
              </ActionList.LeadingVisual>
              {text}
            </ActionList.Item>
          ))}
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  );
}
