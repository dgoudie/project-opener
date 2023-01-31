import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { ThemeProviderProps, useTheme } from '@primer/react';

import { settingsTable } from '../indexed-db';

type SettingsState = {
  HOTKEY: string;
  SETUP_COMPLETE: boolean;
  THEME: ThemeProviderProps['colorMode'];
  ENABLE_FILE_WATCHING: boolean;
  RESCAN_ON_START: boolean;
};

type SettingsMutators = {
  setTheme: (THEME: ThemeProviderProps['colorMode']) => Promise<void>;
  setHotkey: (HOTKEY: string) => Promise<void>;
  setFileWatchingEnabled: (enabled: boolean) => void;
  setRescanOnStart: (enabled: boolean) => void;
};

type SettingsContextType = SettingsState & SettingsMutators;

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export default function SettingsProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [settingsState, setSettingsState] = useState<SettingsState>();

  const { setColorMode } = useTheme();

  useEffect(() => {
    if (!settingsState) {
      return;
    }
    window.BRIDGE.registerShowApplicationHotkey(settingsState.HOTKEY);
    window.BRIDGE.enableFileWatching(settingsState.ENABLE_FILE_WATCHING);
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
      setColorMode(THEME);
    },
    [settingsState]
  );

  const setFileWatchingEnabled = useCallback(
    async (ENABLE_FILE_WATCHING: boolean) => {
      await settingsTable.update('ENABLE_FILE_WATCHING', {
        value: ENABLE_FILE_WATCHING,
      });
      setSettingsState({ ...settingsState, ENABLE_FILE_WATCHING });
      window.BRIDGE.enableFileWatching(ENABLE_FILE_WATCHING);
    },
    [settingsState]
  );

  const setRescanOnStart = useCallback(
    async (RESCAN_ON_START: boolean) => {
      await settingsTable.update('RESCAN_ON_START', {
        value: RESCAN_ON_START,
      });
      setSettingsState({ ...settingsState, RESCAN_ON_START });
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
    <SettingsContext.Provider
      value={{
        ...settingsState,
        setTheme,
        setHotkey,
        setFileWatchingEnabled,
        setRescanOnStart,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
