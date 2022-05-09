import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { ThemeProviderProps } from '@primer/react';
import { settingsTable } from '../indexed-db';

type SettingsState = {
  HOTKEY: string;
  SETUP_COMPLETE: boolean;
  THEME: ThemeProviderProps['colorMode'];
};

type SettingsMutators = {
  setTheme: (THEME: ThemeProviderProps['colorMode']) => Promise<void>;
  setHotkey: (HOTKEY: string) => Promise<void>;
};

type SettingsContextType = SettingsState & SettingsMutators;

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export default function SettingsProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [settingsState, setSettingsState] = useState<SettingsState>();

  useEffect(() => {
    if (!settingsState) {
      return;
    }
    window.BRIDGE.registerShowApplicationHotkey(settingsState.HOTKEY);
  }, [settingsState?.HOTKEY]);

  useEffect(() => {
    const load = async () => {
      let settings: Partial<SettingsState> = {};
      await settingsTable.each(
        (item) => (settings = { ...settings, [item.key]: item.value })
      );
      setSettingsState(settings as SettingsState);
    };
    load();
  }, []);

  const setTheme = useCallback(
    async (THEME: ThemeProviderProps['colorMode']) => {
      await settingsTable.update('THEME', { value: THEME });
      setSettingsState({ ...settingsState, THEME });
    },
    [settingsState]
  );

  const setHotkey = useCallback(
    async (HOTKEY: string) => {
      await settingsTable.update('HOTKEY', { value: HOTKEY });
      setSettingsState({ ...settingsState, HOTKEY });
    },
    [settingsState]
  );

  if (!settingsState) {
    return null;
  }

  return (
    <SettingsContext.Provider value={{ ...settingsState, setTheme, setHotkey }}>
      {children}
    </SettingsContext.Provider>
  );
}
