import {
  ActionList,
  ActionMenu,
  SegmentedControl,
  ThemeProviderProps,
} from '@primer/react';
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
    async (selectedIndex: number) => {
      const selectedItem = items[selectedIndex];
      await setTheme(selectedItem.key);
      // location.reload();
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
    <SegmentedControl aria-label='File view' onChange={onSelect}>
      {items.map(({ text, key, icon: Icon }, index) => (
        <SegmentedControl.Button
          key={text}
          selected={key === selectedItem.key}
          leadingIcon={Icon}
        >
          {text}
        </SegmentedControl.Button>
      ))}
    </SegmentedControl>
  );
}
